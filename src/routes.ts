import { FastifyInstance } from "fastify";

async function routes(app: FastifyInstance) {
  app.get("/logistics", () => {
    return {
      data: [],
    };
  });
}

export default routes;
