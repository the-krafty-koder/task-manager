import { Modal, Box, Typography, Stack, Button } from "@mui/material";
import { styled } from "@mui/material/styles";

interface ConfirmationDialogProps {
  open: boolean;
  onClose: () => void;
  title: string;
  onConfirm: () => void;
}

const StyledBox = styled(Box)(({ theme }) => ({
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 300,
  backgroundColor: theme.palette.background.paper,
  border: "2px solid rgba(0, 0, 0, 0.3)",
  boxShadow: theme.shadows[5],
  padding: theme.spacing(4),
  textAlign: "center",
}));

const ConfirmationDialog = ({
  open,
  onClose,
  title,
  onConfirm,
}: ConfirmationDialogProps) => {
  return (
    <Modal open={open} onClose={onClose}>
      <StyledBox>
        <Typography variant="h6">Confirm Delete?</Typography>
        <Typography variant="body2" sx={{ mt: 2 }}>
          Are you sure you want to delete "{title}"?
        </Typography>
        <Stack
          direction="row"
          justifyContent="center"
          spacing={2}
          sx={{ mt: 3 }}
        >
          <Button variant="outlined" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="contained" color="error" onClick={onConfirm}>
            Delete
          </Button>
        </Stack>
      </StyledBox>
    </Modal>
  );
};

export default ConfirmationDialog;
