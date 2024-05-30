import { nextui } from "@nextui-org/theme";
import { primary, secondaryDark, secondaryLight } from "./utils/colors";

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)"],
        mono: ["var(--font-geist-mono)"],
      },
    },
  },
  darkMode: "class",
  plugins: [
    nextui({
      prefix: "noodle",
      layout: {
        radius: {
          small: "4px",
          medium: "8px",
          large: "12px",
        },
      },
      themes: {
        light: {
          colors: {
            background: "#ffffff",
            foreground: "#000000",
            primary: {
              ...primary,
              foreground: "#ffffff",
            },
            secondary: secondaryLight,
          },
        },
        dark: {
          colors: {
            background: "#000000",
            foreground: "#ffffff",
            primary,
            secondary: secondaryDark,
            divider: "#363130",
          },
        },
      },
    }),
  ],
};
