import App from '@/app';
import AuthRoute from '@routes/auth.route';
import IndexRoute from '@routes/index.route';
import UsersRoute from '@routes/users.route'; 
import CronRoute from '@routes/cron.route'; 
import SearchRoute from '@routes/search.route';  
import BookingRoute from '@routes/booking.route';
import validateEnv from '@utils/validateEnv';

validateEnv();

const app = new App([new IndexRoute(), new UsersRoute(), new CronRoute(),new SearchRoute(),new BookingRoute(), new AuthRoute()]);

app.listen();
