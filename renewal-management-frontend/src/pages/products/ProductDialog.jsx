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
  FormControlLabel,
  Switch,
  CircularProgress
} from '@mui/material';

const schema = yup.object({
  productName: yup.string().required('Product name is required'),
  vendor: yup.string().required('Vendor is required'),
  validityMonths: yup
    .number()
    .typeError('Validity must be a number')
    .positive('Validity must be positive')
    .required('Validity (in months) is required'),
  price: yup
    .number()
    .typeError('Price must be a number')
    .min(0, 'Price cannot be negative')
    .required('Price is required'),
  active: yup.boolean()
});

const defaultValues = {
  productName: '',
  vendor: '',
  validityMonths: '',
  price: '',
  active: true
};
const ProductDialog = ({ open, onClose, onSubmit, initialData, submitting }) => {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues
  });

  useEffect(() => {
    if (open) {
      reset(initialData || defaultValues);
    }
  }, [open, initialData, reset]);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ fontWeight: 700 }}>
        {initialData ? 'Edit Product' : 'Add New Product'}
      </DialogTitle>
      <DialogContent dividers>
        <Grid container spacing={2} sx={{ mt: 0.2 }}>
          <Grid item xs={12} sm={6}>
            <Controller
              name="productName"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="Product Name"
                  error={!!errors.productName}
                  helperText={errors.productName?.message}
                />
              )}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Controller
              name="vendor"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="Vendor"
                  error={!!errors.vendor}
                  helperText={errors.vendor?.message}
                />
              )}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Controller
              name="validityMonths"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  type="number"
                  label="Validity (months)"
error={!!errors.validityMonths}
helperText={errors.validityMonths?.message}                />
              )}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Controller
              name="price"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  type="number"
                  label="Price"
                  error={!!errors.price}
                  helperText={errors.price?.message}
                />
              )}
            />
          </Grid>
          <Grid item xs={12}>
            <Controller
              name="active"
              control={control}
              render={({ field }) => (
                <FormControlLabel
                  control={<Switch checked={field.value} onChange={(e) => field.onChange(e.target.checked)} />}
                  label="Active"
                />
              )}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions sx={{ px: 3, py: 2 }}>
  <Button
    onClick={onClose}
    color="inherit"
    disabled={submitting}
  >
    Cancel
  </Button>

  <Button
    variant="contained"
    disabled={submitting}
    onClick={handleSubmit((values) => {
      onSubmit({
        ...values,
        validityMonths: Number(values.validityMonths),
        price: Number(values.price),
      });
    })}
  >
    {submitting ? (
      <CircularProgress size={20} color="inherit" />
    ) : initialData ? (
      "Update"
    ) : (
      "Create"
    )}
  </Button>
</DialogActions>
    </Dialog>
  );
};

export default ProductDialog;
