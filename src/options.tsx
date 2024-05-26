import React from 'react'
import Options from './apps/Options'
import { createRoot } from 'react-dom/client'

const root = createRoot(document.getElementById('root')!)
root.render(
  <React.StrictMode>
    <Options />
  </React.StrictMode>,
)
