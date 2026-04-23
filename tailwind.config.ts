import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#0A0A0A",
        cream: "#FAFAF6",
        forest: "#0F3D2E",
      },
      fontFamily: {
        display: ["var(--font-display)", "ui-serif", "Georgia", "serif"],
        body: ["var(--font-body)", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
    },
  },
  plugins: [],
};
export default config;
