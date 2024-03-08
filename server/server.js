const express = require('express');
const cors = require('cors');

// 使用环境变量中的API密钥来实例化OpenAI
const OpenAI = require("openai");

const openai = new OpenAI({
  apiKey: "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" // This is also the default, can be omitted
});

const app = express();
const port = 5001;

app.use(cors());
app.use(express.json()); // 使用express内置的中间件代替body-parser

app.post('/api/recommend-music', async (req, res) => {
  const userInput = req.body.input;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo", // 确保检查最新的模型版本
      messages: [
        {
          role: "system",
          content: `Give me a list of 10 songs that represents the user's mood: "${userInput}"`
        },
        {
          role: "user",
          content: userInput
        }
      ],
      temperature: 0.7,
      max_tokens: 40,
      top_p: 1.0,
      frequency_penalty: 0.0,
      presence_penalty: 0.0,
    });
    console.log(response.choices[0].message);
    const recommendations = response.choices[0].message;
    res.json({ recommendations });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error getting music recommendations');
  }
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
