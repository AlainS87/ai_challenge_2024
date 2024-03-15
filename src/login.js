import React from 'react';
import './Login.css'; // Import the CSS file for styling

function Login() {
    return (
        <div className="login-container">
            <header className="login-header">
                <a className="btn-spotify" href="/auth/login">
                    Login with Spotify
                </a>
            </header>
        </div>
    );
}

export default Login;
