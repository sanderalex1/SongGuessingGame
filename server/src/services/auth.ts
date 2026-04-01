import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import pool from "../db/pool.js";
import { AppError } from "../middleware/AppError.js";

const ACCESS_EXPIRY = "7m";
const REFRESH_EXPIRY = "7d";

function generateTokens(userId: string) {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET!, {
    expiresIn: ACCESS_EXPIRY,
  });
  const refreshToken = jwt.sign({ userId, type: "refresh" }, process.env.JWT_SECRET!, {
    expiresIn: REFRESH_EXPIRY,
  });
  return { token, refreshToken };
}

// Creating a user with a hashed password
export const createUser = async (
  username: string,
  email: string,
  password: string,
) => {
  const id = crypto.randomUUID();
  const hashedPass = await bcrypt.hash(password, 10);

  const result = await pool.query(
    `INSERT INTO users (id, username, email, password_hash)
        VALUES ($1, $2, $3, $4)
        RETURNING id, username, email`,
    [id, username, email, hashedPass],
  );

  const user = result.rows[0];
  const { token, refreshToken } = generateTokens(user.id);
  return { user, token, refreshToken };
};

// Verifying credentials and returning a token
export const verifyUser = async (email: string, password: string) => {
  const result = await pool.query(
    `SELECT id, username, email, password_hash FROM users WHERE email = $1`,
    [email],
  );

  if (result.rows.length === 0) {
    throw new AppError("User not found!", 401);
  }

  const user = result.rows[0];
  const isValid = await bcrypt.compare(password, user.password_hash);

  if (!isValid) {
    throw new AppError("Invalid password", 401);
  }

  const { token, refreshToken } = generateTokens(user.id);
  return {
    user: { id: user.id, username: user.username, email: user.email },
    token,
    refreshToken,
  };
};

// Creating a guest (no credentials)
export const createGuest = async (guestName: string) => {
  const id = crypto.randomUUID();

  const result = await pool.query(
    `INSERT INTO users (id, username, is_guest)
        VALUES ($1, $2, true)
        RETURNING id, username
        `,
    [id, guestName],
  );

  const guest = result.rows[0];
  const { token, refreshToken } = generateTokens(guest.id);
  return { user: guest, token, refreshToken };
};

// Refresh access token using a valid refresh token
export const refreshAccessToken = (currentRefreshToken: string) => {
  try {
    const decoded = jwt.verify(currentRefreshToken, process.env.JWT_SECRET!) as {
      userId: string;
      type?: string;
    };

    if (decoded.type !== "refresh") {
      throw new AppError("Invalid token type", 401);
    }

    const { token, refreshToken } = generateTokens(decoded.userId);
    return { accessToken: token, refreshToken };
  } catch (err) {
    if (err instanceof AppError) throw err;
    throw new AppError("Invalid or expired refresh token", 401);
  }
};
