import { isReadonly, readonly, isProxy } from "../reactive";
describe("readonly", () => {
  it("happy path", () => {
    const original = { foo: 1, bar: { baz: 2 } };
    const wrapped = readonly(original);

    expect(isReadonly(wrapped)).toBe(true);
    expect(isReadonly(original)).toBe(false);

    expect(isProxy(wrapped)).toBe(true);
    expect(isProxy(original)).toBe(false);

    expect(wrapped).not.toBe(original);
    expect(wrapped.foo).toBe(1);
  });
});
