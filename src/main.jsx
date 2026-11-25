import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router/dom';
import { TicketProvider } from './context/TicketContext';
import { EventProvider } from './providers/EventProvider';
import { router } from './router';
import './styles/main.css';
import './styles/posters.css';
import './styles/final.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <TicketProvider>
      <EventProvider>
        <RouterProvider router={router}/>
      </EventProvider>
    </TicketProvider>
  </StrictMode>
);
