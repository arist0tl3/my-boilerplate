import argon2 from 'argon2';
import User from '../model';
import { createAuthToken } from '../../AuthToken/model';
import { checkRateLimit, resetRateLimit } from '../../../server/utils/rateLimiter';
import { IContext } from '../../../types';
import { LoginMutationVariables } from '../../../generated';

async function login(_: any, args: LoginMutationVariables, context: IContext) {
  try {
    const { email, password } = args.input;
    const ip = context.req.ip || 'unknown';

    // Check rate limit for IP address using context cache
    if (!checkRateLimit(context.cache, ip, 5, 10)) {
      return {
        success: false,
        error: 'Too many login attempts. Please try again later.',
      };
    }

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return {
        success: false,
        error: 'Invalid email or password',
      };
    }

    // Check if account is locked
    if (user.lockedUntil && new Date() < user.lockedUntil) {
      const minutesLeft = Math.ceil((user.lockedUntil.getTime() - Date.now()) / 60000);
      return {
        success: false,
        error: `Account is locked. Please try again in ${minutesLeft} minutes.`,
      };
    }

    // Check password
    const isValid = await argon2.verify(user.password, password);

    if (!isValid) {
      // Increment failed login attempts
      user.failedLoginAttempts += 1;

      // Lock account after 3 failed attempts
      if (user.failedLoginAttempts >= 3) {
        user.lockedUntil = new Date(Date.now() + 30 * 60000); // Lock for 30 minutes
      }

      await user.save();

      return {
        success: false,
        error:
          user.failedLoginAttempts >= 3
            ? 'Account locked due to too many failed login attempts. Try again in 30 minutes.'
            : 'Invalid email or password',
      };
    }

    // Reset failed login attempts on successful login
    if (user.failedLoginAttempts > 0) {
      user.failedLoginAttempts = 0;
      user.lockedUntil = undefined;
      await user.save();
    }

    // Reset rate limit for this IP on successful login
    resetRateLimit(context.cache, ip);

    // Create auth token
    const token = await createAuthToken(user._id);

    return {
      success: true,
      token,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message,
    };
  }
}

export default login;
