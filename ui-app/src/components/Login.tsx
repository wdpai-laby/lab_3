import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Login_and_Register_styles.css';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null); // For error handling

    const navigate = useNavigate(); 

    useEffect(() => {
        const token = sessionStorage.getItem('token');

        if (token) {
            navigate('/me');
            return; 
        }
    });

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null); // Clear previous errors

        if (!username || !password) {
            setError('Both username and password are required.');
            return;
        }

        try {
            const response = await axios.post('http://localhost:8000/api/login/', { username, password });
            sessionStorage.setItem('token', response.data.access);
            navigate('/me'); 
        } catch (err) {
            console.error(err);
            setError('Login failed. Please check your username and password.');
        }
    };

    return (
        <div className='container'>
            <h1>Login</h1>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <form onSubmit={handleLogin}>
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
                    Password:
                    <input
                        type="password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        required
                    />
                </label>
                <br />
                <button type="submit">Login</button>
            </form>
        </div>
    );
};

export default Login;
