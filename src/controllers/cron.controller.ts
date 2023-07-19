import { NextFunction, Request, Response } from 'express'; 
import { Location,EligibleOriginDestinations,AllowedOriginDestinations,AirLineDetails} from '@interfaces/cron.interface';
import cronService from '@services/cron.service';

class CronController {
  public CronService = new cronService();

  public setLocation = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const SetLocationData: Location[] = await this.CronService.SetLocation();
      res.status(200).json({ data: SetLocationData, message: 'All Loacation' });
    } catch (error) {
      next(error);
    }
  };

  public setEligibleOriginDestinations = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const SetEligOriDestData: EligibleOriginDestinations[] = await this.CronService.SetEligibleOriginDestinations();
      res.status(200).json({ data: SetEligOriDestData, message: 'All Eligible Origin Destinations' });
    } catch (error) {
      next(error);
    }
  };
  public setAllowedOriginDestinations = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const SetAllowOriDestData: AllowedOriginDestinations[] = await this.CronService.SetAllowedOriginDestinations();
      res.status(200).json({ data: SetAllowOriDestData, message: 'Allowed Origin Destinations' });
    } catch (error) {
      next(error);
    }
  };
  public setAirLineDetails = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const SetAirLineDetailsData: AirLineDetails[] = await this.CronService.SetAirLineDetails();
      res.status(200).json({ data: SetAirLineDetailsData, message: 'AirLine Details' });
    } catch (error) {
      next(error);
    }
  };
    
  
}
export default CronController;
