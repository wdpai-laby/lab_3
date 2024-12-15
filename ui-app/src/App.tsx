import { Link, BrowserRouter, Route, Routes } from 'react-router-dom';
import Register from './components/Register';
import Login from './components/Login';
import UserList from './components/UserList';
import Me from './components/Me';
import BusinessUserDetails from './components/BusinessUserDetails';
import './styles.css';

function App() {
    return (
    <BrowserRouter>
      <nav>
        <Link to="/register">Rejestracja</Link> | <Link to="/login">Logowanie</Link> | <Link to="/business-users">Lista użytkowników</Link>
      </nav>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/business-users" element={<UserList />} />
        <Route path="/business-users/:id" element={<BusinessUserDetails />} />
        <Route path="/me" element={<Me />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;