/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ['./src/**/*.{js,jsx,ts,tsx}'],
    theme: {
        extend: {
            screens: {
                'sm-max': { max: '639px' },
                'md-max': { max: '767px' },
                'lg-max': { max: '1023px' },
                'lgx-max': { max: '1050px' },
                'xl-max': { max: '1279px' },
                'sm2-max': { max: '716px' },
                'lg-between': { max: '1050px', min: '940px' },
                'xl-between': { max: '1279px', min: '1024px' },
            },
        },
    },
    plugins: [],
};
