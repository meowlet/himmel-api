import { Elysia } from "elysia";
import { container } from "../injection/Container";
import { AuthController } from "./controller/AuthController";

export class Router {
  static setup(): Elysia {
    const app = new Elysia();

    // Register all controllers
    app.use(this.setupAuthRoutes());

    // Add more route groups as needed
    // app.use(this.setupUserRoutes());
    // app.use(this.setupFictionRoutes());

    return app;
  }

  private static setupAuthRoutes() {
    const authController = container.resolve<AuthController>(AuthController);
    return authController.routes();
  }

  // Add more controller setups as needed
  // private static setupUserRoutes(): Elysia { ... }
  // private static setupFictionRoutes(): Elysia { ... }
}
