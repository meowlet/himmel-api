import { Elysia } from "elysia";
import { AppError, ErrorType } from "../../common/error/AppError";
import { ResponseFormatter } from "../../common/util/ResponseFormatter";

export function ErrorHandler(app: Elysia) {
  return app.error({ AppError }).onError(({ code, error, set }) => {
    console.error(`Error [${code}]:`, error);

    if (error instanceof AppError) {
      set.status = error.statusCode;
      return ResponseFormatter.error(error.message, error.type, error.details);
    }

    if (code == "PARSE") {
      set.status = 400;

      return ResponseFormatter.error(
        "Invalid JSON payload passed",
        ErrorType.PARSE_ERROR
      );
    }

    if (code === "NOT_FOUND") {
      set.status = 404;

      return ResponseFormatter.error(
        "The requested resource was not found",
        ErrorType.NOT_FOUND
      );
    }

    if (code === "VALIDATION") {
      set.status = 400;
      return ResponseFormatter.error(
        "Validation failed",
        ErrorType.VALIDATION_ERROR,
        {}
      );
    }

    console.error("Unhandled error:", error);
    set.status = 500;

    return ResponseFormatter.error(
      "An unexpected error occurred",
      ErrorType.INTERNAL_SERVER_ERROR
    );
  });
}
