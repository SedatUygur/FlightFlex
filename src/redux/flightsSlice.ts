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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async ({ origin, destination, date }: { origin: any; destination: any; date: string }) => {
        const response = await axios.get('API_URL/api/v1/flights/searchFlights', {
            params: {
                originSkyId: origin.skyId,
                destinationSkyId: destination.skyId,
                originEntityId: origin.entityId,
                destinationEntityId: destination.entityId,
                date: date,
            },
        });
        return response.data.data;
    }
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