import { Toaster } from 'react-hot-toast'
import AppRoutes from './routes/AppRoutes'
import Navbar from './components/Navbar'

function App() {
  return (
    <div>
      <Navbar />
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            background: '#1B1B18',
            color: '#FAF8F4',
            fontSize: '14px',
            borderRadius: '999px',
            padding: '10px 20px',
          },
        }}
      />
      <AppRoutes />
    </div>
  )
}

export default App