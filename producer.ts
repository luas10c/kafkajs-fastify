import fastify from "fastify";
import { Kafka } from "kafkajs";

async function bootstrap() {
  const app = await fastify();

  const kafka = new Kafka({
    brokers: ["0.0.0.0:9092"],
    clientId: "logistics-producer",
  });

  const producer = kafka.producer();

  await producer.connect();
  console.log("Producer");

  app.get("/", async () => {
    const data = await producer.send({
      topic: "create-logistic",
      messages: [
        {
          key: "example-01",
          value: JSON.stringify({ name: "Luciano" }),
        },
      ],
    });
    console.log("data", data);

    return data;
  });

  const url = await app.listen({ port: 7002, host: "0.0.0.0" });
  console.log(url);
}

bootstrap();
