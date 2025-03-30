import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Box from '@mui/joy/Box';

import { useCurrentUserQuery } from './generated';

import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';

import Layout from './components/Layout';
import { CurrentUserContext } from './contexts/currentUserContext';

function App() {
  const { data, error, loading } = useCurrentUserQuery();

  if (loading) return <div>{''}</div>;
  if (error) return <div>{`Error: ${error}`}</div>;

  const currentUser = data?.currentUser ?? null;

  return (
    <Box
      sx={{
        height: '100vh',
        width: '100vw',
      }}
    >
      <BrowserRouter>
        {!currentUser && (
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        )}

        {currentUser && (
          <CurrentUserContext.Provider value={currentUser}>
            <Routes>
              <Route element={<Layout />}>
                <Route path={'/'} element={<Dashboard />} />

                <Route path="/login" element={<Navigate to="/" replace />} />
                <Route path="/register" element={<Navigate to="/" replace />} />
              </Route>
            </Routes>
          </CurrentUserContext.Provider>
        )}
      </BrowserRouter>
    </Box>
  );
}

export default App;
