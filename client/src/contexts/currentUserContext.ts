import { createContext } from 'react';

import { CurrentUser } from '../generated';

export const CurrentUserContext = createContext<CurrentUser | null>(null);
