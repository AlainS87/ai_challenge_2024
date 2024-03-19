import React from 'react';
import spotify_logo from "./img/spotify_logo.png";
import './Login.css'; // Import the CSS file for styling

// Login component displaying Spotify logo and login button
function Login() {
    return (
        <div className="login-container">
            <header className="login-header">
                {/* Spotify logo */}
                <img src={spotify_logo} alt="Spotify_logo" className="spotify_logo" />
                {/* Login button */}
                <a className="btn-spotify" href="/auth/login">
                    Login with Spotify
                </a>
            </header>
        </div>
    );
}

export default Login;
