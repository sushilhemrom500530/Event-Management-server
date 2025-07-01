// import { ZodError } from "zod";

// const globalErrorHandler = (err, req, res, next) => {
// //   console.error("Global Error:", err);

//   if (err instanceof ZodError) {
//     const formatted = err.errors.map((e) => ({
//       [e.path[0]]: e.message,
//     }));

//     return res.status(400).json({
//       success: false,
//       message: formatted,
//       message: err?.issues[0]?.code,
//       errors: formatted || "Internal Server Error"
//     });
//   }

//   res.status(err.statusCode || 500).json({
//     success: false,
//     message: err.message || "Internal Server Error",
//   });
// };

// export default globalErrorHandler;
import { ZodError } from "zod";

const globalErrorHandler = (err, req, res, next) => {
  // Handle Zod validation errors
  if (err instanceof ZodError) {
    const formattedErrors = err.errors.map((e) => ({
      [e.path[0]]: e.message,
    }));

    return res.status(400).json({
      success: false,
      message: "Validation Error",
      errors: formattedErrors,
    });
  }

  // Fallback: any other server or application error
  return res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
    errors: err.errors || [],
  });
};

export default globalErrorHandler;
