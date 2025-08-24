// Flight data from the test file
export interface FlightRoute {
  from: string;
  to: string;
  miles: number;
  flightCode: string;
  type: "Business" | "Economy";
}

export const FLIGHT_DATA: FlightRoute[] = [
  // JFK routes
  {
    from: "JFK",
    to: "LAX",
    miles: 2336,
    flightCode: "SK046",
    type: "Business",
  },
  { from: "JFK", to: "LHR", miles: 920, flightCode: "KE187", type: "Business" },
  { from: "JFK", to: "CDG", miles: 2606, flightCode: "RU937", type: "Economy" },
  { from: "JFK", to: "NRT", miles: 2054, flightCode: "LQ444", type: "Economy" },
  { from: "JFK", to: "SYD", miles: 7180, flightCode: "HI371", type: "Economy" },
  { from: "JFK", to: "DXB", miles: 6461, flightCode: "PX550", type: "Economy" },
  { from: "JFK", to: "SIN", miles: 4011, flightCode: "CA611", type: "Economy" },
  {
    from: "JFK",
    to: "FRA",
    miles: 7923,
    flightCode: "RF297",
    type: "Business",
  },
  { from: "JFK", to: "AMS", miles: 1690, flightCode: "JC199", type: "Economy" },

  // LAX routes
  {
    from: "LAX",
    to: "JFK",
    miles: 7402,
    flightCode: "LF844",
    type: "Business",
  },
  { from: "LAX", to: "LHR", miles: 4601, flightCode: "HX027", type: "Economy" },
  {
    from: "LAX",
    to: "CDG",
    miles: 7486,
    flightCode: "UT872",
    type: "Business",
  },
  { from: "LAX", to: "NRT", miles: 5856, flightCode: "BK598", type: "Economy" },
  { from: "LAX", to: "SYD", miles: 1661, flightCode: "BL498", type: "Economy" },
  {
    from: "LAX",
    to: "DXB",
    miles: 4295,
    flightCode: "SK545",
    type: "Business",
  },
  {
    from: "LAX",
    to: "SIN",
    miles: 9285,
    flightCode: "VV811",
    type: "Business",
  },
  {
    from: "LAX",
    to: "FRA",
    miles: 4858,
    flightCode: "FK316",
    type: "Business",
  },
  {
    from: "LAX",
    to: "AMS",
    miles: 8715,
    flightCode: "YE935",
    type: "Business",
  },

  // LHR routes
  { from: "LHR", to: "JFK", miles: 8654, flightCode: "MO945", type: "Economy" },
  {
    from: "LHR",
    to: "LAX",
    miles: 8823,
    flightCode: "FA166",
    type: "Business",
  },
  {
    from: "LHR",
    to: "CDG",
    miles: 2550,
    flightCode: "BE317",
    type: "Business",
  },
  {
    from: "LHR",
    to: "NRT",
    miles: 3710,
    flightCode: "SX754",
    type: "Business",
  },
  { from: "LHR", to: "SYD", miles: 6412, flightCode: "PJ942", type: "Economy" },
  {
    from: "LHR",
    to: "DXB",
    miles: 7535,
    flightCode: "PS110",
    type: "Business",
  },
  {
    from: "LHR",
    to: "SIN",
    miles: 1491,
    flightCode: "HJ405",
    type: "Business",
  },
  { from: "LHR", to: "FRA", miles: 6499, flightCode: "LN028", type: "Economy" },
  { from: "LHR", to: "AMS", miles: 7530, flightCode: "BO078", type: "Economy" },

  // CDG routes
  { from: "CDG", to: "JFK", miles: 8588, flightCode: "CO174", type: "Economy" },
  {
    from: "CDG",
    to: "LAX",
    miles: 4554,
    flightCode: "KD447",
    type: "Business",
  },
  {
    from: "CDG",
    to: "LHR",
    miles: 7142,
    flightCode: "PA028",
    type: "Business",
  },
  {
    from: "CDG",
    to: "NRT",
    miles: 7498,
    flightCode: "SS635",
    type: "Business",
  },
  { from: "CDG", to: "SYD", miles: 9769, flightCode: "MG642", type: "Economy" },
  { from: "CDG", to: "DXB", miles: 7624, flightCode: "IM807", type: "Economy" },
  { from: "CDG", to: "SIN", miles: 8855, flightCode: "ZQ841", type: "Economy" },
  {
    from: "CDG",
    to: "FRA",
    miles: 6968,
    flightCode: "GE605",
    type: "Business",
  },
  { from: "CDG", to: "AMS", miles: 5368, flightCode: "MV629", type: "Economy" },

  // NRT routes
  {
    from: "NRT",
    to: "JFK",
    miles: 7249,
    flightCode: "UE315",
    type: "Business",
  },
  {
    from: "NRT",
    to: "LAX",
    miles: 5750,
    flightCode: "PI176",
    type: "Business",
  },
  { from: "NRT", to: "LHR", miles: 2666, flightCode: "PQ683", type: "Economy" },
  { from: "NRT", to: "CDG", miles: 9226, flightCode: "KG735", type: "Economy" },
  { from: "NRT", to: "SYD", miles: 968, flightCode: "CX741", type: "Business" },
  {
    from: "NRT",
    to: "DXB",
    miles: 1265,
    flightCode: "IN985",
    type: "Business",
  },
  {
    from: "NRT",
    to: "SIN",
    miles: 4502,
    flightCode: "BI386",
    type: "Business",
  },
  { from: "NRT", to: "FRA", miles: 8937, flightCode: "KZ116", type: "Economy" },
  { from: "NRT", to: "AMS", miles: 8823, flightCode: "YY818", type: "Economy" },

  // SYD routes
  {
    from: "SYD",
    to: "JFK",
    miles: 6497,
    flightCode: "WC088",
    type: "Business",
  },
  { from: "SYD", to: "LAX", miles: 8377, flightCode: "SP636", type: "Economy" },
  { from: "SYD", to: "LHR", miles: 7143, flightCode: "SA708", type: "Economy" },
  {
    from: "SYD",
    to: "CDG",
    miles: 6095,
    flightCode: "IL499",
    type: "Business",
  },
  { from: "SYD", to: "NRT", miles: 1231, flightCode: "VX252", type: "Economy" },
  {
    from: "SYD",
    to: "DXB",
    miles: 5609,
    flightCode: "TY055",
    type: "Business",
  },
  { from: "SYD", to: "SIN", miles: 1365, flightCode: "HD568", type: "Economy" },
  {
    from: "SYD",
    to: "FRA",
    miles: 8836,
    flightCode: "QZ482",
    type: "Business",
  },
  {
    from: "SYD",
    to: "AMS",
    miles: 4858,
    flightCode: "OJ906",
    type: "Business",
  },

  // DXB routes
  {
    from: "DXB",
    to: "JFK",
    miles: 3757,
    flightCode: "OQ355",
    type: "Business",
  },
  { from: "DXB", to: "LAX", miles: 5724, flightCode: "IF824", type: "Economy" },
  {
    from: "DXB",
    to: "LHR",
    miles: 5026,
    flightCode: "UE369",
    type: "Business",
  },
  { from: "DXB", to: "CDG", miles: 761, flightCode: "GQ256", type: "Economy" },
  {
    from: "DXB",
    to: "NRT",
    miles: 1073,
    flightCode: "WQ409",
    type: "Business",
  },
  { from: "DXB", to: "SYD", miles: 6404, flightCode: "VI975", type: "Economy" },
  {
    from: "DXB",
    to: "SIN",
    miles: 9206,
    flightCode: "HT600",
    type: "Business",
  },
  {
    from: "DXB",
    to: "FRA",
    miles: 1177,
    flightCode: "DG286",
    type: "Business",
  },
  { from: "DXB", to: "AMS", miles: 9698, flightCode: "UP134", type: "Economy" },

  // SIN routes
  {
    from: "SIN",
    to: "JFK",
    miles: 4335,
    flightCode: "TR493",
    type: "Business",
  },
  { from: "SIN", to: "LAX", miles: 580, flightCode: "PC127", type: "Business" },
  {
    from: "SIN",
    to: "LHR",
    miles: 8538,
    flightCode: "HS660",
    type: "Business",
  },
  { from: "SIN", to: "CDG", miles: 9278, flightCode: "EP901", type: "Economy" },
  { from: "SIN", to: "NRT", miles: 1371, flightCode: "UT674", type: "Economy" },
  {
    from: "SIN",
    to: "SYD",
    miles: 6238,
    flightCode: "TY011",
    type: "Business",
  },
  {
    from: "SIN",
    to: "DXB",
    miles: 8548,
    flightCode: "DJ658",
    type: "Business",
  },
  { from: "SIN", to: "FRA", miles: 5975, flightCode: "NN678", type: "Economy" },
  {
    from: "SIN",
    to: "AMS",
    miles: 9913,
    flightCode: "DH004",
    type: "Business",
  },

  // FRA routes
  {
    from: "FRA",
    to: "JFK",
    miles: 2027,
    flightCode: "NI682",
    type: "Business",
  },
  { from: "FRA", to: "LAX", miles: 2644, flightCode: "MD844", type: "Economy" },
  {
    from: "FRA",
    to: "LHR",
    miles: 2121,
    flightCode: "CB373",
    type: "Business",
  },
  { from: "FRA", to: "CDG", miles: 735, flightCode: "CX002", type: "Economy" },
  {
    from: "FRA",
    to: "NRT",
    miles: 3856,
    flightCode: "KH997",
    type: "Business",
  },
  {
    from: "FRA",
    to: "SYD",
    miles: 7659,
    flightCode: "NV784",
    type: "Business",
  },
  {
    from: "FRA",
    to: "DXB",
    miles: 6539,
    flightCode: "MS994",
    type: "Business",
  },
  { from: "FRA", to: "SIN", miles: 7119, flightCode: "EY301", type: "Economy" },
  {
    from: "FRA",
    to: "AMS",
    miles: 5743,
    flightCode: "XQ099",
    type: "Business",
  },

  // AMS routes
  { from: "AMS", to: "JFK", miles: 7606, flightCode: "HA207", type: "Economy" },
  { from: "AMS", to: "LAX", miles: 4869, flightCode: "LS798", type: "Economy" },
  { from: "AMS", to: "LHR", miles: 4680, flightCode: "GC909", type: "Economy" },
  { from: "AMS", to: "CDG", miles: 8787, flightCode: "QR942", type: "Economy" },
  {
    from: "AMS",
    to: "NRT",
    miles: 5043,
    flightCode: "MM692",
    type: "Business",
  },
  { from: "AMS", to: "SYD", miles: 2845, flightCode: "YY686", type: "Economy" },
  {
    from: "AMS",
    to: "DXB",
    miles: 2548,
    flightCode: "ZV244",
    type: "Business",
  },
  {
    from: "AMS",
    to: "SIN",
    miles: 4467,
    flightCode: "MW197",
    type: "Business",
  },
  {
    from: "AMS",
    to: "FRA",
    miles: 5603,
    flightCode: "RX303",
    type: "Business",
  },
];

