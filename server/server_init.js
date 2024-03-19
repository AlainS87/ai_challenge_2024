const express = require('express');
const cors = require('cors');

// Import the OpenAI library
const OpenAI = require("openai");

// Initialize the OpenAI API with your API key
const openai = new OpenAI({
    apiKey: "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" // Ensure to replace this with your actual OpenAI API key
});

const app = express();
const port = 5006;

app.use(cors());
app.use(express.json()); // Use express's built-in middleware

app.post('/api/analyze-mood', async (req, res) => {
    // Destructure all fields from the request body
    const { input, age, mbti, gender, job, zodiac, relationshipStatus } = req.body;

    // Construct a description string including user's personal information
    const personal_info = `Age: ${age}, MBTI: ${mbti}, Gender: ${gender}, Job: ${job}, Zodiac: ${zodiac}, Relationship Status: ${relationshipStatus}`;

    try {
        const response = await openai.chat.completions.create({
            model: "gpt-4", // Make sure to check for the latest model version
            messages: [
                {
                    role: "system",
                    content: `This AI is trained to analyze emotions and mood based on user inputs. Given the following user's personal information ${personal_info}, 
          and their input, analyze and describe their current mood or feelings in detail. Consider all provided information for a comprehensive analysis.`
                },
                {
                    role: "user",
                    content: `Considering my current situation and feelings, here's what's on my mind: ${input}. Based on these details, 
                    including my personal information provided earlier, what can you tell about my current mood or feelings?
                    here is a word lists to decribe mood:
                    Aflutter	Emotional	Melancholy
                    Aloof	Enthused	Miffy 
                    Amusement	Erratic	Moody
                    Angry	Euphoric	Mournful
                    Antsy	Excited	Mysterious
                    Avid	Exhausted	Nervous
                    Awe	Famished	Neurotic
                    Bitter	Fearful	Numb
                    Blank	Fiery	Ominous
                    Blue	Gloomy	On edge
                    Calm	Gorged	Ornery
                    Cantankerous	Gormandizing	Pessimistic
                    Capricious	Gratitude	Petrified
                    Cheerful	Grim	Petulant
                    Chuffed	Grumpy	Pride
                    Colorless	Hesitant	Queasy
                    Covetous	Hollow	Ravenous
                    Crabby	Hope	Reflective
                    Cranky	Hopeless	Restless
                    Craving	Humorous	Romantic
                    Cross	Idyllic	Serenity
                    Deflated	Inconsolable	Snappy
                    Dejected	Insatiable	Starved
                    Depressed	Inspiration	Tense
                    Destitute	Interest	Touchy
                    Devoid	Irascible	Unattached
                    Devouring	Jittery	Unpredictable
                    Disheartening	Jumpy	Vacant
                    Dispiriting	Lamentable	Volatile
                    Distant	Lighthearted	Voracious
                    Dither	Livid	Whimsical
                    Drained	Lonely	Worried
                    Dyspeptic	Love	Yearning
                    
                    choose one from them which best decribe the input's mood, give this word directly
                    Format your response as one word aboveonly,
                    no other messages shall be included`
                }
            ],
            temperature: 0.7,
            max_tokens: 150, // Adjust tokens as necessary to cover a detailed analysis
            top_p: 1.0,
            frequency_penalty: 0.0,
            presence_penalty: 0.0,
        });

        const moodAnalysis = response.choices[0].message.content; // Get the reply from GPT
        console.log(moodAnalysis); // Ensure correct access to the content in the response
        res.json({ moodAnalysis });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error analyzing mood');
    }
});

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});
