import React, { useState, useEffect } from 'react';
import './App.css'; // Styling for the app
import logo from "./img/logo.png"; // Logo image
import back_vid from "./video/star2.mp4" // Background video
import Login from './login';
import WebPlayback from './WebPlayback';
import SpotifyPlayer from "react-spotify-player";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useNavigate
} from 'react-router-dom';

// Get Started Page component
function GetStartedPage() {

  const navigate = useNavigate();

  // Rendering the Get Started Page component
  // Includes background video, instructions, and navigation button
  return (
    <div className="App">
      <video autoPlay muted loop className="background-video">
        <source src={back_vid} type="video/mp4" />
        Your browser does not support HTML5 video.
      </video>
      <div className='container'>
        <div className="logo-container">
          <img src={logo} alt="SoulSound Logo" className="get-started-logo" />
        </div>
        <div className="content">
          <header className="App-header">
            <div className="instructions">
              <p>Welcome to SoulSound! Tired of the same tunes every day?
                You've found the perfect spot to explore new music that resonates with your very essence.
                SoulSound is dedicated to uncovering the music that speaks to the depths of your soul,
                offering you a uniquely personalized listening experience.
                Here’s how to dive in:
              </p>
              <ul>
                <li>Connect Your Spotify Account: Sign in with your Spotify account for a personalized touch.</li>
                <p></p>
                <li>Share a Bit About Yourself: Fill in the personal info section with your age, MBTI type, and more. Fear not—your details are confidential and solely used to enhance your music recommendations.</li>
                <p></p>
                <li>Set the Mood: Describe how you’re feeling or the vibe you’re after in the text box on our main page.</li>
                <p></p>
                <li>Discover Your Sound: Hit the ‘Get Music Recommendations’ button and get ready for a playlist that’s tailor-made for you.</li>
              </ul>
              <p>Enjoy the thrill of discovering music that strikes a chord with your soul.</p>
            </div>
            <button onClick={() => navigate(-1)}>Go Back</button>
          </header>
        </div>
      </div>
    </div>
  );
}

// Helper components for select inputs
function MBTISelect({ value, onChange }) {
  return (
    <select value={value} onChange={onChange}>
      <option value="" disabled>Select MBTI</option>
      <option value="INTJ">INTJ</option>
      <option value="INTP">INTP</option>
      <option value="ENTJ">ENTJ</option>
      <option value="ENTP">ENTP</option>
      <option value="INFJ">INFJ</option>
      <option value="INFP">INFP</option>
      <option value="ENFJ">ENFJ</option>
      <option value="ENFP">ENFP</option>
      <option value="ISTJ">ISTJ</option>
      <option value="ISFJ">ISFJ</option>
      <option value="ESTJ">ESTJ</option>
      <option value="ESFJ">ESFJ</option>
      <option value="ISTP">ISTP</option>
      <option value="ISFP">ISFP</option>
      <option value="ESTP">ESTP</option>
      <option value="ESFP">ESFP</option>
      <option value="IDoNotKnowWhatIsMBTI">I do not know what is MBTI</option>
    </select>
  );
}

// Helper components for select inputs
function GenderSelect({ value, onChange }) {
  return (
    <select value={value} onChange={onChange}>
      <option value="" disabled>Select Gender</option>
      <option value="Male">Male</option>
      <option value="Female">Female</option>
      <option value="Other">NTUC Shopping Bag</option>
      <option value="DoNotWishToSpecify">Do not wish to specify</option>
    </select>
  );
}

// Helper components for select inputs
function ZodiacSelect({ value, onChange }) {
  return (
    <select value={value} onChange={onChange}>
      <option value="" disabled>Select Zodiac Sign</option>
      <option value="Aries">Aries</option>
      <option value="Taurus">Taurus</option>
      <option value="Gemini">Gemini</option>
      <option value="Cancer">Cancer</option>
      <option value="Leo">Leo</option>
      <option value="Virgo">Virgo</option>
      <option value="Libra">Libra</option>
      <option value="Scorpio">Scorpio</option>
      <option value="Sagittarius">Sagittarius</option>
      <option value="Capricorn">Capricorn</option>
      <option value="Aquarius">Aquarius</option>
      <option value="Pisces">Pisces</option>
      <option value="DoNotWishToSpecify">Do not wish to specify</option>
    </select>
  );
}

