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
import CreateStory  from '~/pages/CreateStory';
import SavePosts from '~/pages/SavePosts';
import PostPage from '~/pages/PostPage/PostPage';
import Documents from '~/pages/Documents';
import FlashCardPage from '~/pages/FlashcardPage/FlashCardPage';

// Router khong can dang nhap cung xem duoc
const publicRoutes = [
    { path: routes.home, component: Home },
    { path: routes.login, component: Login, layout: null },
    { path: routes.setting, component: Setting },
    { path: routes.storyPage, component: Story, layout: HeaderOnly },
    { path: routes.postpage,component:PostPage,layout:HeaderOnly},
    { path: routes.postpagespecific,component:PostPage,layout:HeaderOnly},
    { path: routes.profile, component: Profile, layout: HeadSideLayout },
    { path: routes.updateInfo, component: UpdateProfile, layout: null },
    { path: routes.flashcard, component: FlashCardPage, layout: HeaderOnly },   
    { path: routes.documents, component: Documents, layout: HeadSideLayout},
    { path: '/*', component: NotFounded, layout:HeaderOnly },
];

// Router dang nhap moi xem duoc //TO DO
const privateRoutes = [
    { path: routes.saveposts, component: SavePosts },
    { path: routes.flashcardDeck, component: FlashCard, layout: HeaderOnly },
    { path: routes.createStory, component: CreateStory, layout: HeaderOnly},
    { path: routes.friend, component: Friend }, 
    { path: routes.chat, component: Chat },
    { path: routes.userUpdate, component: UpdateProfile}
];

export { publicRoutes, privateRoutes };
