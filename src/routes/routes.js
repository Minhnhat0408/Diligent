import { HeaderOnly } from '../layouts';
import routes from '../config/routes';

// Page
import Home from '~/pages/Home';
import NotFounded from '~/pages/NotFounded';
import Setting from '~/pages/Setting';
import Chat from '~/pages/Chat';
import Story from '~/pages/Story';
import Profile from '~/pages/Profile';
import Friend from '~/pages/Friend';


// Router khong can dang nhap cung xem duoc
const publicRoutes = [
  { path: routes.home, component: Home },
  
  { path: routes.setting, component: Setting },
  { path: routes.chat, component: Chat},
  { path: routes.story, component: Story },
  { path: '/*', component: NotFounded, layout: null },
  
];

// Router dang nhap moi xem duoc
const privateRoutes = [
  { path: routes.profile, component: Profile },
  { path: routes.friend, component: Friend },
];

export { publicRoutes, privateRoutes };
