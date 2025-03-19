import './index.css';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ApolloClient, ApolloProvider, HttpLink, InMemoryCache, split } from '@apollo/client';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { createClient } from 'graphql-ws';
import App from './App.tsx';
import { getMainDefinition } from '@apollo/client/utilities';

const httpLink = new HttpLink({
  // HTTP-ссылка для запросов и мутаций
  // http://localhost:4000/graphql
  uri: 'https://graphql-nestjs.ru/graphql',
});

const wsLink = new GraphQLWsLink(
  // WebSocket-ссылка для подписок
  // http://localhost:4000/graphql
  createClient({
    url: 'ws://graphql-nestjs.ru/graphql',
  }),
);

const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    );
  },
  wsLink,
  httpLink,
);

const client = new ApolloClient({
  link: splitLink,
  cache: new InMemoryCache(),
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  </StrictMode>,
)
