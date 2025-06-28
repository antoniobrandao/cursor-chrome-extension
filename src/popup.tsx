import React, { StrictMode } from 'react'
import Popup from './apps/Popup'
import { createRoot } from 'react-dom/client'
import { appPopupElementClass } from './appConfig'

const rootElement = document.createElement('div')
rootElement.setAttribute('id', appPopupElementClass)
document.body.appendChild(rootElement)
// const rootElement = document.getElementById('root')!
const shadowTarget = document.createElement('div')
shadowTarget.setAttribute('id', 'my-shadow-target')
shadowTarget.style.setProperty('display', 'block', 'important')
rootElement.appendChild(shadowTarget)
const shadowContainer = shadowTarget.attachShadow({ mode: 'open' })
const shadowRoot = document.createElement('div')
shadowRoot.setAttribute('id', 'my-shadow-root')
shadowContainer.append(shadowRoot)


createRoot(shadowRoot).render(
  <StrictMode>
    <Popup />
  </StrictMode>,
)

// const alreadyExistsEl = document.getElementById(appPopupElementClass)
// if (!alreadyExistsEl) {
//   const newNode = document.createElement('div')
//   newNode.setAttribute('id', appPopupElementClass)
//   document.body.appendChild(newNode)
//   const root = createRoot(newNode)

//   root.render(
//     <React.StrictMode>
//       <Popup />
//     </React.StrictMode>,
//   )
// }