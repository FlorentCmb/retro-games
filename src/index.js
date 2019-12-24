// Import librairies
import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter } from 'react-router-dom'

// Import screens & components
import App from './App'

// Import styles
import './index.css'

// Others imports
import * as serviceWorker from './serviceWorker'

ReactDOM.render(<BrowserRouter><App /></BrowserRouter>, document.querySelector('#root'))

serviceWorker.register()
