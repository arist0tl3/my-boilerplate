import { ReactElement, ReactNode, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Avatar,
  Box,
  Divider,
  Dropdown,
  IconButton,
  Input,
  List,
  ListItem,
  ListItemButton,
  ListItemContent,
  ListItemDecorator,
  Menu,
  MenuButton,
  MenuItem,
  Sheet,
  Typography,
} from '@mui/joy';

import { useColorScheme } from '@mui/joy';

// Import icons (you'll need to install @mui/icons-material)
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import SettingsIcon from '@mui/icons-material/Settings';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import TaskIcon from '@mui/icons-material/Task';
import SearchIcon from '@mui/icons-material/Search';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import MenuIcon from '@mui/icons-material/Menu';
import LogoutIcon from '@mui/icons-material/Logout';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { useLogoutMutation } from '../../generated';

interface LayoutProps {
  children: ReactNode;
}

interface SidebarItem {
  label: string;
  icon: ReactElement;
  path: string;
}

function Layout({ children }: LayoutProps): ReactElement {
  const { mode, setMode } = useColorScheme();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);

  const [logout] = useLogoutMutation({
    refetchQueries: ['CurrentUser'],
    onCompleted: () => {
      localStorage.removeItem('auth_token');
    },
  });

  const sidebarItems: SidebarItem[] = [
    { label: 'Dashboard', icon: <DashboardIcon />, path: '/' },
    { label: 'Users', icon: <PeopleIcon />, path: '/users' },
    { label: 'Tasks', icon: <TaskIcon />, path: '/tasks' },
    { label: 'Analytics', icon: <AnalyticsIcon />, path: '/analytics' },
    { label: 'Settings', icon: <SettingsIcon />, path: '/settings' },
  ];

  const toggleColorMode = () => {
    setMode(mode === 'light' ? 'dark' : 'light');
  };

  const handleLogout = () => {
    try {
      logout();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const toggleMobileSidebar = () => {
    setMobileOpen(!mobileOpen);
  };

  const Sidebar = () => (
    <Sheet
      sx={{
        position: { xs: 'fixed', md: 'sticky' },
        top: 0,
        left: 0,
        height: '100vh',
        width: { xs: 240, md: sidebarOpen ? 240 : 72 },
        transition: 'width 0.3s ease',
        zIndex: 1000,
        borderRight: '1px solid',
        borderColor: 'divider',
        overflow: 'hidden',
        display: { xs: mobileOpen ? 'block' : 'none', md: 'block' },
        boxShadow: 'md',
      }}
    >
      <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: sidebarOpen ? 'space-between' : 'center' }}>
        {sidebarOpen ? (
          <Typography level="h3" component="h1">
            AppName
          </Typography>
        ) : (
          <Typography level="h3" component="h1">
            A
          </Typography>
        )}
      </Box>
      <Divider />
      <List size="sm" sx={{ py: 2 }}>
        {sidebarItems.map((item) => (
          <ListItem key={item.label}>
            <ListItemButton
              component={RouterLink}
              to={item.path}
              sx={{
                borderRadius: 'sm',
                justifyContent: sidebarOpen ? 'flex-start' : 'center',
                p: sidebarOpen ? undefined : 1,
              }}
            >
              <ListItemDecorator>{item.icon}</ListItemDecorator>
              {sidebarOpen && <ListItemContent>{item.label}</ListItemContent>}
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Sheet>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          minWidth: 0,
          height: '100vh',
          overflow: 'auto',
        }}
      >
        <Sheet
          component="header"
          sx={{
            p: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1px solid',
            borderColor: 'divider',
            position: 'sticky',
            top: 0,
            zIndex: 900,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <IconButton
              variant="outlined"
              color="neutral"
              onClick={toggleMobileSidebar}
              sx={{ display: { xs: 'inline-flex', md: 'none' } }}
            >
              <MenuIcon />
            </IconButton>
            <IconButton variant="outlined" color="neutral" onClick={toggleSidebar} sx={{ display: { xs: 'none', md: 'inline-flex' } }}>
              <MenuIcon />
            </IconButton>
            <Input size="sm" placeholder="Search..." startDecorator={<SearchIcon />} sx={{ width: { xs: 160, md: 240 } }} />
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <IconButton variant="outlined" color="neutral" onClick={toggleColorMode}>
              {mode === 'light' ? <DarkModeIcon /> : <LightModeIcon />}
            </IconButton>
            <Dropdown>
              <MenuButton slots={{ root: IconButton }} slotProps={{ root: { variant: 'plain', color: 'neutral' } }}>
                <Avatar size="sm" variant="outlined">
                  <AccountCircleIcon />
                </Avatar>
              </MenuButton>
              <Menu placement="bottom-end">
                <MenuItem>
                  <Typography>My Profile</Typography>
                </MenuItem>
                <MenuItem>
                  <Typography>Account Settings</Typography>
                </MenuItem>
                <Divider />
                <MenuItem color="danger" onClick={handleLogout}>
                  <ListItemDecorator>
                    <LogoutIcon />
                  </ListItemDecorator>
                  <Typography>Logout</Typography>
                </MenuItem>
              </Menu>
            </Dropdown>
          </Box>
        </Sheet>
        <Box
          component="div"
          sx={{
            flexGrow: 1,
            p: 3,
            bgcolor: 'background.level1',
          }}
        >
          {children}
        </Box>
      </Box>
    </Box>
  );
}

export default Layout;
