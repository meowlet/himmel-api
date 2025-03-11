export class AuthConstant {
  public static readonly JWT_SECRET = Bun.env.JWT_SECRET || "MEOW";
  public static readonly ACCESS_TOKEN_EXPIRES_IN = "1h";
  public static readonly REFRESH_TOKEN_EXPIRES_IN = "7d";
  public static readonly BCRYPT_SALT_ROUNDS = 10;
  public static readonly GOOGLE_CLIENT_ID = Bun.env.GOOGLE_CLIENT_ID || "";
  public static readonly GOOGLE_CLIENT_SECRET =
    Bun.env.GOOGLE_CLIENT_SECRET || "";
}
