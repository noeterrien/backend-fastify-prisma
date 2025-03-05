// helper functions for jest tests

import Fastify from "fastify";

import createApp from "../src/app.js";
import registerApp from "../src/app.js";

export default build = () => {
  let app = Fastify();

  beforeAll(async () => {
    app.register(registerApp);
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  return app;
};
