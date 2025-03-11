import { Elysia, t } from "elysia";
import { inject, injectable } from "tsyringe";
import { AuthService } from "../../infrastructure/service/AuthService";
import { DIToken } from "../../common/enum/DIToken";
import { ResponseFormatter } from "../../common/util/ResponseFormatter";

const authModels = {
  signUp: t.Object({
    username: t.String(),
    email: t.String(),
    password: t.String(),
  }),

  signIn: t.Object({
    identifier: t.String(),
    password: t.String(),
  }),

  refreshToken: t.Object({
    token: t.String(),
  }),

  googleAuth: t.Object({
    token: t.String(),
  }),

  forgotPassword: t.Object({
    email: t.String(),
  }),

  resetPassword: t.Object({
    token: t.String(),
    newPassword: t.String(),
  }),
};

@injectable()
export class AuthController {
  constructor(@inject(DIToken.AUTH_SERVICE) private authService: AuthService) {}

  public routes() {
    return new Elysia()
      .model({
        "auth.signUp": authModels.signUp,
        "auth.signIn": authModels.signIn,
        "auth.refreshToken": authModels.refreshToken,
        "auth.googleAuth": authModels.googleAuth,
        "auth.forgotPassword": authModels.forgotPassword,
        "auth.resetPassword": authModels.resetPassword,
      })
      .post(
        "/sign-up",
        async ({ body }) => {
          const { username, email, password } = body;
          await this.authService.signUp(username, email, password);
          return ResponseFormatter.success(
            null,
            "User has been created successfully"
          );
        },
        { body: "auth.signUp" }
      )
      .post(
        "/sign-in",
        async ({ body }) => {
          const { identifier, password } = body;
          const { user, accessToken, refreshToken } =
            await this.authService.signIn(identifier, password);

          return ResponseFormatter.success({
            user: ResponseFormatter.formatUserResponse(user),
            tokens: {
              accessToken,
              refreshToken,
            },
          });
        },
        { body: "auth.signIn" }
      )
      .post(
        "/refresh-token",
        async ({ body }) => {
          const { token } = body;
          const tokens = await this.authService.refreshToken(token);

          return ResponseFormatter.success(tokens);
        },
        { body: "auth.refreshToken" }
      )
      .post(
        "/google",
        async ({ body }) => {
          const { token } = body;
          const { user, accessToken, refreshToken, isNewUser } =
            await this.authService.googleAuth(token);

          return ResponseFormatter.success({
            user: ResponseFormatter.formatUserResponse(user),
            tokens: {
              accessToken,
              refreshToken,
            },
            isNewUser,
          });
        },
        { body: "auth.googleAuth" }
      )
      .post(
        "/forgot-password",
        async ({ body }) => {
          const { email } = body;
          await this.authService.generateResetToken(email);

          // Don't reveal whether the email exists or not for security
          return ResponseFormatter.success(
            null,
            "If your email exists in our system, you will receive a password reset link"
          );
        },
        { body: "auth.forgotPassword" }
      )
      .post(
        "/reset-password",
        async ({ body }) => {
          const { token, newPassword } = body;
          await this.authService.resetPassword(token, newPassword);

          return ResponseFormatter.success(
            null,
            "Password has been reset successfully"
          );
        },
        { body: "auth.resetPassword" }
      );
  }
}
