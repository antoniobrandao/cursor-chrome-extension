import React from 'react'
import App from './apps/App'
import { createRoot } from 'react-dom/client'
import { appElementClass } from './appConfig'

const alreadyExistsEl = document.getElementById(appElementClass)
if (!alreadyExistsEl) {
  const newNode = document.createElement('div')
  newNode.setAttribute('id', appElementClass)
  document.body.appendChild(newNode)
  const root = createRoot(newNode)
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  )
} else {
  window.dispatchEvent(new Event('requestCursorSettingsUpdate'))
}
