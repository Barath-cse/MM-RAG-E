const queryPipeline = require('../../ai-services/pipeline/queryPipeline');
const audioService = require('../../ai-services/audio/speechToText');

exports.handleTextQuery = async (req, res, next) => {
  try {
    const { query, filters } = req.body;
    if (!query) {
      return res.status(400).json({ success: false, error: 'Query is required' });
    }

    const result = await queryPipeline.query(query, filters || []);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

exports.handleVoiceQuery = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, error: 'Audio file is required' });
    }

    // 1. Transcribe voice to text
    const transcription = await audioService.transcribe(req.file.path);

    // 2. Run query pipeline with transcribed text
    const result = await queryPipeline.query(transcription);
    
    res.status(200).json({
      ...result,
      transcription
    });
  } catch (error) {
    next(error);
  }
};
