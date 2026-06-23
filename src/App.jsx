import { Routes, Route } from "react-router-dom"
import Login from "./pages/Login.jsx"
import Register from "./pages/Register.jsx"
import ProtectedRoute from "./components/ProtectedRoute.jsx"

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route path="/jobs" element={
        <ProtectedRoute>
          <h1>Jobs Page Coming Soon</h1>
        </ProtectedRoute>
      } />
    </Routes>
  )
}

export default App