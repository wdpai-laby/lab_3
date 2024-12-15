import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Me = () => {
    const [user, setUser] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);
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
            })
            .catch(error => {
                console.error('Error fetching user data:', error);
                setError('Wystąpił problem z pobraniem danych użytkownika.');
            });
    }, [navigate]);

    if (error) {
        return <div style={{ color: 'red' }}>{error}</div>;
    }

    if (!user) {
        return <div>Ładowanie...</div>;
    }

    return (
        <div className="container">
            <h2>Profil użytkownika</h2>
            <div className="user-info">
                <p><strong>Imię:</strong> {user.first_name}</p>
                <p><strong>Nazwisko:</strong> {user.last_name}</p>
                <p><strong>Nazwa użytkownika:</strong> {user.username}</p>
                <p><strong>Email:</strong> {user.email}</p>
            </div>
        </div>
    );
};

export default Me;
