import { Router } from 'express';
import CronController from '@controllers/cron.controller';
import { Routes } from '@interfaces/routes.interface';
import validationMiddleware from '@middlewares/validation.middleware';

class CronRoute implements Routes {
  public path = '/cron';
  public router = Router();
  public cronController = new CronController();

  constructor() {
    this.initializeRoutes();
  } 
  private initializeRoutes() {
      this.router.get(`${this.path}/location`, this.cronController.setLocation);
      this.router.get(`${this.path}/setEligibleOriginDestinations`, this.cronController.setEligibleOriginDestinations);
      this.router.get(`${this.path}/setAllowedOriginDestinations`, this.cronController.setAllowedOriginDestinations);
      this.router.get(`${this.path}/setAirLineDetails`, this.cronController.setAirLineDetails);
   
    }
} 
export default CronRoute;
