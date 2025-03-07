export const msalConfig = {
    auth: {
        clientId: "d247e254-6008-487a-96f7-f423519064cd",  // Reemplaza con tu client_id real
        authority: "https://login.microsoftonline.com/d644f2b8-a0cf-4678-b419-c5bfd6230d52",  // Tu tenant_id
        redirectUri: "http://localhost:3000/auth/callback"  // O la URL de tu frontend
    }
  };
 
  export const loginRequest = {
    scopes: ["User.Read"]
  };
