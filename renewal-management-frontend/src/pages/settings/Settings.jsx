import React, { useState } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Switch,
  FormControlLabel,
  Avatar,
  Stack,
  CircularProgress
} from '@mui/material';
import { toast } from 'react-toastify';

import PageHeader from '../../components/common/PageHeader';
import { useAuth } from '../../context/AuthContext';
import { useThemeMode } from '../../theme/ThemeModeContext';
import authService from '../../services/authService';

const Settings = () => {
  const { user } = useAuth();
  const { mode, toggleMode } = useThemeMode();

  const [name, setName] = useState(user?.name || '');
  const [email] = useState(user?.email || '');
  const [savingProfile, setSavingProfile] = useState(false);

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [savingPassword, setSavingPassword] = useState(false);

  const initials = user?.name
    ? user.name
        .split(' ')
        .map((n) => n[0])
        .slice(0, 2)
        .join('')
        .toUpperCase()
    : 'U';

  const handleProfileSave = async () => {
    setSavingProfile(true);

    try {
      // Profile update is not connected to backend yet.
      await new Promise((res) => setTimeout(res, 600));

      toast.success('Profile updated successfully');
    } catch (err) {
      toast.error('Failed to update profile');
    } finally {
      setSavingProfile(false);
    }
  };

  const handlePasswordChange = async () => {
    /*
     * Frontend validation
     */
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error('Please fill in all password fields');
      return;
    }

    if (newPassword.length < 6) {
      toast.error('New password must be at least 6 characters');
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error('New password and confirm password do not match');
      return;
    }

    if (currentPassword === newPassword) {
      toast.error(
        'New password must be different from the current password'
      );
      return;
    }

    setSavingPassword(true);

    try {
      /*
       * Call the real backend API.
       *
       * Endpoint:
       * POST /api/auth/change-password
       */
      await authService.changePassword(
        currentPassword,
        newPassword
      );

      toast.success('Password changed successfully');

      /*
       * Clear password fields after successful update.
       */
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');

    } catch (err) {

      /*
       * Try to get the backend's actual error message.
       */
      const message =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        'Failed to change password';

      toast.error(message);

    } finally {
      setSavingPassword(false);
    }
  };

  return (
    <Box>
      <PageHeader
        title="Settings"
        subtitle="Manage your account and application preferences"
        breadcrumbs={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Settings' }
        ]}
      />

      <Grid container spacing={2.5}>

        {/* PROFILE */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>

              <Typography variant="h6" sx={{ mb: 2 }}>
                Profile
              </Typography>

              <Stack
                direction="row"
                alignItems="center"
                spacing={2}
                sx={{ mb: 3 }}
              >
                <Avatar
                  sx={{
                    width: 56,
                    height: 56,
                    bgcolor: 'primary.main'
                  }}
                >
                  {initials}
                </Avatar>

                <Box>
                  <Typography
                    variant="subtitle1"
                    sx={{ fontWeight: 600 }}
                  >
                    {user?.name || 'User'}
                  </Typography>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                  >
                    {user?.role || 'VIEWER'}
                  </Typography>
                </Box>
              </Stack>

              <TextField
                fullWidth
                label="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                margin="normal"
              />

              <TextField
                fullWidth
                label="Email Address"
                value={email}
                margin="normal"
                disabled
              />

              <Button
                variant="contained"
                sx={{ mt: 2 }}
                onClick={handleProfileSave}
                disabled={savingProfile}
              >
                {savingProfile ? (
                  <CircularProgress
                    size={20}
                    color="inherit"
                  />
                ) : (
                  'Save Changes'
                )}
              </Button>

            </CardContent>
          </Card>
        </Grid>

        {/* CHANGE PASSWORD */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>

              <Typography variant="h6" sx={{ mb: 2 }}>
                Change Password
              </Typography>

              <TextField
                fullWidth
                type="password"
                label="Current Password"
                value={currentPassword}
                onChange={(e) =>
                  setCurrentPassword(e.target.value)
                }
                margin="normal"
                autoComplete="current-password"
              />

              <TextField
                fullWidth
                type="password"
                label="New Password"
                value={newPassword}
                onChange={(e) =>
                  setNewPassword(e.target.value)
                }
                margin="normal"
                autoComplete="new-password"
              />

              <TextField
                fullWidth
                type="password"
                label="Confirm New Password"
                value={confirmPassword}
                onChange={(e) =>
                  setConfirmPassword(e.target.value)
                }
                margin="normal"
                autoComplete="new-password"
              />

              <Button
                variant="contained"
                sx={{ mt: 2 }}
                onClick={handlePasswordChange}
                disabled={savingPassword}
              >
                {savingPassword ? (
                  <CircularProgress
                    size={20}
                    color="inherit"
                  />
                ) : (
                  'Update Password'
                )}
              </Button>

            </CardContent>
          </Card>
        </Grid>

        {/* APPEARANCE */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>

              <Typography variant="h6" sx={{ mb: 2 }}>
                Appearance
              </Typography>

              <FormControlLabel
                control={
                  <Switch
                    checked={mode === 'dark'}
                    onChange={toggleMode}
                  />
                }
                label={
                  mode === 'dark'
                    ? 'Dark Mode'
                    : 'Light Mode'
                }
              />

            </CardContent>
          </Card>
        </Grid>

        {/* SYSTEM INFORMATION */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>

              <Typography variant="h6" sx={{ mb: 2 }}>
                System Information
              </Typography>

              <Stack spacing={1.2}>

                <InfoRow
                  label="Application"
                  value="Renewal Management System"
                />

                <InfoRow
                  label="Version"
                  value="1.0.0"
                />

                <InfoRow
                  label="Environment"
                  value={import.meta.env.MODE}
                />

                <InfoRow
                  label="API Base URL"
                  value={import.meta.env.VITE_API_BASE_URL}
                />

              </Stack>

            </CardContent>
          </Card>
        </Grid>

      </Grid>
    </Box>
  );
};

const InfoRow = ({ label, value }) => (
  <Box
    sx={{
      display: 'flex',
      justifyContent: 'space-between'
    }}
  >
    <Typography
      variant="body2"
      color="text.secondary"
    >
      {label}
    </Typography>

    <Typography
      variant="body2"
      sx={{ fontWeight: 600 }}
    >
      {value}
    </Typography>
  </Box>
);

export default Settings;
