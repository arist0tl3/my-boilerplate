import { IContext } from '../../../types';
import { invalidateAuthToken } from '../../AuthToken/model';

import { LogoutResponse } from '../../../generated';

/**
 * Remove any auth tokens, essentially "logging the user out"
 */
async function logout(parent: undefined, args: undefined, context: IContext): Promise<LogoutResponse> {
  try {
    const token = context?.req?.headers?.authorization?.replace('Bearer ', '');

    if (!token) {
      return {
        success: false,
        error: 'No token provided',
      };
    }

    await invalidateAuthToken(token);

    return {
      success: true,
    };
  } catch (err) {
    const error = err as Error;
    return {
      success: false,
      error: error.message || 'An error occurred during logout',
    };
  }
}

export default logout;
