import dotenv from "dotenv";
import app from "./app.js";
import { connectDB } from "./config/db.js";

dotenv.config();

const PORT = Number(process.env.PORT ?? 3000);

const bootstrap = async (): Promise<void> => {
  await connectDB();

  app.listen(PORT, () => {
    console.info(`Server listening on port ${PORT}`);
  });
};

bootstrap().catch((error) => {
  console.error("Failed to start the server", error);
  process.exitCode = 1;
});
