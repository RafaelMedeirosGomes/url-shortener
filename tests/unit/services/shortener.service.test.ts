import generateId from "../../../src/services/shortener.service";

describe("shortener service tests", () => {
  describe("when generateId is called", () => {
    const DEFAULT_PREFIX = "www.us.com/";

    it("should create a string", () => {
      const id = generateId();

      expect(typeof id).toBe("string");
    });

    it("with correct length", () => {
      const id = generateId();

      expect(id.length).toBeLessThanOrEqual(22);
    });

    it("with default prefix", () => {
      const id = generateId();

      expect(id.startsWith(DEFAULT_PREFIX)).toBe(true);
    });

    it("or with given prefix", () => {
      const givenPrefix = "www.br.com/";

      const id = generateId(givenPrefix);

      expect(id.startsWith(givenPrefix)).toBe(true);
    });
  });
});
