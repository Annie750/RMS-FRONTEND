import React, { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  MenuItem,
  CircularProgress,
} from "@mui/material";

const schema = yup.object({
  companyName: yup
    .string()
    .trim()
    .required("Company Name is required"),

  contactPerson: yup
    .string()
    .trim()
    .required("Contact Person is required"),

  designation: yup
    .string()
    .trim()
    .required("Designation is required"),

  accountOwnerId: yup
    .string()
    .required("Account Owner is required"),

  email: yup
    .string()
    .email("Invalid email")
    .required("Email is required"),

  phone: yup
    .string()
    .trim()
    .required("Phone is required"),

  address: yup
    .string()
    .trim()
    .required("Address is required"),

  city: yup
    .string()
    .trim()
    .required("City is required"),

  state: yup
    .string()
    .trim()
    .required("State is required"),

  country: yup
    .string()
    .trim()
    .required("Country is required"),

  postalCode: yup
    .string()
    .trim()
    .required("Postal Code is required"),

  status: yup
    .string()
    .required("Status is required"),
});

const defaultValues = {
  companyName: "",
  contactPerson: "",
  designation: "",
  accountOwnerId: "",
  email: "",
  phone: "",
  address: "",
  city: "",
  state: "",
  country: "",
  postalCode: "",
  status: "ACTIVE",
};

const CustomerDialog = ({
  open,
  onClose,
  onSubmit,
  initialData,
  submitting,
  users = [],
}) => {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues,
  });

  useEffect(() => {
    if (!open) {
      return;
    }

    if (initialData) {
      /*
       * Account owner can come from:
       *
       * accountOwnerId
       * OR
       * accountOwner.id
       */
      const accountOwnerId =
        initialData.accountOwnerId ||
        initialData.accountOwner?.id ||
        "";

      reset({
        companyName: initialData.companyName || "",
        contactPerson: initialData.contactPerson || "",
        designation: initialData.designation || "",
        accountOwnerId: accountOwnerId,
        email: initialData.email || "",
        phone: initialData.phone || "",
        address: initialData.address || "",
        city: initialData.city || "",
        state: initialData.state || "",
        country: initialData.country || "",
        postalCode: initialData.postalCode || "",
        status: initialData.active ? "ACTIVE" : "INACTIVE",
      });
    } else {
      reset(defaultValues);
    }
  }, [open, initialData, reset]);

  const submitHandler = (values) => {
    onSubmit({
      companyName: values.companyName.trim(),
      contactPerson: values.contactPerson.trim(),
      designation: values.designation.trim(),

      /*
       * Send the selected user's UUID to backend.
       */
      accountOwnerId: values.accountOwnerId,

      email: values.email.trim(),
      phone: values.phone.trim(),
      address: values.address.trim(),
      city: values.city.trim(),
      state: values.state.trim(),
      country: values.country.trim(),
      postalCode: values.postalCode.trim(),

      active: values.status === "ACTIVE",
    });
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle sx={{ fontWeight: 700 }}>
        {initialData ? "Edit Customer" : "Add Customer"}
      </DialogTitle>

      <DialogContent dividers>
        <Grid
          container
          spacing={2}
          sx={{ mt: 0.2 }}
        >
          {/* Company Name */}
          <Grid item xs={12} md={6}>
            <Controller
              name="companyName"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="Company Name"
                  error={!!errors.companyName}
                  helperText={errors.companyName?.message}
                />
              )}
            />
          </Grid>

          {/* Contact Person */}
          <Grid item xs={12} md={6}>
            <Controller
              name="contactPerson"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="Contact Person"
                  error={!!errors.contactPerson}
                  helperText={errors.contactPerson?.message}
                />
              )}
            />
          </Grid>

          {/* Designation */}
          <Grid item xs={12} md={6}>
            <Controller
              name="designation"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="Designation"
                  error={!!errors.designation}
                  helperText={errors.designation?.message}
                />
              )}
            />
          </Grid>

          {/* Account Owner */}
          <Grid item xs={12} md={6}>
            <Controller
              name="accountOwnerId"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  select
                  fullWidth
                  label="Account Owner"
                  error={!!errors.accountOwnerId}
                  helperText={errors.accountOwnerId?.message}
                >
                  <MenuItem value="">
                    Select Account Owner
                  </MenuItem>

                  {users.map((user) => (
                    <MenuItem
                      key={user.id}
                      value={user.id}
                    >
                      {user.firstName} {user.lastName}
                    </MenuItem>
                  ))}
                </TextField>
              )}
            />
          </Grid>

          {/* Email */}
          <Grid item xs={12} md={6}>
            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="Email"
                  error={!!errors.email}
                  helperText={errors.email?.message}
                />
              )}
            />
          </Grid>

          {/* Phone */}
          <Grid item xs={12} md={6}>
            <Controller
              name="phone"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="Phone"
                  error={!!errors.phone}
                  helperText={errors.phone?.message}
                />
              )}
            />
          </Grid>

          {/* Address */}
          <Grid item xs={12}>
            <Controller
              name="address"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  multiline
                  rows={2}
                  label="Address"
                  error={!!errors.address}
                  helperText={errors.address?.message}
                />
              )}
            />
          </Grid>

          {/* City */}
          <Grid item xs={12} md={6}>
            <Controller
              name="city"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="City"
                  error={!!errors.city}
                  helperText={errors.city?.message}
                />
              )}
            />
          </Grid>

          {/* State */}
          <Grid item xs={12} md={6}>
            <Controller
              name="state"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="State"
                  error={!!errors.state}
                  helperText={errors.state?.message}
                />
              )}
            />
          </Grid>

          {/* Country */}
          <Grid item xs={12} md={6}>
            <Controller
              name="country"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="Country"
                  error={!!errors.country}
                  helperText={errors.country?.message}
                />
              )}
            />
          </Grid>

          {/* Postal Code */}
          <Grid item xs={12} md={6}>
            <Controller
              name="postalCode"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="Postal Code"
                  error={!!errors.postalCode}
                  helperText={errors.postalCode?.message}
                />
              )}
            />
          </Grid>

          {/* Status */}
          <Grid item xs={12} md={6}>
            <Controller
              name="status"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  select
                  fullWidth
                  label="Status"
                  error={!!errors.status}
                  helperText={errors.status?.message}
                >
                  <MenuItem value="ACTIVE">
                    Active
                  </MenuItem>

                  <MenuItem value="INACTIVE">
                    Inactive
                  </MenuItem>
                </TextField>
              )}
            />
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button
          onClick={onClose}
          disabled={submitting}
        >
          Cancel
        </Button>

        <Button
          variant="contained"
          onClick={handleSubmit(submitHandler)}
          disabled={submitting}
        >
          {submitting ? (
            <CircularProgress
              size={20}
              color="inherit"
            />
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

export default CustomerDialog;
