import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

const Backoffice = React.lazy(() => import('backoffice_app/Backoffice'));
const Checkout = React.lazy(() => import('checkout_app/Checkout'));
const Kitchen = React.lazy(() => import('kitchen_app/Kitchen'));

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
  },
  {
    path: '/backoffice',
    element: <Backoffice />,
  },
  {
    path: '/kitchen',
    element: <Kitchen />,
  },
  {
    path: '/checkout',
    element: <Checkout />,
  },
]);

const rootEl = document.getElementById('root');
if (rootEl) {
  const root = ReactDOM.createRoot(rootEl);
  root.render(
    <React.StrictMode>
      <RouterProvider router={router} />
    </React.StrictMode>,
  );
}
