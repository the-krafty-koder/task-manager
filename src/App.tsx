import NotesIcon from "@mui/icons-material/Notes";
import "./App.css";
import Board from "./pages/Board";

import {
  AppBar,
  Box,
  createTheme,
  Stack,
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
      <Box>
        <AppBar className="appBar">
          <Toolbar>
            <Stack direction="row" spacing={1} alignItems="center">
              <Typography variant="h6" component="div">
                Jotter
              </Typography>
              <NotesIcon />
            </Stack>
          </Toolbar>
        </AppBar>
        <Board />
      </Box>
    </ThemeProvider>
  );
}

export default App;
