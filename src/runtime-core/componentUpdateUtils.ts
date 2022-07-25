export function shouldUpdateComponent(prevVNode, nextVNode) {
  const prevProps = prevVNode.props;
  const nextProps = nextVNode.props;
  for (const key in nextProps) {
    if (nextProps[key] !== prevProps[key]) {
      return true;
    }
  }
  return false;
}
