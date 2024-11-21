import { useState, useEffect } from 'react';
import axios from 'axios';
import './UserList.css';

const UserList = () => {
    interface User {
        id: number;
        first_name: string;
        last_name: string;
        role: string;
    }

    const [users, setUsers] = useState<User[]>([]);
    const [newUser, setNewUser] = useState({
        first_name: '',
        last_name: '',
        role: ''
    });

    // Pobieranie użytkowników z backendu
    useEffect(() => {
        axios.get('http://localhost:8000/api/users/')
            .then(response => {
                console.log('Users:', response.data);
                setUsers(response.data);
            })
            .catch(error => console.error('Error fetching users:', error));

            console.log('Users:', users);
    }, []);

    // Dodawanie użytkownika
    const handleAddUser = () => {
        axios.post('http://localhost:8000/api/users/', newUser)
            .then(response => {
                console.log('User added:', response.data);
            })
            .catch(error => console.error('Error adding user:', error));
    };

    // Usuwanie użytkownika
    const handleDeleteUser = (id: Number) => {
        axios.delete(`http://localhost:8000/api/users/${id}/`)
            .then(response => {
                console.log('User deleted:', response.data);
                setUsers((prevUsers) => prevUsers.filter((user) => user.id !== id));
            })
            .catch(error => console.error('Error deleting user:', error));
    };

    return (
        <>
            <div className="form-container">
                <div className="title">
                    Let's level up your brand, together
                </div>
                <form action="">
                    <div className="htmlForm-group">
                        <label htmlFor="first_name" className="label">First name</label>
                        <input 
                            type="text" 
                            name="first_name" 
                            placeholder="First name" 
                            className="input" 
                            onChange={e => setNewUser({ ...newUser, first_name: e.target.value })} 
                            required 
                        />

                        <label htmlFor="last_name" className="label">Last name</label>
                        <input 
                            type="text" 
                            name="last_name" 
                            placeholder="Last name" 
                            className="input" 
                            onChange={e => setNewUser({ ...newUser, last_name: e.target.value })} 
                            required 
                        />

                        <label htmlFor="role" className="label">Role</label>
                        <input 
                            type="text" 
                            name="role" 
                            placeholder="Role" 
                            className="input" 
                            onChange={e => setNewUser({ ...newUser, role: e.target.value })} 
                            required 
                        />

                        <input type="checkbox" id="agree" name="agree" className="checkbox" required />
                        <div className="checkbox-text">You agree to our friendly <a href="">privacy policy</a>.</div>
                        
                        <button className="submit" onClick={handleAddUser}>SUBMIT</button>
                    </div>
                </form>
            </div>
            <div className="response-container">
                {users && users.length > 0 ? (
                    users.map((user) => (
                    <div className='response-item' key={user.id}>
                        <div className='response-fullname'>
                            {user.first_name + ' ' + user.last_name}
                        </div> 
                        <div className='delete-img'onClick={() => handleDeleteUser(user.id)}>
                            🗑️
                        </div>
                        <div className='response-role'>
                            {user.role}
                        </div>
                    </div>
                    ))
                ) : (
                    <div>Brak użytkowników</div>
                )}
            </div>
        </>
    );
};

export default UserList;

