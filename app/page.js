"use client";
import { db } from "@/firebase";
import { config } from "dotenv";

config({ path: ".env" });

import { collection, doc, getDoc, getDocs, setDoc } from "firebase/firestore";

import React, { useEffect, useState } from "react";
import CreateDialog from "./components/modals/create-dialog";
import {
  AppBar,
  Badge,
  Box,
  Button,
  ButtonGroup,
  Chip,
  CircularProgress,
  CssBaseline,
  Fab,
  List,
  ListItem,
  ListItemText,
  Paper,
  Toolbar,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import IconButton from "@mui/material/IconButton";
import CameraIcon from "@mui/icons-material/Camera";
import CameraPage from "./components/camera";
import axios from "axios";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  display: "flex",
  flexDirection: "column",
  border: "none",
  width: 400,
  bgcolor: "black",
  gap: 3,
  boxShadow: 24,
  p: 4,
  color: "white",
};

const StyledFab = styled(Fab)({
  position: "absolute",
  zIndex: 1,
  top: -20,
  left: 0,
  right: 0,
  margin: "0 auto",
});
export default function Home() {
  const [inventory, setInventory] = useState([]);
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [openCamera, setOpenCamera] = useState(false);
  const [image, setImage] = useState(null);

  

  const removeItem = async (item) => {
    // reference of the document
    const docRef = doc(collection(db, "inventory"), item);
    // collections within the documents
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      if (quantity === 1) {
        await RemoveDoc(docRef);
      } else {
        await setDoc(docRef, { quantity: quantity - 1 });
      }
    }

    await updateInventory();
  };

  const addItem = async (item) => {
    // reference of the document
    const docRef = doc(collection(db, "inventory"), item);
    // collections within the documents
    const docSnap = await getDoc(docRef);

    // if there exists collections in the documents
    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      await setDoc(docRef, { quantity: quantity + 1 });
    }
    // if there are no collections if the documents, then add one
    else {
      await setDoc(docRef, { quantity: 1 });
    }

    await updateInventory();
  };

  const addItemByImage = async () => {
     try {
       const response = await axios.post(`${process.env.NEXT_API_URL}/ai`, {
         image: image,
       });

       const json = JSON.parse(response.data);
       addItem(json.object);
     } catch (error) {
       console.error("Error:", error.message); // Handle errors properly
     }

  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const updateInventory = async () => {
    let inventoryList = [];
    const querySnapshot = await getDocs(collection(db, "inventory"));
    querySnapshot.forEach((doc) => {
      inventoryList.push({
        id: doc.id,
        name: doc.id,
        ...doc.data(),
      });
    });
    setInventory(inventoryList);
  };

  useEffect(() => {
    updateInventory();
  }, []);

  if (openCamera) {
    return (
      <div>
        <CameraPage
          addItemByImage={addItemByImage}
          image={image}
          setImage={(value) => setImage(value)}
          setOpenCamera={() => {
            setOpenCamera(false);
          }}
        />
      </div>
    );
  }

  return (
    <Box
      sx={{
        width: "100vw",
        height: "100vh",
        margin: "auto",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        justifyItems: "center",
        overflow: "hidden",
      }}
    >
      <CreateDialog
        open={open}
        handleClose={handleClose}
        handleOpen={handleOpen}
        setName={(value) => setName(value)}
        name={name}
        addItem={(value) => addItem(value)}
      />
      <React.Fragment>
        <CssBaseline />
        <Paper
          square
          sx={{
            width: "100%",
            height: "100%",
            margin: "auto",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            justifyItems: "center",
            overflow: "hidden",
          }}
        >
          <Box
            display={"flex"}
            justifyContent={"space-between"}
            justifyItems={"center"}
            sx={{ p: 2, pb: 0 }}
          >
            <Typography variant="h5" gutterBottom component="div">
              Inbox
            </Typography>
            <IconButton onClick={() => setOpenCamera(true)}>
              <CameraIcon />
            </IconButton>
          </Box>
          <List sx={{ height: "100%", overflowY: "auto" }}>
            {!inventory.length ? (
              <Box
                height="100%"
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  justifyItems: "center",
                }}
              >
                <CircularProgress />
              </Box>
            ) : (
              inventory.map(({ id, name, quantity }) => (
                <ListItem
                  key={id}
                  secondaryAction={
                    <ButtonGroup>
                      <Button
                        size="small"
                        aria-label="reduce"
                        onClick={() => {
                          removeItem(name);
                        }}
                      >
                        <RemoveIcon fontSize="small" />
                      </Button>
                      <Button
                        size="small"
                        aria-label="increase"
                        onClick={() => {
                          addItem(name);
                        }}
                      >
                        <AddIcon fontSize="small" />
                      </Button>
                    </ButtonGroup>
                  }
                >
                  {/* <ListItemAvatar>
                    <Avatar>
                      <FolderIcon />
                    </Avatar>
                  </ListItemAvatar> */}
                  <Badge color="secondary" badgeContent={quantity}>
                    {/* <ListItemText
                      primary={name.charAt(0).toUpperCase() + name.slice(1)}
                      secondary={quantity ? quantity : 0}
                    /> */}
                    <Chip
                      label={name.charAt(0).toUpperCase() + name.slice(1)}
                      onClick={() => {}}
                    />
                  </Badge>

                  {/* <Typography>
                    {name}
                  </Typography> */}
                </ListItem>
              ))
            )}
          </List>
          <AppBar
            position="fized"
            color="primary"
            sx={{ top: "auto", bottom: 0, height: "50px" }}
          >
            <Toolbar>
              {/* <IconButton color="inherit" aria-label="open drawer">
              <MenuIcon />
            </IconButton> */}
              <StyledFab
                size="small"
                onClick={handleOpen}
                color="secondary"
                aria-label="add"
              >
                <AddIcon />
              </StyledFab>
              <Box sx={{ flexGrow: 1 }} />
              {/* <IconButton color="inherit">
              <SearchIcon />
            </IconButton>
            <IconButton color="inherit">
              <MoreIcon />
            </IconButton> */}
            </Toolbar>
          </AppBar>
        </Paper>
      </React.Fragment>
    </Box>
  );
}
