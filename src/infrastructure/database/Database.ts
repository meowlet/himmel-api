import { Db, MongoClient } from "mongodb";
import { DatabaseConstant } from "../../common/constant/DatabaseConstant";

export class MongoDatabase {
  private static instance: MongoDatabase;
  private client: MongoClient | null = null;
  private database: Db | null = null;

  public static getInstance(): MongoDatabase {
    if (!MongoDatabase.instance) {
      MongoDatabase.instance = new MongoDatabase();
    }
    return MongoDatabase.instance;
  }

  public async connect(): Promise<void> {
    if (!this.client) {
      this.client = await MongoClient.connect(DatabaseConstant.DATABASE_URI);
      this.database = this.client.db(DatabaseConstant.DATABASE_NAME);
    }
  }

  public getDatabase(): Db {
    if (!this.database) {
      throw new Error("Database not connected. Call connect() first.");
    }
    return this.database;
  }

  public async close(): Promise<void> {
    if (this.client) {
      await this.client.close();
      this.client = null;
      this.database = null;
    }
  }
}
