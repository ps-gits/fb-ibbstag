import { NextFunction, Request, Response } from 'express';
import { Location,EligibleOriginDestinations,Country} from '@interfaces/cron.interface';
import CommonService from '@services/common.service'; 
import { OriginDestinationDto,OriginDto} from '@dtos/search.dto';

class CommonController {
  public CommonService = new CommonService();

  public getLocation = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const LocationData: Location[] = await this.CommonService.getLocation();
      res.status(200).json({ data: LocationData, message: 'Get All Loacation' });
    } catch (error) {
      next(error);
    }
  };

  public getDestination = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const OriginData: OriginDto = req.body;
      const LocationData: Location[] = await this.CommonService.getDestination(OriginData);
      res.status(200).json({ data: LocationData, message: 'Get All Destinations' });
    } catch (error) {
      next(error);
    }
  };

  
  public getEligibleOriginDestinations = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const OriginDestinationData: OriginDestinationDto = req.body;
      const eligibleLocationData: EligibleOriginDestinations[] = await this.CommonService.getEligibleOriginDestinations(OriginDestinationData);
      
      const modifiedData = eligibleLocationData.map((item) => {
        if (item.Date !== null) {
          //const dateInMs = parseInt(item.TargetDate.substring(6, 19));
          item.TargetDate = item.Date//new Date(dateInMs+18000000).toISOString();
          
        }
        return item;
      });
      res.status(200).json({ data: modifiedData, message: 'Get All Loacation' });
    } catch (error) {
      next(error);
    }
  };

  public getCountry = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const CountryData: Country[] = await this.CommonService.getCountry();
      res.status(200).json({ data: CountryData, message: 'Get All Country' });
    } catch (error) {
      next(error);
    }
  };
  
}
export default CommonController;
