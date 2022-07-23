import { App } from "./App.js";
import { createApp } from "../../lib/mini-vue.esm.js";
const app = createApp(App);
app.mount(document.querySelector("#app"));
