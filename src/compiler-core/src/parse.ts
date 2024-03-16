import { NodeTypes } from "./ast";

export function baseParse(content: string): any {
  const context = createParserContext(content);
  return createRoot(parseChildren(context));
}

function parseChildren(context: any) {
  const nodes: any[] = [];
  let node;
  if (context.source.startsWith("{{")) {
    node = parseInterpolation(context);
  }

  nodes.push(node);

  return nodes;
}

function parseInterpolation(context) {
  //  {{ message }}

  const openDelimiter = "{{";
  const closeDelimiter = "}}";

  const s = context.source;

  advanceBy(context, openDelimiter.length);

  const closeIndex = s.indexOf(closeDelimiter);

  const rawContentLength = closeIndex - openDelimiter.length;

  const rawContent = s.slice(openDelimiter.length, closeIndex);

  const content = rawContent.trim();

  advanceBy(context, rawContentLength + closeDelimiter.length);

  return {
    type: NodeTypes.INTERPOLATION,
    content: {
      type: NodeTypes.SIMPLE_EXPRESSION,
      content,
    },
  };
}

function advanceBy(context, n) {
  context.source = context.source.slice(n);
}

function createRoot(children) {
  return { children };
}

function createParserContext(content: string) {
  return {
    source: content,
  };
}
