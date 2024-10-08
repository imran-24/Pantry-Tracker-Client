"use client";

import { Box, Fab, IconButton, Typography } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import {Camera} from "react-camera-pro";
import styled from "styled-components";
import CloseIcon from "@mui/icons-material/Close";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SendIcon from "@mui/icons-material/Send";
import PropTypes from 'prop-types';

const Wrapper = styled.div`
  position: fixed;
  width: 100%;
  height: 100%;
  z-index: 1;
`;

const Control = styled.div`
  position: fixed;
  display: flex;
  right: 0;
  width: 20%;
  min-width: 130px;
  min-height: 130px;
  height: 100%;
  background: rgba(0, 0, 0, 0.8);
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 50px;
  box-sizing: border-box;
  flex-direction: column-reverse;

  @media (max-aspect-ratio: 1/1) {
    flex-direction: row;
    bottom: 0;
    width: 100%;
    height: 20%;
  }

  @media (max-width: 400px) {
    padding: 10px;
  }
`;

const CameraButton = styled.button`
  outline: none;
  color: white;
  opacity: 1;
  background: transparent;
  background-color: transparent;
  background-position-x: 0%;
  background-position-y: 0%;
  background-repeat: repeat;
  background-image: none;
  padding: 0;
  text-shadow: 0px 0px 4px black;
  background-position: center center;
  background-repeat: no-repeat;
  pointer-events: auto;
  cursor: pointer;
  z-index: 2;
  filter: invert(100%);
  border: none;

  &:hover {
    opacity: 0.7;
  }
`;

const TakePhotoButton = styled(CameraButton)`
  background: url('https://img.icons8.com/ios/50/000000/compact-camera.png');
  background-position: center;
  background-size: 50px;
  background-repeat: no-repeat;
  width: 80px;
  height: 80px;
  border: solid 4px black;
  border-radius: 50%;

  &:hover {
    background-color: rgba(0, 0, 0, 0.3);
  }
`;

const TorchButton = styled(CameraButton)`
  background: url('https://img.icons8.com/ios/50/000000/light.png');
  background-position: center;
  background-size: 50px;
  background-repeat: no-repeat;
  width: 80px;
  height: 80px;
  border: solid 4px black;
  border-radius: 50%;

  &.toggled {
    background-color: rgba(0, 0, 0, 0.3);
  }
`;

const ChangeFacingCameraButton = styled(CameraButton)`
  background: url(https://img.icons8.com/ios/50/000000/switch-camera.png);
  background-position: center;
  background-size: 40px;
  background-repeat: no-repeat;
  width: 40px;
  height: 40px;
  padding: 40px;
  &:disabled {
    opacity: 0;
    cursor: default;
    padding: 60px;
  }
  @media (max-width: 400px) {
    padding: 40px 5px;
    &:disabled {
      padding: 40px 25px;
    }
  }
`;

const ImagePreview = styled.div`
  width: 120px;
  height: 120px;
  ${({ image }) => (image ? `background-image:  url(${image});` : '')}
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;

  @media (max-width: 400px) {
    width: 50px;
    height: 120px;
  }
`;

const FullScreenImagePreview = styled.div`
  width: 100%;
  height: 100%;
  z-index: 100;
  position: absolute;
  background-color: black;
  ${({ image }) => (image ? `background-image:  url(${image});` : '')}
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
`;

const IconFab = styled(Fab)({
  position: "absolute",
  zIndex: 999,
  bottom: 14,
  right: 14,
  display: 'flex',
  alignItems: "center",
  justifyContent: "center"
});

const CameraPage = ({setOpenCamera, image, setImage, addItemByImage}) => {
    const [numberOfCameras, setNumberOfCameras] = useState(0);
    const [showImage, setShowImage] = useState(false);
    const camera = useRef(null);
    const [devices, setDevices] = useState([]);
    const [activeDeviceId, setActiveDeviceId] = useState(undefined);
    const [torchToggled, setTorchToggled] = useState(false);
  
    useEffect(() => {
      (async () => {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = devices.filter((i) => i.kind == 'videoinput');
        setDevices(videoDevices);
      })();
    });
  
    return (
    <Wrapper>
        {showImage ? (
        <Box>
            <FullScreenImagePreview
          image={image}
          onClick={() => {
            setShowImage(!showImage);
          }}
            />
            <IconButton onClick={() => { setShowImage(!showImage);}} sx={{ zIndex: 200}} >
                <CloseIcon color="warning" />
            </IconButton>
            
            <IconFab  
            color="primary"
            size="small"
            aria-label="add"
            onClick={() => {
              addItemByImage()
              setShowImage(false)
              setOpenCamera()
            }} >
                <SendIcon sx={{ marginLeft: .7}} fontSize="small"  />
            </IconFab>
        </Box>
      ) : (
        <Box>
            <Camera
            ref={camera}
            aspectRatio="cover"
            facingMode="user"
            numberOfCamerasCallback={(i) => setNumberOfCameras(i)}
            videoSourceDeviceId={activeDeviceId}
            errorMessages={{
                noCameraAccessible: 'No camera device accessible. Please connect your camera or try a different browser.',
                permissionDenied: 'Permission denied. Please refresh and give camera permission.',
                switchCamera:
                'It is not possible to switch camera to different one because there is only one video device accessible.',
                canvas: 'Canvas is not supported.',
            }}
            videoReadyCallback={() => {
                console.log('Video feed ready.');
            }}
            />
            <IconFab  onClick={() => { 
              setOpenCamera(false);
              }} 
              size="small"
              color="inherit"
              sx={{ zIndex: 999, position: "fixed", left: 6, top: 6}} >
                <ArrowBackIcon fontSize="small"   />
            </IconFab>
        </Box>
        
      )}
        <Control>
        <ImagePreview
          image={image}
          onClick={() => {
            setShowImage(!showImage);
          }}
        />
        <TakePhotoButton
          onClick={() => {
            if (camera.current) {
              const photo = camera.current.takePhoto();
              setImage(photo);
              setShowImage(!showImage)
            }
          }}
        />
        {camera.current?.torchSupported && (
          <TorchButton
            className={torchToggled ? 'toggled' : ''}
            onClick={() => {
              if (camera.current) {
                setTorchToggled(camera.current.toggleTorch());
              }
            }}
          />
        )}
        <ChangeFacingCameraButton
          disabled={numberOfCameras <= 1}
          onClick={() => {
            if (camera.current) {
              const result = camera.current.switchCamera();
              console.log(result);
            }
          }}
        />
      </Control>
    </Wrapper>
    )
}
export default CameraPage

CameraPage.propTypes = {
    addItemByImage: PropTypes.func.isRequired,
    setOpenCamera: PropTypes.func.isRequired,
    image: PropTypes.object,
    setImage: PropTypes.func.isRequired,
  };