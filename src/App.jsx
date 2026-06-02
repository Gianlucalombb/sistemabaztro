import { useState } from 'react'
import Dashboard from './components/Dashboard'
import Productos from './components/Productos'
import Ventas from './components/Ventas'
import Cotizaciones from './components/Cotizaciones'

function Login({ onLogin }) {
  const [usuario, setUsuario] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  function handleLogin() {
    if (usuario === 'baztro' && password === 'gianluca05') {
      onLogin()
    } else {
      setError('Usuario o contraseña incorrectos')
    }
  }

  return (
    <div className="min-h-screen flex" style={{ background: '#f7f6f3' }}>
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12" style={{ background: '#1a1a1a' }}>
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-6 h-6 rounded-full" style={{ background: '#c8f564' }}></div>
            <span className="text-white font-medium text-sm tracking-wide">Baztro</span>
          </div>
        </div>
        <div>
          <p className="text-4xl font-light text-white leading-snug mb-4">Sistema de gestión<br /><span style={{ color: '#c8f564' }}>mayorista</span></p>
          <p className="text-sm" style={{ color: 'rgba(255,255,255,0.4)' }}>Productos · Ventas · Cotizaciones · Clientes</p>
        </div>
        <p className="text-xs" style={{ color: 'rgba(255,255,255,0.2)' }}>Baztro Mayorista © 2026</p>
      </div>

      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-sm">
          <h1 className="text-2xl font-medium text-gray-900 mb-1">Bienvenido</h1>
          <p className="text-sm text-gray-400 mb-8">Ingresá a tu cuenta para continuar</p>

          <div className="mb-4">
            <label className="text-xs font-medium text-gray-500 block mb-1.5 uppercase tracking-wider">Usuario</label>
            <input
              type="text"
              value={usuario}
              onChange={(e) => setUsuario(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-gray-400 bg-stone-100"
              placeholder="tu@email.com"
            />
          </div>

          <div className="mb-6">
            <label className="text-xs font-medium text-gray-500 block mb-1.5 uppercase tracking-wider">Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-gray-400 bg-stone-100"
              placeholder="••••••••"
            />
          </div>

          {error && <p className="text-xs text-red-500 mb-4">{error}</p>}

          <button
            onClick={handleLogin}
            className="w-full py-3 rounded-xl text-sm font-medium transition-all"
            style={{ background: '#1a1a1a', color: 'white' }}
          >
            Ingresar
          </button>
        </div>
      </div>
    </div>
  )
}

const navItems = [
  { key: 'dashboard', label: 'Dashboard', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
  { key: 'productos', label: 'Productos', icon: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4' },
  { key: 'ventas', label: 'Ventas', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' },
  { key: 'cotizaciones', label: 'Cotizaciones', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
]

function Sistema() {
  const [seccion, setSeccion] = useState('dashboard')
  const [menuAbierto, setMenuAbierto] = useState(false)

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#e8e5e0' }}>

      {/* Topbar mobile */}
      <div className="lg:hidden flex items-center justify-between px-4 py-3 border-b border-gray-200" style={{ background: '#1a1a1a' }}>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full" style={{ background: '#c8f564' }}></div>
          <span className="text-white font-medium text-sm">Baztro</span>
        </div>
        <button onClick={() => setMenuAbierto(!menuAbierto)} className="text-white p-1">
          {menuAbierto ? (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {/* Menu mobile desplegable */}
      {menuAbierto && (
        <div className="lg:hidden flex flex-col py-2 border-b border-gray-800" style={{ background: '#1a1a1a' }}>
          {navItems.map(item => (
            <button
              key={item.key}
              onClick={() => { setSeccion(item.key); setMenuAbierto(false) }}
              className="flex items-center gap-3 px-5 py-3 text-sm w-full text-left"
              style={{ color: seccion === item.key ? '#c8f564' : 'rgba(255,255,255,0.5)' }}
            >
              <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
              </svg>
              {item.label}
            </button>
          ))}
        </div>
      )}

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar desktop */}
        <div className="hidden lg:flex w-56 flex-shrink-0 flex-col" style={{ background: '#1a1a1a' }}>
          <div className="p-5 border-b" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-full flex-shrink-0" style={{ background: '#c8f564' }}></div>
              <span className="text-white font-medium text-sm">Baztro</span>
            </div>
            <p className="text-xs mt-0.5 ml-7" style={{ color: 'rgba(255,255,255,0.3)' }}>Sistema Mayorista</p>
          </div>
          <nav className="flex-1 p-3 flex flex-col gap-0.5">
            <p className="text-xs px-3 pt-4 pb-2 uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.2)' }}>Principal</p>
            {navItems.map(item => (
              <button
                key={item.key}
                onClick={() => setSeccion(item.key)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm w-full text-left transition-all"
                style={{
                  background: seccion === item.key ? 'rgba(200,245,100,0.12)' : 'transparent',
                  color: seccion === item.key ? '#c8f564' : 'rgba(255,255,255,0.45)',
                }}
              >
                <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
                </svg>
                {item.label}
              </button>
            ))}
          </nav>
          <div className="p-4 border-t" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium" style={{ background: '#c8f564', color: '#1a1a1a' }}>A</div>
              <div>
                <p className="text-xs font-medium text-white">Admin</p>
                <p className="text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>Baztro</p>
              </div>
            </div>
          </div>
        </div>

        {/* Contenido */}
        <div className="flex-1 flex flex-col overflow-auto">
          {seccion === 'dashboard' && <Dashboard />}
          {seccion === 'productos' && <Productos />}
          {seccion === 'ventas' && <Ventas />}
          {seccion === 'cotizaciones' && <Cotizaciones />}
        </div>
      </div>

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