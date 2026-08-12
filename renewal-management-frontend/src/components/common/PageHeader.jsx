import React from "react";
import { Box, Typography, Breadcrumbs, Link as MuiLink } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";

const PageHeader = ({ title, subtitle, breadcrumbs = [], action }) => {
  return (
    <Box sx={{ mb: 3, display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 2 }}>
      <Box>
        {breadcrumbs.length > 0 && (
          <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} sx={{ mb: 0.5 }}>
            {breadcrumbs.map((crumb, idx) =>
              crumb.href ? (
                <MuiLink
                  key={idx}
                  component={RouterLink}
                  to={crumb.href}
                  underline="hover"
                  color="text.secondary"
                  variant="body2"
                >
                  {crumb.label}
                </MuiLink>
              ) : (
                <Typography key={idx} variant="body2" color="text.primary">
                  {crumb.label}
                </Typography>
              )
            )}
          </Breadcrumbs>
        )}
        <Typography variant="h4">{title}</Typography>
        {subtitle && (
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            {subtitle}
          </Typography>
        )}
      </Box>
      {action && <Box>{action}</Box>}
    </Box>
  );
};

export default PageHeader;
