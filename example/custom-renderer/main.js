import { createRenderer } from "../../lib/mini-vue.esm.js";
import { App } from "./App.js";

const game = new PIXI.Application({
  width: 500,
  height: 500,
});

const renderer = createRenderer({
  createElement(type) {
    const rect = new PIXI.Graphics();
    rect.beginFill(0xff0000);
    rect.drawRect(0, 0, 100, 100);
    rect.endFill();
    console.log("createElement", rect);
    window.rect = rect;
    return rect;
  },

  patchProp(el, key, nextValue) {
    console.log("patchProp");
    el[key] = nextValue;
  },

  insert(el, parent) {
    console.log("insert", el, parent);
    parent.addChild(el);
  },
});
document.body.append(game.view);
renderer.createApp(App).mount(game.stage);
