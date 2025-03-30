// import DataLoader from 'dataloader';
import type NodeCache from 'node-cache';
import { Request, Response } from 'express';

import type { Models } from './models';

import { IUser } from './models/User/model';

export interface IDataloaders {
  // personLoader: DataLoader<string, IPerson | undefined, string>;
}

export interface IContext {
  req: Request;
  res: Response;
  models: Models;
  currentUser?: IUser | null;
  cache: NodeCache;
  dataLoaders: IDataloaders;
}
