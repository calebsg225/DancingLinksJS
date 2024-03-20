import DancingLinks from "../src/DLX/DLX";

describe('testing DLX file', () => {
  const dlx = new DancingLinks();
  test(`should convert string to number`, () => {
    expect(dlx.test('69')).toBe(69);
  });
});