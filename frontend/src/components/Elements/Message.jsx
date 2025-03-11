import React from 'react'

const Message = ({type,children}) => {
    const types = {
        "error":"bg-red-600",
        "alert":"bg-blue-600",
        "notify":"bg-yellow-600",
    }
  return (
    <div className={`p-2 rounded-xl ${types[type]} `} >
      {children}
    </div>
  )
}

export default Message
