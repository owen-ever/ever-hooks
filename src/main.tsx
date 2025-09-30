import React from 'react';
import { createRoot } from 'react-dom/client';
import ToggleDemo from '@demo/ToggleDemo';

const container = document.getElementById('root');
if (!container) {
  throw new Error('#root element not found in index.html');
}

createRoot(container).render(
  <React.StrictMode>
    <ToggleDemo />
  </React.StrictMode>,
);
