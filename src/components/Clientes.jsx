import { useState, useEffect } from 'react'
import { supabase } from '../supabase'

function Clientes() {
  const [clientes, setClientes] = useState([])
  const [busqueda, setBusqueda] = useState('')
  const [mostrarForm, setMostrarForm] = useState(false)
  const [nuevoCliente, setNuevoCliente] = useState({ nombre: '', email: '', telefono: '', direccion: '' })
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    cargarClientes()
  }, [])

  async function cargarClientes() {
    setCargando(true)
    const { data } = await supabase.from('clientes').select('*').order('created_at', { ascending: false })
    if (data) setClientes(data)
    setCargando(false)
  }

  async function agregarCliente() {
    if (!nuevoCliente.nombre) return
    const { data } = await supabase.from('clientes').insert([{
      nombre: nuevoCliente.nombre,
      email: nuevoCliente.email,
      telefono: nuevoCliente.telefono,
      direccion: nuevoCliente.direccion,
    }]).select()
    if (data) setClientes([data[0], ...clientes])
    setNuevoCliente({ nombre: '', email: '', telefono: '', direccion: '' })
    setMostrarForm(false)
  }

  const clientesFiltrados = clientes.filter(c =>
    c.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
    c.email?.toLowerCase().includes(busqueda.toLowerCase())
  )

  return (
    <div className="flex-1 flex flex-col">
      <div className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between">
        <p className="font-medium text-gray-900">Clientes</p>
        <button
          onClick={() => setMostrarForm(true)}
          className="bg-gray-900 text-white text-xs px-4 py-2 rounded-lg"
        >
          + Nuevo cliente
        </button>
      </div>

      <div className="p-5 flex flex-col gap-4">

        {mostrarForm && (
          <div className="bg-white border border-gray-200 rounded-xl p-4">
            <p className="text-sm font-medium text-gray-900 mb-4">Nuevo cliente</p>
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div>
                <label className="text-xs text-gray-400 block mb-1">Nombre *</label>
                <input
                  type="text"
                  value={nuevoCliente.nombre}
                  onChange={(e) => setNuevoCliente({ ...nuevoCliente, nombre: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-gray-400"
                  placeholder="Ej: Distribuidora López"
                />
              </div>
              <div>
                <label className="text-xs text-gray-400 block mb-1">Email</label>
                <input
                  type="email"
                  value={nuevoCliente.email}
                  onChange={(e) => setNuevoCliente({ ...nuevoCliente, email: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-gray-400"
                  placeholder="cliente@gmail.com"
                />
              </div>
              <div>
                <label className="text-xs text-gray-400 block mb-1">Teléfono</label>
                <input
                  type="text"
                  value={nuevoCliente.telefono}
                  onChange={(e) => setNuevoCliente({ ...nuevoCliente, telefono: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-gray-400"
                  placeholder="11-1234-5678"
                />
              </div>
              <div>
                <label className="text-xs text-gray-400 block mb-1">Dirección</label>
                <input
                  type="text"
                  value={nuevoCliente.direccion}
                  onChange={(e) => setNuevoCliente({ ...nuevoCliente, direccion: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-gray-400"
                  placeholder="Av. Corrientes 1234, CABA"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={agregarCliente} className="bg-gray-900 text-white text-xs px-4 py-2 rounded-lg">Guardar cliente</button>
              <button onClick={() => setMostrarForm(false)} className="border border-gray-200 text-gray-500 text-xs px-4 py-2 rounded-lg">Cancelar</button>
            </div>
          </div>
        )}

        <div className="bg-white border border-gray-200 rounded-xl px-4 py-2 flex items-center gap-2">
          <span className="text-gray-400">🔍</span>
          <input
            type="text"
            placeholder="Buscar cliente, email..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="flex-1 text-sm outline-none"
          />
        </div>

        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          {cargando ? (
            <p className="text-xs text-gray-300 text-center py-12">Cargando clientes...</p>
          ) : (
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-gray-100 text-gray-400">
                  <th className="text-left px-4 py-3 font-normal">Nombre</th>
                  <th className="text-left px-4 py-3 font-normal">Email</th>
                  <th className="text-left px-4 py-3 font-normal">Teléfono</th>
                  <th className="text-left px-4 py-3 font-normal">Dirección</th>
                </tr>
              </thead>
              <tbody>
                {clientesFiltrados.length === 0 ? (
                  <tr><td colSpan="4" className="text-center py-12 text-gray-300">No hay clientes todavía</td></tr>
                ) : (
                  clientesFiltrados.map(cliente => (
                    <tr key={cliente.id} className="border-b border-gray-50 hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium text-gray-900">{cliente.nombre}</td>
                      <td className="px-4 py-3 text-gray-400">{cliente.email}</td>
                      <td className="px-4 py-3 text-gray-400">{cliente.telefono}</td>
                      <td className="px-4 py-3 text-gray-400">{cliente.direccion}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>

      </div>
    </div>
  )
}

export default Clientes