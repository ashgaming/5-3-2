import { createContext, useCallback, useContext, useState } from "react";
import { useSelector } from "react-redux";

// Create the context
const VariableContext = createContext();

// Create a provider component
export const VariableProvider = ({ children }) => {
    const [isSidebarOpen, setSidebarOpen] = useState(false);
    const [showCameraPanel, setShowCameraPanel] = useState(false);
    const [showCameraInputPanel, setShowCameraInputPanel] = useState(false);
    const [TakenImage, setTakenImage] = useState(null);
   // const preloadmsg = JSON.parse(localStorage.getItem(`chat_${localStorage.getItem('last_active_chat')}`)) || undefined;
 //   const [messages, setMessages] = useState( preloadmsg ? [...preloadmsg] : [] );
  //  const [messages, setMessages] = useState(  [] );
  const [messages, setMessages] = useState(() => {
    const lastActiveChat = localStorage.getItem('last_active_chat');
    const preloadmsg = lastActiveChat
        ? JSON.parse(localStorage.getItem(`chat_${lastActiveChat}`)) || []
        : [];
    return Array.isArray(preloadmsg) ? [...preloadmsg] : [];
});


    const toggleSidebar = useCallback(() => setSidebarOpen(prev => !prev), []);


    const { chat_ids = [] } = useSelector(state => state.GetChatIds);
    const [chatId, setChatId] = useState( chat_ids[0]?._id || undefined);


    const setActiveChat = (id) => { 
        setChatId(id);
        localStorage.setItem('last_active_chat', id);
     }

    // const LoadChatsFromLocalStorage = (chatId) => {
    //     const chats = JSON.parse(localStorage.getItem(`chat_${chatId}`)) || {};
    //     setMessages(chats);
    //  }


    const states = {
        isSidebarOpen,
        toggleSidebar,
        showCameraPanel,
        setShowCameraPanel,
        showCameraInputPanel,
        setShowCameraInputPanel,
        messages, setMessages,
        TakenImage,
        setTakenImage,
        chat_ids, chatId, setChatId , setActiveChat

    }
    return (
        <VariableContext.Provider value={states}>
            {children}
        </VariableContext.Provider>
    );
};

export const globalVariable = () => {
    return useContext(VariableContext);
};
