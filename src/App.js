import React, { useState } from 'react';
import './App.css';
import AudioPlayer from "./AudioPlayer";

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
    const response = await fetch('http://localhost:5003/api/recommend-music', {
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
          <input value={mbti} onChange={(e) => setMbti(e.target.value)} placeholder="MBTI Type" />
          <input value={gender} onChange={(e) => setGender(e.target.value)} placeholder="Gender" />
          <input value={job} onChange={(e) => setJob(e.target.value)} placeholder="Job" />
          <input value={zodiac} onChange={(e) => setZodiac(e.target.value)} placeholder="Zodiac Sign" />
          <input value={relationshipStatus} onChange={(e) => setRelationshipStatus(e.target.value)} placeholder="Relationship Status" />
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
    </div>
  );
}

export default App;
