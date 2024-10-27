import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { styled } from "@mui/material/styles";

// STYLED COMPONENTS
const AppFooter = styled(Toolbar)({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  minHeight: "40px", // Adjust the height as needed
  padding: "1rem",
  backgroundColor: "#00bcd4" // Cyan color for the footer background
});

export default function Footer() {
  return (
    <AppBar position="static" color="transparent" sx={{ boxShadow: "none" }}>
      <AppFooter>
        <Typography variant="body1" sx={{ fontWeight: 500, fontSize: "1rem" }}>
          Design and Developed by @ S-U-R
      </Typography>
      </AppFooter>
    </AppBar>
  );
}
