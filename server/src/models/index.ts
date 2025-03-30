import type { Model } from 'mongoose';

import AuthToken, { IAuthToken } from './AuthToken/model';
import User, { IUser } from './User/model';

export type Models = {
  AuthToken: Model<IAuthToken, {}, {}, {}>;
  User: Model<IUser, {}, {}, {}>;
};

const models: Models = {
  AuthToken,
  User,
};

export default models;
