// AuthContext.jsx — manages login state across the whole app

// What it does:
// - Stores user and token in React state
// - On page load, checks localStorage to see if user was already logged in (so refresh doesn't log you out)
// - login(userData, tokenData) → saves user + token to state AND localStorage
// - logout() → clears user + token from state AND localStorage
// - Wraps the whole app in <AuthContext.Provider> so any page can access user/token without prop drilling
// - useAuth() → custom hook, use this in any page to get { user, token, login, logout }

// How to use it in any page:
// import { useAuth } from "../context/AuthContext"
// const { user, token, logout } = useAuth()


// createContext → ek khaali dabba (box) banata hai
// useContext → us dabbe se cheez nikalne ke liye
// useState → kisi value ko yaad rakhne ke liye, aur change hone par screen update karne ke liye
// useEffect → page load hone ke baad automatically kuch karne ke liye

import { createContext, useContext, useState, useEffect } from "react"

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)

  useEffect(() => {
    try {
      const savedToken = localStorage.getItem("token");
      const savedUser = localStorage.getItem("user");

      if (savedToken && savedUser) {
        setToken(savedToken);
        setUser(JSON.parse(savedUser));
      }
    } catch (error) {
      console.error("Auth Error:", error);

      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }
  }, []);


  const login = (userData, tokenData) => {
    console.log("USER:", userData);
    console.log("TOKEN:", tokenData);

    setUser(userData);
    setToken(tokenData);

    localStorage.setItem("token", tokenData);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null)
    setToken(null)
    localStorage.removeItem("token")
    localStorage.removeItem("user")

  }

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  )

}



export const useAuth = () => useContext(AuthContext)