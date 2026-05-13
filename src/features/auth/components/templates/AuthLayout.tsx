import { Grid2 as Grid } from '@mui/material';
import IntroSlider from '../organisms/IntroSlider';

interface AuthLayoutProps {
  children?: React.ReactNode;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  return (
    <Grid container >
      <Grid size={{ xs: 12, md: 6 }}>
        <IntroSlider />
      </Grid>

      <Grid
        size={{ xs: 12, md: 6 }}
      >
        {children}
      </Grid>
    </Grid>
  );
};

export default AuthLayout;
