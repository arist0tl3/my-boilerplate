import { ReactElement, useState, useRef, useEffect } from 'react';
import { Link as RouterLink, useLocation, Outlet } from 'react-router-dom';
import {
  Avatar,
  Box,
  Divider,
  Dropdown,
  IconButton,
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
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import MenuIcon from '@mui/icons-material/Menu';
import LogoutIcon from '@mui/icons-material/Logout';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { useLogoutMutation } from '../../generated';

interface SidebarItem {
  label: string;
  icon: ReactElement;
  path: string;
}

function Layout(): ReactElement {
  const { mode, setMode } = useColorScheme();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const mainContentRef = useRef<HTMLDivElement>(null);

  const [logout] = useLogoutMutation({
    refetchQueries: ['CurrentUser'],
    onCompleted: () => {
      localStorage.removeItem('auth_token');
    },
  });

  // Close mobile sidebar when route changes
  useEffect(() => {
    if (mobileOpen) {
      setMobileOpen(false);
    }
  }, [location.pathname]);

  // Handle clicks outside the sidebar to close it on mobile
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (mobileOpen && mainContentRef.current && mainContentRef.current.contains(event.target as Node)) {
        setMobileOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [mobileOpen]);

  const sidebarItems: SidebarItem[] = [{ label: 'Dashboard', icon: <DashboardIcon />, path: '/' }];

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

  const handleSidebarItemClick = () => {
    if (window.innerWidth < 900) {
      // Approximate md breakpoint
      setMobileOpen(false);
    }
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <Box
        sx={{
          display: { xs: 'block', md: 'none' },
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          bgcolor: 'rgba(0, 0, 0, 0.5)',
          zIndex: 999,
          opacity: mobileOpen ? 1 : 0,
          visibility: mobileOpen ? 'visible' : 'hidden',
          transition: 'opacity 0.3s ease, visibility 0.3s ease',
          backdropFilter: 'blur(2px)',
        }}
        onClick={() => setMobileOpen(false)}
      />
      <Sheet
        sx={{
          position: { xs: 'fixed', md: 'sticky' },
          top: 0,
          left: 0,
          height: '100vh',
          width: {
            xs: 240,
            md: sidebarOpen ? 240 : 72,
          },
          zIndex: 1000,
          borderRight: '1px solid',
          borderColor: 'divider',
          overflow: 'hidden',
          display: 'block',
          transition: 'all 0.3s ease',
          boxShadow: 'md',
          transform: {
            xs: mobileOpen ? 'translateX(0)' : 'translateX(-240px)',
            md: 'translateX(0)',
          },
        }}
      >
        <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: sidebarOpen ? 'space-between' : 'center' }}>
          {sidebarOpen || mobileOpen ? (
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
                onClick={handleSidebarItemClick}
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
      <Box
        component="main"
        ref={mainContentRef}
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
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}

export default Layout;
