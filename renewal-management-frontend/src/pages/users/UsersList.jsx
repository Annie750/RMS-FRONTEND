import React, {
  useEffect,
  useState,
  useCallback,
  useMemo
} from 'react';

import {
  Box,
  Button,
  Chip,
  IconButton,
  Stack,
  Tooltip,
  Switch,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  CircularProgress,
  InputAdornment
} from '@mui/material';
import {
  Visibility,
  VisibilityOff
} from '@mui/icons-material';
import { DataGrid } from '@mui/x-data-grid';

import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import LockResetOutlinedIcon from '@mui/icons-material/LockResetOutlined';

import { toast } from 'react-toastify';

import PageHeader from '../../components/common/PageHeader';
import SearchBar from '../../components/common/SearchBar';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import NoDataOverlay from '../../components/common/NoDataOverlay';
import UserDialog from './UserDialog';

import userService from '../../services/userService';
import { isAdmin } from '../../utils/auth';
import { Navigate } from 'react-router-dom';


const UsersList = () => {

  /*
   * ---------------------------------------------------------
   * State
   * ---------------------------------------------------------
   */

  const [rows, setRows] = useState([]);

  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState('');

  const [dialogOpen, setDialogOpen] = useState(false);

  const [editingUser, setEditingUser] = useState(null);

  const [submitting, setSubmitting] = useState(false);

  /*
   * Delete dialog
   */
  const [confirmOpen, setConfirmOpen] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState(null);

  const [deleting, setDeleting] = useState(false);

  /*
   * Reset password dialog
   */
  const [resetOpen, setResetOpen] = useState(false);

  const [resetTarget, setResetTarget] = useState(null);

  const [resetting, setResetting] = useState(false);

  const [newPassword, setNewPassword] = useState('');

  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  /*
   * Pagination
   */
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10
  });


  /*
   * ---------------------------------------------------------
   * Fetch users
   * ---------------------------------------------------------
   */

  const fetchUsers = useCallback(async () => {

    setLoading(true);

    try {

      const data = await userService.getAll();

      const list =
        Array.isArray(data)
          ? data
          : data?.content || [];

      setRows(list);

    } catch (err) {

      toast.error(
        err?.response?.data?.message ||
        err?.message ||
        'Failed to load users'
      );

    } finally {

      setLoading(false);

    }

  }, []);


  useEffect(() => {

    fetchUsers();

  }, [fetchUsers]);


  /*
   * ---------------------------------------------------------
   * Search
   * ---------------------------------------------------------
   */

  const filteredRows = useMemo(() => {

    if (!search.trim()) {
      return rows;
    }

    const q = search.toLowerCase();

    return rows.filter((r) =>
      `${r.firstName ?? ''} ${r.lastName ?? ''}`
        .toLowerCase()
        .includes(q) ||

      r.email?.toLowerCase().includes(q)
    );

  }, [rows, search]);


  /*
   * ---------------------------------------------------------
   * Add user
   * ---------------------------------------------------------
   */

  const handleAdd = () => {

    if (!isAdmin()) {
      return;
    }

    setEditingUser(null);

    setDialogOpen(true);
  };


  /*
   * ---------------------------------------------------------
   * Edit user
   * ---------------------------------------------------------
   */

  const handleEdit = (row) => {

    if (!isAdmin()) {
      return;
    }

    setEditingUser(row);

    setDialogOpen(true);
  };


  /*
   * ---------------------------------------------------------
   * Delete user
   * ---------------------------------------------------------
   */

  const handleDeleteClick = (row) => {

    if (!isAdmin()) {
      return;
    }

    setDeleteTarget(row);

    setConfirmOpen(true);
  };


  const handleDeleteConfirm = async () => {

    if (!deleteTarget) {
      return;
    }

    setDeleting(true);

    try {

      await userService.remove(deleteTarget.id);

      toast.success('User deleted successfully');

      setConfirmOpen(false);

      setDeleteTarget(null);

      await fetchUsers();

    } catch (err) {

      toast.error(
        err?.response?.data?.message ||
        err?.message ||
        'Failed to delete user'
      );

    } finally {

      setDeleting(false);

    }

  };


  /*
   * ---------------------------------------------------------
   * Create / Update user
   * ---------------------------------------------------------
   */

  const handleFormSubmit = async (values) => {

    setSubmitting(true);

    try {

      if (editingUser) {

        await userService.update(
          editingUser.id,
          values
        );

        toast.success(
          'User updated successfully'
        );

      } else {

        await userService.create(values);

        toast.success(
          'User created successfully'
        );

      }

      setDialogOpen(false);

      setEditingUser(null);

      await fetchUsers();

    } catch (err) {

      toast.error(
        err?.response?.data?.message ||
        err?.message ||
        'Failed to save user'
      );

    } finally {

      setSubmitting(false);

    }

  };


  /*
   * ---------------------------------------------------------
   * Toggle active
   * ---------------------------------------------------------
   */

  const handleToggleActive = async (row) => {

    if (!isAdmin()) {
      return;
    }

    try {

      await userService.toggleActive(row.id);

      toast.success(
        `User ${
          row.active
            ? 'deactivated'
            : 'activated'
        } successfully`
      );

      await fetchUsers();

    } catch (err) {

      toast.error(
        err?.response?.data?.message ||
        err?.message ||
        'Failed to update user status'
      );

    }

  };


  /*
   * ---------------------------------------------------------
   * Reset password
   * ---------------------------------------------------------
   */

  const handleResetClick = (row) => {

    if (!isAdmin()) {
      return;
    }

    setResetTarget(row);

    setNewPassword('');

    setConfirmPassword('');

    setResetOpen(true);
  };


  /*
   * Close reset dialog
   */

  const handleResetClose = () => {

    if (resetting) {
      return;
    }

    setResetOpen(false);

    setResetTarget(null);

    setNewPassword('');

    setConfirmPassword('');
  };


  /*
   * Submit new password
   */
