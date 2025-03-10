import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login/Login";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import { MsalProvider } from "@azure/msal-react";
import { PublicClientApplication } from "@azure/msal-browser";
import { msalConfig } from "../src/components/Login/services/loginService";
import UserProfile from "./pages/UserProfile";
import AuthCallback from "./components/AuthCallback";

const msalInstance = new PublicClientApplication(msalConfig);
 
const App: React.FC = () => {
    return (
        <MsalProvider instance={msalInstance}>
            <Router>
                <Routes>
                    <Route path="/" element={<Login />} />
                    <Route path="/dashboard" element={
                        <ProtectedRoute>
                            <Dashboard />
                        </ProtectedRoute>
                    } />
                    <Route path="/user-profile" element={<UserProfile name={""} position={""} email={""} phone={""} department={""} office={""} />} />
                    <Route path="/auth/callback" element={<AuthCallback />} />
                </Routes>
            </Router>
        </MsalProvider>
    );
};
 
export default App;