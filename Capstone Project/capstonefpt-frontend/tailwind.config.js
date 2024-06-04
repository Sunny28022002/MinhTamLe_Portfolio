/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: "class",
  theme: {
    extend: {
      animation: {
        first: "moveVertical 30s ease infinite",
        second: "moveInCircle 20s reverse infinite",
        third: "moveInCircle 40s linear infinite",
        fourth: "moveHorizontal 40s ease infinite",
        fifth: "moveInCircle 20s ease infinite",
      },
      keyframes: {
        moveHorizontal: {
          "0%": {
            transform: "translateX(-50%) translateY(-10%)",
          },
          "50%": {
            transform: "translateX(50%) translateY(10%)",
          },
          "100%": {
            transform: "translateX(-50%) translateY(-10%)",
          },
        },
        moveInCircle: {
          "0%": {
            transform: "rotate(0deg)",
          },
          "50%": {
            transform: "rotate(180deg)",
          },
          "100%": {
            transform: "rotate(360deg)",
          },
        },
        moveVertical: {
          "0%": {
            transform: "translateY(-50%)",
          },
          "50%": {
            transform: "translateY(50%)",
          },
          "100%": {
            transform: "translateY(-50%)",
          },
        },
      },
      colors: {
        'bg-neutral-1': '#FFFFFF',
        'bg-neutral-2': '#F7F8FA',
        'bg-neutral-3': '#F1F3F5',
        'bg-neutral-4': '#4361EE',
        'content-neutral-1': '#212529',
        'content-neutral-2': '#495057',
        'content-neutral-3': '#ADB5BD',
        'content-neutral-4': '#DEE2E6',
        'content-neutral-5': '#526581',
        'content-neutral-6': '#8491A5',
        'brand-neutral-1': '#48CAE4',
        'brand-neutral-2': '#3F37C999',
        'brand-neutral-3': '#3F37C966',
        'brand-neutral-4': '#3F37C91A',
        'brand-neutral-5': '#3F37C90D',
        'brand-neutral-6': '#3F37C908',
        'line-neutral-1': '#F4F4FC',
        'ext-link': '#50A5FD',
        'ext-error': '#F6370D',
        'ext-success': '#00CA20',
        'ext-warning': '#FFBD24',
        'modal-bg-neutral-1': '#FFFFFF',
        'modal-bg-neutral-2': '#F7F8FA',
      }
    },
  },
  plugins: [],
}
