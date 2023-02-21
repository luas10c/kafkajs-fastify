import fastify from "fastify";
import { Kafka } from "kafkajs";

import routes from "./routes";

async function bootstrap() {
  const app = await fastify();

  await app.register(routes);

  const kafka = new Kafka({
    clientId: "logistics-consumer",
    brokers: ["0.0.0.0:9092"],
  });

  const consumer = kafka.consumer({
    groupId: `log-consumer-${Math.random() * 9999999999}`,
    allowAutoTopicCreation: true,
    retry: {
      initialRetryTime: 100,
      retries: 8,
    },
  });

  await consumer.connect();
  console.log("Conectado");

  await consumer.subscribe({ topic: "create-logistic" });
  await consumer.run({
    async eachMessage(payload) {
      const { message } = payload;

      console.log(message.value?.toString());
    },
  });

  await app.listen({ port: 7000, host: "0.0.0.0" });
}

bootstrap();
