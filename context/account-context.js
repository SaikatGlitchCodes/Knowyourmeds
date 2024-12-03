import React, { createContext, useState, useContext } from 'react';
import { authorize } from '@okta/okta-react-native';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userInfo, setUserInfo] = useState(null);

  const signIn = async () => {
    try {
      const result = await authorize({
        clientId: 'IMTSDCqTpLcgs4ZXXcXUECgZC7Ipfy6Y',
        redirectUri: 'com.okta.dev-dev-rq5d6lx3177s74kx.us.auth0.com:/callback',
        endSessionRedirectUri: 'com.okta.dev-dev-rq5d6lx3177s74kx.us.auth0.com:/logout',
        discoveryUri: 'dev-rq5d6lx3177s74kx.us.auth0.com',
        scopes: ['openid', 'profile', 'email']
      });
      setUserInfo(result);
    } catch (err) {
      console.error(err);
    }
  };

  const signOut = () => setUserInfo(null);

  return (
    <AuthContext.Provider value={{ userInfo, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
