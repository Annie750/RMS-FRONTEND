import React from "react";
import EmptyState from "./EmptyState";

// Used as a slot override for MUI DataGrid: slots={{ noRowsOverlay: NoDataOverlay }}
const NoDataOverlay = () => <EmptyState title="No records found" subtitle="Try adjusting your filters or add a new record." />;

export default NoDataOverlay;
