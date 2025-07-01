export const sendResponse = (res, jsonData) => {
  return res.status(jsonData.statusCode).json({
    success: true,
    message: jsonData.message,
    data: jsonData.data || null,
  });
};

export const sendError = (res, statusCode, message) => {
  return res.status(statusCode).json({
    success: false,
    message,
  });
};


