import { faEyeSlash, faFilePen, faFlag, faLock, faSave, faTrash, faUserXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export const CATEGORY_OPTIONS = [
    {
    
        title: 'Japanese',
        children: {
            title: 'Japanese',
            data: [
                {
                    title: 'Vocabulary',
                },
                {
                    title: 'Grammar',
                },
                {
                    title: 'Kanji',
                },
            ],
        },
        
    },
    {
    
        title: 'English',
        children: {
            title: 'English',
            data: [
                {
                    title: 'Vocabulary',
                },
                {
                    title: 'Grammar',
                },
                {
                    title: 'Pronunciation',
                },
            ],
        },
        
    },
    {
    
        title: 'Korean',
        children: {
            title: 'Korean',
            data: [
                {
                    title: 'Vocabulary',
                },
                {
                    title: 'Grammar',
                },
            ],
        },
        
    },
    {
    
        title: 'Math',
        children: {
            title: 'Math',
            data: [
                {
                    title: 'Đại số',
                },
                {
                    title: 'Hình Học',
                },
                {
                    title: 'Kinh tế',
                },
                {
                    title: 'Tối ưu',
                },
            ],
        },
        
    },
]
export const USER_POST_OPTIONS = [
    {
        icon:<FontAwesomeIcon icon={faFilePen} />,
        title: 'Update',
        type: 'update' 
    },
    {
        icon:<FontAwesomeIcon icon={faTrash} />,
        title: 'Delete',
        type: 'delete' 
    },
    {
        icon:<FontAwesomeIcon icon={faSave} />,
        title: 'Save',
        type: 'save' 
    },

]
export const POST_OPTIONS = [
    {
        icon:<FontAwesomeIcon icon={faSave} />,
        title: 'Save',
        type: 'save' 
    },
    {
        icon: <FontAwesomeIcon icon={faFlag} />,
        title: 'Report',
        children: {
            title: 'Report',
            data: [
                {
                    type: 'report',
                    title: 'Fake account',
                    children: {
                        title: 'Success',
                        data: [
                            {
                                title: 'Not Working',
                            },
                        ],
                    },
                },
                {
                    type: 'report',
                    title: 'Harassment/Bully',
                    children: {
                        title: 'Success',
                        data: [
                            {
                                title: 'Not Working',
                            },
                        ],
                    },
                },
                {
                    type: 'report',
                    title: 'Inappropriate post',
                    children: {
                        title: 'Success',
                        data: [
                            {
                                title: 'Not Working',
                            },
                        ],
                    },
                },
            ],
        },
    },
    {
        icon:<FontAwesomeIcon icon={faEyeSlash} />,
        title: 'Hide',
        type: 'hide' 
    },
]

export const PROFILE_FRIEND_OPTIONS =[
    {
        icon: <FontAwesomeIcon icon={faFlag} />,
        title: 'Report',
        children: {
            title: 'Report',
            data: [
                {
                    type: 'report',
                    title: 'Fake account',
                    children: {
                        title: 'Success',
                        data: [
                            {
                                title: 'Not Working',
                            },
                        ],
                    },
                },
                {
                    type: 'report',
                    title: 'Harassment/Bully',
                    children: {
                        title: 'Success',
                        data: [
                            {
                                title: 'Not Working',
                            },
                        ],
                    },
                },
                {
                    type: 'report',
                    title: 'Inappropriate post',
                    children: {
                        title: 'Success',
                        data: [
                            {
                                title: 'Not Working',
                            },
                        ],
                    },
                },
            ],
        },
    },
    { icon: <FontAwesomeIcon icon={faUserXmark} />, title: 'Unfriend', type: 'unfriend' },
]

export const PROFILE_OPTIONS = [
    // {
    //     icon: <FontAwesomeIcon icon={faEarthAsia} />,
    //     title: 'English',
    //     children: {
    //         title: 'Language',
    //         data: listLanguage,
    //     },
    // },
    {
        icon: <FontAwesomeIcon icon={faFlag} />,
        title: 'Report',
        children: {
            title: 'Report',
            data: [
                {
                    type: 'report',
                    title: 'Fake account',
                    children: {
                        title: 'Success',
                        data: [
                            {
                                title: 'Not Working',
                            },
                        ],
                    },
                },
                {
                    type: 'report',
                    title: 'Harassment/Bully',
                    children: {
                        title: 'Success',
                        data: [
                            {
                                title: 'Not Working',
                            },
                        ],
                    },
                },
                {
                    type: 'report',
                    title: 'Inappropriate post',
                    children: {
                        title: 'Success',
                        data: [
                            {
                                title: 'Not Working',
                            },
                        ],
                    },
                },
            ],
        },
    },
   
];

export const regex = /@[^)]+\)/g;//extract the tag part
export const getIdInMentions = /\([^(]+\w+/g;//extract id part of the tag part EX @Doan Ngoc Anh(kfjalksdlf243)