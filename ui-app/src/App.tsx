import { Link, BrowserRouter, Route, Routes } from 'react-router-dom';
import Register from './components/Register';
import Login from './components/Login';
import FilmList from './components/FilmList';
import Me from './components/Me';
import './styles.css';

function App() {
    return (
    <BrowserRouter>
      <nav>
        <Link to="/register">Rejestracja</Link> | <Link to="/login">Logowanie</Link> | <Link to="/film-list">Lista filmów</Link>
      </nav>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/film-list" element={<FilmList />} />
        <Route path="/me" element={<Me />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;