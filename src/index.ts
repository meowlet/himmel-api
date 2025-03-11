import "core-js";
import { Elysia } from "elysia";
import { ErrorHandler } from "./presentation/plugin/ErrorHandler";
import { container } from "./injection/Container";
import { IAuthService } from "./domain/service/IAuthService";
import { MongoDatabase } from "./infrastructure/database/Database";
import { Router } from "./presentation/Router";
import { DIToken } from "./common/enum/DIToken";

const start = async () => {
  // Use DIToken.AUTH_SERVICE instead of "AuthService"
  const authService = container.resolve<IAuthService>(DIToken.AUTH_SERVICE);

  const app = new Elysia().use(ErrorHandler).use(Router.setup()).listen(3000);

  console.log(
    `🦊 Elysia should be running at http://${app.server?.hostname}:${app.server?.port}`
  );

  // Handle graceful shutdown
  const shutdown = async () => {
    console.log("Shutting down application...");
    await container.resolve<MongoDatabase>(DIToken.DATABASE).close();
    process.exit(0);
  };

  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);
};

start().catch(console.error);
