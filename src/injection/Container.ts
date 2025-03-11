import { container } from "tsyringe";
import { IUserRepository } from "../domain/repository/IUserRepository";
import { MongoUserRepository } from "../infrastructure/repository/MongoUserRepository";
import { IAuthService } from "../domain/service/IAuthService";
import { AuthService } from "../infrastructure/service/AuthService";
import { MongoDatabase } from "../infrastructure/database/Database";
import { DatabaseConstant } from "../common/constant/DatabaseConstant";
import { MongoRoleRepository } from "../infrastructure/repository/MongoRoleRepository";
import { IRoleRepository } from "../domain/repository/IRoleRepository";
import { DIToken } from "../common/enum/DIToken";
import { IEmailService } from "../domain/service/IEmailService";
import { EmailService } from "../infrastructure/service/EmailService";

// Initialize database connection
const mongodbInstance = MongoDatabase.getInstance();
await mongodbInstance.connect();
const database = mongodbInstance.getDatabase();

// Register database instance
container.registerInstance(DIToken.DATABASE, database);

// Register repositories
container.registerSingleton<IUserRepository>(
  DIToken.USER_REPOSITORY,
  MongoUserRepository
);
container.registerSingleton<IRoleRepository>(
  DIToken.ROLE_REPOSITORY,
  MongoRoleRepository
);

// Register services
container.registerSingleton<IAuthService>(DIToken.AUTH_SERVICE, AuthService);
container.registerSingleton<IEmailService>(DIToken.EMAIL_SERVICE, EmailService);

// Export the container
export { container };
