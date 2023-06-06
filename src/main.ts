import { createApp } from "vue";
import "./assets/css/main.css";
import App from "./App.vue";
import { router } from "./router";
import { VueQueryPlugin } from "@tanstack/vue-query";

const meta = document.createElement("meta");
meta.name = "naive-ui-style";


document.head.appendChild(meta);

const app = createApp(App);

app.use(router);
app.use(VueQueryPlugin)
app.mount("#app");
