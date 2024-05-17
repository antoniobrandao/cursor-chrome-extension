import React from 'react'
import ReactDOM from 'react-dom/client'
import App from '../apps/Cursor'
import { Route, Switch } from 'wouter'

function Preview() {
  return (
    <div>
      <Switch>
        <Route path="/" component={App} />
      </Switch>
    </div>
  )
}

const newNode = document.createElement('div')
document.body.appendChild(newNode)
const root = ReactDOM.createRoot(newNode)
root.render(<Preview />)
