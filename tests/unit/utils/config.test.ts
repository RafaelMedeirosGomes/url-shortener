import { loadConfig } from "../../../src/utils/config";

describe.only("config tests", () => {
  beforeEach(() => {
    process.env.SERVER_PORT = "42";
    process.env.DB_URI = "dburi";
    process.env.DB_USER = "johndoe";
    process.env.DB_PASS = "123456";
    process.env.DB_NAME = "dbname";
    process.env.URL_PREFIX = "urlprefix";
    process.env.URL_EXPIRY_TIME = "42";
  });

  it("uses given values", () => {
    const config = loadConfig();

    expect(config.SERVER_PORT).toBe(42);
    expect(config.DB_URI).toBe("dburi");
    expect(config.DB_USER).toBe("johndoe");
    expect(config.DB_PASS).toBe("123456");
    expect(config.DB_NAME).toBe("dbname");
    expect(config.URL_PREFIX).toBe("urlprefix");
    expect(config.URL_EXPIRY_TIME).toBe(42);
  });

  it("uses default SERVER_PORT", () => {
    delete process.env.SERVER_PORT;

    const config = loadConfig();

    expect(config.SERVER_PORT).toBe(5000);
  });

  it("uses default DB_URI", () => {
    delete process.env.DB_URI;

    const config = loadConfig();

    expect(config.DB_URI).toBe("mongodb://localhost:27017");
  });

  it("uses default URL_PREFIX", () => {
    delete process.env.URL_PREFIX;

    const config = loadConfig();

    expect(config.URL_PREFIX).toBe("www.us.com/");
  });

  it("uses default URL_EXPIRY_TIME", () => {
    delete process.env.URL_EXPIRY_TIME;

    const config = loadConfig();

    expect(config.URL_EXPIRY_TIME).toBe(1);
  });

  it("uses default DB_NAME", () => {
    delete process.env.DB_NAME;

    const config = loadConfig();

    expect(config.DB_NAME).toBe("shortener");
  });
});
