import argon2 from 'argon2';
import User from '../model';
import { createAuthToken } from '../../AuthToken/model';
import { RegisterMutationVariables } from '../../../generated';

async function register(_: any, args: RegisterMutationVariables, context: any) {
  try {
    const { email, password, name } = args.input;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return {
        success: false,
        error: 'Email already in use',
      };
    }

    const hashedPassword = await argon2.hash(password);

    // Create new user
    const user = await User.create({
      email,
      password: hashedPassword,
      name,
    });

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

export default register;
