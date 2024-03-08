import React from "react";
const DisplayTrack = ({ currentTrack }) => {
    return (
      <div>
        <h3>default music</h3>
        <audio src={currentTrack.src} controls/>
      </div>
    );
  };
export default DisplayTrack;