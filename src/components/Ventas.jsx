import { useState, useEffect } from 'react'
import { supabase } from '../supabase'

const colores = {
  blanco: { bg: 'bg-stone-100', texto: 'text-gray-900', label: 'Blanco' },
  rojo: { bg: 'bg-red-500', texto: 'text-white', label: 'Rojo' },
  verde: { bg: 'bg-green-500', texto: 'text-white', label: 'Verde' },
  azul: { bg: 'bg-blue-500', texto: 'text-white', label: 'Azul' },
}

function SelectorColor({ valor, onChange }) {
  return (
    <div className="flex gap-1.5">
      {Object.entries(colores).map(([key, c]) => (
        <button
          key={key}
          onClick={() => onChange(key)}
          className={`w-6 h-6 rounded-full border-2 ${c.bg} ${valor === key ? 'border-gray-900' : 'border-gray-200'}`}
        />
      ))}
    </div>
  )
}


  const FormVenta = ({ datos, setDatos, onGuardar, onCancelar, titulo }) => (
    <div className="bg-stone-100 border-2 border-gray-900 rounded-xl p-4">
      <p className="text-sm font-medium text-gray-900 mb-4">{titulo}</p>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 mb-4">
        <div>
          <label className="text-xs text-gray-400 block mb-1">Fecha</label>
          <input type="date" value={datos.fecha} onChange={(e) => setDatos({ ...datos, fecha: e.target.value })} className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none bg-stone-100" />
        </div>
        <div>
          <label className="text-xs text-gray-400 block mb-1">Cliente</label>
          <input type="text" value={datos.cliente} onChange={(e) => setDatos({ ...datos, cliente: e.target.value })} className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none bg-stone-100" placeholder="Nombre del cliente" />
        </div>
        <div>
          <label className="text-xs text-gray-400 block mb-1">Quién cobró</label>
          <select value={datos.quien} onChange={(e) => setDatos({ ...datos, quien: e.target.value })} className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none bg-stone-100">
            <option>Yo</option>
            <option>Fábrica</option>
          </select>
        </div>
        <div>
          <label className="text-xs text-gray-400 block mb-1">Costo</label>
          <div className="relative">
            <span className="absolute left-3 top-2.5 text-sm text-gray-400">$</span>
            <input type="number" value={datos.costo} onChange={(e) => setDatos({ ...datos, costo: e.target.value })} className="w-full border border-gray-200 rounded-lg pl-7 pr-3 py-2.5 text-sm outline-none bg-stone-100" placeholder="0" />
          </div>
        </div>
        <div>
          <label className="text-xs text-gray-400 block mb-1">Venta</label>
          <div className="relative">
            <span className="absolute left-3 top-2.5 text-sm text-gray-400">$</span>
            <input type="number" value={datos.venta} onChange={(e) => setDatos({ ...datos, venta: e.target.value })} className="w-full border border-gray-200 rounded-lg pl-7 pr-3 py-2.5 text-sm outline-none bg-stone-100" placeholder="0" />
          </div>
        </div>
        <div>
          <label className="text-xs text-gray-400 block mb-1">Ganancia</label>
          <div className="w-full border border-gray-100 bg-gray-50 rounded-lg px-3 py-2.5 text-sm text-gray-500">
            ${((Number(datos.venta) || 0) - (Number(datos.costo) || 0)).toLocaleString()}
          </div>
        </div>
        <div>
          <label className="text-xs text-gray-400 block mb-2">Debe</label>
          <div className="relative mb-2">
            <span className="absolute left-3 top-2.5 text-sm text-gray-400">$</span>
            <input type="number" value={datos.debe} onChange={(e) => setDatos({ ...datos, debe: e.target.value })} className="w-full border border-gray-200 rounded-lg pl-7 pr-3 py-2.5 text-sm outline-none bg-stone-100" placeholder="0" />
          </div>
          <SelectorColor valor={datos.debe_color} onChange={(c) => setDatos({ ...datos, debe_color: c })} />
        </div>
        <div>
          <label className="text-xs text-gray-400 block mb-2">Haber</label>
          <div className="relative mb-2">
            <span className="absolute left-3 top-2.5 text-sm text-gray-400">$</span>
            <input type="number" value={datos.haber} onChange={(e) => setDatos({ ...datos, haber: e.target.value })} className="w-full border border-gray-200 rounded-lg pl-7 pr-3 py-2.5 text-sm outline-none bg-stone-100" placeholder="0" />
          </div>
          <SelectorColor valor={datos.haber_color} onChange={(c) => setDatos({ ...datos, haber_color: c })} />
        </div>
      </div>
      <div className="flex gap-2">
        <button onClick={onGuardar} className="text-white text-xs px-4 py-2 rounded-lg" style={{ background: '#1a1a1a' }}>Guardar</button>
        <button onClick={onCancelar} className="border border-gray-200 text-gray-500 text-xs px-4 py-2 rounded-lg">Cancelar</button>
      </div>
    </div>
  )


