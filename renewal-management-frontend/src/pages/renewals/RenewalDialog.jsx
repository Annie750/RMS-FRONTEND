import React, { useEffect, useState } from "react";
import { useForm, Controller, useFieldArray } from "react-hook-form";
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
  IconButton,
  Typography,
  Divider,
  CircularProgress,
  Paper,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";

import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import DownloadIcon from "@mui/icons-material/Download";
import DeleteIcon from "@mui/icons-material/Delete";

import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";

import customerService from "../../services/customerService";
import productService from "../../services/productService";
import userService from "../../services/userService";
import renewalService from "../../services/renewalService";
import renewalDocumentService from "../../services/renewalDocumentService";

const schema = yup.object({
  customerId: yup.string().required("Customer is required"),
  assignedUserId: yup.string().required("Assigned user is required"),
  purchaseDate: yup.date().nullable().required("Purchase date is required"),
  notes: yup.string(),
  lineItems: yup
    .array()
    .of(
      yup.object({
        productId: yup.string().required("Product is required"),
        quantity: yup.number().required().min(1),
        transferPrice: yup.number().required(),
        sellingPrice: yup.number().required(),
      })
    )
    .min(1),
});

const defaultValues = {
  customerId: "",
  assignedUserId: "",
  purchaseDate: null,
  notes: "",
  lineItems: [
    {
      productId: "",
      quantity: 1,
      transferPrice: "",
      sellingPrice: "",
    },
  ],
};

