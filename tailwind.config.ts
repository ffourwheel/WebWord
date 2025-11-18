import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ['var(--font-merriweather)', 'serif'],
        sans: ['var(--font-inter)', 'sans-serif'],
      },
      colors: {
        bg: {
          main: "#FFF5FA", // สีชมพูอ่อนพื้นหลัง
          card: "#7C9A9C", // สีเขียว Slate เข้ม (พื้นหลัง Card ใหญ่)
        },
        btn: {
          primary: "#1F3A3D", // สีปุ่มเข้ม
        }
      },
    },
  },
  plugins: [],
};
export default config;