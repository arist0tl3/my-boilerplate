import { gql } from 'graphql-tag';
import { GraphQLDateTime } from 'graphql-scalars';

import UserResolvers from '../models/User/resolvers';
import UserTypeDefs from '../models/User/typeDefs';

const ScalarResolvers = {
  DateTime: GraphQLDateTime,
};

const ScalarTypeDefs = gql`
  scalar DateTime
`;

const schema = [
  {
    resolvers: ScalarResolvers,
    typeDefs: ScalarTypeDefs,
  },
  {
    resolvers: UserResolvers,
    typeDefs: UserTypeDefs,
  },
];

export default schema;
