const validateAndParseBody = (schema) => {
  return (req, res, next) => {
    try {
      const dataToValidate = req.body.data && typeof req.body.data === "string"
        ? JSON.parse(req.body.data)
        : req.body;

      req.body = schema.parse(dataToValidate);
      next();
    } catch (error) {
      next(error);
    }
  };
};

export default validateAndParseBody;
