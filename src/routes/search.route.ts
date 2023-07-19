import { Router } from 'express';
import SearchController from '@controllers/search.controller'; 
import CommonController from '@controllers/common.controller'; 
import { Routes } from '@interfaces/routes.interface';
import authMiddleware from '@middlewares/auth.middleware'; 
import validationMiddleware from '@middlewares/validation.middleware'; 
class SearchRoute implements Routes {
  public path = '/';
  public router = Router();
  public searchController = new SearchController();
  public commonController = new CommonController();

  constructor() {
    this.initializeRoutes();
  } 
  private initializeRoutes() {
      this.router.post(`${this.path}prepareFlights`, this.searchController.prepareFlights); 
      this.router.post(`${this.path}searchFlight`, this.searchController.searchFlight); 
      
      this.router.post(`${this.path}prepareExchangeFlights`, this.searchController.prepareExchangeFlights); 
      this.router.post(`${this.path}searchExchangeFlight`, this.searchController.searchExchangeFlight); 

      this.router.get(`${this.path}getOrigin`, this.commonController.getLocation);
      this.router.post(`${this.path}getDestinations`, this.commonController.getDestination);
      this.router.post(`${this.path}getEligibleOriginDestinations`, this.commonController.getEligibleOriginDestinations);
      this.router.get(`${this.path}compareFairFamily`, this.searchController.compareFairFamily);
     
      
    }
} 
export default SearchRoute;
