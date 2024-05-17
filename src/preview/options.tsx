import React from 'react'
import ReactDOM from 'react-dom/client'
import Options from '../apps/Options'
import { Route, Switch } from 'wouter'

function Preview() {
  return (
    <div>
      <Switch>
        <Route path="/" component={Options} />
      </Switch>
    </div>
  )
}

const newNode = document.createElement('div')
document.body.appendChild(newNode)
const root = ReactDOM.createRoot(newNode)
root.render(<Preview />)
