import { HeaderOnly } from '../layouts';
import routes from '../config/routes';

// Page
import Home from '~/pages/Home';
import NotFounded from '~/pages/NotFounded';


// Router khong can dang nhap cung xem duoc
const publicRoutes = [
  { path: routes.home, component: Home },
  { path: '/*', component: NotFounded, layout: null },
  
];

// Router dang nhap moi xem duoc
const privateRoutes = [];

export { publicRoutes, privateRoutes };
