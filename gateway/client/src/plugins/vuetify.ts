import "@mdi/font/css/materialdesignicons.css";
import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";
import { aliases, mdi } from "vuetify/iconsets/mdi";
import "vuetify/styles";

const vuetify = createVuetify({
  theme: {
    themes: {
      light: {
        colors: {
          primary: "#e56e2f",
          secondary: "#1b7f2a",
          accent: "#82B1FF",
          error: "#FF5252",
          info: "#2196F3",
          success: "#4CAF50",
          warning: "#FFC107",
        },
      },
      dark: {
        colors: {
          background: "#000000",
          surface: "#000000",
          primary: "#000000",
          "primary-darken-1": "#000000",
          secondary: "#000000",
          "secondary-darken-1": "#000000",
          error: "#000000",
          info: "#000000",
          success: "#000000",
          warning: "#000000",
        },
      },
    },
  },
  icons: {
    defaultSet: "mdi",
    aliases: {
      ...aliases,
    },
    sets: {
      mdi,
    },
  },
  ssr: true,
  components,
  directives,
});

export default vuetify;
