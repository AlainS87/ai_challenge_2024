const express = require('express');
const cors = require('cors');

// 使用环境变量中的API密钥来实例化OpenAI
const OpenAI = require("openai");

const openai = new OpenAI({
  apiKey: "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" // This is also the default, can be omitted
});

const app = express();
const port = 5200;

app.use(cors());
app.use(express.json()); // 使用express内置的中间件代替body-parser

app.post('/api/recommend-music', async (req, res) => {
  // 解构请求体中的所有字段
  const { input, age, mbti, gender, job, zodiac, relationshipStatus, example_songs } = req.body;

  // 构建一个描述字符串，包括用户的个人偏好信息
  const personnal_info = `Age: ${age}, MBTI: ${mbti}, Gender: ${gender}, Job: ${job}, Zodiac: ${zodiac}, Relationship Status: ${relationshipStatus}`;
  const Spotify_songs = `Example_songs: ${example_songs}`;
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4", // 确保检查最新的模型版本
      messages: [
        {
          role: "system",
          content: `Based on the following user's personal information including ${personnal_info}, predict their preference  on music.
          Therefore, based on their "input" which described their current mood or their experience or anything in their input, 
          tailor make and customize a recommendation list contaning 10 songs. Spotify, based on their current mood,
           recommended these songs for your reference ${Spotify_songs}:`
        },
        {
          role: "user",
          content: `this is what in my mind(ie.input) right now ${input}.
          You take into consideration factors in the personal information provide to recommend songs.
          Format your recommendation song list into 10 rows, with a row number+'. |' at the beginning,
          followed by the song name and its singer, creator, or musician, each of the information split with a " | ", and each row ends with a "\n". 
          strictly no other messages shall be included` // 使用用户的心情或事件描述作为用户的输入
        }
      ],
      temperature: 0.7,
      max_tokens: 60, // 可能需要增加tokens以包含更详细的推荐
      top_p: 1.0,
      frequency_penalty: 0.0,
      presence_penalty: 0.0,
    });
    console.log(response.choices[0].message.content); // 确保正确访问响应中的内容
    const recommendations = response.choices[0].message.content; // 获取GPT的回复
    res.json({ recommendations });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error getting music recommendations');
  }
});


app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
