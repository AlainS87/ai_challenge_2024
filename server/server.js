const express = require('express');
const cors = require('cors');

// Instantiate OpenAI using the API key in the environment variable
const OpenAI = require("openai");

const openai = new OpenAI({
  apiKey: "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" // This is also the default, can be omitted
});

const app = express();
const port = 5007;

app.use(cors());
app.use(express.json()); // Uses express's built-in middleware instead of body-parser

app.post('/api/recommend-music', async (req, res) => {
  // Deconstructs all fields in the request body
  const { input, gpt_mood, age, mbti, gender, job, zodiac, relationshipStatus, example_songs } = req.body;

  // Constructs a description string that includes the user's personal preference information
  const personnal_info = `Age: ${age}, userState: ${gpt_mood}, MBTI: ${mbti}, Gender: ${gender}, Job: ${job}, Zodiac: ${zodiac}, Relationship Status: ${relationshipStatus}`;
  const Spotify_songs = `Example_songs: ${example_songs}`;
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4", // Checks for the latest model version
      messages: [
        {
          role: "system",
          content: `Based on the following user's personal information including ${personnal_info}, predict their preference  on music.
          Therefore, based on their "input" which described their current mood or their experience or anything in their input, 
          tailor make and customize a recommendation list contaning 10 songs. Spotify, based on their current state${gpt_mood},
           recommended these songs for your reference ${Spotify_songs}:`
        },
        {
          role: "user",
          content: `this is what in my mind(ie.input) right now ${input}.
          You take into consideration factors in the personal information provide to recommend songs.
          Format your recommendation song list into 10 rows, with a row number+'. |' at the beginning,
          followed by the song name and its singer, creator, or musician, each of the information split with a " | ", and each row ends with a "\n". 
          strictly no other messages shall be included` // Uses the user's mood or event description as the user's input
        }
      ],
      temperature: 0.7,
      top_p: 1.0,
      frequency_penalty: 0.0,
      presence_penalty: 0.0,
    });
    console.log(response.choices[0].message.content); // Ensures proper access to the content in the response
    const recommendations = response.choices[0].message.content; // Gets a response from GPT
    res.json({ recommendations });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error getting music recommendations');
  }
});


app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
