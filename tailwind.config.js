/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      screens: { md: { max: "1050px" }, sm: { max: "550px" } },
      colors: {
        gray: {
          400: "#b9b9b9",
          500: "#979797",
          800: "#4d4c4e",
          900: "#121220",
          "900_10": "#1f2024",
          "800_bf": "#373d45bf",
          "900_02": "#121120",
          "900_03": "#151421",
          "900_04": "#151423",
          "900_05": "#1f1f1f",
          "900_01": "#141423",
          "900_06": "#272525",
          "900_07": "#1f2124",
          "900_08": "#201e35",
          "900_09": "#0b1437",
        },
        red: {
          400: "#f55851",
          900: "#7b0000",
          A100_01: "#f58574",
          "400_01": "#ee5d50",
          A100: "#f58575",
        },
        light_blue: {
          500: "#00a4f9",
          A700_6c: "#0082f56c",
          A700: "#006bf2",
          A700_87: "#0082f587",
        },
        lime: { 100: "#cfff0f" },
        teal: { 500: "#00b574", A400_01: "#00e8a2", A400: "#00ddc5" },
        blue_gray: {
          100: "#d9d9d9",
          400: "#8290b0",
          900: "#26243f",
          "900_a5": "#26243fa5",
          "900_02": "#222039",
          "900_01": "#25243e",
          "900_04": "#2c2c2e",
          "900_03": "#232238",
          "100_60": "#d9d9d960",
        },

        deep_purple: {
          A400: "#830ef7",
          A200: "#7551ff",
          A100: "#ac5bfd",
          A700: "#7c01f6",
        },
        blue: { 500: "#1a91fa" },
        indigo: { 200: "#a3aed0", 300: "#8a88b7", 500: "#4949c9" },
        cyan: { A400: "#00d4ff" },
        amber: { 400: "#ffcd1f", A400: "#ffc300" },
        black: { 900: "#000000" },
        pink: { A400: "#e80054" },
      },

      boxShadow: {
        bs: "6px 6px 12px 0px #121120, -5px -5px 12px 0px #232239, 0px 0px 3px 0px #202124 inset",
      },
      backgroundImage: {
        gradient: "linear-gradient(27deg ,#00a4f9,#006bf2)",
        gradient1: "linear-gradient(47deg ,#1f1f1f,#1f1f1f)",
        gradient2: "linear-gradient(47deg ,#830ef7,#ac5bfd)",
        gradient3: "radial-gradient(#1f1f1f,#1f1f1f)",
        gradient4: "linear-gradient(38deg ,#00a4f9,#006bf2)",
        gradient5: "linear-gradient(27deg ,#1a91fa,#006bf2)",
      },
    },
  },
  // eslint-disable-next-line no-undef
  plugins: [require("tailwindcss-rtl"), require("daisyui")],
};
