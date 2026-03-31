import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import pool from "../db/pool.js";
import { AppError } from "../middleware/AppError.js";
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
  const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, {
    expiresIn: "7d",
  });

  return { user, token };
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
  const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, {
    expiresIn: "7d",
  });

  return {
    user: { id: user.id, username: user.username, email: user.email },
    token,
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
  const token = jwt.sign({ userId: guest.id }, process.env.JWT_SECRET!, {
    expiresIn: "1d",
  });
  return { user: guest, token };
};
