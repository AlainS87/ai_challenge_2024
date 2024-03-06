import React, { useState } from 'react';
import './App.css';

function App() {
  const [input, setInput] = useState(''); // 用户输入的状态
  const [recommendations, setRecommendations] = useState(''); // 存储音乐推荐的状态

  // 处理提交事件
  const handleSubmit = async () => {
    // 发送POST请求到你的后端API
    const response = await fetch('http://localhost:5000/api/recommend-music', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ input }),
    });


    if (!response.ok) {
      // 如果请求失败，打印错误信息
      console.error("Failed to fetch music recommendations.");
      return;
    }

    const data = await response.json(); // 解析返回的JSON数据
    setRecommendations(data.recommendations.content); // 将推荐更新到状态中，以便显示
  };

  return (
    <div className="App">
      <header className="App-header">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Describe your mood or scene..."
          rows={4} // 设置文本框的行数
          style={{ margin: "10px 0", padding: "10px", width: "300px" }} // 设置样式
        />
        <button onClick={handleSubmit} style={{ padding: "10px 20px" }}>
          Get Music Recommendations
        </button>
        {recommendations && (
          <div>
            <h3>Music Recommendations</h3>
            <p>{recommendations}</p>
          </div>
        )}
      </header>
    </div>
  );
}

export default App;
