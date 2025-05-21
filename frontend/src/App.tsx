import { Route, BrowserRouter, Routes } from 'react-router-dom'
import { Sender } from './componets/sender'
import { Receiver } from './componets/receiver'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/sender" element={<Sender />} />
        <Route path="/receiver" element={<Receiver />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App