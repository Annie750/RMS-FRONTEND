import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { Box, Button, IconButton, Stack, Tooltip } from '@mui/material';
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
import StatusChip from '../../components/common/StatusChip';
import RenewalDialog from './RenewalDialog';
import renewalService from '../../services/renewalService';
import { exportToCSV } from '../../utils/exportCSV';
import { isAdmin } from '../../utils/auth';
const RenewalsList = () => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingRenewal, setEditingRenewal] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 });

  const fetchRenewals = useCallback(async () => {
    setLoading(true);
    try {
      const data = await renewalService.getAll();
      const list = Array.isArray(data) ? data : data?.content || [];
      setRows(list);
    } catch (err) {
      toast.error(err?.message || 'Failed to load renewals');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRenewals();
  }, [fetchRenewals]);

  const filteredRows = useMemo(() => {
    if (!search.trim()) return rows;
    const q = search.toLowerCase();
    return rows.filter(
      (r) =>
        r.customerName?.toLowerCase().includes(q) ||
        r.productName?.toLowerCase().includes(q) ||
        r.assignedUserName?.toLowerCase().includes(q)
    );
  }, [rows, search]);

  const handleAdd = () => {
  if (!isAdmin()) return;

  setEditingRenewal(null);
  setDialogOpen(true);
};

  const handleEdit = (row) => {
  if (!isAdmin()) return;

  setEditingRenewal(row);
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
      await renewalService.remove(deleteTarget.id);
      toast.success('Renewal deleted successfully');
      setConfirmOpen(false);
      setDeleteTarget(null);
      fetchRenewals();
    } catch (err) {
      toast.error(err?.message || 'Failed to delete renewal');
    } finally {
      setDeleting(false);
    }
  };

  const handleFormSubmit = async (values) => {
    setSubmitting(true);
    try {
      if (editingRenewal) {
        await renewalService.update(editingRenewal.id, values);
        toast.success('Renewal updated successfully');
      } else {
        await renewalService.create(values);
        toast.success('Renewal created successfully');
      }
      setDialogOpen(false);
      fetchRenewals();
    } catch (err) {
      toast.error(err?.message || 'Failed to save renewal');
    } finally {
      setSubmitting(false);
    }
  };

  const columns = [
    { field: 'customerName', headerName: 'Customer', flex: 1.1, minWidth: 160 },
    { field: 'productName', headerName: 'Product', flex: 1, minWidth: 140 },
    { field: 'purchaseDate', headerName: 'Purchase Date', flex: 0.9, minWidth: 130 },
    { field: 'expiryDate', headerName: 'Expiry Date', flex: 0.9, minWidth: 130 },
    {
  field: "renewalAmount",
  headerName: "Amount",
  flex: 0.8,
  minWidth: 110,
  renderCell: (params) => (
    <>₹{Number(params.row.renewalAmount ?? 0).toLocaleString()}</>
  )
},
    {
  field: 'status',
  headerName: 'Status',
  flex: 0.9,
  minWidth: 140,
  renderCell: (params) => (
    <StatusChip
      status={
        params.row.active
          ? params.row.status
          : 'INACTIVE'
      }
    />
  )
},
    { field: 'assignedUserName', headerName: 'Assigned User', flex: 0.9, minWidth: 140 },
    {
  field: 'actions',
  headerName: 'Actions',
  sortable: false,
  filterable: false,
  width: 120,
  renderCell: (params) =>
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
}
  ];

  return (
    <Box>
      <PageHeader
        title="Renewals"
        subtitle="Track and manage all customer renewals"
        breadcrumbs={[{ label: 'Dashboard', href: '/dashboard' }, { label: 'Renewals' }]}
        action={
  isAdmin() && (
    <Button
      variant="contained"
      startIcon={<AddOutlinedIcon />}
      onClick={handleAdd}
    >
      Create Renewal
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
          <SearchBar value={search} onChange={setSearch} placeholder="Search renewals..." />
          <Button
            variant="outlined"
            startIcon={<FileDownloadOutlinedIcon />}
            onClick={() => exportToCSV(filteredRows, columns.slice(0, -1), 'renewals.csv')}
          >
            Export CSV
          </Button>
        </Stack>

        <Box sx={{ height: 560, width: '100%' }}>
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

      <RenewalDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onSubmit={handleFormSubmit}
        initialData={editingRenewal}
        submitting={submitting}
      />

      <ConfirmDialog
        open={confirmOpen}
        title="Delete Renewal"
        message="Are you sure you want to delete this renewal? This action cannot be undone."
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleDeleteConfirm}
        loading={deleting}
      />
    </Box>
  );
};

export default RenewalsList;
