import React, { createContext, useState } from 'react'

export const UserDataContext = createContext()

const Context_User = ({ children }) => {

    const [user, setUser] = useState({
        email: '',
        fullname: {
            firstname: '',
            lastname: ''
        }
    })
    return (
            <UserDataContext.Provider value={{ user, setUser }}>
                {children}
            </UserDataContext.Provider>
    )
}

export default Context_User;
