"use client";

import React from 'react';
import { useSelector } from 'react-redux';
import { List, ListItem, ListItemText, CircularProgress } from '@mui/material';
import { RootState } from '../redux/store';

const FlightResults: React.FC = () => {
    const { flights, loading, error } = useSelector((state: RootState) => state.flights);

    if (loading) return <CircularProgress />;
    if (error) return <div>Error: {error}</div>;

    return (
        <List>
            {Array.isArray(flights) && flights.map((flight, index) => (
                <ListItem key={index}>
                    <ListItemText primary={`Flight: ${flight.title}`} secondary={`Price: ${flight.price}`} />
                </ListItem>
            ))}
        </List>
    );
};

export default FlightResults;