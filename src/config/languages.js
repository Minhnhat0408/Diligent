const languages = [
    'English',
    'العربية',
    'বাঙ্গালি (ভারত)',
    'Cebuano (Pilipinas)',
    'Čeština (Česká republika)',
    'Deutsch',
    'Ελληνικά (Ελλάδα)',
    'Español',
    'Suomi (Suomi)',
    'Filipino (Pilipinas)',
    'Français',
    '(ישראל) עברית',
    'हिंदी',
    'Magyar (Magyarország)',
    'Bahasa Indonesia (Indonesia)',
    'Italiano (Italia)',
    '日本語（日本）',
    'Basa Jawa (Indonesia)',
    'ខ្មែរ (កម្ពុជា)',
    '한국어 (대한민국)',
    'Bahasa Melayu (Malaysia)',
    'မြန်မာ (မြန်မာ)',
    'Nederlands (Nederland)',
    'Polski  (Polska)',
    'Português (Brasil)',
    'Română (Romania)',
    'Русский (Россия)',
    'Svenska  (Sverige)',
    'ไทย (ไทย)',
    'Türkçe (Türkiye)',
    'Українська (Україна)',
    'اردو',
    'Tiếng Việt (Việt Nam)',
    '简体中文',
    '繁體中文',
];

const listLanguage = languages.map((lang) => {
    return {
        code: 'en',
        type: 'language',
        title: lang,
        children: {
            title: 'Success',
            data: [
                {
                    title: 'Not Working',
                },
            ],
        },
    };
});
export default listLanguage