// Register.jsx — the registration page

// What it does:
// - 3 controlled inputs (name, email, password) using useState
// - On form submit:
//   1. e.preventDefault() — stops page refresh
//   2. Calls backend: api.post("/auth/register", { name, email, password })
//   3. Backend creates user in MongoDB (no token returned here)
//   4. navigate("/login") — redirects to login page so user can log in fresh

// Key difference from Login.jsx:
// - No login() call here — register doesn't return a token, only creates the account
// - User must go log in separately after registering (matches your backend design)

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import api from "../api/axios.js"
import { useAuth } from "../context/AuthContext.jsx"

function Register() {
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const navigate = useNavigate()
    const { login } = useAuth()

    const handleRegister = async (e) => {
        e.preventDefault()

        try {
            await api.post("/auth/register", { name, email, password })
            navigate("/login")
        } catch (error) {
            console.log(error.response.data)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <form onSubmit={handleRegister} className="bg-white p-8 rounded-lg shadow-md w-96">
                <h1 className="text-2xl font-bold mb-6 text-center">Register</h1>

                <input
                    type="text"
                    placeholder="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full border p-2 rounded mb-4"
                />

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
                    Register
                </button>
            </form>
        </div>
    )
}

export default Register