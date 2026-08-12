import React, { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  MenuItem,
  CircularProgress
} from '@mui/material';

const buildSchema = (isEdit) =>
  yup.object({
    firstName: yup.string().required('First name is required'),
    lastName: yup.string().required('Last name is required'),
    email: yup.string().email('Enter a valid email').required('Email is required'),
    role: yup.string().required('Role is required'),
    password: isEdit
      ? yup.string().notRequired()
      : yup
          .string()
          .min(6, 'Password must be at least 6 characters')
          .required('Password is required')
  });

const defaultValues = {
  firstName: '',
  lastName: '',
  email: '',
  role: 'VIEWER',
  password: ''
};

const UserDialog = ({ open, onClose, onSubmit, initialData, submitting }) => {
  const isEdit = Boolean(initialData);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(buildSchema(isEdit)),
    defaultValues
  });

  useEffect(() => {
  if (open) {
    reset(initialData ? { ...initialData, password: '' } : defaultValues);
  }
}, [open, initialData, reset]);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ fontWeight: 700 }}>{isEdit ? 'Edit User' : 'Add New User'}</DialogTitle>
      <DialogContent dividers>
        <Grid container spacing={2} sx={{ mt: 0.2 }}>
          <Grid item xs={12} sm={6}>
  <Controller
    name="firstName"
    control={control}
    render={({ field }) => (
      <TextField
        {...field}
        fullWidth
        label="First Name"
        error={!!errors.firstName}
        helperText={errors.firstName?.message}
      />
    )}
  />
</Grid>

<Grid item xs={12} sm={6}>
  <Controller
    name="lastName"
    control={control}
    render={({ field }) => (
      <TextField
        {...field}
        fullWidth
        label="Last Name"
        error={!!errors.lastName}
        helperText={errors.lastName?.message}
      />
    )}
  />
</Grid>
          <Grid item xs={12} sm={6}>
            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="Email"
                  disabled={isEdit}
                  error={!!errors.email}
                  helperText={errors.email?.message}
                />
              )}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Controller
              name="role"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  select
                  fullWidth
                  label="Role"
                  error={!!errors.role}
                  helperText={errors.role?.message}
                >
                  <MenuItem value="ADMIN">Admin</MenuItem>
                  <MenuItem value="VIEWER">Viewer</MenuItem>
                </TextField>
              )}
            />
          </Grid>
          {!isEdit && (
            <Grid item xs={12} sm={6}>
              <Controller
                name="password"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    type="password"
                    label="Password"
                    error={!!errors.password}
                    helperText={errors.password?.message}
                  />
                )}
              />
            </Grid>
          )}
        </Grid>
      </DialogContent>
      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={onClose} color="inherit" disabled={submitting}>
          Cancel
        </Button>
        <Button onClick={handleSubmit(onSubmit)} variant="contained" disabled={submitting}>
          {submitting ? <CircularProgress size={20} color="inherit" /> : isEdit ? 'Update' : 'Create'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UserDialog;
