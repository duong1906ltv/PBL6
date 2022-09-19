import { useNavigate } from 'react-router-dom'
import { createContext, useState,  useMemo, useEffect } from 'react'

const UserContext = createContext({})


export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(localStorage.getItem('token'))
    const [user, setUser] = useState(localStorage.getItem('user'))

    const providerValue = useMemo(
        () => ({  user, setUser, token, setToken}),
        [ user, setUser, token, setToken],
    )        
    const navigate = useNavigate()

    useEffect(() => {
        if (token !== 'null') {
            if (token !== localStorage.getItem('token')) {
                localStorage.setItem('token', token)
                localStorage.setItem('user', user)
            }
        } else {
            setUser('null')
            localStorage.setItem('token', null)
            localStorage.setItem('user', null)
        }
    }, [token, user, navigate])

    return (
        <UserContext.Provider value={providerValue}>
            {children}
        </UserContext.Provider>
    )
}

export default UserContext