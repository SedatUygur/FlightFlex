import type { Dayjs } from "dayjs";
import type { Airport } from "./AirportType";

export type SearchData = {
  origin: Airport | null;
  destination: Airport | null;
  departDate: Dayjs | null;
  returnDate: Dayjs | null;
  passengers: Record<"adults" | "children" | "infants", number>;
};