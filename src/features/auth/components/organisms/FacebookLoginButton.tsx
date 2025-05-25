import React from 'react';
import { Button } from '@mui/material';
import FacebookIcon from '@mui/icons-material/Facebook';
import { authenticateWithFacebook } from '../../../../utils/FacebookSDK';
import { useTranslation } from 'react-i18next';
import { useFacebookLoginMutation } from '../../../../services/authApi';

interface FacebookLoginButtonProps {
    onLoginSuccess: (data: any) => void;
    onLoginFailure: (error: Error) => void;
}

const FacebookLoginButton: React.FC<FacebookLoginButtonProps> = ({
    onLoginSuccess,
    onLoginFailure
}) => {
    const { t } = useTranslation();
    const [loading, setLoading] = React.useState(false);
    const [facebookLogin] = useFacebookLoginMutation();

    const handleFacebookLogin = async () => {
        try {
            setLoading(true);
            // Use the authenticateWithFacebook function from FacebookSDK.ts
            const { authResponse, userData } = await authenticateWithFacebook();
            //   });
            const response = await facebookLogin({ accessToken: authResponse.accessToken }).unwrap();

            if (!response) {
                throw new Error('Backend authentication failed');
            }


            // Call the success callback with the data
            onLoginSuccess(response?.data);

        } catch (error) {
            console.error('Facebook login failed:', error);
            onLoginFailure(error instanceof Error ? error : new Error('Authentication failed'));
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Button
                variant="contained"
                startIcon={<FacebookIcon />}
                onClick={handleFacebookLogin}
                disabled={loading}
                fullWidth
                sx={{
                    bgcolor: '#1877F2',
                    color: 'white',
                    '&:hover': {
                        bgcolor: '#166FE5'
                    },
                    textTransform: 'none',
                    my: 2
                }}
            >
                {loading ? t('common.loading') : t('auth.login.login_with_facebook', 'Continue with Facebook')}
            </Button>
        </>
    );
};

export default FacebookLoginButton;