import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

// Pages
import Municipio from './routes/Municipio.tsx';
import Bairro from './routes/Bairro.tsx';
import UF from './routes/UF.tsx';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: '/',
        element: <UF />,
      },
      {
        path: '/municipios',
        element: <Municipio />,
      },
      {
        path: '/bairros',
        element: <Bairro />,
      },
    ],
  },
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
