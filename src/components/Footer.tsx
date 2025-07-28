import * as React from "react";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";
import { Box } from "@mui/material";

export default function Footer(props: any) {
  return (
    <Box>
      <Typography
        className="align-bottom"
        variant="body2"
        {...props}
        sx={[
          {
            color: "text.secondary",
            // backgroundColor: "red",
            textAlign: "center",
          },
          ...(Array.isArray(props.sx) ? props.sx : [props.sx]),
        ]}
      >
        {"Copyright © "}
        <Link color="inherit" href="https://mavsleo.com.br/">
          MavsLeo
        </Link>{" "}
        {new Date().getFullYear()}
        {"."}
      </Typography>
    </Box>
  );
}
