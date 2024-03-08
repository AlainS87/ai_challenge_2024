import React from 'react';
import { useState } from 'react';
import { tracks } from './tracks';
import DisplayTrack from './DisplayTrack';

const AudioPlayer = () => {
    const [currentTrack, setCurrentTrack] = useState(tracks[0]);
    return (
      <div className="audio-player">
        <div className="inner">
          <DisplayTrack currentTrack={currentTrack} />
        </div>
      </div>
    );
  };
export default AudioPlayer;