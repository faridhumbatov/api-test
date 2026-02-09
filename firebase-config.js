import { useState, useEffect } from 'react';
import { db } from './firebaseConfig'; // Firebase sazlamaların
import { ref, onValue } from "firebase/database";

export default function UserList() {
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        const userRef = ref(db, '/'); // Kök dizindən datanı götürür
        onValue(userRef, (snapshot) => {
            const data = snapshot.val();
            if (data) setUsers(Object.values(data));
        });
    }, []);

    // Filtrasiya məntiqi (Ad və ya Emailə görə)
    const filteredUsers = users.filter(user =>
        user.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div>
            <input
                type="text"
                placeholder="Axtar (Ad və ya Email)..."
                onChange={(e) => setSearchTerm(e.target.value)}
            />

            <ul>
                {filteredUsers.map(user => (
                    <li key={user.id}>
                        {user.first_name} {user.last_name} - {user.email} ({user.country})
                    </li>
                ))}
            </ul>
        </div>
    );
}