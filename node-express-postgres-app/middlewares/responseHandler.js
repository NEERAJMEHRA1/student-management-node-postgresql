
export const sendResponse = (req, res, next) => {
  res.success = (data, message = "Success") => {
    return res.status(200).json({ success: true, message, data });
  };
  res.error = (status, message = "Error") => {
    return res.status(status).json({ success: false, message });
  };
  next();
};
