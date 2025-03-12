import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login/Login";
import Dashboard from "./pages/Dashboard";
// import ProtectedRoute from "./components/ProtectedRoute";
import { MsalProvider } from "@azure/msal-react";
import { PublicClientApplication } from "@azure/msal-browser";
import { msalConfig } from "../src/components/Login/services/loginService";
import UserProfile from "./pages/UserProfile";


const msalInstance = new PublicClientApplication(msalConfig);

const App: React.FC = () => {
  return (
    <MsalProvider instance={msalInstance}>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          
          <Route
            path="/dashboard"
            element={
              // <ProtectedRoute>
                <Dashboard />
              // </ProtectedRoute>
            }
          />
          <Route
            path="/user_profile"
            element={
              // <ProtectedRoute>
                <UserProfile
                  name={""}
                  position={""}
                  email={""}
                  phone={""}
                  department={""}
                  office={""}
                />
              // </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </MsalProvider>
  );
};

export default App;
