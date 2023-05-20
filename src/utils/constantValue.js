import {
    faArrowDown,
    faArrowUp,
    faBan,
    faDownload,
    faEyeSlash,
    faFilePen,
    faFlag,
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
export const FILTER_OPTIONS = [
    { icon: <FontAwesomeIcon icon={faArrowUp} />, title: 'Latest', type: 'latest', tick: false },
    { icon: <FontAwesomeIcon icon={faArrowDown} />, title: 'Oldest', type: 'oldest', tick: false },
    {
        icon: <FontAwesomeIcon icon={faDownload} />,
        title: 'Downloads',
        type: 'downloads',
        tick: false,
    },
];
export const CATEGORY_OPTIONS = [
    {
        title: 'Ngoại ngữ',
        children: {
            title: 'Ngoại ngữ',
            data: [
                {
                    title: 'Tiếng Nhật',
                    children: {
                        title: 'Tiếng Nhật',
                        data: [
                            {
                                title: 'Từ vựng',
                            },
                            {
                                title: 'Ngữ pháp',
                            },
                            {
                                title: 'Kanji',
                            },
                            {
                                title: 'Hiragana - Katakana',
                            },
                            {
                                title: 'Phiên âm',
                            },
                        ],
                    },
                },
                {
                    title: 'Tiếng Anh',
                    children: {
                        title: 'Tiếng Anh',
                        data: [
                            {
                                title: 'Từ vựng',
                            },
                            {
                                title: 'Ngữ pháp',
                            },
                            {
                                title: 'Phiên âm',
                            },
                        ],
                    },
                },
                {
                    title: 'Tiếng Hàn',
                    children: {
                        title: 'Tiếng Hàn',
                        data: [
                            {
                                title: 'Từ vựng',
                            },
                            {
                                title: 'Ngữ pháp',
                            },
                        ],
                    },
                },
            ],
        },
    },
    {
        title: 'Toán',
        children: {
            title: 'Toán',
            data: [
                {
                    title: 'Số học',
                },
                {
                    title: 'Hình học',
                },
                {
                    title: 'Kinh tế',
                },
                {
                    title: 'Tối ưu hóa',
                },
                {
                    title: 'Giải tích',
                },
                {
                    title: 'Lượng giác',
                },
            ],
        },
    },
    {
        title: 'Vật lý',
        children: {
            title: 'Vật lý',
            data: [
                {
                    title: 'Cơ học',
                },
                {
                    title: 'Quang học',
                },
                {
                    title: 'Nhiệt động lực học',
                },
                {
                    title: 'Điện - Từ học',
                },
                {
                    title: 'Thuyết tương đối',
                },
                {
                    title: 'Âm học',
                },
            ],
        },
    },
    {
        title: 'Hóa học',
        children: {
            title: 'Hóa học',
            data: [
                {
                    title: 'Vô cơ',
                },
                {
                    title: 'Hữu cơ',
                },
                {
                    title: 'Hóa - Lý',
                },
                {
                    title: 'Hóa - Sinh',
                },
                {
                    title: 'Hóa phân tích',
                },
                {
                    title: 'Phản ứng',
                },
            ],
        },
    },
    {
        title: 'Sinh học',
        children: {
            title: 'Sinh học',
            data: [
                {
                    title: 'Nhân học',
                },
                {
                    title: 'Động vật học',
                },
                {
                    title: 'Thực vật học',
                },
                {
                    title: 'Vi sinh vật học',
                },
                {
                    title: 'Giải phẫu học',
                },
                {
                    title: 'Sinh học phân tử',
                },
                {
                    title: 'Tiến hóa - Di truyền',
                },
                {
                    title: 'Sinh - Hóa',
                },
            ],
        },
    },
    {
        title: 'IT',
        children: {
            title: 'IT',
            data: [
                {
                    title: 'Ngôn ngữ LT',
                    children: {
                        title: 'Ngôn ngữ LT',
                        data: [
                            {
                                title: 'C/C++',
                            },
                            {
                                title: 'Java',
                            },
                            {
                                title: 'Javascript',
                            },
                            {
                                title: 'HTML/CSS',
                            },
                            {
                                title: 'Python',
                            },
                        ],
                    },
                },
                {
                    title: 'Môn học LT',
                    children: {
                        title: 'Môn học LT',
                        data: [
                            {
                                title: 'Nhập môn lập trình',
                            },
                            {
                                title: 'Lập trình nâng cao',
                            },
                            {
                                title: 'Cấu giải',
                            },
                            {
                                title: 'LT hướng đối tượng',
                            },
                            {
                                title: 'Cơ sở dữ liệu',
                            },
                            {
                                title: 'Kiểm thử',
                            },
                            {
                                title: 'Web',
                            },
                            {
                                title: 'Mobile App',
                            },
                        ]
                    }
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
