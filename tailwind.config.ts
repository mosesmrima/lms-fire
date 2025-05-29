import type { Config } from "tailwindcss"
import { heroui } from "@heroui/react"

const config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
    "*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
  },
  plugins: [
    heroui({
      themes: {
        dark: {
          colors: {
            // primary: "#f90026",
            background: "#111111",
            // content1: "#1e1e1e",
            focus: "#f90026",
            default: "#f90026",
                    // Add these lines to set text color
          foreground: "#ffffff", // general text color for dark theme
          content1: {
            DEFAULT: "#1e1e1e",
            //foreground: "#ffffff", // text on content1
          },
          primary: {
            DEFAULT: "#f90026",
            //foreground: "#ffffff", // text on primary background
          },
          },
        },
      },
    }),
  ],
} satisfies Config

export default config
