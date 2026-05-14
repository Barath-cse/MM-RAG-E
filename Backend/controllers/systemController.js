const endeeService = require('../services/endeeService');

exports.getStats = async (req, res, next) => {
  try {
    const stats = await endeeService.getStats();
    res.status(200).json({ success: true, stats });
  } catch (error) {
    next(error);
  }
};

exports.getDocuments = async (req, res, next) => {
  try {
    const documents = await endeeService.getDocuments();
    res.status(200).json({ success: true, documents });
  } catch (error) {
    next(error);
  }
};

exports.deleteDocument = async (req, res, next) => {
  try {
    const { filename } = req.params;
    await endeeService.deleteDocument(filename);
    res.status(200).json({ success: true, message: `Document ${filename} deleted` });
  } catch (error) {
    next(error);
  }
};