// Helper components for select inputs
function RelationshipSelect({ value, onChange }) {
  return (
    <select value={value} onChange={onChange}>
      <option value="" disabled>Select Relationship Type</option>
      <option value="single">Single</option>
      <option value="married">Married</option>
      <option value="long-distance">Long-distance</option>
      <option value="divorced">Divorced</option>
      <option value="attached">Attached</option>
      <option value="separated">Separated</option>
      <option value="DoNotWishToDisclose">Do not wish to dislose</option>
    </select>
  );
}

// Main page component
function MainPage() {
  // State hooks for storing user inputs, preferences, and recommendations
  const [input, setInput] = useState('');
  const [uri, setUri] = useState('https://open.spotify.com/embed/playlist/3IMnb5InWV1OGUwsYKOMRk?utm_source=generator');
  const [token, setToken] = useState('');
  const [age, setAge] = useState('');
  const [mbti, setMbti] = useState('');
  const [gender, setGender] = useState('');
  const [job, setJob] = useState('');
  const [zodiac, setZodiac] = useState('');
  const [relationshipStatus, setRelationshipStatus] = useState('');
  const [recommendations, setRecommendations] = useState('');
  const [recommendations_spotify, setRecommendations_spotify] = useState('');

  // Function to handle form submission and fetch music recommendations based on user inputs
  const handleSubmit = async () => {
    // Code to handle fetching and setting recommendations here
    // Includes fetching mood analysis, fetching recommendations from Spotify,
    // setting Spotify URI, and handling errors
    const mood = await fetch('http://localhost:5006/api/analyze-mood', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ input, age, mbti, gender, job, zodiac, relationshipStatus }),
    });
    if (!mood.ok) {
      console.error("Failed to fetch mood.");
      return;
    }
    const mood_data = await mood.json();
    const gpt_mood = mood_data.moodAnalysis;

    const queryParams = new URLSearchParams({
      mood: gpt_mood, 
      age,
      mbti,
      gender,
      job,
      zodiac,
      relationshipStatus,
    }).toString();

    const response_from_spotify = await fetch(`http://localhost:5003/recommendations?${queryParams}`, {
      method: 'GET', 
    });

    if (!response_from_spotify.ok) {
      console.error("Failed to fetch music recommendations.");
      return;
    }

    const data_from_spotify = await response_from_spotify.json();

    const tracksData = data_from_spotify;
    tracksData.forEach(function (item) {
      var name = item.name;

      var value = item.artists[0].name;
    });

    const songArtistArray = tracksData.map(track => ({
      songName: track.name,
      artistNames: track.artists[0].name
    }));

    const example_songs = songArtistArray.map(track => `Song name:${track.songName} Artist Name: ${track.artistNames}`).join(", ");
    setRecommendations_spotify(songArtistArray);

    const response = await fetch('http://localhost:5007/api/recommend-music', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ input, gpt_mood, age, mbti, gender, job, zodiac, relationshipStatus, example_songs }),
    });

    if (!response.ok) {
      console.error("Failed to fetch music recommendations.");
      return;
    }

    const data = await response.json(); 
    const recommendationsList = data.recommendations.split("\n").map((item) => {
      const parts = item.split("|").map(part => part.trim()); // Splits each item and removes leading and trailing spaces.
      return { number: parts[0], song: parts[1] ? parts[1].replace(/"/g, '') : 'Unknown Song', artist: parts[2] };
    });
    setRecommendations(recommendationsList);


    const tracksInfo = recommendationsList.map(item => {
      const song = item.song ? item.song.replace(/"/g, '\\"') : "";
      const artist = item.artist ? item.artist.replace(/"/g, '\\"') : "";
      return `${song} | ${artist}`;
    });

    const spotify_search_response = await fetch('http://localhost:5003/create-playlist', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        tracksInfo,
        playlistName: 'Soul Sound Recommendation List'
      }),
    });

    const souldata = await spotify_search_response.json(); // Parses JSON response
    var temp = souldata['playlistUri']
    setUri(temp)
    if (!spotify_search_response.ok) {
      // Prints error message if failed.
      console.error("Failed to create list in spotify.");
      return;
    }
  };

  // Effect hook to fetch Spotify token on component mount
  useEffect(() => {
    async function getToken() {
      console.log("start fetching response")
      const response = await fetch('/auth/token');
      console.log(response)
      const json = await response.json();
      setToken(json.access_token);
    }

    getToken();

  }, []);

  const [isSidebarVisible, setIsSidebarVisible] = useState(false);

  // Effect hook to control sidebar visibility based on mouse position
  useEffect(() => {
    // This handler only shows the sidebar when the mouse is near the left edge
    const handleMouseMove = (e) => {
      if (e.clientX < 100) {
        setIsSidebarVisible(true);
      }
    };

    // We only need to listen to the mousemove event to show the sidebar
    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  // Handler for mouse entering the sidebar area
  const handleMouseEnter = () => {
    setIsSidebarVisible(true);
  };

  // Handler for mouse leaving the sidebar area
  const handleMouseLeave = () => {
    setIsSidebarVisible(false);
  };

  // Rendering the main page component
  return (
    <div className='entire'>
      <div className="App">
        {/* Background video */}
        <video autoPlay muted loop className="background-video">
          <source src={back_vid} type="video/mp4" />
          Your browser does not support HTML5 video.
        </video>
        <div className='container'>
          {/* Sidebar for logo and Spotify login */}
          <div
            className={`panel ${isSidebarVisible ? 'panel-visible' : ''}`}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            {/* Sidebar content */}
            <img src={logo} alt="SoulSound Logo" className="logo" />
            <div className="get-started">
              <Link to="/get-started">
                <h2>Get Started</h2>
              </Link>
            </div>
            <div className='spotify-login'>
              {(token === '')
                ? <Login />
                :
                <div>
                  <h3>Login successfully!</h3>
                  <h3>Welcome to soul sound!</h3>
                </div>}
            </div>
          </div>
          <div className="content">
            <header className="App-header">
              {/* Form for user inputs */}
              {/* Code to render input fields and the submit button here */}
              <div className="personal-info">
                <input value={age} onChange={(e) => setAge(e.target.value)} placeholder="Age" />
                <MBTISelect value={mbti} onChange={(e) => setMbti(e.target.value)} />
                <GenderSelect value={gender} onChange={(e) => setGender(e.target.value)} />
                <input value={job} onChange={(e) => setJob(e.target.value)} placeholder="Job" />
                <ZodiacSelect value={zodiac} onChange={(e) => setZodiac(e.target.value)} />
                <RelationshipSelect value={relationshipStatus} onChange={(e) => setRelationshipStatus(e.target.value)} />
                <div className="mood-input">
                  <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Describe your mood or scene..."
                    rows={4}
                  />
                </div>
                <div className='buttonArea'>
                  <button className='recommendation_button' onClick={handleSubmit} style={{ padding: "10px 20px" }}>
                    Get Music Recommendations
                  </button>
                </div>
              </div>
            </header>
            <div className="listplayer">
              {/* Spotify player and related content */}
              <SpotifyPlayer uri={uri} size={{ width: '100%', height: 300 }} />
            </div>
          </div>
        </div>
       {/* WebPlayback component */}  
      </div>
      {(token === '')
        ? <h3 className='notice'>Login to spotify to use our web sdk player!</h3>
        : <div>
          <WebPlayback token={token} />
        </div>}
    </div>
  );
}

// App component that includes routing
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/get-started" element={<GetStartedPage />} />
      </Routes>
    </Router>
  );
}
export default App;