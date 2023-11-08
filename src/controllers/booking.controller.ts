import { NextFunction, Request, Response } from 'express';
import { CreateBookingDto,CreateBookingExchangeDto,loadBookingDto,calendarDto,ModifyBookingDto,
  SearchBookingDto,PrepareBookingModiDto,
  CreateTicketDto,LoadMCOTicketDto,SendTicketConfirmationDto,
  AddItineraryDto,PrepareAdditionalItineraryDto,CancelBookingDto,PrepareCancelBookingDto,paymentRequestDto
  ,PaymentCheckDto,HeadersDto,cabsBookingDto} from '@dtos/booking.dto';
import { Booking,LoadBooking,Calendar,Payment} from '@interfaces/booking.interface';
import bookingService from '@services/booking.service';
import { Search } from '@interfaces/search.interface';

class BookingController {
  public BookingService = new bookingService();

  public createBooking = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const boookingData: CreateBookingDto = req.body;
      const CreateBookingData: Booking = await this.BookingService.createBooking(boookingData);
      res.status(200).json({ data: CreateBookingData, message: 'Booking Result',status : 200 });
    } catch (error) {
      next(error);
    }
  };
  public modifyBooking = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const boookingData: ModifyBookingDto = req.body;
      const CreateBookingData: Booking = await this.BookingService.modifyBooking(boookingData);
      res.status(200).json({ data: CreateBookingData, message: 'Booking Result',status : 200 });
    } catch (error) {
      next(error);
    }
  };
  public searchBooking = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const searchboookingData: SearchBookingDto = req.body;
      const SearchBookingData: Booking = await this.BookingService.searchBooking(searchboookingData);
      res.status(200).json({ data: SearchBookingData, message: 'Search Booking Result',status : 200 });
    } catch (error) {
      next(error);
    }
  };
  public prepareBookingModification = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const prepareBookingModiData: PrepareBookingModiDto = req.body;
      const prepareBookingData: Search = await this.BookingService.prepareBookingModification(prepareBookingModiData);
      res.status(200).json({ data: prepareBookingData, message: 'Propare Booking Result',status : 200 });
    } catch (error) {
      next(error);
    }
  };
  public createTicket = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const createTicket: CreateTicketDto = req.body;
      const createTicketData: Booking = await this.BookingService.createTicket(createTicket);
      res.status(200).json({ data: createTicketData, message: 'Create Ticket Result',status : 200 });
    } catch (error) {
      next(error);
    }
  };

  public loadMCOTicket = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const loadMCOTicket: LoadMCOTicketDto = req.body;
      const loadMCOTicketData: Booking = await this.BookingService.loadMCOTicket(loadMCOTicket);
      res.status(200).json({ data: loadMCOTicketData, message: 'Load MCO Ticket Result',status : 200 });
    } catch (error) {
      next(error);
    }
  };
  
  public sendTicketConfirmation = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const sendTicketConfirmation: SendTicketConfirmationDto = req.body;
      const sendTicketConfirmationData: Booking = await this.BookingService.sendTicketConfirmation(sendTicketConfirmation);
      res.status(200).json({ data: sendTicketConfirmationData, message: 'Load MCO Ticket Result',status : 200 });
    } catch (error) {
      next(error);
    }
  };

  public addItinerary = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const addItinerary: AddItineraryDto = req.body;
      const addItineraryData: Booking = await this.BookingService.addItinerary(addItinerary);
      res.status(200).json({ data: addItineraryData, message: 'Add Itinerary Result',status : 200 });
    } catch (error) {
      next(error);
    }
  };
  public prepareAdditionalItinerary = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const parepareAdditionalItinerary: PrepareAdditionalItineraryDto = req.body;
      const parepareAdditionalItineraryData: Booking = await this.BookingService.prepareAdditionalItinerary(parepareAdditionalItinerary);
      res.status(200).json({ data: parepareAdditionalItineraryData, message: 'parepare Additional ItineraryData Result',status : 200 });
    } catch (error) {
      next(error);
    }
  };
  
  public cancelBooking = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const cancelBooking: CancelBookingDto = req.body;
      const cancelBookingData: Booking = await this.BookingService.cancelBooking(cancelBooking);
      res.status(200).json({ data: cancelBookingData, message: 'Cancel parepare Additional ItineraryData Result',status : 200 });
    } catch (error) {
      next(error);
    }
  }; 
  
  public prepareCancelBooking = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const prepareCencalBooking: PrepareCancelBookingDto = req.body;
      const prepareCencalBookingData: Booking = await this.BookingService.prepareCancelBooking(prepareCencalBooking);
      res.status(200).json({ data: prepareCencalBookingData, message: 'Cancel parepare Additional ItineraryData Result',status : 200 });
    } catch (error) {
      next(error);
    }
  }; 

  
  public loadBooking = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const loadBoookingData: loadBookingDto = req.body;
      const Data: LoadBooking = await this.BookingService.loadBooking(loadBoookingData);
      res.status(200).json({ data: Data, message: 'Load Booking Result',status : 200 });
    } catch (error) {
      next(error);
    }
  }; 
  public calendar = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const calendarData: calendarDto = req.body;
      const Data: Calendar = await this.BookingService.calendar(calendarData);
      res.status(200).json({ data: Data, message: 'Load Booking Result',status : 200 });
    } catch (error) {
      next(error);
    }
  }; 
  
  public exchangeCreateBooking = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const boookingData: CreateBookingExchangeDto = req.body;
      const CreateBookingData: Booking = await this.BookingService.exchangeCreateBooking(boookingData);
      res.status(200).json({ data: CreateBookingData, message: 'Booking Result',status : 200 });
    } catch (error) {
      next(error);
    }
  };
  
  public prepareCheckin = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const loadBoookingData: loadBookingDto = req.body;
      const Data: LoadBooking = await this.BookingService.prepareCheckin(loadBoookingData);
      res.status(200).json({ data: Data, message: 'Prepare Checkin',status : 200 });
    } catch (error) {
      next(error);
    }
  };
  
  public checkIn = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const loadBoookingData: loadBookingDto = req.body;
      const Data: LoadBooking = await this.BookingService.checkIn(loadBoookingData);
      res.status(200).json({ data: Data, message: 'Checkin',status : 200 });
    } catch (error) {
      next(error);
    }
  };

  public unCheck = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const loadBoookingData: loadBookingDto = req.body;
      const Data: LoadBooking = await this.BookingService.unCheck(loadBoookingData);
      res.status(200).json({ data: Data, message: 'UnCheck',status : 200 });
    } catch (error) {
      next(error);
    }
  };
  
  public paymentRequest = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const PaymentRequestData: paymentRequestDto = req.body;
      const CreateBookingData: Payment = await this.BookingService.paymentRequest(PaymentRequestData);
      res.status(200).json({ data: CreateBookingData, message: 'Payment Result',status : 200 });
    } catch (error) {
      next(error);
    }    
  }

  public paymentCheck = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const paymentCheckData: PaymentCheckDto = req.body;
      const CreateBookingData: Payment = await this.BookingService.paymentCheck(paymentCheckData);
      res.status(200).json({ data: CreateBookingData, message: 'Payment Result',status : 200 });
    } catch (error) {
      next(error);
    }    
  }

  public cabsBooking = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const cabsBookingData: cabsBookingDto = req.body;
      const CreateCabsData: Payment = await this.BookingService.cabsBooking(cabsBookingData);
      res.status(200).json({ data: CreateCabsData, message: 'Cabs Booking Result',status : 200 });
    } catch (error) {
      next(error);
    }    
  }

  public updateCabs = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const CabsbookData: CabsbookDto = req.body;
      const CreateCabsBookData: Payment = await this.BookingService.updateCabs(CabsbookData);
      res.status(200).json({ data: CreateCabsBookData, message: 'Cabs Result',status : 200 });
    } catch (error) {
      next(error);
    }    
  }
  

  
}
export default BookingController;
