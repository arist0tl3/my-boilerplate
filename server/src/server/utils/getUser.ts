import { verifyAuthToken } from '../../models/AuthToken/model';
import type { Models } from '../../models';

async function getUser(authHeader: string, models: Models) {
  const token = authHeader?.replace('Bearer ', '');

  if (!token) {
    return null;
  }

  try {
    const userId = await verifyAuthToken(token);
    if (!userId) {
      return null;
    }

    const user = await models.User.findOne({ _id: userId });
    return user;
  } catch (error) {
    throw new Error('Invalid token');
  }
}

export default getUser;
