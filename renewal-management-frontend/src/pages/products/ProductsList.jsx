import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { Box, Button, Chip, IconButton, Stack, Tooltip } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import { toast } from 'react-toastify';
import PageHeader from '../../components/common/PageHeader';
import SearchBar from '../../components/common/SearchBar';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import NoDataOverlay from '../../components/common/NoDataOverlay';
import ProductDialog from './ProductDialog';
import productService from '../../services/productService';
import { isAdmin } from '../../utils/auth';
const ProductsList = () => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 });

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const data = await productService.getAll();
      const list = Array.isArray(data) ? data : data?.content || [];
      setRows(list);
    } catch (err) {
      toast.error(err?.message || 'Failed to load products');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const filteredRows = useMemo(() => {
    if (!search.trim()) return rows;
    const q = search.toLowerCase();
    return rows.filter(
      (r) => r.productName?.toLowerCase().includes(q) || r.vendor?.toLowerCase().includes(q)
    );
  }, [rows, search]);

  const handleAdd = () => {
  if (!isAdmin()) return;

  setEditingProduct(null);
  setDialogOpen(true);
};

  const handleEdit = (row) => {
  if (!isAdmin()) return;

  setEditingProduct(row);
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
      await productService.remove(deleteTarget.id);
      toast.success('Product deleted successfully');
      setConfirmOpen(false);
      setDeleteTarget(null);
      fetchProducts();
    } catch (err) {
      toast.error(err?.message || 'Failed to delete product');
    } finally {
      setDeleting(false);
    }
  };

  const handleFormSubmit = async (values) => {
    setSubmitting(true);
    try {
      if (editingProduct) {
        await productService.update(editingProduct.id, values);
        toast.success('Product updated successfully');
      } else {
        await productService.create(values);
        toast.success('Product created successfully');
      }
      setDialogOpen(false);
      fetchProducts();
    } catch (err) {
      toast.error(err?.message || 'Failed to save product');
    } finally {
      setSubmitting(false);
    }
  };

  const columns = [
    { field: 'productName', headerName: 'Product Name', flex: 1.2, minWidth: 180 },
    { field: 'vendor', headerName: 'Vendor', flex: 1, minWidth: 150 },
    { field: 'validityMonths', headerName: 'Validity (months)', flex: 0.9, minWidth: 140 },
    {
      field: 'price',
      headerName: 'Price',
      flex: 0.8,
      minWidth: 120,
valueFormatter: (_, row) =>
  `₹${Number(row.price ?? 0).toLocaleString()}`    },
    {
      field: 'active',
      headerName: 'Status',
      flex: 0.7,
      minWidth: 110,
      renderCell: (params) => (
        <Chip
          label={params.value ? 'Active' : 'Inactive'}
          size="small"
          color={params.value ? 'success' : 'default'}
        />
      )
    },
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
        title="Products"
        subtitle="Manage your product catalog"
        breadcrumbs={[{ label: 'Dashboard', href: '/dashboard' }, { label: 'Products' }]}
                  action={
  isAdmin() && (
    <Button
      variant="contained"
      startIcon={<AddOutlinedIcon />}
      onClick={handleAdd}
    >
      Add Product
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
          <SearchBar value={search} onChange={setSearch} placeholder="Search products..." />
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

      <ProductDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onSubmit={handleFormSubmit}
        initialData={editingProduct}
        submitting={submitting}
      />

      <ConfirmDialog
        open={confirmOpen}
        title="Delete Product"
        message={`Are you sure you want to delete "${deleteTarget?.productName}"? This action cannot be undone.`}
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleDeleteConfirm}
        loading={deleting}
      />
    </Box>
  );
};

export default ProductsList;
