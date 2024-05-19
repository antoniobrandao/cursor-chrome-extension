import React from 'react'
import Cursor from './apps/Cursor'
import { createRoot } from 'react-dom/client'
// import './sharedstyles/tailwind.css'

const newNode = document.createElement('div')
newNode.setAttribute('id', 'ab-cursor-app')
document.body.appendChild(newNode)
const root = createRoot(newNode)

root.render(
  <React.StrictMode>
    <Cursor />
  </React.StrictMode>,
)