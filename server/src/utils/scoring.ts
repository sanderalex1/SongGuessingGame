const BASE_WORD_WEIGHT = 1.0;
const PARENTHETICAL_WEIGHT = 0.25;
const MAX_POINTS = 1000;
const ARTIST_BONUS = 200;
const MIN_ACCURACY_THRESHOLD = 0.10;

export interface ScoringResult {
  accuracy: number;
  matchedWords: string[];
  artistMatch: boolean;
  points: number;
}

interface WeightedWords {
  words: string[];
  weights: Map<string, number>;
  totalWeight: number;
}

/**
 * Lowercase, strip punctuation (keep hyphens/apostrophes within words),
 * collapse whitespace.
 */
function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s'-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Parse a title into weighted words.
 * Words outside parentheses get weight 1.0, words inside get 0.25.
 */
function getWeightedTitleWords(title: string): WeightedWords {
  const weights = new Map<string, number>();
  const words: string[] = [];

  // Split into segments: text outside parens and text inside parens
  const parenRegex = /\(([^)]*)\)/g;
  const parentheticalParts: string[] = [];
  let match: RegExpExecArray | null;
  while ((match = parenRegex.exec(title)) !== null) {
    parentheticalParts.push(match[1]);
  }

  // Base title = everything with parenthetical groups removed
  const baseTitle = title.replace(parenRegex, "").trim();
  const baseWords = normalizeText(baseTitle).split(" ").filter(Boolean);
  const parenWords = parentheticalParts
    .map((p) => normalizeText(p).split(" ").filter(Boolean))
    .flat();

  for (const w of baseWords) {
    if (!weights.has(w)) {
      weights.set(w, BASE_WORD_WEIGHT);
      words.push(w);
    }
  }

  for (const w of parenWords) {
    if (!weights.has(w)) {
      weights.set(w, PARENTHETICAL_WEIGHT);
      words.push(w);
    }
  }

  const totalWeight = Array.from(weights.values()).reduce((a, b) => a + b, 0);

  return { words, weights, totalWeight };
}

export function calculateScore(
  title: string,
  artist: string,
  guess: string,
  timeLeft: number,
  clipDuration: number,
): ScoringResult {
  const guessWords = new Set(
    normalizeText(guess).split(" ").filter(Boolean),
  );

  // --- Title accuracy ---
  const titleData = getWeightedTitleWords(title);
  let matchedWeight = 0;
  const matchedWords: string[] = [];

  for (const word of titleData.words) {
    if (guessWords.has(word)) {
      matchedWeight += titleData.weights.get(word)!;
      matchedWords.push(word);
    }
  }

  const accuracy =
    titleData.totalWeight > 0 ? matchedWeight / titleData.totalWeight : 0;

  // --- Artist check ---
  const artistMatch =
    normalizeText(artist) === normalizeText(guess);

  // --- Points ---
  let points = 0;
  const timeFactor = clipDuration > 0 ? timeLeft / clipDuration : 0;

  if (accuracy >= MIN_ACCURACY_THRESHOLD) {
    points = Math.round(MAX_POINTS * accuracy * timeFactor);
  }

  if (artistMatch) {
    points += ARTIST_BONUS;
  }

  return { accuracy, matchedWords, artistMatch, points };
}
