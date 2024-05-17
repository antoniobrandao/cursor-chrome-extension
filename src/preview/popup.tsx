import React from 'react'
import ReactDOM from 'react-dom/client'
import Popup from '../apps/Popup'
import { Route, Switch } from 'wouter'

function Preview() {
  return (
    <Switch>
      <Route path="/" component={Popup} />
    </Switch>
  )
}

const newNode = document.createElement('div')
document.body.appendChild(newNode)
const root = ReactDOM.createRoot(newNode)
root.render(<Preview />)
