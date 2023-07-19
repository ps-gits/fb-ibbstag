import { NextFunction, Request, Response } from 'express';
import { SearchDto,prepareFlightsDto } from '@dtos/search.dto';
import { Search } from '@interfaces/search.interface';
import searchService from '@services/search.service';

class SearchController {
  public SearchService = new searchService();

  public searchFlight = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const searchData: SearchDto = req.body;
      const SearchFlightData: Search = await this.SearchService.searchFlight(searchData);
      res.status(200).json({ data: SearchFlightData, message: ' Search Result',status : 200 });
    } catch (error) {
      next(error);
    }
  }; 
  public prepareFlights = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const searchData: prepareFlightsDto = req.body;
      const prepareFlightData: Search = await this.SearchService.prepareFlights(searchData);
      res.status(200).json({ data: prepareFlightData, message: ' Search Result',status : 200 });
    } catch (error) {
      next(error);
    }
  }; 

  public searchExchangeFlight = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const searchData: SearchDto = req.body;
      const SearchFlightData: Search = await this.SearchService.searchExchangeFlight(searchData);
      res.status(200).json({ data: SearchFlightData, message: ' Search Result',status : 200 });
    } catch (error) {
      next(error);
    }
  }; 
  public prepareExchangeFlights = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const searchData: prepareFlightsDto = req.body;
      const prepareFlightData: Search = await this.SearchService.prepareExchangeFlights(searchData);
      res.status(200).json({ data: prepareFlightData, message: ' Search Result',status : 200 });
    } catch (error) {
      next(error);
    }
  }; 

  public compareFairFamily = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const SetAirLineDetailsData: Search = await this.SearchService.compareFairFamily();
      res.status(200).json({ data: SetAirLineDetailsData, message: 'AirLine Details' });
    } catch (error) {
      next(error);
    }
  };
}
export default SearchController;
