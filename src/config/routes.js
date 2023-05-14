const routes = {
    home: '/',
    profile: '/user/:id',
    postpage: '/post/:id',
    postpagespecific: '/post/:id/:num',
    post: '/post/', // shortcut too
    chat: '/chat/:roomId',
    chatroom: '/chat/', //shortcut
    friend: '/friend',
    setting: '/setting',
    storyPage: '/short/:id',
    story:'/short/',//shortcut
    login: '/login',
    user: '/user/', // shortcut for navigate only
    updateInfo: '/updateinfor',
    flashcard: '/flashcard/',
    flashcardDeck:'/flashcard/:id',
    userUpdate: '/user/updateinfor',
    createStory: '/createshort',
    saveposts: '/saves/:id',
    saves: '/saves/', // shortcut for save
    notFound: '/notfound',
    documents: '/documents',
};

export default routes;
