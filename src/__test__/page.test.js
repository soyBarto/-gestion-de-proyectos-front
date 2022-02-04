import {
  ApolloProvider,
  ApolloClient,
  createHttpLink,
  InMemoryCache,
} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import {
  fireEvent,
  getByText,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import { UserContext } from 'context/userContext';
import Profile from 'pages/profile';

// Hacer push con el link de Heroku
const httpLink = createHttpLink({
  uri: 'servidor-gql-mintic-4.herokuapp.com/graphql',
  // uri: 'http://localhost:4000/graphql',
});

const authLink = setContext((_, { headers }) => {
  // get the authentication token from local storage if it exists
  const token = JSON.parse(localStorage.getItem('token'));
  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: authLink.concat(httpLink),
});

it('fetches info from backend', async () => {
  render(
    <ApolloProvider client={client}>
      <UserContext.Provider
        value={{
          userData: {
            _id: '61afcbf921c2d93aaa848d8f',
          },
        }}
      >
        <Profile />
      </UserContext.Provider>
    </ApolloProvider>
  );

  waitFor(() => {
    expect(screen.getByTestId('perfil')).toHaveTextContent(
      'Perfil del usuario'
    );
  });

  // const input = screen.getByTestId('name-input');

  // fireEvent.change(input, { target: { value: 'Jose' } });

  //   expect(input.value).toBe('Daniel');

  //   const boton = screen.getByTestId('button-loading');
  //   expect(boton).toHaveTextContent('Confirmar');

  //   fireEvent.click(boton);

  //   await waitFor(() => {
  //     const toast = getByText();
  //     expect(toast).toBeInTheDocument();
  //   });
});