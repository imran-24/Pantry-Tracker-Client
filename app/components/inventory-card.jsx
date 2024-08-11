'use client';
import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { Box, Button, ButtonGroup, CardActionArea, Chip, Stack } from '@mui/material';
import EventNoteIcon from '@mui/icons-material/EventNote';
import FolderOutlinedIcon from '@mui/icons-material/FolderOutlined';
import PropTypes from 'prop-types';

const InventoryCard = ({serial, name, count, onOpen, setName, setCount, setTitle}) => {
 
  const handleOpen = (value) => {
    setTitle(value)
    setName(name);
    setCount(count);
    onOpen();
  }

  return (
    <Card >
      <CardActionArea>
        {/* <CardMedia
          component="img"
          height="140"
          image="/static/images/cards/contemplative-reptile.jpg"
          alt="green iguana"
        /> */}
        <CardContent sx={{ paddingX: 0, paddingY: 2}}>
          <Box paddingX={2} paddingBottom={1}>
          {/* <Typography gutterBottom variant="body1" color="rgb(107 114 128)">
            Item ##29023
          </Typography> */}
          <Chip
          // sx={{ color: "rgb(107 114 128)"}}
                label={`Item #${serial}`}
                onClick={() => {}}
            />
          <Typography fontWeight={500}  variant="h6" sx={{ textTransform: "capitalize"}}>
            {name}
          </Typography>
          </Box>
          {/* <Typography variant="body1" color="text.secondary">
            Robert Fox . 3891 Ranchview Dr. Richardson
          </Typography> */}
          <hr />
          <ButtonGroup sx={{marginTop: 1, paddingX: 2, zIndex: 999}} >
            <Button onClick={() => handleOpen("Add")} variant='contained' color="primary" size='small'>Add </Button>
            <Button  onClick={() => handleOpen("Remove")} variant="contained" color="error" size='small'>
                Remove 
            </Button>
          </ButtonGroup>
          <Stack direction="row" spacing={1} marginTop={1} rowGap={2}  paddingX={2}>
                {/* <Typography sx={{ display: "flex", alignItems: "center", gap: 1}} color={"rgb(107 114 128)"}   variant='body2'>
                    <EventNoteIcon sx={{ height: 20, width: 20}}  /> 2
                </Typography> */}
                <Typography sx={{ display: "flex", alignItems: "center", gap: 1}} color={"rgb(107 114 128)"}  variant='body2'>
                    <FolderOutlinedIcon   sx={{ height: 20, width: 20}}  /> {count}
                </Typography>
          </Stack>
        </CardContent>
      </CardActionArea>
    </Card>
  )
}

InventoryCard.propTypes = {
    setTitle: PropTypes.func.isRequired,
    setName: PropTypes.func.isRequired,
    setCount: PropTypes.func.isRequired,
    onOpen: PropTypes.func.isRequired,
    serial: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    count: PropTypes.number.isRequired,
  };

export default InventoryCard