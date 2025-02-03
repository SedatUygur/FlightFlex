'use client';

import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { searchFlights } from '../redux/FlightsSlice';
import { TextField, Button } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { AppDispatch } from '@/redux/store';

const FlightSearch: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [date, setDate] = useState('');

  const handleSearch = () => {
    const originData = { skyId: 'LOND', entityId: '27544008' }; // Example data
    const destinationData = { skyId: 'NYCA', entityId: '27537542' }; // Example data
    dispatch(searchFlights({ origin: originData, destination: destinationData, date }));
  };

  return (
    <Grid container spacing={2}>
      <Grid size={{ xs: 12, sm: 4 }}>
        <TextField
          fullWidth
          label="Origin"
          value={origin}
          onChange={(e) => setOrigin(e.target.value)}
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 4 }}>
        <TextField
          fullWidth
          label="Destination"
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 4 }}>
        <TextField
          fullWidth
          type="date"
          label="Travel Date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
      </Grid>
      <Grid size={{ xs: 12 }}>
        <Button variant="contained" color="primary" onClick={handleSearch}>
          Search Flights
        </Button>
      </Grid>
    </Grid>
  );
};

export default FlightSearch;
