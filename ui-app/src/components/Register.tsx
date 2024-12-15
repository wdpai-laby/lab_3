import React, { useState } from 'react';
import axios from 'axios';
import './Login_and_Register_styles.css';

const Register = () => {
    // Separate state for each form field
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null); // Allow error to be null or a string

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null); // Clear any existing errors

        const formData = { username, email, password };

        try {
            await axios.post('http://localhost:8000/api/register/', formData, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            Notification.requestPermission().then(permission => {
                if (permission === 'granted') {
                    new Notification('Registration successful!');
                }
            }); 
        } catch (error) {
            console.error(error);
            setError('Registration failed. Please try again.'); // Set error message as a string
        }
    };

    return (
        <div className='container'>
            <h1>Register</h1>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <form onSubmit={handleSubmit}>
                <label>
                    Username:
                    <input
                        type="text"
                        value={username}
                        onChange={e => setUsername(e.target.value)}
                        required
                    />
                </label>
                <br />
                <label>
                    Email:
                    <input
                        type="email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        required
                    />
                </label>
                <br />
                <label>
                    Password:
                    <input
                        type="password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        required
                    />
                </label>
                <br />
                <button type="submit">Register</button>
            </form>
        </div>
    );
};

export default Register;
