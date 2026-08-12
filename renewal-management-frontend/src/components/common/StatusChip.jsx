import React from "react";
import { Chip } from "@mui/material";
import { RENEWAL_STATUS_COLOR } from "../../utils/constants";

const StatusChip = ({ status }) => {
  const color = RENEWAL_STATUS_COLOR[status] || "default";
  const label = status ? status.replace(/_/g, " ") : "UNKNOWN";
  return <Chip label={label} color={color} size="small" variant="filled" />;
};

export default StatusChip;