function Ventas() {
  const [ventas, setVentas] = useState([])
  const [cargando, setCargando] = useState(true)
  const [mostrarForm, setMostrarForm] = useState(false)
  const [editando, setEditando] = useState(null)
  const [filtro, setFiltro] = useState('todos')
  const [nueva, setNueva] = useState({
    fecha: new Date().toISOString().split('T')[0],
    cliente: '',
    costo: '',
    venta: '',
    debe: '',
    debe_color: 'blanco',
    haber: '',
    haber_color: 'blanco',
    quien: 'Yo',
  })

  useEffect(() => {
    cargarVentas()
    const intervalo = setInterval(cargarVentas, 15000)
    return () => clearInterval(intervalo)
  }, [])

  async function cargarVentas() {
    setCargando(true)
    const { data } = await supabase.from('ventas').select('*').order('id', { ascending: false })
    if (data) setVentas(data)
    setCargando(false)
  }

  async function agregarVenta() {
    if (!nueva.fecha) return
    const { data } = await supabase.from('ventas').insert([{
      fecha: nueva.fecha,
      cliente: nueva.cliente,
      costo: Number(nueva.costo) || 0,
      venta: Number(nueva.venta) || 0,
      debe: Number(nueva.debe) || 0,
      debe_color: nueva.debe_color,
      haber: Number(nueva.haber) || 0,
      haber_color: nueva.haber_color,
      quien: nueva.quien,
    }]).select()
    if (data) setVentas([data[0], ...ventas])
    setNueva({
      fecha: new Date().toISOString().split('T')[0],
      cliente: '',
      costo: '',
      venta: '',
      debe: '',
      debe_color: 'blanco',
      haber: '',
      haber_color: 'blanco',
      quien: 'Yo',
    })
    setMostrarForm(false)
  }

  async function borrarVenta(id) {
    if (!confirm('¿Seguro que querés borrar esta venta?')) return
    await supabase.from('ventas').delete().eq('id', id)
    setVentas(ventas.filter(v => v.id !== id))
  }

  async function guardarEdicion() {
    if (!editando.fecha) return
    const { data } = await supabase.from('ventas').update({
      fecha: editando.fecha,
      cliente: editando.cliente,
      costo: Number(editando.costo) || 0,
      venta: Number(editando.venta) || 0,
      debe: Number(editando.debe) || 0,
      debe_color: editando.debe_color,
      haber: Number(editando.haber) || 0,
      haber_color: editando.haber_color,
      quien: editando.quien,
    }).eq('id', editando.id).select()
    if (data) setVentas(ventas.map(v => v.id === editando.id ? data[0] : v))
    setEditando(null)
  }

  const BASE_GANANCIA = 5173317
  const BASE_VENTAS = 104

  const ahora = new Date()
  const inicioSemana = new Date(ahora)
  inicioSemana.setDate(ahora.getDate() - 7)
  const inicioMes = new Date(ahora.getFullYear(), ahora.getMonth(), 1)

  const ventasFiltradas = ventas.filter(v => {
    const fecha = new Date(v.fecha + 'T12:00:00')
    if (filtro === 'semana') return fecha >= inicioSemana
    if (filtro === 'mes') return fecha >= inicioMes
    return true
  })

  const gananciaFiltrada = ventasFiltradas.reduce((acc, v) => acc + (v.ganancia || 0), 0)
  const gananciaTotal = filtro === 'todos' ? BASE_GANANCIA + gananciaFiltrada : gananciaFiltrada
  const ultimoNumero = ventas.length > 0 ? Math.max(...ventas.map(v => v.id)) : BASE_VENTAS


  return (
    <div className="flex-1 flex flex-col overflow-auto">
      <div className="bg-stone-100 border-b border-gray-200 px-4 lg:px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <p className="font-medium text-gray-900">Ventas</p>
          <div className="flex gap-0.5 bg-gray-100 rounded-lg p-0.5">
            {[
              { key: 'todos', label: 'Todos' },
              { key: 'semana', label: 'Semana' },
              { key: 'mes', label: 'Mes' },
            ].map(f => (
              <button
                key={f.key}
                onClick={() => setFiltro(f.key)}
                className="text-xs px-2.5 py-1.5 rounded-md transition-all"
                style={{
                  background: filtro === f.key ? 'white' : 'transparent',
                  color: filtro === f.key ? '#1a1a1a' : '#9ca3af',
                  boxShadow: filtro === f.key ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                }}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
        <button
          onClick={() => { setMostrarForm(!mostrarForm); setEditando(null) }}
          className="text-white text-xs px-3 py-2 rounded-lg"
          style={{ background: '#1a1a1a' }}
        >
          + Nueva
        </button>
      </div>

      <div className="p-4 lg:p-5 flex flex-col gap-4">

        <div className="grid grid-cols-2 gap-3">
          <div className="bg-stone-100 border border-gray-200 rounded-xl p-4">
            <p className="text-xs text-gray-400 mb-1">
              {filtro === 'todos' ? 'Venta actual' : filtro === 'semana' ? 'Ventas semana' : 'Ventas mes'}
            </p>
            <p className="text-2xl font-medium text-gray-900">
              {filtro === 'todos' ? `#${ultimoNumero}` : ventasFiltradas.length}
            </p>
          </div>
          <div className="bg-stone-100 border border-gray-200 rounded-xl p-4">
            <p className="text-xs text-gray-400 mb-1">
              {filtro === 'todos' ? 'Ganancia acumulada' : filtro === 'semana' ? 'Ganancia semana' : 'Ganancia mes'}
            </p>
            <p className="text-xl font-medium text-gray-900">${gananciaTotal.toLocaleString()}</p>
          </div>
        </div>

        {editando && (
          <FormVenta
            datos={editando}
            setDatos={setEditando}
            onGuardar={guardarEdicion}
            onCancelar={() => setEditando(null)}
            titulo={`Editando venta #${editando.id}`}
          />
        )}

        {mostrarForm && (
          <FormVenta
            datos={nueva}
            setDatos={setNueva}
            onGuardar={agregarVenta}
            onCancelar={() => setMostrarForm(false)}
            titulo="Nueva venta"
          />
        )}

        {/* Tabla desktop */}
        <div className="hidden lg:block bg-stone-100 border border-gray-200 rounded-xl overflow-hidden">
          {cargando ? (
            <p className="text-xs text-gray-300 text-center py-12">Cargando ventas...</p>
          ) : ventasFiltradas.length === 0 ? (
            <p className="text-xs text-gray-300 text-center py-12">No hay ventas en este período</p>
          ) : (
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-gray-100 text-gray-400">
                  <th className="text-left px-4 py-3 font-normal">#</th>
                  <th className="text-left px-4 py-3 font-normal">Fecha</th>
                  <th className="text-left px-4 py-3 font-normal">Cliente</th>
                  <th className="text-left px-4 py-3 font-normal">Costo</th>
                  <th className="text-left px-4 py-3 font-normal">Venta</th>
                  <th className="text-left px-4 py-3 font-normal">Ganancia</th>
                  <th className="text-left px-4 py-3 font-normal">Debe</th>
                  <th className="text-left px-4 py-3 font-normal">Haber</th>
                  <th className="text-left px-4 py-3 font-normal">Quién</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {ventasFiltradas.map(v => {
                  const debeColor = colores[v.debe_color] || colores.blanco
                  const haberColor = colores[v.haber_color] || colores.blanco
                  return (
                    <tr key={v.id} className="border-b border-gray-50 hover:bg-gray-50">
                      <td className="px-4 py-3 text-gray-400">{v.id}</td>
                      <td className="px-4 py-3 text-gray-400">{new Date(v.fecha + 'T12:00:00').toLocaleDateString('es-AR')}</td>
                      <td className="px-4 py-3 font-medium text-gray-900">{v.cliente}</td>
                      <td className="px-4 py-3">${(v.costo || 0).toLocaleString()}</td>
                      <td className="px-4 py-3">${(v.venta || 0).toLocaleString()}</td>
                      <td className="px-4 py-3 font-medium text-green-700">${(v.ganancia || 0).toLocaleString()}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded-lg font-medium ${debeColor.bg} ${debeColor.texto}`}>${(v.debe || 0).toLocaleString()}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded-lg font-medium ${haberColor.bg} ${haberColor.texto}`}>${(v.haber || 0).toLocaleString()}</span>
                      </td>
                      <td className="px-4 py-3 text-gray-400">{v.quien}</td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button onClick={() => { setEditando(v); setMostrarForm(false) }} className="text-gray-400 hover:text-gray-700 text-xs border border-gray-200 px-2 py-1 rounded-lg hover:bg-gray-50">Editar</button>
                          <button onClick={() => borrarVenta(v.id)} className="text-red-400 hover:text-red-600 text-xs border border-red-100 px-2 py-1 rounded-lg hover:bg-red-50">Borrar</button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          )}
        </div>

        {/* Tarjetas mobile */}
        <div className="lg:hidden flex flex-col gap-3">
          {cargando ? (
            <p className="text-xs text-gray-300 text-center py-12">Cargando ventas...</p>
          ) : ventasFiltradas.length === 0 ? (
            <p className="text-xs text-gray-300 text-center py-12">No hay ventas en este período</p>
          ) : (
            ventasFiltradas.map(v => {
              const debeColor = colores[v.debe_color] || colores.blanco
              const haberColor = colores[v.haber_color] || colores.blanco
              return (
                <div key={v.id} className="bg-stone-100 border border-gray-200 rounded-xl p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{v.cliente}</p>
                      <p className="text-xs text-gray-400 mt-0.5">#{v.id} · {new Date(v.fecha + 'T12:00:00').toLocaleDateString('es-AR')} · {v.quien}</p>
                    </div>
                    <p className="text-sm font-medium text-green-700">${(v.ganancia || 0).toLocaleString()}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-2 mb-3">
                    <div className="bg-gray-50 rounded-lg p-2">
                      <p className="text-xs text-gray-400">Costo</p>
                      <p className="text-sm font-medium">${(v.costo || 0).toLocaleString()}</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-2">
                      <p className="text-xs text-gray-400">Venta</p>
                      <p className="text-sm font-medium">${(v.venta || 0).toLocaleString()}</p>
                    </div>
                    <div className={`rounded-lg p-2 ${debeColor.bg}`}>
                      <p className={`text-xs ${debeColor.texto} opacity-70`}>Debe</p>
                      <p className={`text-sm font-medium ${debeColor.texto}`}>${(v.debe || 0).toLocaleString()}</p>
                    </div>
                    <div className={`rounded-lg p-2 ${haberColor.bg}`}>
                      <p className={`text-xs ${haberColor.texto} opacity-70`}>Haber</p>
                      <p className={`text-sm font-medium ${haberColor.texto}`}>${(v.haber || 0).toLocaleString()}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => { setEditando(v); setMostrarForm(false) }} className="flex-1 text-xs border border-gray-200 py-2 rounded-lg text-gray-500">Editar</button>
                    <button onClick={() => borrarVenta(v.id)} className="flex-1 text-xs border border-red-100 py-2 rounded-lg text-red-400">Borrar</button>
                  </div>
                </div>
              )
            })
          )}
        </div>

      </div>
    </div>
  )
}

export default Ventas