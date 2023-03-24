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
import UpdateProfile from '~/pages/UpdateProfile/UpdateProfile';
import HeadSideLayout from '~/layouts/HeadSideLayout';

// Router khong can dang nhap cung xem duoc
const publicRoutes = [
    { path: routes.home, component: Home },
    { path: routes.login, component: Login, layout: null },
    { path: routes.setting, component: Setting },
    { path: routes.story, component: Story },
    { path: routes.flashcard,component:FlashCard,layout: HeaderOnly},
    { path: routes.profile, component: Profile, layout:HeadSideLayout },
    { path: '/*', component: NotFounded, layout: null },
];

// Router dang nhap moi xem duoc //TO DO
const privateRoutes = [
    { path: routes.updateInfo, component: UpdateProfile, layout: null },
    { path: routes.friend, component: Friend },
    { path: routes.chat, component: Chat },
];

export { publicRoutes, privateRoutes };
