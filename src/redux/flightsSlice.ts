/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

interface Flight {
  title: string;
  price: string;
}

interface FlightsState {
  flights: Flight[];
  loading: boolean;
  error: string | null;
}

export const searchFlights = createAsyncThunk(
  'flights/searchFlights',
  async ({
    origin,
    destination,
    date,
  }: {
    origin: any;
    destination: any;
    date: string;
  }) => {
    const options = {
      method: 'GET',
      url: 'https://sky-scrapper.p.rapidapi.com/api/v1/flights/searchFlights',
      params: {
        originSkyId: origin.skyId,
        destinationSkyId: destination.skyId,
        originEntityId: origin.entityId,
        destinationEntityId: destination.entityId,
        date: date,
        // Add other parameters as needed
        /*
        cabinClass: 'economy',
        adults: '1',
        sortBy: 'best',
        currency: 'USD',
        market: 'en-US',
        countryCode: 'US'
        */
      },
      headers: {
        'x-rapidapi-key': 'f3ddd86466msh752e061ac7839a6p18c18djsnd0a243d6bf21',
        'x-rapidapi-host': 'sky-scrapper.p.rapidapi.com',
      },
    };
    try {
      const response = await axios.request(options);
      console.log(response.data);
      return response.data.data;
    } catch (error) {
      console.error(error);
    }
  },
);

const flightsSlice = createSlice({
  name: 'flights',
  initialState: {
    flights: [],
    loading: false,
    error: null,
  } as FlightsState,
  reducers: {
    // We can define other reducers here if needed
  },
  extraReducers: (builder) => {
    builder
      .addCase(searchFlights.pending, (state) => {
        state.loading = true;
      })
      .addCase(searchFlights.fulfilled, (state, action) => {
        state.loading = false;
        state.flights = action.payload;
      })
      .addCase(searchFlights.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Something went wrong';
      });
  },
});

export default flightsSlice.reducer;
