import { faFlag, faUserXmark } from "@fortawesome/free-solid-svg-icons";
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
    { icon: <FontAwesomeIcon icon={faUserXmark} />, title: 'Unfriend', type: 'unfriend' },
];