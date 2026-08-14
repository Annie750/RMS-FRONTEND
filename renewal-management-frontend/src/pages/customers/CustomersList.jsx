import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { Box, Button, Chip, IconButton, Stack, Tooltip } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import { toast } from 'react-toastify';
import PageHeader from '../../components/common/PageHeader';
import SearchBar from '../../components/common/SearchBar';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import NoDataOverlay from '../../components/common/NoDataOverlay';
import CustomerDialog from './CustomerDialog';
import customerService from '../../services/customerService';
import { exportToCSV } from '../../utils/exportCSV';
import { isAdmin } from '../../utils/auth';
import userService from "../../services/userService";
const CustomersList = () => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 });
const [users, setUsers] = useState([]);
  const fetchCustomers = useCallback(async () => {
    setLoading(true);
    try {
      const data = await customerService.getAll();
      const list = Array.isArray(data) ? data : data?.content || [];
      setRows(list);
    } catch (err) {
      toast.error(err?.message || 'Failed to load customers');
    } finally {
      setLoading(false);
    }
  }, []);
useEffect(() => {
  const loadUsers = async () => {
    try {
      const data = await userService.getAccountOwners();

      setUsers(
        Array.isArray(data)
          ? data
          : data?.content || []
      );
    } catch (e) {
      console.error("Failed to load account owners:", e);
      toast.error(
        e?.response?.data?.message ||
        "Failed to load account owners"
      );
    }
  };

  loadUsers();
}, []);
  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  const filteredRows = useMemo(() => {
    if (!search.trim()) return rows;
    const q = search.toLowerCase();
    return rows.filter((r) =>
    r.companyName?.toLowerCase().includes(q) ||
    r.contactPerson?.toLowerCase().includes(q) ||
    r.designation?.toLowerCase().includes(q) ||
    r.city?.toLowerCase().includes(q) ||
    r.phone?.toLowerCase().includes(q) ||
    r.email?.toLowerCase().includes(q)
);
  }, [rows, search]);

  const handleAdd = () => {

  if (!isAdmin()) return;

  setEditingCustomer(null);
  setDialogOpen(true);
};

  const handleEdit = (row) => {

  if (!isAdmin()) return;

  setEditingCustomer(row);
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
      await customerService.remove(deleteTarget.id);
      toast.success('Customer deleted successfully');
      setConfirmOpen(false);
      setDeleteTarget(null);
      fetchCustomers();
    } catch (err) {
      toast.error(err?.message || 'Failed to delete customer');
    } finally {
      setDeleting(false);
    }
  };

  const handleFormSubmit = async (values) => {
  console.log("Editing:", editingCustomer);
  console.log("Payload:", values);

  setSubmitting(true);

  try {
    if (editingCustomer) {
      await customerService.update(editingCustomer.id, values);
      toast.success("Customer updated successfully");
    } else {
      await customerService.create(values);
      toast.success("Customer created successfully");
    }

    setDialogOpen(false);
    fetchCustomers();

  } catch (err) {
    console.error(err.response?.data);
    console.error(err);

    toast.error(err?.response?.data?.message || "Failed to save customer");
  } finally {
    setSubmitting(false);
  }
};

    const columns = [
  {
    field: "companyName",
    headerName: "Company",
    flex: 1.4,
    minWidth: 180,
  },

  {
    field: "contactPerson",
    headerName: "Contact Person",
    flex: 1.2,
    minWidth: 170,
  },

  {
    field: "designation",
    headerName: "Designation",
    flex: 1,
    minWidth: 140,
  },

  {
    field: "city",
    headerName: "City",
    flex: 0.9,
    minWidth: 120,
  },

  {
    field: "phone",
    headerName: "Phone",
    flex: 1,
    minWidth: 140,
  },

  {
    field: "accountOwnerName",
    headerName: "Account Owner",
    flex: 1.2,
    minWidth: 170,
  },

  {
    field: "active",
    headerName: "Status",
    flex: 0.8,
    minWidth: 110,
    renderCell: (params) => (
      <Chip
        label={params.value ? "ACTIVE" : "INACTIVE"}
        color={params.value ? "success" : "default"}
        size="small"
      />
    ),
  },
    {
  field: 'actions',
  headerName: 'Actions',
  sortable: false,
  filterable: false,
  width: 120,
  renderCell: (params) => (
    isAdmin() ? (
      <Stack direction="row" spacing={0.5}>
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
  )
}
  ];

  return (
    <Box>
      <PageHeader
        title="Customers"
        subtitle="Manage all your customer accounts"
        breadcrumbs={[{ label: 'Dashboard', href: '/dashboard' }, { label: 'Customers' }]}
        action={
  isAdmin() && (
    <Button
      variant="contained"
      startIcon={<AddOutlinedIcon />}
      onClick={handleAdd}
    >
      Add Customer
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
          <SearchBar value={search} onChange={setSearch} placeholder="Search customers..." />
          <Button
            variant="outlined"
            startIcon={<FileDownloadOutlinedIcon />}
            onClick={() => exportToCSV(filteredRows, columns.slice(0, -1), 'customers.csv')}
          >
            Export CSV
          </Button>
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

      <CustomerDialog
    open={dialogOpen}
    onClose={() => setDialogOpen(false)}
    onSubmit={handleFormSubmit}
    initialData={editingCustomer}
    submitting={submitting}
    users={users}
/>

      <ConfirmDialog
        open={confirmOpen}
        title="Delete Customer"
        message={`Are you sure you want to delete "${deleteTarget?.companyName}"? This action cannot be undone.`}
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleDeleteConfirm}
        loading={deleting}
      />
    </Box>
  );
};

export default CustomersList;
