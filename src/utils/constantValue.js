import {
    faBan,
    faEyeSlash,
    faFilePen,
    faFlag,
    faLock,
    faSave,
    faTrash,
    faUserXmark,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const currentDate = new Date();
export const adminId = 'rFB2DyO43uTTjubLtoi8BhPQcNu1';
export const report = {
    icon: <FontAwesomeIcon icon={faFlag} />,
    title: 'Report',
    children: {
        title: 'Report',
        data: [
            {
                type: 'report',
                title: 'Fake account.',
            },
            {
                type: 'report',
                title: 'Harassment/Bully.',
            },
            {
                type: 'report',
                title: 'Inappropriate post.',
            },
        ],
    },
};
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
];
export const USER_POST_OPTIONS = [
    {
        icon: <FontAwesomeIcon icon={faFilePen} />,
        title: 'Update',
        type: 'update',
    },
    {
        icon: <FontAwesomeIcon icon={faTrash} />,
        title: 'Delete',
        type: 'delete',
    },
    {
        icon: <FontAwesomeIcon icon={faSave} />,
        title: 'Save',
        type: 'save',
    },
];
export const ADMIN_POST_OPTIONS = [
    {
        icon: <FontAwesomeIcon icon={faBan} />,
        title: 'Disable',
        type: 'disable',
    },
    {
        icon: <FontAwesomeIcon icon={faTrash} />,
        title: 'Delete',
        type: 'delete',
    },
    {
        icon: <FontAwesomeIcon icon={faSave} />,
        title: 'Save',
        type: 'save',
    },
    {
        icon: <FontAwesomeIcon icon={faEyeSlash} />,
        title: 'Hide',
        type: 'hide',
    },
];
export const POST_OPTIONS = [
    {
        icon: <FontAwesomeIcon icon={faSave} />,
        title: 'Save',
        type: 'save',
    },
    {
        icon: <FontAwesomeIcon icon={faEyeSlash} />,
        title: 'Hide',
        type: 'hide',
    },
    report,
];

export const PROFILE_FRIEND_OPTIONS = [
    report,
    { icon: <FontAwesomeIcon icon={faUserXmark} />, title: 'Unfriend', type: 'unfriend' },
];

export const PROFILE_ADMIN_OPTIONS = [
    { icon: <FontAwesomeIcon icon={faUserXmark} />, title: 'Unfriend', type: 'unfriend' },
    {
        icon: <FontAwesomeIcon icon={faBan} />,
        title: 'Ban',
        children: {
            title: 'Duration',
            data: [
                {
                    type: 'ban',
                    title: '1 day',
                    duration: new Date(currentDate.setDate(currentDate.getDate() + 1)),
                },
                {
                    type: 'ban',
                    title: '3 days',
                    duration: new Date(currentDate.setDate(currentDate.getDate() + 3)),
                },
                {
                    type: 'ban',
                    title: '7 days',
                    duration: new Date(currentDate.setDate(currentDate.getDate() + 7)),
                },
                {
                    type: 'ban',
                    title: '1 month',
                    duration: new Date(currentDate.setDate(currentDate.getDate() + 30)),
                },
            ],
        },
    },
];
export const PROFILE_OPTIONS = [
    // {
    //     icon: <FontAwesomeIcon icon={faEarthAsia} />,
    //     title: 'English',
    //     children: {
    //         title: 'Language',
    //         data: listLanguage,
    //     },
    // },
    report,
];

export const regex = /@[^)]+\)/g; //extract the tag part
export const getIdInMentions = /\([^(]+\w+/g; //extract id part of the tag part EX @Doan Ngoc Anh(kfjalksdlf243)
