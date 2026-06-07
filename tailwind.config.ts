import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./lib/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    darkMode: "class",
    theme: {
        extend: {
            colors: {
                background: '#FAFAFA',
                foreground: '#0F0F0F',
                deep:       '#0A0A0A',
                primary: {
                    DEFAULT:    '#D3B27B',
                    hover:      '#E0C28D',
                    foreground: '#0F0F0F',
                },
                secondary: {
                    DEFAULT:    '#F4EFEA',
                    foreground: '#0F0F0F',
                },
                accent: {
                    DEFAULT:    '#E8DCC4',
                    foreground: '#0F0F0F',
                },
                muted: {
                    DEFAULT:    '#F4EFEA',
                    foreground: '#6F6F6F',
                },
                border:      '#EBDCC4',
                input:       '#EBDCC4',
                ring:        '#D3B27B',
                card:        '#FFFFFF',
                destructive: {
                    DEFAULT:    'hsl(0 84.2% 60.2%)',
                    foreground: 'hsl(0 0% 98%)',
                },
                popover: {
                    DEFAULT:    '#FFFFFF',
                    foreground: '#0F0F0F',
                },
            },
            fontFamily: {
                sans:  ['var(--font-inter)', 'Inter', 'system-ui', 'sans-serif'],
                serif: ['Georgia', '"Times New Roman"', 'serif'],
                mono:  ['var(--font-jetbrains)', '"JetBrains Mono"', 'monospace'],
            },
            fontSize: {
                'frame-label': ['10px', { letterSpacing: '0.18em', lineHeight: '1' }],
            },
            borderRadius: {
                sm:    '4px',
                DEFAULT: '6px',
                md:    '8px',
                lg:    '12px',
                xl:    '16px',
                '2xl': '20px',
                '3xl': '24px',
                full:  '999px',
            },
            boxShadow: {
                card:         '0 20px 50px -20px rgba(211,178,123,.45)',
                'card-hover': '0 24px 60px -18px rgba(211,178,123,.55)',
                btn:          '0 15px 40px -10px rgba(211,178,123,.6)',
                nav:          '0 4px 20px rgba(15,15,15,.04)',
            },
            maxWidth: {
                layout: '1600px',
            },
            backgroundImage: {
                "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
            },
        },
    },
    plugins: [],
};

export default config;
