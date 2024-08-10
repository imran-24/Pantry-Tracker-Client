'use client';
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import React from "react";
import PropTypes from 'prop-types';

const CreateModal = ({open, handleClose, name, setName, quantity, setQuantity, addItem }) => {
  return (
    <React.Fragment>
        <Dialog
          
          open={open}
          onClose={handleClose}
          PaperProps={{
            component: "form",
            onSubmit: (event) => {
              event.preventDefault();
              const formData = new FormData(event.currentTarget);
              const formJson = Object.fromEntries(formData.entries());
              const value = formJson.name;
              addItem(name, quantity)
              // handleClose();
            },
          }}
        >
          <DialogTitle>Add Item</DialogTitle>
          <DialogContent >
            <DialogContentText>
              Add new items to your inventory
            </DialogContentText>
            <TextField
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoFocus
              required
              margin="dense"
              id="name"
              name="name"
              label="Product name"
              type="text"
              fullWidth
              variant="standard"
            />
            <TextField
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              autoFocus
              required
              margin="dense"
              id="quantity"
              name="quantity"
              label="Quantity"
              type="number"
              fullWidth
              variant="standard"
            />
          </DialogContent>
          <DialogActions >
            <Button onClick={handleClose} sx={{ textDecoration: "none", textTransform: "capitalize" }}  size="small"  variant="contained" color="inherit">Cancel</Button>
            <Button type="submit" size="small" sx={{ textDecoration: "none", textTransform: "capitalize" }}  variant="contained">Add </Button>
          </DialogActions>
        </Dialog>
      </React.Fragment>
  )
}

CreateModal.propTypes = {
    open: PropTypes.bool.isRequired,
    handleOpen: PropTypes.func,
    handleClose: PropTypes.func,
    setName: PropTypes.func,
    addItem: PropTypes.func,
    name : PropTypes.string.isRequired,
    setQuantity: PropTypes.func,
    quantity : PropTypes.number.isRequired,
};

export default CreateModal
