// import { StrictMode } from 'react'
// import { createRoot } from 'react-dom/client'
// import './index.css'
// import App from './App.jsx'

// createRoot(document.getElementById('root')).render(
//   <StrictMode>
//     <App />
//   </StrictMode>,
// )


import ReactDOM from "react-dom/client";

import App from "./App";
import "./index.css";

// Redux
import { Provider } from "react-redux";
import { store, persistor } from "./redux/store";
import { PersistGate } from "redux-persist/integration/react";

// Persist

// =============================================
// Application Root
// =============================================

import { ToastProvider } from "./context/ToastContext";
import { SocketProvider } from "./context/socket";

ReactDOM.createRoot(
  document.getElementById("root")
).render(
  <Provider store={store}>
    <PersistGate
      loading={null}
      persistor={persistor}
    >
      <ToastProvider>
        <SocketProvider>
          <App />
        </SocketProvider>
      </ToastProvider>
    </PersistGate>
  </Provider>
);