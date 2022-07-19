const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);

const toHandlerKey = (name: string) => `on${capitalize(name)}`;
// add-count => addCount
const camelize = (name: string) =>
  name.replace(/-(\w)/g, (match, p1) => {
    return capitalize(p1);
  });

export function emit(instance, event, ...payload) {
  // 处理props
  const { props } = instance;

  const handlerName = toHandlerKey(camelize(event));
  if (handlerName in props) {
    props[handlerName].apply(null, payload);
  }
}