// Flight lookup by flight code
export const FLIGHTS_BY_CODE = new Map<string, FlightRoute>();
FLIGHT_DATA.forEach((flight) => {
  FLIGHTS_BY_CODE.set(flight.flightCode, flight);
});

// Flight lookup by route
export const FLIGHTS_BY_ROUTE = new Map<string, FlightRoute>();
FLIGHT_DATA.forEach((flight) => {
  const routeKey = `${flight.from}-${flight.to}`;
  FLIGHTS_BY_ROUTE.set(routeKey, flight);
});

// Points calculation logic
export function calculatePoints(flightCode: string): {
  basePoints: number;
  bonusPoints: number;
  totalPoints: number;
  flight: FlightRoute | null;
} {
  const flight = FLIGHTS_BY_CODE.get(flightCode);

  if (!flight) {
    return {
      basePoints: 0,
      bonusPoints: 0,
      totalPoints: 0,
      flight: null,
    };
  }

  // Base points = miles flown
  const basePoints = flight.miles;

  // Bonus points calculation
  let bonusPoints = 0;

  if (flight.type === "Business") {
    // Business class gets 50% bonus
    bonusPoints = Math.floor(basePoints * 0.5);
  }

  // Additional bonus for long-haul flights (>5000 miles)
  if (flight.miles > 5000) {
    bonusPoints += Math.floor(basePoints * 0.25);
  }

  const totalPoints = basePoints + bonusPoints;

  return {
    basePoints,
    bonusPoints,
    totalPoints,
    flight,
  };
}

