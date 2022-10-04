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

  describe("when generateId is called multiple times", () => {
    /*
     * This simplistic test is more for documentation purposes.
     * From the short-unique-id lib specs we can see that this test
     * will probably never find any collision ever,
     * and brute forcing a collision is a really unreliable and costly strategy
     */
    const numberOfTimesCalled = 100000;
    it(
      `should be able to create at least ${numberOfTimesCalled}` +
        "unique ids without collisions",
      () => {
        const set = new Set();

        for (let index = 0; index < numberOfTimesCalled; index++) {
          const id = generateId();
          set.add(id);
        }

        expect(set.size).toBe(numberOfTimesCalled);
      }
    );
  });
});
