import { createContext, useContext } from "react";
import React, { useState } from 'react'

const GlobalContext = createContext()

export const useGlobalContext = () => useContext(GlobalContext)

const AppContext = ({children}) =>{
    const [textInput, setTextInput] = useState('')
    return <GlobalContext.Provider value={{textInput, setTextInput}}>{children}</GlobalContext.Provider>
}

export default AppContext