import { useEffect } from "react";
import { useMsal } from "@azure/msal-react";
import { useNavigate } from "react-router-dom";

const AuthCallback = () => {
  const { instance, inProgress } = useMsal();
  const navigate = useNavigate();

  useEffect(() => {
    const urlFragment = window.location.hash;

    if (urlFragment && window.location.origin === "http://localhost:3000") {
      const redirectUrl = `http://localhost:5173/auth/callback${urlFragment}`;

      window.location.replace(redirectUrl);
      return;  
    }

    const handleAuth = async () => {
      if (inProgress === "none") {
        try {
          const response = await instance.handleRedirectPromise();

          if (response) {
            const token = response.accessToken;

            const backendResponse = await fetch('http://localhost:3000/api/auth/validate-microsoft/', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ token })
            });

            const result = await backendResponse.json();

            if (result.status === 'ok') {
              localStorage.setItem('user', JSON.stringify(result.user));
              localStorage.setItem('token', token);
              navigate('/dashboard', { replace: true });
            } else {
              navigate('/');
            }
          }
        } catch (error) {
          console.error("Error:", error);
          navigate('/');
        }
      }
    };

    handleAuth();
  }, [instance, inProgress, navigate]);

  return <p>Autenticando...</p>;
};

export default AuthCallback;
