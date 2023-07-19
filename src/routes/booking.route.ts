import { Router } from 'express';
import BookingController from '@controllers/booking.controller'; 
import authMiddleware from '@middlewares/auth.middleware';
import { Routes } from '@interfaces/routes.interface';
import validationMiddleware from '@middlewares/validation.middleware'; 
import {CreateBookingDto,CreateBookingExchangeDto,ModifyBookingDto,SearchBookingDto,
    PrepareBookingModiDto,CreateTicketDto,LoadMCOTicketDto,
    SendTicketConfirmationDto,AddItineraryDto,PrepareAdditionalItineraryDto,
    CancelBookingDto,PrepareCancelBookingDto,paymentRequestDto,PaymentCheckDto
} from '@dtos/booking.dto';
class BookingRoute implements Routes {
  public path = '/';
  public router = Router(); 
  public bookingController = new BookingController();
  

  constructor() {
    this.initializeRoutes();
  } 
  private initializeRoutes() {
        this.router.post(`${this.path}createBooking`,validationMiddleware(CreateBookingDto, 'body'), this.bookingController.createBooking);
        this.router.post(`${this.path}loadBooking`, this.bookingController.loadBooking);
        this.router.post(`${this.path}prepareCheckin`, this.bookingController.prepareCheckin); 
        this.router.post(`${this.path}checkIn`, this.bookingController.checkIn); 
        this.router.post(`${this.path}unCheck`, this.bookingController.unCheck); 

        this.router.post(`${this.path}calendar`,authMiddleware, this.bookingController.calendar);
        this.router.post(`${this.path}modifyBooking`,validationMiddleware(ModifyBookingDto, 'body'), this.bookingController.modifyBooking);
        this.router.post(`${this.path}searchBooking`,authMiddleware,validationMiddleware(SearchBookingDto, 'body'), this.bookingController.searchBooking);
        this.router.post(`${this.path}prepareBookingModification`,validationMiddleware(PrepareBookingModiDto, 'body'), this.bookingController.prepareBookingModification);
        this.router.post(`${this.path}createTicket`,validationMiddleware(CreateTicketDto, 'body'), this.bookingController.createTicket);
        this.router.post(`${this.path}loadMCOTicket`,authMiddleware,validationMiddleware(LoadMCOTicketDto, 'body'), this.bookingController.loadMCOTicket);
        this.router.post(`${this.path}sendTicketConfirmation`,authMiddleware,validationMiddleware(SendTicketConfirmationDto, 'body'), this.bookingController.sendTicketConfirmation);
        this.router.post(`${this.path}addItinerary`,authMiddleware,validationMiddleware(AddItineraryDto, 'body'), this.bookingController.addItinerary);
        this.router.post(`${this.path}prepareAdditionalItinerary`,authMiddleware,validationMiddleware(PrepareAdditionalItineraryDto, 'body'), this.bookingController.prepareAdditionalItinerary);
        this.router.post(`${this.path}cancelBooking`,validationMiddleware(CancelBookingDto, 'body'), this.bookingController.cancelBooking);
        this.router.post(`${this.path}prepareCancelBooking`,validationMiddleware(PrepareCancelBookingDto, 'body'), this.bookingController.prepareCancelBooking);
        this.router.post(`${this.path}exchangeCreateBooking`,validationMiddleware(CreateBookingExchangeDto, 'body'), this.bookingController.exchangeCreateBooking);
        this.router.post(`${this.path}paymentRequest`,validationMiddleware(paymentRequestDto, 'body'), this.bookingController.paymentRequest);
        this.router.post(`${this.path}paymentCheck`,validationMiddleware(PaymentCheckDto, 'body'), this.bookingController.paymentCheck);
       
      }
} 
export default BookingRoute;