const RenewalDialog = ({ open, onClose, onSubmit, initialData, submitting }) => {
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previousPrices, setPreviousPrices] = useState({});

  const {
    control,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues,
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "lineItems",
  });

  const watchedCustomer = watch("customerId");
  const watchedItems = watch("lineItems") || [];

  useEffect(() => {
    if (!open) return;

    const loadData = async () => {
      try {
        const [customerData, productData, userData] = await Promise.all([
          customerService.getAll(),
          productService.getAll(),
          userService.getAll(),
        ]);

        setCustomers(
          Array.isArray(customerData) ? customerData : customerData?.content || []
        );
        setProducts(
          Array.isArray(productData) ? productData : productData?.content || []
        );
        setUsers(
          Array.isArray(userData) ? userData : userData?.content || []
        );

        if (initialData?.id) {
          const docs = await renewalDocumentService.getDocuments(initialData.id);
          setDocuments(docs);
        } else {
          setDocuments([]);
        }

        if (initialData) {
          reset({
            customerId: initialData.customerId,
            assignedUserId: initialData.assignedUserId,
            purchaseDate: initialData.purchaseDate
              ? dayjs(initialData.purchaseDate)
              : null,
            notes: initialData.notes || "",
            lineItems: initialData.lineItems?.length
              ? initialData.lineItems
              : [
                  {
                    productId: "",
                    quantity: 1,
                    transferPrice: "",
                    sellingPrice: "",
                  },
                ],
          });
        } else {
          reset(defaultValues);
        }
      } catch (err) {
        console.error(err);
      }
    };

    loadData();
  }, [open, initialData, reset]);

  const loadPreviousPrice = async (customerId, productId) => {
    if (!customerId || !productId) return;

    try {
      const data = await renewalService.getPreviousPrices(customerId, productId);
      setPreviousPrices((prev) => ({
        ...prev,
        [productId]: data,
      }));
    } catch {
      setPreviousPrices((prev) => ({
        ...prev,
        [productId]: null,
      }));
    }
  };

  const addProduct = () => {
    append({
      productId: "",
      quantity: 1,
      transferPrice: "",
      sellingPrice: "",
    });
  };

  const removeProduct = (index) => {
    remove(index);
  };

  const handleUpload = async () => {
    if (!selectedFile || !initialData?.id) return;
    try {
      const uploadedDoc = await renewalDocumentService.upload(
        initialData.id,
        selectedFile
      );
      setDocuments((prev) => [...prev, uploadedDoc]);
      setSelectedFile(null);
    } catch (err) {
      console.error("Upload error:", err);
    }
  };

  const handleDeleteDocument = async (id) => {
    try {
      await renewalDocumentService.remove(initialData.id, id);
      setDocuments((prev) => prev.filter((d) => d.id !== id));
    } catch (err) {
      console.error("Delete document error:", err);
    }
  };

  const totalAmount = watchedItems.reduce(
    (sum, item) =>
      sum + Number(item.quantity || 0) * Number(item.sellingPrice || 0),
    0
  );

  const submitHandler = (values) => {
    onSubmit({
      ...values,
      purchaseDate: dayjs(values.purchaseDate).format("YYYY-MM-DD"),
      lineItems: values.lineItems.map((item) => ({
        ...item,
        quantity: Number(item.quantity),
        transferPrice: Number(item.transferPrice),
        sellingPrice: Number(item.sellingPrice),
      })),
    });
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        {initialData ? "Edit Renewal" : "Create Renewal"}
      </DialogTitle>

      <DialogContent dividers>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Grid container spacing={2} sx={{ mt: 0.5 }}>
            {/* Customer */}
            <Grid item xs={12} md={6}>
              <Controller
                name="customerId"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    select
                    label="Customer"
                    fullWidth
                    error={!!errors.customerId}
                    helperText={errors.customerId?.message}
                  >
                    {customers.map((customer) => (
                      <MenuItem key={customer.id} value={customer.id}>
                        {customer.companyName}
                      </MenuItem>
                    ))}
                  </TextField>
                )}
              />
            </Grid>

            {/* Assigned User */}
            <Grid item xs={12} md={6}>
              <Controller
                name="assignedUserId"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    select
                    label="Assigned User"
                    fullWidth
                    error={!!errors.assignedUserId}
                    helperText={errors.assignedUserId?.message}
                  >
                    {users.map((user) => (
                      <MenuItem key={user.id} value={user.id}>
                        {user.firstName} {user.lastName}
                      </MenuItem>
                    ))}
                  </TextField>
                )}
              />
            </Grid>

            {/* Purchase Date */}
            <Grid item xs={12} md={6}>
              <Controller
                name="purchaseDate"
                control={control}
                render={({ field }) => (
                  <DatePicker
                    label="Purchase Date"
                    value={field.value}
                    onChange={field.onChange}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        error: !!errors.purchaseDate,
                        helperText: errors.purchaseDate?.message,
                      },
                    }}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12}>
              <Divider>Products</Divider>
            </Grid>

            <Grid item xs={12}>
              <Button
                variant="outlined"
                startIcon={<AddCircleOutlineIcon />}
                onClick={addProduct}
              >
                Add Product
              </Button>
            </Grid>

            {fields.map((item, index) => (
              <Grid item xs={12} key={item.id}>
                <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={4}>
                      <Controller
                        name={`lineItems.${index}.productId`}
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            select
                            label="Product"
                            fullWidth
                            onChange={(e) => {
                              field.onChange(e);
                              loadPreviousPrice(watchedCustomer, e.target.value);
                            }}
                          >
                            {products.map((product) => (
                              <MenuItem key={product.id} value={product.id}>
                                {product.productName}
                              </MenuItem>
                            ))}
                          </TextField>
                        )}
                      />
                    </Grid>

                    <Grid item xs={12} md={2}>
                      <Controller
                        name={`lineItems.${index}.quantity`}
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            label="Qty"
                            type="number"
                            fullWidth
                          />
                        )}
                      />
                    </Grid>

                    <Grid item xs={12} md={3}>
                      <Controller
                        name={`lineItems.${index}.transferPrice`}
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            label="Transfer Price"
                            type="number"
                            fullWidth
                          />
                        )}
                      />
                    </Grid>

                    <Grid item xs={12} md={3}>
                      <Controller
                        name={`lineItems.${index}.sellingPrice`}
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            label="Selling Price"
                            type="number"
                            fullWidth
                          />
                        )}
                      />
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Previous Transfer Price"
                        value={
                          previousPrices[
                            watchedItems[index]?.productId
                          ]?.previousTransferPrice ?? ""
                        }
                        InputProps={{
                          readOnly: true,
                        }}
                      />
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Previous Selling Price"
                        value={
                          previousPrices[
                            watchedItems[index]?.productId
                          ]?.previousSellingPrice ?? ""
                        }
                        InputProps={{
                          readOnly: true,
                        }}
                      />
                    </Grid>

                    <Grid item xs={12}>
                      <Button
                        color="error"
                        startIcon={<DeleteOutlineIcon />}
                        onClick={() => removeProduct(index)}
                        disabled={fields.length === 1}
                      >
                        Remove Product
                      </Button>
                    </Grid>
                  </Grid>
                </Paper>
              </Grid>
            ))}

            <Grid item xs={12}>
              <Paper sx={{ p: 2, bgcolor: "#f5f5f5" }}>
                <Typography variant="h6" fontWeight={700}>
                  Total Renewal Amount
                </Typography>
                <Typography variant="h4" color="primary">
                  ₹{totalAmount.toLocaleString()}
                </Typography>
              </Paper>
            </Grid>

            <Grid item xs={12}>
              <Controller
                name="notes"
                control={control}
                render={({ field }) => (
                  <TextField {...field} label="Notes" multiline rows={4} fullWidth />
                )}
              />
            </Grid>

            {/* Supporting Documents */}
            <Grid item xs={12}>
              <Divider>Supporting Documents</Divider>
            </Grid>

            <Grid item xs={8}>
              <Button
                variant="outlined"
                component="label"
                fullWidth
                startIcon={<UploadFileIcon />}
              >
                {selectedFile ? selectedFile.name : "Choose File"}
                <input
                  hidden
                  type="file"
                  onChange={(e) => setSelectedFile(e.target.files[0])}
                />
              </Button>
            </Grid>

            <Grid item xs={4}>
              <Button
                fullWidth
                variant="contained"
                disabled={!selectedFile || !initialData}
                onClick={handleUpload}
              >
                Upload
              </Button>
            </Grid>

            <Grid item xs={12}>
              <List dense>
                {documents.map((doc) => (
                  <ListItem
                    key={doc.id}
                    secondaryAction={
                      <>
                        <IconButton
                          onClick={() =>
                            renewalDocumentService.download(
                              initialData.id,
                              doc.id
                            )
                          }
                        >
                          <DownloadIcon />
                        </IconButton>
                        <IconButton
                          color="error"
                          onClick={() => handleDeleteDocument(doc.id)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </>
                    }
                  >
                    <ListItemText
                      primary={doc.fileName}
                      secondary={`${(doc.fileSize / 1024).toFixed(1)} KB`}
                    />
                  </ListItem>
                ))}
              </List>
            </Grid>
          </Grid>
        </LocalizationProvider>
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={onClose} disabled={submitting}>
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmit(submitHandler)}
          disabled={submitting}
        >
          {submitting ? (
            <CircularProgress size={20} color="inherit" />
          ) : initialData ? (
            "Update Renewal"
          ) : (
            "Create Renewal"
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default RenewalDialog;