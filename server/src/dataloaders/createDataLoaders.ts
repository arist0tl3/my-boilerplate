// import DataLoader from 'dataloader';

import { Models } from '../models';

function createLoaders(models: Models, currentUserId?: string) {
  return {
    // personLoader: new DataLoader(async (keys: readonly string[]) => {
    //   if (!currentUserId) return [];

    //   const people = await models.Person.find({
    //     _id: {
    //       $in: keys,
    //     },
    //     createdById: currentUserId,
    //   });

    //   return keys.map((personId) => people.find((person) => person?._id?.toString() === personId));
    // }),
  };
}

export default createLoaders;
