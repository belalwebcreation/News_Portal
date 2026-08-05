const errorHandler = (
  err,
  req,
  res,
  next
) => {

  console.error(
    "ERROR:",
    err.message
  );


  // MongoDB duplicate error
  if (err.code === 11000) {
    return res.status(400).json({
      success: false,
      message:
        "Duplicate value already exists.",
    });
  }


  // Mongoose validation error
  if (err.name === "ValidationError") {

    const messages =
      Object.values(err.errors)
        .map(
          (item) => item.message
        );

    return res.status(400).json({
      success: false,
      message: messages.join(", "),
    });
  }


  // JWT error
  if (err.name === "JsonWebTokenError") {

    return res.status(401).json({
      success: false,
      message:
        "Invalid authentication token.",
    });
  }


  // JWT expired
  if (err.name === "TokenExpiredError") {

    return res.status(401).json({
      success: false,
      message:
        "Token expired. Please login again.",
    });
  }


  return res.status(
    err.statusCode || 500
  )
  .json({

    success:false,

    message:
      err.message ||
      "Internal Server Error",

    ...(process.env.NODE_ENV === "development" && {
      stack: err.stack,
    }),

  });

};


export default errorHandler;