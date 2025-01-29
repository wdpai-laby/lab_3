import { BrowserRouter, Route, Routes, useNavigate } from 'react-router-dom';
import Register from './components/Register';
import Login from './components/Login';
import FilmList from './components/FilmList';
import Favorites from './components/Favorites';
import Me from './components/Me';
import './styles.css';

function Navbar() {
    const navigate = useNavigate();
    const isAuthenticated = sessionStorage.getItem("token"); // Check if user is logged in

    const handleLogout = async () => {
        const refreshToken = sessionStorage.getItem("refreshToken");

        if (!refreshToken) {
            console.error("No refresh token found");
            sessionStorage.removeItem("token");
            sessionStorage.removeItem("refreshToken");
            navigate("/login");
            return;
        }

        try {
            const response = await fetch("http://127.0.0.1:8000/logout/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${sessionStorage.getItem("token")}`,
                },
                body: JSON.stringify({ refresh: refreshToken }),
            });

            if (response.ok) {
                console.log("Logout successful");
            } else {
                console.error("Failed to log out:", await response.json());
            }
        } catch (error) {
            console.error("Error logging out:", error);
        }

        // Clear tokens and redirect to login
        sessionStorage.removeItem("token");
        sessionStorage.removeItem("refreshToken");
        navigate("/login");
    };

    return (
       <nav>
            <button onClick={() => navigate("/")} className="nav-button">Home</button>
            <button onClick={() => navigate("/me")} className="nav-button">Profile</button>

            {!isAuthenticated ? (
                <>
                    <button onClick={() => navigate("/register")} className="nav-button">Register</button>
                    <button onClick={() => navigate("/login")} className="nav-button">Login</button>
                </>
            ) : (
              <>
                <button onClick={() => navigate("/favorites")} className="nav-button">Favorites</button>
                <button onClick={handleLogout} className="nav-button logout">Logout</button>
              </>
            )}
        </nav> 
    );
}

function App() {
    return (
        <BrowserRouter>
            <Navbar />
            <Routes>
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Login />} />
                <Route path="/" element={<FilmList />} />
                <Route path="/me" element={<Me />} />
                <Route path="/favorites" element={<Favorites />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
