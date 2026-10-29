import React, { createContext, useEffect, useState } from 'react'
import API_URL from "./api.js";
export const AuthContext = createContext(null)

export const AuthProvider = ({children}) => {
    const [user, setUser] = useState()
    const [loading, setLoading]= useState(true)

    useEffect(() => {
        fetch(`${API_URL}/api/me`, {
            method: 'GET',
            credentials: 'include',
        }).then(res => res.json()).then(data => setUser(data['user'])).catch(() => setUser(null)).finally(() => setLoading(false))
    }, [])
  
    return (
        <AuthContext.Provider value={{user, loading, setUser}}>{children}</AuthContext.Provider>
    )
}

