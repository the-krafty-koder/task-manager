import "./App.css";
import Board from "./pages/Board";

import {
  AppBar,
  Box,
  createTheme,
  ThemeProvider,
  Toolbar,
  Typography,
} from "@mui/material";

const theme = createTheme({
  typography: {
    fontFamily: ["Poppins"].join(","),
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static" className="appBar">
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Task manager
            </Typography>
          </Toolbar>
        </AppBar>
        <Board />
      </Box>
    </ThemeProvider>
  );
}

export default App;
