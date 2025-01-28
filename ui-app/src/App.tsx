import { Link, BrowserRouter, Route, Routes } from 'react-router-dom';
import Register from './components/Register';
import Login from './components/Login';
import FilmList from './components/FilmList';
import Favorites from './components/Favorites';
import Me from './components/Me';
import './styles.css';

function App() {
    return (
    <BrowserRouter>
      <nav>
        <Link to="/">Home</Link> | <Link to="/me">Profile</Link> | <Link to="/favorites">Favorites</Link> | <Link to="/register">Register</Link> | <Link to="/login">Login</Link>
      </nav>
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