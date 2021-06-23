const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
    purge: {
        // enabled: true,
        content: [
            './src/**/*.vue',
            './src/**/**/*.vue',
            './src/**/*.js',
        ]
    },
    darkMode: false, // or 'media' or 'class'
    theme: {
        extend: {
            fontFamily: {
                sans: ["Inter var", ...defaultTheme.fontFamily.sans],
            },
        },
    },
    variants: {
        extend: {},
    },
    plugins: [
        require('@tailwindcss/forms'),
    ],
};
