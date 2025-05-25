// Facebook SDK types
interface FacebookAuthResponse {
  accessToken: string;
  expiresIn: number;
  signedRequest: string;
  userID: string;
  graphDomain?: string;
  data_access_expiration_time?: number;
}

interface FacebookStatusResponse {
  status: 'connected' | 'not_authorized' | 'unknown';
  authResponse: FacebookAuthResponse | null;
}

interface FacebookLoginResponse {
  authResponse: FacebookAuthResponse | null;
  status: 'connected' | 'not_authorized' | 'unknown';
}

interface FacebookUserData {
  id: string;
  name: string;
  email?: string;
  picture?: {
    data: {
      url: string;
    }
  };
}

// Augment Window interface
declare global {
  interface Window {
    FB?: {
      init(options: {
        appId: string;
        cookie?: boolean;
        xfbml: boolean;
        version: string;
      }): void;
      getLoginStatus(callback: (response: FacebookStatusResponse) => void): void;
      login(
        callback: (response: FacebookLoginResponse) => void,
        options: { scope: string }
      ): void;
      api(
        path: string,
        callback: (response: FacebookUserData) => void
      ): void;
    };
    fbAsyncInit?: () => void;
  }
}

const FB_PERMISSIONS = 'public_profile,email';

/**
 * Wait for the Facebook SDK to be available
 * @returns Promise that resolves when the SDK is ready
 */
export const waitForFacebookSDK = (): Promise<void> => {
  return new Promise<void>((resolve, reject) => {
    // If SDK is already loaded, resolve immediately
    if (window.FB) {
      resolve();
      return;
    }

    // Check every 100ms for up to 10 seconds
    let attempts = 0;
    const maxAttempts = 100;
    
    const checkSDK = () => {
      attempts++;
      if (window.FB) {
        resolve();
      } else if (attempts >= maxAttempts) {
        reject(new Error('Facebook SDK not loaded after timeout'));
      } else {
        setTimeout(checkSDK, 100);
      }
    };
    
    checkSDK();
  });
};

/**
 * Check if the user is already logged in to Facebook
 * @returns Promise with the login status response
 */
export const checkLoginState = async (): Promise<FacebookStatusResponse> => {
  await waitForFacebookSDK();
  
  return new Promise<FacebookStatusResponse>((resolve, reject) => {
    window.FB!.getLoginStatus((response) => {
      if (response.status === 'connected') {
        resolve(response);
      } else {
        reject(new Error('User not logged in or not authenticated'));
      }
    });
  });
};

/**
 * Trigger Facebook login flow
 * @returns Promise with the login response
 */
export const loginWithFacebook = async (): Promise<FacebookLoginResponse> => {
  await waitForFacebookSDK();
  
  return new Promise<FacebookLoginResponse>((resolve, reject) => {
    window.FB!.login((response) => {
      if (response.authResponse) {
        resolve(response);
      } else {
        reject(new Error('User cancelled login or did not fully authorize'));
      }
    }, { scope: FB_PERMISSIONS });
  });
};

/**
 * Get user data from Facebook
 * @returns Promise with user profile data
 */
export const getFacebookUserData = async (): Promise<FacebookUserData> => {
  await waitForFacebookSDK();
  
  return new Promise<FacebookUserData>((resolve, reject) => {
    window.FB!.api(
      '/me?fields=id,name,email,picture.type(large)',
      (response) => {
        if (!response || response.error) {
          reject(new Error(response?.error?.message || 'Failed to get user data'));
          return;
        }
        resolve(response);
      }
    );
  });
};

/**
 * Complete Facebook authentication flow
 * @returns Promise with the auth response and user data
 */
export const authenticateWithFacebook = async (): Promise<{
  authResponse: FacebookAuthResponse;
  userData: FacebookUserData;
}> => {
  try {
    console.log('Starting Facebook authentication...');
    
    // Wait for the Facebook SDK to be available
    await waitForFacebookSDK();
    
    // Continue with login flow...
    let authResponse: FacebookAuthResponse;
    
    try {
      // Try to get existing session first
      const statusResponse = await checkLoginState();
      authResponse = statusResponse.authResponse!;
      console.log('Using existing Facebook session');
    } catch (error) {
      // If no existing session, try login
      console.log('No existing session, initiating Facebook login');
      const loginResponse = await loginWithFacebook();
      
      if (!loginResponse.authResponse) {
        throw new Error('Failed to get authentication response');
      }
      
      authResponse = loginResponse.authResponse;
    }
    
    // Get user profile data
    const userData = await getFacebookUserData();
    
    return { authResponse, userData };
    
  } catch (error) {
    console.error('Facebook authentication failed:', error);
    throw error instanceof Error ? error : new Error('Authentication failed');
  }
};