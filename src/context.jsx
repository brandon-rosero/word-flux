import { createContext, useContext } from "react";
import React, { useState } from 'react'

export const GlobalContext = createContext(null)

//export const useGlobalContext = () => useContext(GlobalContext)

const AppContext = ({children}) =>{
    const [textInput, setTextInput] = useState('')
    const [definitions, setDefinitions] = useState()
    const [word, setCurrentWord] = useState("")
    const [currentLexicalWords, setCurrentLexicalWords] = useState("")
    return <GlobalContext.Provider value={{textInput, setTextInput, definitions, setDefinitions, word, setCurrentWord, currentLexicalWords, setCurrentLexicalWords}}>{children}</GlobalContext.Provider>
}

export default AppContext