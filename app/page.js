'use client';
import Box from '@mui/material/Box';
import { Stack, Typography, Button, Modal, TextField } from '@mui/material';
// import { firestore } from './firebase';
import {
  collection,
  getDocs,
  query,
  setDoc,
  doc,
  deleteDoc,
  getDoc,
  count,
} from 'firebase/firestore';
import { firestore } from './firebase';
import { useEffect, useState } from 'react';

// For add item modal box
const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #CC0066',
  boxShadow: 24,
  p: 4,
  gap: 3,
  display: 'flex',
  flexDirection: 'column',
};

export default function Home() {
  const [pantry, setPantry] = useState([]);

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [itemName, setItemName] = useState('');

  const updatePantry = async () => {
    const snapshot = query(collection(firestore, 'pantry'));
    const docs = await getDocs(snapshot);
    const pantryList = [];
    docs.forEach(doc => {
      pantryList.push({ name: doc.id, ...doc.data() });
    });
    console.log(pantryList);
    setPantry(pantryList);
  };

  useEffect(() => {
    updatePantry();
  }, []);

  const addItem = async item => {
    const docRef = doc(collection(firestore, 'pantry'), item); // adds item to pantry
    const docSnap = await getDoc(docRef);
    console.log(docSnap.data());

    // Check if it exists
    if (docSnap.exists()) {
      const { count } = docSnap.data();
      await setDoc(docRef, { count: count + 1 });
    } else {
      await setDoc(docRef, { count: 1 });
    }
    await updatePantry(); // code calls firestore for refreshed list of items, including newly added item
  };

  const removeItem = async item => {
    // console.log(item);
    const docRef = doc(collection(firestore, 'pantry'), item); // adds item to pantry
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const { count } = docSnap.data();
      if (count === 1) {
        await deleteDoc(docRef);
      } else {
        await setDoc(docRef, { count: count - 1 });
      }
      await updatePantry(); // calls firestore for refreshed list of items, including newly added item
    }
  };

  //Search functionality
  const [searchQuery, setSearchQuery] = useState('');

  // Function to handle search input change
  const handleSearchChange = e => {
    setSearchQuery(e.target.value);
  };
  const filteredPantry = pantry.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <Box
      width="100vw"
      height="100vh"
      display={'flex'}
      justifyContent={'center'}
      alignItems={'center'}
      flexDirection={'column'}
      gap={2}
      sx={{
        background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
      }}
    >
      <Box
        width="80%"
        marginBottom={2}
        marginTop={2}
        bgcolor={'#FFFFFF'}
        borderRadius={2}
        border={'#BA459B 2px solid'}
      >
        <TextField
          fullWidth
          label="Search Pantry Items"
          variant="outlined"
          value={searchQuery}
          onChange={handleSearchChange}
          InputLabelProps={{
            sx: { color: '#9C4685' }, // Change the color to your desired value
          }}
        />
      </Box>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography
            id="modal-modal-title"
            variant="h6"
            component="h2"
            sx={{ color: '#CC0066' }}
          >
            Add item
          </Typography>
          <Stack width="100%" direction={'row'} spacing={2}>
            <TextField
              id="outlined-basic"
              label="Item"
              variant="outlined"
              fullWidth
              value={itemName}
              onChange={e => setItemName(e.target.value)}
            />
            <Button
              variant="contained"
              onClick={() => {
                addItem(itemName);
                handleClose();
                setItemName(''); // reset item name after closing modal
              }}
              sx={{
                backgroundColor: '#FE6B8B', // Button background color
                color: '#FFFFFF', // Button text color
                '&:hover': {
                  backgroundColor: '#FF8E53', // Button background color on hover
                },
              }}
            >
              Add
            </Button>
          </Stack>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}></Typography>
        </Box>
      </Modal>
      <Button
        variant="contained"
        onClick={handleOpen}
        sx={{
          backgroundColor: '#FF007F', // Button background color
          color: '#FFFFFF', // Button text color
          '&:hover': {
            backgroundColor: '#FF66B2', // Button background color on hover
          },
        }}
      >
        Add
      </Button>
      <Box height={'600px'} width={'80%'}>
        <Box
          width="100%"
          height="100px"
          bgcolor={'#FFFFFF'}
          display={'flex'}
          justifyContent={'center'}
          alignItems={'center'}
          sx={{ borderTopLeftRadius: 20, borderTopRightRadius: 20 }}
        >
          <Typography variant={'h2'} color={'#CC0066'} textAlign={'center'}>
            Pantry Items
          </Typography>
        </Box>
        <Stack
          width="100%"
          height="450px"
          spacing={2}
          overflow={'scroll'}
          marginTop={2}
        >
          {filteredPantry.map(({ name, count }) => (
            <Stack
              key={name}
              direction={'row'}
              spacing={2}
              justifyContent={'space-between'}
              alignContent={'space-between'}
              alignItems={'center'}
              paddingRight={2}
              paddingLeft={2}
              bgcolor={'#f0f0f0'}
            >
              <Box
                key={name}
                width="100%"
                minHeight="60px"
                display={'flex'}
                justifyContent={'space-between'}
                alignItems={'center'}
                bgcolor={'#f0f0f0'}
              >
                {/* <Box> */}
                <Typography
                  variant={'h4'}
                  color={'#CC0066'}
                  textAlign={'center'}
                >
                  {
                    // Capitalise first letter
                    name.charAt(0).toUpperCase() + name.slice(1)
                  }
                </Typography>
                {/* </Box> */}
                {/* <Box
                  display={'flex'}
                  flexDirection={'row'}
                  justifyContent={'center'}
                  alignContent={'space-evenly'}
                  alignItems={'center'}
                > */}
                <Typography
                  variant={'h4'}
                  color={'#CC0066'}
                  textAlign={'center'}
                  paddingLeft={10}
                  paddingRight={10}
                >
                  Qty: {count}
                </Typography>
              </Box>
              {/* </Box> */}
              <Button
                variant="contained"
                onClick={() => removeItem(name)}
                sx={{
                  height: '40px',
                  marginRight: 2,
                  backgroundColor: '#FF007F', // Button background color
                  color: '#FFFFFF', // Button text color
                  '&:hover': {
                    backgroundColor: '#FF66B2', // Button background color on hover
                  },
                }}
              >
                Remove
              </Button>
            </Stack>
          ))}
        </Stack>
      </Box>
    </Box>
  );
}
