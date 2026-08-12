import React from 'react';
import {
  Drawer,
  Box,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Divider
} from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined';
import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined';
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';
import AutorenewOutlinedIcon from '@mui/icons-material/AutorenewOutlined';
import ManageAccountsOutlinedIcon from '@mui/icons-material/ManageAccountsOutlined';
import AssessmentOutlinedIcon from '@mui/icons-material/AssessmentOutlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import { useAuth } from '../context/AuthContext';
import { ROLES } from '../utils/constants';
import { DRAWER_WIDTH } from '../utils/constants';

const navItems = [
  { label: 'Dashboard', icon: <DashboardOutlinedIcon />, path: '/dashboard' },
  { label: 'Customers', icon: <PeopleAltOutlinedIcon />, path: '/customers' },
  { label: 'Products', icon: <Inventory2OutlinedIcon />, path: '/products' },
  { label: 'Renewals', icon: <AutorenewOutlinedIcon />, path: '/renewals' },
  { label: 'Users', icon: <ManageAccountsOutlinedIcon />, path: '/users', adminOnly: true },
  { label: 'Reports', icon: <AssessmentOutlinedIcon />, path: '/reports' },
  { label: 'Settings', icon: <SettingsOutlinedIcon />, path: '/settings' }
];

const SidebarContent = ({ onNavigate }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

  const isAdmin = user?.role === ROLES.ADMIN;

  const handleClick = (path) => {
    navigate(path);
    if (onNavigate) onNavigate();
  };

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ px: 3, py: 2.5, display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <Box
          sx={{
            width: 36,
            height: 36,
            borderRadius: 2,
            bgcolor: 'primary.main',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <AutorenewOutlinedIcon sx={{ color: '#fff', fontSize: 20 }} />
        </Box>
        <Typography variant="h6" sx={{ fontWeight: 700 }}>
          RenewalHub
        </Typography>
      </Box>
      <Divider />
      <List sx={{ px: 1.5, py: 2, flex: 1 }}>
        {navItems
          .filter((item) => !item.adminOnly || isAdmin)
          .map((item) => {
            const selected = location.pathname.startsWith(item.path);
            return (
              <ListItemButton
                key={item.path}
                selected={selected}
                onClick={() => handleClick(item.path)}
                sx={{
                  borderRadius: 2,
                  mb: 0.5,
                  '&.Mui-selected': {
                    bgcolor: 'primary.main',
                    color: '#fff',
                    '& .MuiListItemIcon-root': { color: '#fff' },
                    '&:hover': { bgcolor: 'primary.dark' }
                  }
                }}
              >
                <ListItemIcon sx={{ minWidth: 38, color: 'text.secondary' }}>{item.icon}</ListItemIcon>
                <ListItemText
                  primary={item.label}
                  primaryTypographyProps={{ fontWeight: selected ? 600 : 500, fontSize: '0.9rem' }}
                />
              </ListItemButton>
            );
          })}
      </List>
      <Divider />
      <Box sx={{ p: 2 }}>
        <Typography variant="caption" color="text.secondary">
          © {new Date().getFullYear()} RenewalHub
        </Typography>
      </Box>
    </Box>
  );
};

const Sidebar = ({ mobileOpen, onMobileClose }) => {
  return (
    <Box component="nav" sx={{ width: { md: DRAWER_WIDTH }, flexShrink: { md: 0 } }}>
      {/* Mobile drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={onMobileClose}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: DRAWER_WIDTH }
        }}
      >
        <SidebarContent onNavigate={onMobileClose} />
      </Drawer>

      {/* Desktop drawer */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', md: 'block' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: DRAWER_WIDTH,
            borderRight: '1px solid',
            borderColor: 'divider'
          }
        }}
        open
      >
        <SidebarContent />
      </Drawer>
    </Box>
  );
};

export default Sidebar;
