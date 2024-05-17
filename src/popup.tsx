import React from 'react'
import Popup from './apps/Popup'
import { createRoot } from 'react-dom/client'
// import './sharedstyles/tailwind.css'

const root = createRoot(document.getElementById('root')!)
root.render(
  <React.StrictMode>
    <Popup />
  </React.StrictMode>,
)
