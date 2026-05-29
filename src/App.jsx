import { useState } from 'react'
import Dashboard from './components/Dashboard'

function Login({ onLogin }) {
  const [usuario, setUsuario] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  function handleLogin() {
    if (usuario === 'admin' && password === '1234') {
      onLogin()
    } else {
      setError('Usuario o contraseña incorrectos')
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white rounded-2xl border border-gray-200 p-8 w-80">
        <h1 className="text-xl font-medium text-gray-900">Baztro</h1>
        <p className="text-sm text-gray-400 mt-1 mb-6">Sistema de gestión mayorista</p>

        <div className="mb-4">
          <label className="text-xs text-gray-500 block mb-1">Usuario</label>
          <input
            type="text"
            value={usuario}
            onChange={(e) => setUsuario(e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-gray-400"
            placeholder="tu@email.com"
          />
        </div>

        <div className="mb-4">
          <label className="text-xs text-gray-500 block mb-1">Contraseña</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-gray-400"
            placeholder="••••••••"
          />
        </div>

        {error && (
          <p className="text-xs text-red-500 mb-4">{error}</p>
        )}

        <button
          onClick={handleLogin}
          className="w-full bg-gray-900 text-white rounded-lg py-2 text-sm font-medium"
        >
          Ingresar →
        </button>
      </div>
    </div>
  )
}

function App() {
  const [pantalla, setPantalla] = useState('login')

  return (
    <>
      {pantalla === 'login' && <Login onLogin={() => setPantalla('dashboard')} />}
      {pantalla === 'dashboard' && <Dashboard />}
    </>
  )
}

export default App