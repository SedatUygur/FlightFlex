import { FlightSearchForm } from '../components/FlightSearchForm';

/**
 * The root page of the app.
 *
 * This page displays a `FlightSearchForm` component, which includes controls for
 * selecting a trip type, passenger count, origin and destination airports, and
 * travel dates. It also displays a table of search results if the user has
 * submitted a search.
 */
export default function Home() {
  return <FlightSearchForm />;
}
