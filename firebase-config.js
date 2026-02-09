import { useState, useEffect } from 'react';
import { db } from './firebaseConfig'; // Bura Firestore olmalıdır (getFirestore)
import { collection, query, where, getDocs, limit, orderBy } from "firebase/firestore";

export default function UserList() {
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(false);

    // Datanı gətirən əsas funksiya
    const fetchUsers = async (name = "") => {
        setLoading(true);
        try {
            const customersRef = collection(db, "customers");
            let q;

            if (name) {
                // Node.js ilə yüklədiyimiz "first_name_lower" sahəsini istifadə edirik
                q = query(
                    customersRef, 
                    where("first_name_lower", "==", name.toLowerCase()),
                    limit(100)
                );
            } else {
                // Axtarış yoxdursa, sadəcə son 100 nəfəri gətir
                q = query(customersRef, orderBy("id"), limit(100));
            }

            const querySnapshot = await getDocs(q);
            const data = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            
            setUsers(data);
        } catch (error) {
            console.error("Xəta baş verdi:", error);
        }
        setLoading(false);
    };

    // İlk açılışda datanı gətir
    useEffect(() => {
        fetchUsers();
    }, []);

    // Axtarış düyməsinə basanda və ya Enter edəndə işləsin
    const handleSearch = (e) => {
        if (e.key === 'Enter' || e.type === 'click') {
            fetchUsers(searchTerm);
        }
    };

    return (
        <div class="p-8">
            <div className="flex gap-2 mb-6">
                <input
                    className="border p-2 rounded w-full"
                    type="text"
                    placeholder="Adla tam axtar (məs: Caresse) və Enter bas..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyDown={handleSearch}
                />
                <button 
                    onClick={handleSearch}
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                    Axtar
                </button>
            </div>

            {loading ? <p>Yüklənir...</p> : (
                <ul className="space-y-2">
                    {users.map(user => (
                        <li key={user.id} className="border-b p-2">
                            <strong>{user.first_name} {user.last_name}</strong> - {user.email} 
                            <span className="ml-2 text-green-600 font-bold">{user.moey}</span>
                            <div className="text-xs text-gray-400">{user.card_type} | {user.country}</div>
                        </li>
                    ))}
                    {users.length === 0 && <p>Məlumat tapılmadı.</p>}
                </ul>
            )}
        </div>
    );
}
