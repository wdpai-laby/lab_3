import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

const BusinessUserDetails = () => {
    const { id } = useParams<{ id: string }>(); // Get the id from URL
    const [user, setUser] = useState<any>(null); // Store user data
    const [error, setError] = useState<string | null>(null); // Store error message
    const [loading, setLoading] = useState(true); // Manage loading state
    const navigate = useNavigate();

    const token = sessionStorage.getItem('token'); // Get token from sessionStorage

    // Fetch user details
    useEffect(() => {
        if (!token) {
            navigate('/login'); // Redirect to login if no token
            return;
        }

        axios
            .get(`http://localhost:8000/api/business-users/${id}/`, {
                headers: { Authorization: `Bearer ${token}` }, // Authorization header
            })
            .then(response => {
                setUser(response.data); // Set user data
            })
            .catch(error => {
                console.error('Error fetching user data:', error);
                setError('Wystąpił problem z pobraniem danych użytkownika.');
            })
            .finally(() => setLoading(false));
    }, [id, token, navigate]);

    // Handle form submission for updates
    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null); // Clear previous errors

        try {
            const response = await axios.put(
                `http://localhost:8000/api/business-users/${id}/`,
                user,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                }
            );
            alert('Dane użytkownika zostały zaktualizowane.');
            setUser(response.data); // Update user data with server response
        } catch (err) {
            console.error('Error updating user data:', err);
            setError('Wystąpił problem z aktualizacją danych użytkownika.');
        }
    };

    if (loading) {
        return <div>Ładowanie...</div>; // Show loading state
    }

    if (error) {
        return <div style={{ color: 'red' }}>{error}</div>; // Show error state
    }

    return (
        <div className="container">
            <h2>Edytuj Szczegóły Użytkownika</h2>
            <form onSubmit={handleUpdate}>
                <div className="form-group">
                    <label>
                        Imię:
                        <input
                            type="text"
                            value={user.first_name || ''}
                            onChange={(e) => setUser({ ...user, first_name: e.target.value })}
                        />
                    </label>
                </div>
                <div className="form-group">
                    <label>
                        Nazwisko:
                        <input
                            type="text"
                            value={user.last_name || ''}
                            onChange={(e) => setUser({ ...user, last_name: e.target.value })}
                        />
                    </label>
                </div>
                <div className="form-group">
                    <label>
                        Rola:
                        <input
                            type="text"
                            value={user.role || ''}
                            onChange={(e) => setUser({ ...user, role: e.target.value })}
                        />
                    </label>
                </div>
                <button type="submit">Zapisz zmiany</button>
            </form>
        </div>
    );
};

export default BusinessUserDetails;
