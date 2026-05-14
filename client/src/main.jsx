import React from "react";
import ReactDOM from "react-dom/client";

import { BrowserRouter } from "react-router-dom";

import { PayPalScriptProvider } from "@paypal/react-paypal-js";

import App from "./App";

import "./styles.css";

import { AuthProvider } from "./context/AuthProvider";

ReactDOM.createRoot(
  document.getElementById("root")
).render(

  /* =========================================================
     STRICT MODE (DEV ONLY CHECKS)
  ========================================================= */
  <React.StrictMode>

    {/* =====================================================
        ROUTER PROVIDER
        Enables navigation across pages
    ===================================================== */}
    <BrowserRouter>

      {/* ===================================================
          AUTH CONTEXT PROVIDER
          Manages global user authentication state
      =================================================== */}
      <AuthProvider>

        {/* =================================================
            PAYPAL SCRIPT PROVIDER
            Loads PayPal SDK globally for payment system
        ================================================= */}
        <PayPalScriptProvider
          options={{

            // PayPal Client ID from environment variables
            clientId:
              import.meta.env
                .VITE_PAYPAL_CLIENT_ID,

            // Default currency used in PayPal transactions
            currency: "USD",

            // Payment intent type
            intent: "capture",
          }}
        >

          {/* ===============================================
              MAIN APPLICATION ROOT
          =============================================== */}
          <App />

        </PayPalScriptProvider>

      </AuthProvider>

    </BrowserRouter>

  </React.StrictMode>
);