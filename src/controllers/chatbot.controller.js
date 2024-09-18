const { chatbotService } = require('../services');

const chatbot = async (req, res) => {
  try {
    const { prompt } = req.body;
    const response = await chatbotService.chat(prompt);
    res.send({ message: response });
  } catch (error) {
    res.status(500).send(error);
  }
};

module.exports = {
  chatbot,
};
