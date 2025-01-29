import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Me'

const Me = () => {
    const [user, setUser] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        username: '',
        email: '',
    });

    const navigate = useNavigate();

    useEffect(() => {
        const token = sessionStorage.getItem('token');

        if (!token) {
            navigate('/login');
            return;
        }

        axios
            .get('http://localhost:8000/api/me/', {
                headers: { Authorization: `Bearer ${token}` },
            })
            .then(response => {
                setUser(response.data);
                setFormData({
                    first_name: response.data.first_name || '',
                    last_name: response.data.last_name || '',
                    username: response.data.username || '',
                    email: response.data.email || '',
                });
            })
            .catch(error => {
                console.error('Error fetching user data:', error);
                setError('Error fetching user data.');
            });
    }, [navigate]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSave = () => {
        const token = sessionStorage.getItem('token');

        axios
            .put('http://localhost:8000/api/me/', formData, {
                headers: { Authorization: `Bearer ${token}` },
            })
            .then(response => {
                setUser(response.data);
                setIsEditing(false);
            })
            .catch(error => {
                console.error('Error updating user data:', error);
                setError('Error updating user data.');
            });
    };

    if (error) {
        return <div style={{ color: 'red' }}>{error}</div>;
    }

    if (!user) {
        return <div>Loading...</div>;
    }

    return (
        <div className="container">
            <h2>User Profile</h2>
            {isEditing ? (
                <div className="edit-form">
                    <label>First Name:</label>
                    <input type="text" name="first_name" value={formData.first_name} onChange={handleChange} />

                    <label>Last Name:</label>
                    <input type="text" name="last_name" value={formData.last_name} onChange={handleChange} />

                    <label>Username:</label>
                    <input type="text" name="username" value={formData.username} onChange={handleChange} />

                    <label>Email:</label>
                    <input type="email" name="email" value={formData.email} onChange={handleChange} />

                    <button onClick={handleSave}>Save</button>
                    <button onClick={() => setIsEditing(false)}>Cancel</button>
                </div>
            ) : (
                <div className="user-info">
                    <p><strong>First Name:</strong> {user.first_name}</p>
                    <p><strong>Last Name:</strong> {user.last_name}</p>
                    <p><strong>Username:</strong> {user.username}</p>
                    <p><strong>Email:</strong> {user.email}</p>
                    <button onClick={() => setIsEditing(true)}>Edit</button>
                </div>
            )}
        </div>
    );
};

export default Me;
