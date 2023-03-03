import { Route, Routes } from 'react-router-dom'
import './App.css'
import Fibonacci from './container/Fibonacci'
import OtherPage from './container/OtherPage'

const App = () => {
  return (
    <div className="App">
      <Routes>
        <Route key={'fibonacci-route-key'} path='/' element={<Fibonacci />} />
        <Route key={'other-page-route-key'} path='/otherpage' element={<OtherPage />} />
      </Routes>
    </div>
  )
}

export default App
