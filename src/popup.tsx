import React from 'react'
import Popup from './apps/Popup'
import { createRoot } from 'react-dom/client'
import { appPopupElementClass } from './appConfig'

const alreadyExistsEl = document.getElementById(appPopupElementClass)
if (!alreadyExistsEl) {
  const newNode = document.createElement('div')
  newNode.setAttribute('id', appPopupElementClass)
  document.body.appendChild(newNode)
  const root = createRoot(newNode)

  root.render(
    <React.StrictMode>
      <Popup />
    </React.StrictMode>,
  )
}