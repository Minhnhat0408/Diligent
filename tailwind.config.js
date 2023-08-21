/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ['./src/**/*.{js,jsx,ts,tsx}'],
    theme: {
        extend: {
            screens: {
                'smu-max': { max: '576px' },
                'sm-max': { max: '639px' },
                'sml-max': { max: '681px' },
                'md-max': { max: '767px' },
                'mdl-max': { max: '850px' },
                'mdx-max': { max: '939px' },
                'lgs-max': { max: '1000px' },
                'lg-max': { max: '1023px' },
                'lgx-max': { max: '1050px' },
                'sxl-max': { max: '1138px' },
                'xl-max': { max: '1279px' },
                'sm2-max': { max: '716px' },
                'lgbw-max': { max: '1109px', min: '1024px' },
                'lg-between': { max: '1050px', min: '940px' },
                'xl-between': { max: '1279px', min: '1024px' },
                '2xl-max': { max: '1400px' },
                '3xl-max': { max: '1560px' },
            },
        },
    },
    plugins: [],
};
