import React, { createContext, useEffect, useState } from 'react'

export const AuthContext = createContext(null)

export const AuthProvider = ({children}) => {
    const [user, setUser] = useState()
    const [loading, setLoading]= useState(true)

    useEffect(() => {
        fetch("http://127.0.0.1:5000/api/me", {
            method: 'GET',
            credentials: 'include',
        }).then(res => res.json()).then(data => setUser(data['user'])).catch(() => setUser(null)).finally(() => setLoading(false))
    }, [])
  
    return (
        <AuthContext.Provider value={{user, loading, setUser}}>{children}</AuthContext.Provider>
    )
}

