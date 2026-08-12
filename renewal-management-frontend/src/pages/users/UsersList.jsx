import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { Box, Button, Chip, IconButton, Stack, Tooltip, Switch } from '@mui/material';
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
  if (!isAdmin()) {
  return <Navigate to="/dashboard" replace />;
}
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [resetOpen, setResetOpen] = useState(false);
  const [resetTarget, setResetTarget] = useState(null);
  const [resetting, setResetting] = useState(false);
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 });

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const data = await userService.getAll();
      const list = Array.isArray(data) ? data : data?.content || [];
      setRows(list);
    } catch (err) {
      toast.error(err?.message || 'Failed to load users');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const filteredRows = useMemo(() => {
    if (!search.trim()) return rows;
    const q = search.toLowerCase();
return rows.filter((r) =>
  `${r.firstName} ${r.lastName}`.toLowerCase().includes(q) ||
  r.email?.toLowerCase().includes(q)
);  }, [rows, search]);

  const handleAdd = () => {
  if (!isAdmin()) return;

  setEditingUser(null);
  setDialogOpen(true);
};

  const handleEdit = (row) => {
  if (!isAdmin()) return;

  setEditingUser(row);
  setDialogOpen(true);
};

  const handleDeleteClick = (row) => {
  if (!isAdmin()) return;

  setDeleteTarget(row);
  setConfirmOpen(true);
};

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await userService.remove(deleteTarget.id);
      toast.success('User deleted successfully');
      setConfirmOpen(false);
      setDeleteTarget(null);
      fetchUsers();
    } catch (err) {
      toast.error(err?.message || 'Failed to delete user');
    } finally {
      setDeleting(false);
    }
  };

  const handleFormSubmit = async (values) => {
    setSubmitting(true);
    try {
      if (editingUser) {
        await userService.update(editingUser.id, values);
        toast.success('User updated successfully');
      } else {
        await userService.create(values);
        toast.success('User created successfully');
      }
      setDialogOpen(false);
      fetchUsers();
    } catch (err) {
      toast.error(err?.message || 'Failed to save user');
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleActive = async (row) => {
  if (!isAdmin()) return;

  try {
    await userService.toggleActive(row.id);
    toast.success(`User ${row.active ? 'deactivated' : 'activated'} successfully`);
    fetchUsers();
  } catch (err) {
    toast.error(err?.message || 'Failed to update user status');
  }
};

 const handleResetClick = (row) => {
  if (!isAdmin()) return;

  setResetTarget(row);
  setResetOpen(true);
};

  const handleResetConfirm = async () => {
    if (!resetTarget) return;
    setResetting(true);
    try {
      await userService.resetPassword(resetTarget.id, {});
      toast.success('Password reset email sent successfully');
      setResetOpen(false);
      setResetTarget(null);
    } catch (err) {
      toast.error(err?.message || 'Failed to reset password');
    } finally {
      setResetting(false);
    }
  };

  const columns = [
    {
  field: 'fullName',
  headerName: 'Name',
  flex: 1,
  minWidth: 180,
  valueGetter: (_, row) =>
    `${row.firstName ?? ''} ${row.lastName ?? ''}`.trim()
},
    { field: 'email', headerName: 'Email', flex: 1.2, minWidth: 200 },
    {
      field: 'role',
      headerName: 'Role',
      flex: 0.7,
      minWidth: 110,
      renderCell: (params) => (
        <Chip
          label={params.value}
          size="small"
          color={params.value === 'ADMIN' ? 'primary' : 'default'}
          variant={params.value === 'ADMIN' ? 'filled' : 'outlined'}
        />
      )
    },
    {
      field: 'active',
      headerName: 'Active',
      flex: 0.6,
      minWidth: 100,
      renderCell: (params) => (
        <Switch checked={!!params.value} onChange={() => handleToggleActive(params.row)} size="small" />
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
      <Stack direction="row" spacing={0.5}>
        <Tooltip title="Reset Password">
          <IconButton
            size="small"
            onClick={() => handleResetClick(params.row)}
          >
            <LockResetOutlinedIcon fontSize="small" />
          </IconButton>
        </Tooltip>

        <Tooltip title="Edit">
          <IconButton
            size="small"
            onClick={() => handleEdit(params.row)}
          >
            <EditOutlinedIcon fontSize="small" />
          </IconButton>
        </Tooltip>

        <Tooltip title="Delete">
          <IconButton
            size="small"
            onClick={() => handleDeleteClick(params.row)}
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

  return (
    <Box>
      <PageHeader
        title="Users"
        subtitle="Manage system users and permissions (Admin only)"
        breadcrumbs={[{ label: 'Dashboard', href: '/dashboard' }, { label: 'Users' }]}
        action={
  isAdmin() && (
    <Button
      variant="contained"
      startIcon={<AddOutlinedIcon />}
      onClick={handleAdd}
    >
      Add User
    </Button>
  )
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
        <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" spacing={2} sx={{ mb: 2 }}>
          <SearchBar value={search} onChange={setSearch} placeholder="Search users..." />
        </Stack>

        <Box sx={{ height: 520, width: '100%' }}>
          <DataGrid
            rows={filteredRows}
            columns={columns}
            loading={loading}
            paginationModel={paginationModel}
            onPaginationModelChange={setPaginationModel}
            pageSizeOptions={[10, 25, 50]}
            disableRowSelectionOnClick
            slots={{ noRowsOverlay: NoDataOverlay }}
            sx={{ border: 'none' }}
          />
        </Box>
      </Box>

      <UserDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onSubmit={handleFormSubmit}
        initialData={editingUser}
        submitting={submitting}
      />

      <ConfirmDialog
        open={confirmOpen}
        title="Delete User"
message={`Are you sure you want to delete "${deleteTarget?.firstName} ${deleteTarget?.lastName}"? This action cannot be undone.`}        onClose={() => setConfirmOpen(false)}
        onConfirm={handleDeleteConfirm}
        loading={deleting}
      />

      <ConfirmDialog
        open={resetOpen}
        title="Reset Password"
        message={`Send a password reset link to "${resetTarget?.email}"?`}
        confirmText="Send"
        confirmColor="primary"
        onClose={() => setResetOpen(false)}
        onConfirm={handleResetConfirm}
        loading={resetting}
      />
    </Box>
  );
};

export default UsersList;
