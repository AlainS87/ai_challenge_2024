import React, { useState } from 'react';
import './App.css';
import AudioPlayer from "./AudioPlayer";
import logo from "./img/logo.png";

function App() {
  // 存储用户输入和个人偏好的状态
  const [input, setInput] = useState('');
  const [age, setAge] = useState('');
  const [mbti, setMbti] = useState('');
  const [gender, setGender] = useState('');
  const [job, setJob] = useState('');
  const [zodiac, setZodiac] = useState('');
  const [relationshipStatus, setRelationshipStatus] = useState('');

  const [recommendations, setRecommendations] = useState(''); // 存储音乐推荐的状态

  // 处理提交事件
  const handleSubmit = async () => {
    // 发送POST请求到你的后端API，包括用户输入和个人偏好信息
    const response = await fetch('http://localhost:5200/api/recommend-music', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ input, age, mbti, gender, job, zodiac, relationshipStatus }),
    });

    if (!response.ok) {
      // 如果请求失败，打印错误信息
      console.error("Failed to fetch music recommendations.");
      return;
    }

    const data = await response.json(); // 解析返回的JSON数据
    const recommendationsList = data.recommendations.split("\n").map((item) => {
      const parts = item.split("|").map(part => part.trim()); // 分割每一项，并去除首尾空格
      return { number: parts[0], song: parts[1], artist: parts[2] };
    });
    setRecommendations(recommendationsList);
  };

  return (
    <div className="App">
      <header className="App-header">
        <div className="personal-info">
          {/* 个人信息输入字段 */}
          <input value={age} onChange={(e) => setAge(e.target.value)} placeholder="Age" />
          <MBTISelect value={mbti} onChange={(e) => setMbti(e.target.value)}/>
          <GenderSelect value={gender} onChange={(e) => setGender(e.target.value)} />
          <input value={job} onChange={(e) => setJob(e.target.value)} placeholder="Job" />
          <ZodiacSelect value={zodiac} onChange={(e) => setZodiac(e.target.value)} />
          <RelationshipSelect value={relationshipStatus} onChange={(e) => setRelationshipStatus(e.target.value)} />
        </div>
        <div className="mood-input">
          {/* 用户心情描述输入框 */}
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Describe your mood or scene..."
            rows={4}
          />
        </div>
        <button onClick={handleSubmit} style={{ padding: "10px 20px" }}>
          Get Music Recommendations
        </button>
        {recommendations && (
          <div className="recommendations">
            <h3>Music Recommendations</h3>
            {recommendations.map(({ number, song, artist }, index) => (
              <div key={index} className="recommendation-item">
                <span className="number">{number}</span>
                <span className="song">{song}</span>
                <span className="artist">{artist}</span>
              </div>
            ))}
          </div>
        )}
        <AudioPlayer />
      </header>
      <div className='panel'>
      <img src={logo} alt="SoulSound Logo" className="logo" />
        <div className="about-us">
          <h2>About Us</h2>
        </div>
        <div className="get-started">
          <h2>Get Started</h2>
        </div>
      </div>
    </div>
  );
}

function MBTISelect({ value, onChange}) {
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

function GenderSelect({ value, onChange}) {
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

function ZodiacSelect({ value, onChange}) {
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

function RelationshipSelect({ value, onChange}) {
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

export default App;
