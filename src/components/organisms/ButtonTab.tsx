import * as React from 'react';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import Paper from '@mui/material/Paper';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import HomeIcon from '../../assets/images/ButtonTab/HomeIcon.svg';
import TaskIcon from '../../assets/images/ButtonTab/TaskIcon.svg';
import FavoriteIcon from '../../assets/images/ButtonTab/FavoriteIcon.svg';
import HomeIconSelected from '../../assets/images/ButtonTab/HomeIconSelected.svg';
import TaskIconSelected from '../../assets/images/ButtonTab/TaskIconSelected.svg';
import FavoriteIconSelected from '../../assets/images/ButtonTab/FavoriteIconSelected.svg';
import { useTranslation } from 'react-i18next';
import TextAtom from '../atoms/TextAtom';
import { AccountCircle, AccountCircleOutlined, Chat, ChatOutlined, Sync, ViewList, ViewListOutlined } from '@mui/icons-material';
import { useHasRole } from '../../hooks/useHasRole';
import { ButtonAtom } from '../atoms';
import { useUserEvents } from '../../features/auth/hooks/authHooks';
import { useBranding } from '../../hooks/useBranding';

interface Props {
  children: React.ReactNode;
}

export default function ButtonTab({ children }: Props) {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const { t } = useTranslation();
  const isMerchant = useHasRole('Merchant');
  const { handleUpdateUserInfo } = useUserEvents();
  const { config } = useBranding();

  const chatEnabled = !config || config.features.chatEnabled;
  const tasksEnabled = !config || config.features.tasksEnabled;

  const navItems = [
    {
      label: t('buttonTab.home', 'Home'),
      icon: <img src={HomeIcon} alt="Home" style={{ width: 24, height: 24 }} />,
      selectedIcon: (
        <img
          src={HomeIconSelected}
          alt="Home"
          style={{ width: 24, height: 24 }}
        />
      ),
      url: '/home',
    },
    tasksEnabled ? {
      label: t('buttonTab.task', 'Task'),
      icon: <img src={TaskIcon} alt="Task" style={{ width: 24, height: 24 }} />,
      selectedIcon: (
        <img
          src={TaskIconSelected}
          alt="Task"
          style={{ width: 24, height: 24 }}
        />
      ),
      url: '/tasks',
    } : null,
    isMerchant ? {
      label: t('buttonTab.products', 'Products'),
      icon: <ViewListOutlined fontSize="small" />,
      selectedIcon: (
        <ViewList fontSize="small" />
      ),
      url: '/myProducts',
    } :
      {
        label: t('buttonTab.favorites', 'Favorites'),
        icon: (
          <img
            src={FavoriteIcon}
            alt="Favorites"
            style={{ width: 24, height: 24 }}
          />
        ),
        selectedIcon: (
          <img
            src={FavoriteIconSelected}
            alt="Favorites"
            style={{ width: 24, height: 24 }}
          />
        ),
        url: '/favorites',
      },
    chatEnabled ? {
      label: t('buttonTab.chat', 'Messages'),
      icon: <ChatOutlined fontSize="small" />,
      selectedIcon: <Chat fontSize="small" />,
      url: '/messages',
    } : null,
    {
      label: t('buttonTab.profile', 'Profile'),
      icon: <AccountCircleOutlined fontSize="small" />,
      selectedIcon: <AccountCircle fontSize="small" />,
      url: '/profile',
    },
  ];

  const filteredNavItems = navItems.filter((item): item is NonNullable<typeof item> => item !== null);

  const currentIndex = filteredNavItems.findIndex(
    (item) => item.url === location.pathname,
  );
  const [value, setValue] = React.useState(
    currentIndex >= 0 ? currentIndex : 0,
  );

  React.useEffect(() => {
    if (currentIndex !== value) {
      setValue(currentIndex);
    }
  }, [currentIndex, value]);

  return (
    <Box sx={{ pb: 7 }}>
      <CssBaseline />
      {children}
      <Paper
        sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }}
        elevation={3}
      >
          <Box sx={{ position: 'relative', height: 0 }}>
            <ButtonAtom
              variant={isMerchant ? 'elevated' : 'filled'}
              onClick={() => handleUpdateUserInfo({ roles: isMerchant ? [2] : [2, 3] })}
              startIcon={<Sync />}
              sx={{
                position: 'absolute',
                top: '-48px', // Position above the navigation
                left: '50%',
                transform: 'translateX(-50%)',
                minWidth: '250px',
                zIndex: 1,
              }}
            >
              {isMerchant
                ? t('buttonTab.switchToUser', 'Switch to User')
                : t('buttonTab.switchToMerchant', 'Switch to Professional')}
            </ButtonAtom>
          </Box>
        <BottomNavigation
          showLabels
          value={value}
          onChange={(event, newValue) => {
            setValue(newValue);
            navigate(filteredNavItems[newValue].url);
          }}
        >
          {filteredNavItems.map((item, index) => (
            <BottomNavigationAction
              key={index}
              label={
                <TextAtom variant="body" size="small">
                  {item.label}
                </TextAtom>
              }
              icon={
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor:
                      value === index
                        ? theme.palette.secondary.light
                        : 'transparent',
                    borderRadius: value === index ? '12px' : '0%',
                    padding: value === index ? '0 10px' : '0',
                  }}
                >
                  {value === index ? item.selectedIcon : item.icon}
                </div>
              }
            />
          ))}
        </BottomNavigation>
      </Paper>
    </Box>
  );
}
