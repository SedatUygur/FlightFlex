/*import React from 'react';
import FlightSearch from '../components/FlightSearch';
import FlightResults from '../components/FlightResults';
import { Container } from '@mui/material';*/
import { FlightSearchForm } from "../components/FlightSearchForm";

{/* <Container>
    <h1>Flight Search</h1>
    <FlightSearch />
    <FlightResults />
</Container> */}

export default function Home() {
  return (
    <FlightSearchForm />
  );
}
