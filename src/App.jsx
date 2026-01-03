import React from "react";
import { BrowserRouter } from "react-router-dom";

import ErrorBoundary from "components/ErrorBoundary";
import ScrollToTop from "components/ScrollToTop";

import AppRoutes from "routes/AppRoutes";
import { AuthProvider } from "context/AuthContext";
import { ThemeProvider } from "context/ThemeContext";

function App() {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <ThemeProvider>
          <AuthProvider>
            <ScrollToTop />
            <AppRoutes />
          </AuthProvider>
        </ThemeProvider>
      </ErrorBoundary>
    </BrowserRouter>
  );
}

export default App;
