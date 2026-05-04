const endeeService = require('../services/endeeService');

exports.getStats = async (req, res, next) => {
  try {
    const stats = await endeeService.getStats();
    res.status(200).json({ success: true, stats });
  } catch (error) {
    next(error);
  }
};
