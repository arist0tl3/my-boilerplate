import { Schema, model } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'; // Use environment variable in production

export interface IAuthToken {
  _id: string;
  createdAt: Date;
  userId: string;
  token: string;
  expiresAt: Date;
}

const authTokenSchema = new Schema<IAuthToken>({
  _id: { type: String, required: true, default: uuidv4 },
  createdAt: { type: Date, required: true, default: Date.now },
  userId: { type: String, required: true },
  token: { type: String, required: true },
  expiresAt: { type: Date, required: true },
});

// Create a new auth token for a user
export async function createAuthToken(userId: string): Promise<string> {
  const token = jwt.sign({ userId }, JWT_SECRET, { expiresIn: '7d' });
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

  await AuthToken.create({
    userId,
    token,
    expiresAt,
  });

  return token;
}

// Verify a token and return the userId if valid
export async function verifyAuthToken(token: string): Promise<string | null> {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };

    // Find the token in the database
    const authToken = await AuthToken.findOne({
      token,
      expiresAt: { $gt: new Date() },
    });

    if (!authToken) {
      return null;
    }

    return decoded.userId;
  } catch (error) {
    return null;
  }
}

// Invalidate a token (on logout)
export async function invalidateAuthToken(token: string): Promise<boolean> {
  try {
    const result = await AuthToken.deleteMany({ token });
    return result.deletedCount > 0;
  } catch (error) {
    return false;
  }
}

const AuthToken = model<IAuthToken>('AuthToken', authTokenSchema);

export default AuthToken;
