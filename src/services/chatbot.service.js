const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });

const chat = async (message) => {
  try {
    const result = await model.generateContent({
      contents: [
        {
          role: 'user',
          parts: [
            {
              text: message,
            },
          ],
        },
      ],
      generationConfig: {
        maxOutputTokens: 1000,
        temperature: 1,
      },
    });

    return result.response;
  } catch (error) {
    console.error('An error occurred:', error);
    throw error;
  }
};

module.exports = {
  chat,
};
