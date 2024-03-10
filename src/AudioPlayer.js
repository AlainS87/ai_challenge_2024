import React from 'react';
import { useState, useEffect } from 'react';
import { tracks } from './tracks';
import WebPlayback from './WebPlayback'
import Login from './login'
import DisplayTrack from './DisplayTrack';

const AudioPlayer = () => {
    const [currentTrack, setCurrentTrack] = useState(tracks[0]);
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
        { (token === '') ? <Login/> : <WebPlayback token={token} /> }
    </>
  );
};
export default AudioPlayer;