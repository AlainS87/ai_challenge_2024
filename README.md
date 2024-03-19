# SoulSound
![soulsoundlogo](src/docs/soulsoundlogo.jpg)

Tired of the same tunes every day? You've found the perfect spot to explore new music that resonates with your very essence. SoulSound is dedicated to uncovering the music that speaks to the depths of your soul, offering you a uniquely personalized listening experience. 
* Here is our demo video [link](https://youtu.be/lVgwP4j2Sqw).

# Table of Contents

1. [GitHub Source Code](#code)
2. [Preparation](#preparation)
3. [How to Run SoulSound](#howtorun)
4. [How to Start Using SoulSound](#howtostart)
5. [Team Information](#teaminfo)
6. [Aknowledgement](#aknowledgement)

## GitHub Source Code <a name="code"></a>
Please visit [here](https://github.com/AlainS87/ai_challenge_2024)

## Preparation <a name="preparation"></a>

Before diving into the SoulSound experience, a few preparations are necessary. Follow these steps to set up your environment:

### Package Installation

In the project directory, you need to first install the essential packages. Open your terminal and execute the following commands:

* `npm install express`
* `npm install npm-run-all --save-dev`
* `npm install dotenv --save-dev`
* `npm install express --save-dev`
* `npm install request --save-dev`
* `npm install http-proxy-middleware --save-dev`
* `npm install react-router-dom`

This will install all necessary dependencies, including Express for your server backend, React Router for front-end routing, and several development tools to enhance your development workflow.

### Generating GPT API Key

Next, generate a GPT API key:

1. Sign up or log in Chat-GPT and navigate to the API keys section.

2. Visit the OpenAI API portal [here](https://platform.openai.com/api-keys)
![api_page](src/docs/GPT_api_page.png)

3. Generate a new API key to be used in your project. Be careful, you must set up a **billing method** to enable this API key to work for **gpt-4** model.
![key_generation](src/docs/key_generation.png)

4. Copy down the API key.
![copyKey](src/docs/copyKey.png)

5. repeate step 3-4 twice to paste to different key into server/server_init.js and server/server.js respectively.
![serverinitPicture](src/docs/serverinitapi.png)
![serverPicture](src/docs/serverapi.png)

This API key allows your application to communicate with GPT services, enabling AI-driven music recommendations.

### Creating Spotify App

To integrate Spotify's music services:

1. Create a Spotify **premium** account.

2. Head over to the Spotify Developer Dashboard [here](https://developer.spotify.com/dashboard)
![spotify_dashboard](src/docs/spotify_dashboard.png)

3. Create a new application.Remember to tick all the boxes shown in the picture below, and replace the "Redirect URI" section with `http://localhost:3000/auth/callback`
![createapp](src/docs/createapp.png)

4. Click save and then click setting.
![save](src/docs/save.png)
![setting](src/docs/setting.png)

5. Copy your Client ID and Client Secret into server/index.js.
![index](src/docs/indexapi.png)
These credentials are crucial for your application to interact with Spotify's Web API, fetching personalized music recommendations for your users.

## How to Run SoulSound <a name="howtorun"></a>

Get SoulSound up and running by executing the following commands in separate terminal windows:

* `node server/index.js`
![npmindex](src/docs/npmindex.png)
* `node server/server_init.js`
![serverinit](src/docs/serverinit.png)
* `node server/server.js`
![npmserver](src/docs/npmserver.png)
* `npm start`

A webpage will launch, ushering you into the SoulSound experience 🎉🎉.

If the Node version in your computer is 17 or higher:

For Windows systems, if you encounter difficulties running the program, you can try entering the following command in the terminal **before** entering `npm start`: `env:NODE_OPTIONS="--openssl-legacy-provider"`

For Mac Users, please update your package.json file accordingly:
![macnode](src/docs/macnode.png)

## How to Start Using SoulSound <a name="howtostart"></a>
Website Overview:

![UI screenshot](src/docs/ui.png "UI screenshot")
![secondPage](src/docs/secondPage.jpg)

Follow these steps to dive into your personalized music journey:

1. Sign up for a Spotify account.
2. Log in to your Spotify account (hover over the left side of the page to reveal the panel).
* ![login](src/docs/login.png)
3. Answer the on-screen questions to tailor your experience.
* ![input](src/docs/input.png)
4. Share how you're cuurently feeling or what image is in your mind to fine-tune your music recommendations.
5. Enjoy the customized music selections tailored just for you, by clicking on "Get Music Recommendations" 😉.

* ![musicList](src/docs/musicList.png)
6. Now, you shall see a "Soul Sound Recommendation Music" automatically generated inside your local Spotify app.
* ![storedList](src/docs/storedList.png)

7. You shall also link to Web Playback SDK and scroll down the web page to enjoy the music list.
*![websdk](src/docs/websdk.jpg)
*![secondPage](src/docs/secondPage.jpg)
8. Need guidance? Click the `Get Started` button for a walkthrough.
* ![getStarted](src/docs/getStarted.png)

## Team Information <a name="teaminfo"></a>

Encountering any difficulties? Feel free to drop us an email 😆.

![Team](src/docs/team.png)

---

Make sure to replace placeholders like the OpenAI and Spotify URLs with actual links and adjust any project-specific details as necessary.

## Aknowledgement <a name="aknowledgement"></a>
This project draws inspiration from the Spotify Web Playback SDK example found at:
https://github.com/spotify/spotify-web-playback-sdk-example
for the implementation of the Spotify login component and Spotify player.