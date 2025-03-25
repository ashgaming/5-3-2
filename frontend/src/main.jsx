import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { Provider } from 'react-redux'
import store from './redux/store.js'
import { PeerProvider } from './context/PeerContext.jsx'

createRoot(document.getElementById('root')).render(
  <PeerProvider>
    <Provider store={store}>
      <App />
    </Provider>
  </PeerProvider>
)
