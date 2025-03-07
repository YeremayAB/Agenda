def get_access_token():
    app = msal.ConfidentialClientApplication(
        client_id=settings.OUTLOOK_CLIENT_ID,
        authority=f"https://login.microsoftonline.com/{settings.OUTLOOK_TENANT_ID}",
        client_credential=settings.OUTLOOK_CLIENT_SECRET,
    )
   
    result = app.acquire_token_for_client(scopes=["https://graph.microsoft.com/.default"])
    print('El resultado es:', result)
 
    if "access_token" in result:
        return result["access_token"]
    else:
        print(f"Error retrieving access token: {result.get('error_description')}")
        return None



        