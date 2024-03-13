import React from 'react';
import { useState, useEffect } from 'react';
import { tracks } from './tracks';
import WebPlayback from './WebPlayback'
import Login from './login'


const AudioPlayer = (props) => {
    const [token, setToken] = useState('');

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

  return (
    <>
        { (token === '') 
        ? <Login/> 
        : 
        <div>
            <WebPlayback token={token} />
            </div> }
    </>
  );
};
export default AudioPlayer;