import { useState } from 'react'
import Dashboard from './components/Dashboard'
import Productos from './components/Productos'
import Ventas from './components/Ventas'
import Cotizaciones from './components/Cotizaciones'
import Clientes from './components/Clientes'

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

function Sistema() {
  const [seccion, setSeccion] = useState('dashboard')

  return (
    <div className="min-h-screen bg-gray-100 flex">

      {/* Sidebar */}
      <div className="w-48 bg-gray-900 flex flex-col">
        <div className="p-4 border-b border-white/10">
          <p className="text-white font-medium">Baztro</p>
          <p className="text-white/40 text-xs mt-1">Sistema Mayorista</p>
        </div>

        <nav className="flex-1 p-2 flex flex-col gap-1">
          <p className="text-white/25 text-xs px-2 pt-3 pb-1 uppercase tracking-wider">Principal</p>
          <button onClick={() => setSeccion('dashboard')} className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm w-full text-left ${seccion === 'dashboard' ? 'bg-white/10 text-white' : 'text-white/50 hover:text-white/80 hover:bg-white/5'}`}>📊 Dashboard</button>
          <button onClick={() => setSeccion('productos')} className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm w-full text-left ${seccion === 'productos' ? 'bg-white/10 text-white' : 'text-white/50 hover:text-white/80 hover:bg-white/5'}`}>📦 Productos</button>
          <button onClick={() => setSeccion('ventas')} className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm w-full text-left ${seccion === 'ventas' ? 'bg-white/10 text-white' : 'text-white/50 hover:text-white/80 hover:bg-white/5'}`}>🧾 Ventas</button>
          <button onClick={() => setSeccion('cotizaciones')} className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm w-full text-left ${seccion === 'cotizaciones' ? 'bg-white/10 text-white' : 'text-white/50 hover:text-white/80 hover:bg-white/5'}`}>📋 Cotizaciones</button>
          <p className="text-white/25 text-xs px-2 pt-3 pb-1 uppercase tracking-wider">Gestión</p>
          <button onClick={() => setSeccion('clientes')} className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm w-full text-left ${seccion === 'clientes' ? 'bg-white/10 text-white' : 'text-white/50 hover:text-white/80 hover:bg-white/5'}`}>👥 Clientes</button>
          <button onClick={() => setSeccion('ajustes')} className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm w-full text-left ${seccion === 'ajustes' ? 'bg-white/10 text-white' : 'text-white/50 hover:text-white/80 hover:bg-white/5'}`}>⚙️ Ajustes</button>
        </nav>

        <div className="p-4 border-t border-white/10 flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-green-800 flex items-center justify-center text-green-300 text-xs font-medium">AD</div>
          <p className="text-white/60 text-xs">Admin</p>
        </div>
      </div>

      {/* Contenido */}
      {seccion === 'dashboard' && <Dashboard />}
      {seccion === 'productos' && <Productos />}
      {seccion === 'ventas' && <Ventas />}
      {seccion === 'cotizaciones' && <Cotizaciones />}
      {seccion === 'clientes' && <Clientes />}
      {seccion !== 'dashboard' && seccion !== 'productos' && (
        <div className="flex-1 flex items-center justify-center">
          <p className="text-gray-400 text-sm">Módulo en construcción 🚧</p>
        </div>
      )}

    </div>
  )
}

function App() {
  const [pantalla, setPantalla] = useState('login')

  return (
    <>
      {pantalla === 'login' && <Login onLogin={() => setPantalla('sistema')} />}
      {pantalla === 'sistema' && <Sistema />}
    </>
  )
}

export default App