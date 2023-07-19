import {Destination,BagAllowance} from '@interfaces/search.interface';
 
// A common function to create a destination object
export function createDestination(
  orginDepartureDate: string,
  orginDepartureTime: string,
  originName: string,
  originCity: string,
  destinationCity: string,
  luxuryPickup: boolean,
  loungeAccess: boolean,
  bagAllowance: BagAllowance[],
  destinationName: string,
  destinationArrivalDate: string,
  destinationArrivalTime: string
): Destination {
  return {
    orginDepartureDate,
    orginDepartureTime,
    originName,
    originCity,
    destinationCity,
    luxuryPickup,
    loungeAccess,
    BagAllowances: bagAllowance,
    destinationName,
    destinationArrivalDate,
    destinationArrivalTime,
  };
}
 