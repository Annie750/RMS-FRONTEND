import React, { useEffect, useState } from 'react';
import {
  AppBar,
  Toolbar,
  IconButton,
  Box,
  Avatar,
  Menu,
  MenuItem,
  Typography,
  Badge,
  Divider,
  ListItemIcon,
  Tooltip
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined';
import Brightness4OutlinedIcon from '@mui/icons-material/Brightness4Outlined';
import Brightness7OutlinedIcon from '@mui/icons-material/Brightness7Outlined';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useThemeMode } from '../theme/ThemeModeContext';
import { DRAWER_WIDTH } from '../utils/constants';
import dashboardService from '../services/dashboardService';

const Navbar = ({ onMenuClick }) => {
  const { user, logout } = useAuth();
  const { mode, toggleMode } = useThemeMode();
  const navigate = useNavigate();

 const [anchorEl, setAnchorEl] = useState(null);
const [notifAnchorEl, setNotifAnchorEl] = useState(null);
const [notifications, setNotifications] = useState([]);

useEffect(() => {
  const loadNotifications = async () => {
    try {
      const upcoming = await dashboardService.getUpcomingRenewals();
      setNotifications(upcoming || []);
    } catch (error) {
      console.error('Failed to load notifications:', error);
      setNotifications([]);
    }
  };

  loadNotifications();
}, []);

const handleLogout = () => {
  setAnchorEl(null);
  logout();
  navigate('/login');
};

const initials = user?.name
  ? user.name
      .split(' ')
      .map((n) => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase()
  : 'U';

  return (
    <AppBar
      position="fixed"
      color="inherit"
      sx={{
        width: { md: `calc(100% - ${DRAWER_WIDTH}px)` },
        ml: { md: `${DRAWER_WIDTH}px` },
        bgcolor: 'background.paper',
        borderBottom: '1px solid',
        borderColor: 'divider'
      }}
      elevation={0}
    >
      <Toolbar sx={{ gap: 1 }}>
        <IconButton
          color="inherit"
          edge="start"
          onClick={onMenuClick}
          sx={{ display: { md: 'none' } }}
        >
          <MenuIcon />
        </IconButton>

        <Box sx={{ flexGrow: 1 }} />

        <Tooltip title={mode === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}>
          <IconButton onClick={toggleMode} color="inherit">
            {mode === 'light' ? <Brightness4OutlinedIcon /> : <Brightness7OutlinedIcon />}
          </IconButton>
        </Tooltip>

        <Tooltip title="Notifications">
          <IconButton color="inherit" onClick={(e) => setNotifAnchorEl(e.currentTarget)}>
            <Badge
  badgeContent={notifications.length}
  color="error"
  invisible={notifications.length === 0}
>
              <NotificationsNoneOutlinedIcon />
            </Badge>
          </IconButton>
        </Tooltip>
        <Menu
          anchorEl={notifAnchorEl}
          open={Boolean(notifAnchorEl)}
          onClose={() => setNotifAnchorEl(null)}
          PaperProps={{ sx: { width: 320, mt: 1 } }}
        >
          <Box sx={{ px: 2, py: 1 }}>
            <Typography variant="subtitle2">Notifications</Typography>
          </Box>
          <Divider />
         {notifications.length === 0 ? (
  <MenuItem disabled>
    <Typography variant="body2" color="text.secondary">
      No upcoming renewals
    </Typography>
  </MenuItem>
) : (
  notifications.map((notification) => (
    <MenuItem
      key={`${notification.customer}-${notification.product}-${notification.expiryDate}`}
      onClick={() => setNotifAnchorEl(null)}
    >
      <Box>
        <Typography variant="body2">
          {notification.customer} — {notification.product}
        </Typography>

        <Typography variant="caption" color="text.secondary">
          Expires {notification.expiryDate} • {notification.daysLeft} days left
        </Typography>
      </Box>
    </MenuItem>
  ))
)}
        </Menu>

        <Tooltip title="Account">
          <IconButton onClick={(e) => setAnchorEl(e.currentTarget)} sx={{ ml: 0.5 }}>
            <Avatar sx={{ width: 34, height: 34, bgcolor: 'primary.main', fontSize: '0.85rem' }}>
              {initials}
            </Avatar>
          </IconButton>
        </Tooltip>
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={() => setAnchorEl(null)}
          PaperProps={{ sx: { width: 220, mt: 1 } }}
        >
          <Box sx={{ px: 2, py: 1 }}>
            <Typography variant="subtitle2" noWrap>
              {user?.name || 'User'}
            </Typography>
            <Typography variant="caption" color="text.secondary" noWrap>
              {user?.email || ''}
            </Typography>
          </Box>
          <Divider />
          <MenuItem
            onClick={() => {
              setAnchorEl(null);
              navigate('/settings');
            }}
          >
            <ListItemIcon>
              <PersonOutlineOutlinedIcon fontSize="small" />
            </ListItemIcon>
            Profile
          </MenuItem>
          <MenuItem
            onClick={() => {
              setAnchorEl(null);
              navigate('/settings');
            }}
          >
            <ListItemIcon>
              <SettingsOutlinedIcon fontSize="small" />
            </ListItemIcon>
            Settings
          </MenuItem>
          <Divider />
          <MenuItem onClick={handleLogout} sx={{ color: 'error.main' }}>
            <ListItemIcon>
              <LogoutOutlinedIcon fontSize="small" color="error" />
            </ListItemIcon>
            Logout
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
