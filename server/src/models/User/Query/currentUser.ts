import { IContext } from '../../../types';

import { CurrentUser } from '../../../generated';

/**
 * Simply return the user from context
 */
function currentUser(parent: undefined, args: undefined, context: IContext): CurrentUser | null {
  if (context.currentUser === undefined) return null;

  return context.currentUser;
}

export default currentUser;
