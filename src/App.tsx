import React from 'react'
import Routers from './routes/Route';
import store from './redux/store'
import { Provider } from 'react-redux'

function App() {
  return (
    <Provider store={store}>
      <Routers />
    </Provider>
  )
}

export default App
