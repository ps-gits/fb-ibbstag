import { NextFunction, Request, Response } from 'express';
import { CreateUserDto,ForgotPasswordDto,UpdateUserDto} from '@dtos/users.dto';
import { User,CreateUser,UpdateUser,BookingHistory,ProfileData} from '@interfaces/users.interface';
import userService from '@services/users.service';
import { HttpException } from '@exceptions/HttpException';
class UsersController {
  public userService = new userService();
 
  public updateUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) throw new HttpException(400, `This account not found. Please Login again`);
      const userId: string = req.user;
      const userData: UpdateUserDto = req.body;
      const updateUserData: ProfileData = await this.userService.updateUser(userId, userData);

      res.status(200).json({ data: updateUserData, message: 'updated' });
    } catch (error) {
      next(error);
    }
  };

  public forgotPassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId: string = req.params.id;
      const userData: ForgotPasswordDto = req.body;
      const updateUserData = await this.userService.forgotPassword(userId, userData);
      res.status(200).json({ data: updateUserData, message: 'updated' });
    } catch (error) {
      next(error);
    }
  };

  public deleteUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId: string = req.params.id;
      const deleteUserData: User = await this.userService.deleteUser(userId);

      res.status(200).json({ data: deleteUserData, message: 'deleted' });
    } catch (error) {
      next(error);
    }
  };

  public bookingHistory = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) throw new HttpException(400, `This account not found. Please Login again`);
      const userId: string = req.user._id; 
      const BookingHistoryData: BookingHistory = await this.userService.bookingHistory(userId);
      res.status(200).json({ data: BookingHistoryData, message: 'History' });
    } catch (error) {
      next(error);
    }
  };

  public profileData = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) throw new HttpException(400, `This account not found. Please Login again`);
      const userId: string = req.user.Login; 
      const profileData: ProfileData = await this.userService.profileData(userId);

      res.status(200).json({ data: profileData, message: 'Profile Data' });
    } catch (error) {
      next(error);
    }
  };

  
}

export default UsersController;
