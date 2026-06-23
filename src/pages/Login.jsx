// Login.jsx — the login page

// What it does:
// - 2 controlled inputs (email, password) using useState
// - On form submit:
//   1. e.preventDefault() — stops page from refreshing
//   2. Calls backend: api.post("/auth/login", { email, password })
//   3. Backend returns { user, token }
//   4. login(user, token) — saves them via AuthContext (state + localStorage)
//   5. navigate("/jobs") — redirects to jobs page

// Key terms:
// - useState → lets a value be remembered and trigger re-render when changed
// - controlled input → input's value comes from state, onChange updates that state
// - useNavigate → React Router hook to redirect programmatically (no page reload)
// - async/await → waits for the API call to finish before moving to next line
// - try/catch → if API call fails (wrong password etc), catch block runs instead of crashing

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import api from "../api/axios.js"
import { useAuth } from "../context/AuthContext.jsx"

function Login() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("");


    const navigate = useNavigate();
    const { login } = useAuth()

   const handleLogin = async (e) => {
    e.preventDefault();

    try {
        const res = await api.post("/auth/login", {
            email,
            password
        });

        login(
            res.data.data.user,
            res.data.data.token
        );

        navigate("/jobs");

    } catch (error) {
        console.log(error.response?.data);
    }
};



    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <form onSubmit={handleLogin} className="bg-white p-8 rounded-lg shadow-md w-96">
                <h1 className="text-2xl font-bold mb-6 text-center">Login</h1>

                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full border p-2 rounded mb-4"
                />

                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full border p-2 rounded mb-4"
                />

                <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded">
                    Login
                </button>
            </form>
        </div>
    )
}



export default Login