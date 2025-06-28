import React, { StrictMode } from 'react'
import Options from './apps/Options'
import { createRoot } from 'react-dom/client'

// const root = createRoot(document.getElementById('root')!)
// root.render(
//   <React.StrictMode>
//     <Options />
//   </React.StrictMode>,
// )


const rootElement = document.getElementById('root')!
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
    <Options />
  </StrictMode>,
)