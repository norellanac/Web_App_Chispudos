import React, { useState } from 'react';
import {
  AppBar,
  Box,
  Toolbar,
  Typography,
  Menu,
  MenuItem,
  Container,
  IconButton,
  Avatar,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import {
  Menu as MenuIcon,
  Translate as TranslateIcon,
  AccountCircleOutlined as AccountIcon,
  FavoriteBorderOutlined as FavoriteIcon,
  HomeOutlined as HomeIcon,
  AssignmentOutlined as TaskIcon,
  Storefront as StorefrontIcon,
  Sync,
  Chat,
  Engineering,
  Logout,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import AppLogo from '../../../../components/molecules/AppLogo';
import { useAppSelector } from '../../../../hooks/useAppSelector';
import { selectAuth } from '../../../../redux/slices/authSlice';
import { getApiImageUrl } from '../../../../utils/baseEnvironment';
import { useHasRole } from '../../../../hooks/useHasRole';
import { useUserEvents } from '../../../auth/hooks/authHooks';
import { useBranding } from '../../../../hooks/useBranding';

function ResponsiveAppBar() {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAppSelector(selectAuth); // Asegúrate de que `user` esté disponible
  const { t, i18n } = useTranslation();
  const { logoutUser, handleUpdateUserInfo } = useUserEvents();
  const theme = useTheme();
  const isMerchant = useHasRole('Merchant');
  const { palette } = theme;
  const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null);
  const [language, setLanguage] = useState('en');
  const { config } = useBranding();

  const chatEnabled = !config || config.features.chatEnabled;
  const tasksEnabled = !config || config.features.tasksEnabled;

  const handleBecomeMerchant = () => {
    handleUpdateUserInfo({ roles: isMerchant ? [2] : [2, 3] })
    //TODO: Evaluate with the team if we need to navigate to a specific page after becoming a merchant
    //navigate('/myProducts');
  };


  const GLOBAL_NAV_ITEMS = [
    { label: <TranslateIcon />, action: () => toggleLanguage() },
    {
      label: isMerchant ? t('appBar.navItems.user', 'Switch to User') : t('appBar.navItems.merchant', 'Become a Professional'),
      icon: <Sync sx={{ color: theme.palette.primary.main }} />,
      action: isAuthenticated ? handleBecomeMerchant : () => navigate('/register'),
      butonStyle: { backgroundColor: palette.primary.light, borderRadius: 10, },
    },
  ];

  const NAV_ITEMS = [
    {
      label: t('appBar.authNavItems.home'),
      icon: <HomeIcon sx={{ color: theme.palette.primary.main }} />,
      path: '/home',
    },
    { label: t('appBar.navItems.professionals', 'Professionals'), icon: <Engineering sx={{ color: theme.palette.primary.main }} />, path: '/professionals' },
    { label: t('auth.login.auth', 'Log in or Sign up'), icon: <AccountIcon sx={{ color: theme.palette.primary.main }} />, path: '/login' },
  ];

  const AUTH_NAV_ITEMS = [
    {
      label: t('appBar.authNavItems.home', 'Home'),
      icon: <HomeIcon sx={{ color: theme.palette.primary.main }} />,
      path: '/home',
    },
    tasksEnabled ? {
      label: t('appBar.authNavItems.tasks', 'Tasks'),
      icon: <TaskIcon sx={{ color: theme.palette.primary.main }} />,
      path: '/tasks',
    } : null,
    isMerchant ?
      {
        label: t('appBar.navItems.products', 'Products'),
        icon: <StorefrontIcon sx={{ color: theme.palette.primary.main }} />,
        path: '/myProducts',
      } :
      {
        label: t('appBar.authNavItems.favorites', 'Favorites'),
        icon: <FavoriteIcon sx={{ color: theme.palette.primary.main }} />,
        path: '/favorites',
      },
    chatEnabled ? {
      label: t('appBar.authNavItems.messages', 'Messages'),
      icon: <Chat sx={{ color: theme.palette.primary.main }} />,
      path: '/messages',
    } : null,
    {
      label: t('appBar.authNavItems.profile', 'Profile'),
      icon: (
        <Avatar
          src={getApiImageUrl(user?.avatarUrl)}
          sx={{
            width: 25,
            height: 25,
            borderRadius: 50

          }}
        />
      ),
      path: '/profile',
    },
    {
      label: t('appBar.authNavItems.logout', 'Logout'),
      icon: <Logout sx={{ color: theme.palette.primary.main }} />,
      action: () => {
        logoutUser();
      },
    },
  ].filter((item): item is NonNullable<typeof item> => item !== null);
  const toggleLanguage = () => {
    const newLang = language === 'en' ? 'es' : 'en';
    i18n.changeLanguage(newLang);
    setLanguage(newLang);
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorElNav(null);
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    handleMenuClose();
  };

  const renderMenuItems = (items) =>
    items.map(({ label, icon, path, action, butonStyle }, index) => (
      <MenuItem
        key={index}
        onClick={() => (action ? action() : handleNavigation(path))}
        sx={{ ...butonStyle }}
      >
        <Typography
          sx={{ display: 'flex', alignItems: 'center', textAlign: 'center' }}
        >
          {icon && <Box sx={{ mx: 1 }}>{icon}</Box>}
          {label}
        </Typography>
      </MenuItem>
    ));

  return (
    <AppBar position="fixed" color="transparent" sx={{ boxShadow: 'none', backgroundColor: palette.background.paper }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <AppLogo sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} />

          <AppLogo sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }} />
          <Box
            sx={{
              flexGrow: 8,
              display: { xs: 'flex', md: 'flex' },
              justifyContent: 'flex-end',
            }}
          >
            {renderMenuItems(GLOBAL_NAV_ITEMS)}
          </Box>
            <IconButton onClick={handleMenuOpen} sx={{mr: {md: 3}}}>
              <MenuIcon sx={{ color: palette.primary.main }} />
            </IconButton>
            <Menu
              anchorEl={anchorElNav}
              open={Boolean(anchorElNav)}
              onClose={handleMenuClose}
              onClick={handleMenuClose}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
              transformOrigin={{ vertical: 'top', horizontal: 'left' }}
              sx={{ display: { xs: 'flex', md: 'flex' } }}
            >
              {renderMenuItems(isAuthenticated ? AUTH_NAV_ITEMS : NAV_ITEMS)}
            </Menu>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default ResponsiveAppBar;
