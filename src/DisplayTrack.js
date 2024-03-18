import React from "react";
import SpotifyPlayer from "react-spotify-player";
import { useState, useEffect } from 'react';

const DisplayTrack = ({currentUri}) => {
    const [uri, setUri] = useState();
    useEffect(() => {
        setUri(currentUri)
      }, []);
    console.log(uri === undefined)
    console.log(currentUri)
    return (
        <>
        { (uri === undefined) 
        ? <div>
            <p> not ready</p>
        </div>
        : 
        <div>
            <SpotifyPlayer uri={uri}/>
            </div> }
        </>
    );
  };
export default DisplayTrack;