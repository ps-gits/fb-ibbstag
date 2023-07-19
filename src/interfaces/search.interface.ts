export interface Search {
     
  }
  
 

// Define the interface for a destination object
export interface Destination {
  orginDepartureDate: string;
  orginDepartureTime: string;
  originName: string;
  originCity: string;
  destinationCity: string;
  luxuryPickup: boolean;
  loungeAccess: boolean;
  BagAllowances: BagAllowance[];
  destinationName: string;
  destinationArrivalDate: string;
  destinationArrivalTime: string;
}

// Define the interface for a BagAllowance object
export interface BagAllowance {
  Quantity: number;
  WeightMeasureQualifier: string;
  Weight: number;
}
 