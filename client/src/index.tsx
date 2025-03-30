const httpLink = createHttpLink({
  uri: '/graphql',
  credentials: 'include', // This is important for cookies
});

const client = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
}); 