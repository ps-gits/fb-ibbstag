import { Router } from 'express';
import UsersController from '@controllers/users.controller';
import { CreateUserDto,ForgotPasswordDto } from '@dtos/users.dto';
import { Routes } from '@interfaces/routes.interface';
import validationMiddleware from '@middlewares/validation.middleware';

class UsersRoute implements Routes {
  public path = '/users';
  public router = Router();
  public usersController = new UsersController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.put(`${this.path}/:id`,this.usersController.updateUser);
    this.router.post(`${this.path}/forgotPassword`, validationMiddleware(ForgotPasswordDto, 'body'),this.usersController.forgotPassword);
    this.router.delete(`${this.path}/:id`, this.usersController.deleteUser);
  }
}

export default UsersRoute;