const handleResetConfirm = async () => {
  if (!resetTarget) return;

  if (newPassword.length < 6) {
    toast.error('Password must be at least 6 characters.');
    return;
  }

  if (newPassword !== confirmPassword) {
    toast.error('Passwords do not match.');
    return;
  }

  setResetting(true);

  try {
    await userService.resetPassword(
      resetTarget.id,
      {
        newPassword: newPassword
      }
    );

    toast.success('Password updated successfully.');

    setResetOpen(false);
    setResetTarget(null);
    setNewPassword('');
    setConfirmPassword('');
  } catch (err) {

    const message =
      err?.response?.data?.message ||
      err?.response?.data ||
      err?.message ||
      'Failed to update password';

    toast.error(message);

  } finally {
    setResetting(false);
  }
};


  /*
   * ---------------------------------------------------------
   * DataGrid columns
   * ---------------------------------------------------------
   */

  const columns = [

    {
      field: 'fullName',
      headerName: 'Name',
      flex: 1,
      minWidth: 180,

      valueGetter: (_, row) =>
        `${row.firstName ?? ''} ${row.lastName ?? ''}`.trim()
    },

    {
      field: 'email',
      headerName: 'Email',
      flex: 1.2,
      minWidth: 200
    },

    {
      field: 'role',
      headerName: 'Role',
      flex: 0.7,
      minWidth: 110,

      renderCell: (params) => (

        <Chip
          label={params.value}
          size="small"

          color={
            params.value === 'ADMIN'
              ? 'primary'
              : 'default'
          }

          variant={
            params.value === 'ADMIN'
              ? 'filled'
              : 'outlined'
          }
        />

      )
    },

    {
      field: 'active',
      headerName: 'Active',
      flex: 0.6,
      minWidth: 100,

      renderCell: (params) => (

        <Switch
          checked={!!params.value}

          onChange={() =>
            handleToggleActive(params.row)
          }

          size="small"
        />

      )
    },

    {
      field: 'actions',
      headerName: 'Actions',
      sortable: false,
      filterable: false,
      width: 170,

      renderCell: (params) =>

        isAdmin() ? (

          <Stack
            direction="row"
            spacing={0.5}
          >

            {/* Reset Password */}

            <Tooltip title="Reset Password">

              <IconButton
                size="small"
                onClick={() =>
                  handleResetClick(params.row)
                }
              >

                <LockResetOutlinedIcon
                  fontSize="small"
                />

              </IconButton>

            </Tooltip>


            {/* Edit */}

            <Tooltip title="Edit">

              <IconButton
                size="small"
                onClick={() =>
                  handleEdit(params.row)
                }
              >

                <EditOutlinedIcon
                  fontSize="small"
                />

              </IconButton>

            </Tooltip>


            {/* Delete */}

            <Tooltip title="Delete">

              <IconButton
                size="small"
                onClick={() =>
                  handleDeleteClick(params.row)
                }
              >

                <DeleteOutlineOutlinedIcon
                  fontSize="small"
                  color="error"
                />

              </IconButton>

            </Tooltip>

          </Stack>

        ) : null
    }

  ];


  /*
   * ---------------------------------------------------------
   * Non-admin protection
   * ---------------------------------------------------------
   */

  if (!isAdmin()) {

    return (
      <Navigate
        to="/dashboard"
        replace
      />
    );

  }


  /*
   * ---------------------------------------------------------
   * UI
   * ---------------------------------------------------------
   */

  return (

    <Box>

      <PageHeader

        title="Users"

        subtitle="Manage system users and permissions (Admin only)"

        breadcrumbs={[
          {
            label: 'Dashboard',
            href: '/dashboard'
          },
          {
            label: 'Users'
          }
        ]}

        action={

          <Button
            variant="contained"
            startIcon={
              <AddOutlinedIcon />
            }
            onClick={handleAdd}
          >

            Add User

          </Button>

        }

      />


      <Box
        sx={{
          bgcolor: 'background.paper',
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 4,
          p: 2
        }}
      >

        <Stack
          direction={{
            xs: 'column',
            sm: 'row'
          }}

          justifyContent="space-between"

          spacing={2}

          sx={{
            mb: 2
          }}
        >

          <SearchBar
            value={search}
            onChange={setSearch}
            placeholder="Search users..."
          />

        </Stack>


        <Box
          sx={{
            height: 520,
            width: '100%'
          }}
        >

          <DataGrid

            rows={filteredRows}

            columns={columns}

            loading={loading}

            paginationModel={paginationModel}

            onPaginationModelChange={
              setPaginationModel
            }

            pageSizeOptions={[
              10,
              25,
              50
            ]}

            disableRowSelectionOnClick

            slots={{
              noRowsOverlay: NoDataOverlay
            }}

            sx={{
              border: 'none'
            }}

          />

        </Box>

      </Box>


      {/* -------------------------------------------------- */}
      {/* Add / Edit User Dialog */}
      {/* -------------------------------------------------- */}

      <UserDialog

        open={dialogOpen}

        onClose={() => {
          if (!submitting) {
            setDialogOpen(false);
          }
        }}

        onSubmit={handleFormSubmit}

        initialData={editingUser}

        submitting={submitting}

      />


      {/* -------------------------------------------------- */}
      {/* Delete Dialog */}
      {/* -------------------------------------------------- */}

      <ConfirmDialog

        open={confirmOpen}

        title="Delete User"

        message={
          `Are you sure you want to delete ` +
          `"${deleteTarget?.firstName} ${deleteTarget?.lastName}"? ` +
          `This action cannot be undone.`
        }

        onClose={() => {

          if (!deleting) {
            setConfirmOpen(false);
          }

        }}

        onConfirm={handleDeleteConfirm}

        loading={deleting}

      />


      {/* -------------------------------------------------- */}
      {/* Reset Password Dialog */}
      {/* -------------------------------------------------- */}

      <Dialog

        open={resetOpen}

        onClose={handleResetClose}

        maxWidth="sm"

        fullWidth
      >

        <DialogTitle
          sx={{
            fontWeight: 700
          }}
        >

          Reset Password

        </DialogTitle>


        <DialogContent dividers>

          <Box
            sx={{
              pt: 1
            }}
          >

            <TextField
  fullWidth
  label="New Password"
  type={showNewPassword ? 'text' : 'password'}
  value={newPassword}
  onChange={(e) => setNewPassword(e.target.value)}
  disabled={resetting}
  autoFocus
  margin="normal"
  helperText="Password must be at least 6 characters"
  InputProps={{
    endAdornment: (
      <InputAdornment position="end">
        <IconButton
          onClick={() =>
            setShowNewPassword(!showNewPassword)
          }
          edge="end"
          disabled={resetting}
        >
          {showNewPassword ? (
            <VisibilityOff />
          ) : (
            <Visibility />
          )}
        </IconButton>
      </InputAdornment>
    )
  }}
/>

            <TextField
  fullWidth
  label="Confirm Password"
  type={
    showConfirmPassword
      ? 'text'
      : 'password'
  }
  value={confirmPassword}
  onChange={(e) =>
    setConfirmPassword(e.target.value)
  }
  disabled={resetting}
  margin="normal"
  error={
    confirmPassword.length > 0 &&
    newPassword !== confirmPassword
  }
  helperText={
    confirmPassword.length > 0 &&
    newPassword !== confirmPassword
      ? 'Passwords do not match'
      : ''
  }
  InputProps={{
    endAdornment: (
      <InputAdornment position="end">
        <IconButton
          onClick={() =>
            setShowConfirmPassword(
              !showConfirmPassword
            )
          }
          edge="end"
          disabled={resetting}
        >
          {showConfirmPassword ? (
            <VisibilityOff />
          ) : (
            <Visibility />
          )}
        </IconButton>
      </InputAdornment>
    )
  }}
/>

          </Box>

        </DialogContent>


        <DialogActions
          sx={{
            px: 3,
            py: 2
          }}
        >

          <Button

            onClick={handleResetClose}

            color="inherit"

            disabled={resetting}
          >

            Cancel

          </Button>


          <Button

            variant="contained"

            onClick={handleResetConfirm}

            disabled={
              resetting ||
              !newPassword ||
              !confirmPassword
            }
          >

            {resetting ? (

              <CircularProgress
                size={20}
                color="inherit"
              />

            ) : (

              'Update Password'

            )}

          </Button>

        </DialogActions>

      </Dialog>

    </Box>

  );

};


export default UsersList;
