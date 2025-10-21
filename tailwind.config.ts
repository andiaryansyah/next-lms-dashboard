import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      colors: {
        pickSky: "#C3EBFA",
        pickSkyLight: "#EDF9FD",
        pickPurple: "#CFCEFF",
        pickPurpleLight: "#F1F0FF",
        pickYellow: "#FAE27C",
        pickYellowLight: "#FEFCE8",
        pickGreen: "#8CD869",
        pickGreenLight: "#BCEEA5",
      },
    },
  },
  plugins: [],
};
export default config;
