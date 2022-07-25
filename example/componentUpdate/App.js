// 在 render 中使用 proxy 调用 emit 函数
// 也可以直接使用 this
// 验证 proxy 的实现逻辑
import { h, ref } from "../../lib/mini-vue.esm.js";
import Child from "./Child.js";

export default {
  name: "App",
  setup() {
    const msg = ref("123");
    const bar = ref("111");
    window.msg = msg;

    const changeChildProps = () => {
      msg.value = "456";
    };
    const changeOtherProps = () => {
      bar.value = "000";
    };
    return { msg, changeChildProps, bar, changeOtherProps };
  },

  render() {
    return h("div", {}, [
      h("div", {}, "你好" + this.bar),
      h(
        "button",
        {
          onClick: this.changeChildProps,
        },
        "change child props"
      ),
      h(
        "button",
        {
          onClick: this.changeOtherProps,
        },
        "change other props"
      ),
      h(Child, {
        msg: this.msg,
      }),
    ]);
  },
};
