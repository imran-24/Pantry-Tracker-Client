"use client";
import { db } from "@/firebase";
import { config } from "dotenv";

config({ path: ".env" });

import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";

import React, { useEffect, useState } from "react";
import CreateModal from "./components/modals/create-modal";
import {
  AppBar,
  Box,
  CircularProgress,
  CssBaseline,
  Fab,
  Grid,
  List,
  Paper,
  Toolbar,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import AddIcon from "@mui/icons-material/Add";
import CameraIcon from "@mui/icons-material/Camera";
import CameraPage from "./components/camera";
import axios from "axios";
import InventoryCard from "./components/inventory-card";

const StyledFab = styled(Fab)({
  position: "absolute",
  zIndex: 1,
  top: -20,
  left: 0,
  right: 0,
  margin: "0 auto",
});

const CameraFab = styled(Fab)({
  position: "absolute",
  zIndex: 1,
  top: 14,
  right: 10,
});

export default function Home() {
  const [inventory, setInventory] = useState([]);
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [title, setTitle] = useState("");
  const [count, setCount] = useState(1);
  const [openCamera, setOpenCamera] = useState(false);
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const removeItem = async (item, digit) => {
    // reference of the document
    const docRef = doc(collection(db, "inventory"), item.toLowerCase());
    // collections within the documents
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      if (quantity === 1 || quantity < digit || quantity === digit) {
        await deleteDoc(docRef);
      } else {
        await setDoc(docRef, {
          quantity: Number(quantity) - digit,
          updatedAt: serverTimestamp(),
        });
      }
    }

    await updateInventory();
  };

  const addItem = async (item, digit) => {
    // reference of the document
    const docRef = doc(collection(db, "inventory"), item.toLowerCase());
    // collections within the documents
    const docSnap = await getDoc(docRef);

    // if there exists collections in the documents
    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      const increament = Number(digit ? digit : 1);
      await setDoc(docRef, {
        quantity: quantity + increament,
        updatedAt: serverTimestamp(),
      });
    }
    // if there are no collections if the documents, then add one
    else {
      await setDoc(docRef, {
        quantity: Number(digit ? digit : 1),
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    }

    await updateInventory();
  };

  const addItemByImage = async () => {
    try {
      // console.log(image)
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/ai`,
        {
          image: image,
        }
      );

      console.log(JSON.parse(response.data));
      const json = JSON.parse(response.data);
      addItem(json.object, json.number);
    } catch (error) {
      console.error("Error:", error.message); // Handle errors properly
    }
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const updateInventory = async () => {
    setLoading(true);

    let inventoryList = [];
    const querySnapshot = await getDocs(collection(db, "inventory"));
    querySnapshot.forEach((doc) => {
      inventoryList.push({
        id: doc.id,
        name: doc.id,
        ...doc.data(),
      });
    });

    // const list = [];
    // const q = query(collection(db, "inventory"), orderBy("updatedAt"));
    // onSnapshot(q, (snapshot) => {
    //   snapshot.forEach((doc) => {
    //     if (doc.data()) {
    //       list.push({
    //         id: doc.id,
    //         name: doc.id,
    //         ...doc.data(),
    //       });
    //     }
    //   });
    // });
    // console.log(list);
    setInventory(inventoryList);
    setLoading(false);
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
      <CreateModal
        open={open}
        handleClose={handleClose}
        title={title}
        setName={(value) => setName(value)}
        name={name}
        setQuantity={(value) => setCount(value)}
        quantity={count}
        addItem={(a, b) => addItem(a, b)}
        removeItem={(a, b) => removeItem(a, b)}
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
            backgroundColor: "rgb(241 245 249)",
          }}
        >
          <Box
            display={"flex"}
            justifyContent={"space-between"}
            justifyItems={"center"}
            maxWidth={"90vw"}
            paddingX={1}
            minWidth={"90vw"}
            paddingY={2}
            position={"relative"}
            margin={"auto"}
          >
            <Typography variant="h5" gutterBottom component="div">
              Inventory
            </Typography>
            <CameraFab
              size="small"
              onClick={() => {
                setOpen(true);
                setTitle("Add");
              }}
              color="primary"
              aria-label="add"
            >
              <AddIcon />
            </CameraFab>
          </Box>
          <List sx={{ height: "100%", overflowY: "auto" }}>
            {loading ? (
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
              <Grid
                maxWidth={"90vw"}
                marginX={"auto"}
                container
                // gap={1}
                spacing={1}
                paddingBottom={1}
                paddingRight={1}
              >
                {inventory.map(({ name, quantity }, index) => (
                  <Grid item key={index} xs={12} sm={6} md={6} lg={3} xl={3}>
                    <InventoryCard
                      count={quantity}
                      serial={index + 1}
                      name={name}
                      setName={(value) => setName(value)}
                      setCount={(value) => setCount(value)}
                      onOpen={handleOpen}
                      setTitle={(value) => setTitle(value)}
                    />
                  </Grid>
                ))}
              </Grid>
            )}
          </List>
          <AppBar
            position="fized"
            color="primary"
            sx={{ top: "auto", bottom: 0, height: "50px" }}
          >
            <Toolbar>
              <StyledFab
                size="small"
                onClick={() => setOpenCamera(true)}
                color="secondary"
                aria-label="add"
              >
                <CameraIcon />
              </StyledFab>
              <Box sx={{ flexGrow: 1 }} />
            </Toolbar>
          </AppBar>
        </Paper>
      </React.Fragment>
    </Box>
  );
}
