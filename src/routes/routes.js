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
import Login from '~/pages/Login';
import FlashCard from '~/pages/FlashCard';

// Router khong can dang nhap cung xem duoc
const publicRoutes = [
    { path: routes.home, component: Home },
    { path: routes.login, component: Login, layout: null },
    { path: routes.setting, component: Setting },
    { path: routes.story, component: Story },
    { path: routes.flashcard,component:FlashCard,layout: HeaderOnly},
    { path: '/*', component: NotFounded, layout: null },
];

// Router dang nhap moi xem duoc
const privateRoutes = [
    { path: routes.profile, component: Profile },
    { path: routes.friend, component: Friend },
    { path: routes.chat, component: Chat },
];

export { publicRoutes, privateRoutes };
