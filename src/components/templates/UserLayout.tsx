import { ReactNode } from 'react';
import { Box, useMediaQuery, useTheme } from '@mui/material';
import ButtonTab from '../organisms/ButtonTab';
import ResponsiveAppBar from '../../features/landing/components/organisms/AppBar';
import Footer from '../organisms/Footer';

interface Props {
  children: ReactNode;
  showFooter?: boolean;
}

export const UserLayout = ({ children,
  showFooter = true,
 }: Props) => {
  const theme = useTheme();
  const isLargeScreen = useMediaQuery(theme.breakpoints.up('md'));

  return (
    <>
      {isLargeScreen ? (
        <>
          <ResponsiveAppBar />
          <Box sx={{ marginTop: '64px'}}>
            {children}
          </Box>
        </>
      ) : (
        <ButtonTab children={children} />
      )}
      {showFooter && <Footer />}
    </>
  );
};
