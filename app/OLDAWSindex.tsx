// app/index.tsx
import { useState, useMemo, useEffect } from 'react';
import * as WebBrowser from 'expo-web-browser';
import * as AuthSession from 'expo-auth-session';
import {
  useAuthRequest,
  exchangeCodeAsync,
  revokeAsync,
  ResponseType,
} from 'expo-auth-session';
import { Button, Alert, View, Text, StyleSheet, Linking } from 'react-native';

WebBrowser.maybeCompleteAuthSession();

const clientId = '5mn7te3b2qoikfja2agr624kg2';
// const clientId = '13ol47a38qfl2hv1t44vblcvie';
const userPoolUrl = 'https://us-east-2qg3n7kxqu.auth.us-east-2.amazoncognito.com';
// const userPoolUrl = 'https://us-east-2sgqne4ggq.auth.us-east-2.amazoncognito.com';
const redirectUri = 'https://auth.expo.io/@ohanaexperienceapp/ohanaapp';


export default function AppEntry() {
  interface AuthTokens {
    accessToken: string;
    refreshToken: string;
    idToken?: string;
  }

  const [authTokens, setAuthTokens] = useState<AuthTokens | null>(null);
  const [isCreatingAccount, setIsCreatingAccount] = useState(false);

  const discoveryDocument = useMemo(
    () => ({
      authorizationEndpoint: userPoolUrl + '/oauth2/authorize',
      tokenEndpoint: userPoolUrl + '/oauth2/token',
      revocationEndpoint: userPoolUrl + '/oauth2/revoke',
    }),
    []
  );

  const [request, response, promptAsync] = useAuthRequest(
    {
      clientId,
      responseType: ResponseType.Code,
      redirectUri,
      usePKCE: true,
      scopes: ['openid', 'profile', 'email', 'phone'],
    },
    discoveryDocument
  );

  useEffect(() => {
    const sub = Linking.addEventListener('url', ({ url }) => {
      console.log('🔗 Received deep link:', url);
    });
    return () => sub.remove();
  }, []);

  useEffect(() => {
    const exchangeFn = async (exchangeTokenReq: { clientId: string; code: string; redirectUri: string; extraParams: { code_verifier: string } }) => {
      try {
        const exchangeTokenResponse = await exchangeCodeAsync(
          exchangeTokenReq,
          discoveryDocument
        );
        setAuthTokens({
          accessToken: exchangeTokenResponse.accessToken,
          refreshToken: exchangeTokenResponse.refreshToken || '',
          idToken: exchangeTokenResponse.idToken,
        });
      } catch (error) {
        console.error(error);
      }
    };

    if (response) {
      if (response.type === 'error') {
        Alert.alert(
          'Authentication error',
          response.error?.message || 'Something went wrong'
        );
        return;
      }
      if (response.type === 'success') {
        exchangeFn({
          clientId,
          code: response.params.code,
          redirectUri,
          extraParams: {
            code_verifier: request?.codeVerifier || '',
          },
        });
      }
    }
  }, [discoveryDocument, request, response]);

  const logout = async () => {
    if (!authTokens?.refreshToken || !discoveryDocument || !clientId) {
      return;
    }
    try {
      const urlParams = new URLSearchParams({
        client_id: clientId,
        logout_uri: redirectUri,
      });
      await WebBrowser.openAuthSessionAsync(`${userPoolUrl}/logout?${urlParams.toString()}`);
      const revokeResponse = await revokeAsync(
        {
          clientId,
          token: authTokens?.refreshToken,
        },
        discoveryDocument
      );
      if (revokeResponse) {
        setAuthTokens(null);
      }
    } catch (error) {
      console.error('Error during token revocation:', error);
    }
  };

  console.log('authTokens: ' + JSON.stringify(authTokens));

  if (authTokens) {
    return <Button title="Logout" onPress={logout} />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to Ohana.  Do it work?</Text>
      <Button
        title="Create Account"
        onPress={() => {
          setIsCreatingAccount(true);
          promptAsync();
        }}
        disabled={!request}
      />
      <View style={styles.spacer} />
      <Button
        title="Login"
        onPress={() => {
          setIsCreatingAccount(false);
          promptAsync();
        }}
        disabled={!request}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 40 },
  spacer: { height: 20 },
});
