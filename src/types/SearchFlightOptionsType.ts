import type { Dayjs } from "dayjs";
import type { AirportResult } from "./AirportResponseType";
import type { CabinClass } from "./CabinClassType";

export type SearchFlightOptions = {
  cabinClass: CabinClass;
  origin: AirportResult | null;
  destination: AirportResult | null;
  date: Dayjs | null;
  returnDate: Dayjs | null;
  passengers: Record<"adults" | "children" | "infants", number>;
};