// Validate flight information
export function validateFlight(
  flightCode: string,
  departureAirport: string,
  arrivalAirport: string
): {
  isValid: boolean;
  flight: FlightRoute | null;
  error?: string;
} {
  const flight = FLIGHTS_BY_CODE.get(flightCode);

  if (!flight) {
    return {
      isValid: false,
      flight: null,
      error: `Flight ${flightCode} not found in our system`,
    };
  }

  if (flight.from !== departureAirport || flight.to !== arrivalAirport) {
    return {
      isValid: false,
      flight,
      error: `Flight ${flightCode} operates ${flight.from} → ${flight.to}, not ${departureAirport} → ${arrivalAirport}`,
    };
  }

  return {
    isValid: true,
    flight,
  };
}

// Get available airports
export function getAvailableAirports(): string[] {
  const airports = new Set<string>();
  FLIGHT_DATA.forEach((flight) => {
    airports.add(flight.from);
    airports.add(flight.to);
  });
  return Array.from(airports).sort();
}

// Get flights from an airport
export function getFlightsFromAirport(airport: string): FlightRoute[] {
  return FLIGHT_DATA.filter((flight) => flight.from === airport);
}

// Get flights to an airport
export function getFlightsToAirport(airport: string): FlightRoute[] {
  return FLIGHT_DATA.filter((flight) => flight.to === airport);
}
