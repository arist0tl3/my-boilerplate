import ReactDOM from 'react-dom/client';
import { ApolloClient, ApolloProvider, InMemoryCache, HttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { CssVarsProvider, extendTheme } from "@mui/joy";

import App from './App';
import './index.css';

const { VITE_GRAPHQL_ENDPOINT } = import.meta.env;

const link = new HttpLink({ uri: VITE_GRAPHQL_ENDPOINT });

const setAuthorizationLink = setContext((_, previousContext) => {
  return {
    headers: {
      ...previousContext.headers,
      authorization: `Bearer ${localStorage.getItem('auth_token') || ''}`,
    },
  };
});

export const client = new ApolloClient({
  link: setAuthorizationLink.concat(link),
  cache: new InMemoryCache(),
});

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);


const theme = extendTheme();

function renderApp(): void {
  root.render(
    <ApolloProvider client={client}>
      <CssVarsProvider theme={theme}>
        <App />
      </CssVarsProvider>
    </ApolloProvider>,
  );
}

function init(): void {
  renderApp();
}

init();
