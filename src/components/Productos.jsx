import { useState, useEffect } from 'react'
import { supabase } from '../supabase'
import * as XLSX from 'xlsx'

function Productos() {
  const [productos, setProductos] = useState([])
  const [busqueda, setBusqueda] = useState('')
  const [categoriaFiltro, setCategoriaFiltro] = useState('todas')
  const [mostrarForm, setMostrarForm] = useState(false)
  const [editando, setEditando] = useState(null)
  const [nuevoProducto, setNuevoProducto] = useState({ nombre: '', categoria: '', precio_lista: '', precio_venta: '' })
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    cargarProductos()
  }, [])

  async function cargarProductos() {
    setCargando(true)
    const { data } = await supabase.from('productos').select('*').order('created_at', { ascending: false })
    if (data) setProductos(data)
    setCargando(false)
  }

  async function agregarProducto() {
    if (!nuevoProducto.nombre || !nuevoProducto.precio_venta) return
    const { data } = await supabase.from('productos').insert([{
      nombre: nuevoProducto.nombre,
      categoria: nuevoProducto.categoria || 'Sin categoría',
      precio_lista: Number(nuevoProducto.precio_lista) || 0,
      precio_venta: Number(nuevoProducto.precio_venta),
      precio: Number(nuevoProducto.precio_venta),
      stock: 0,
      activo: true,
    }]).select()
    if (data) setProductos([data[0], ...productos])
    setNuevoProducto({ nombre: '', categoria: '', precio_lista: '', precio_venta: '' })
    setMostrarForm(false)
  }

  async function guardarEdicion() {
    if (!editando.nombre || !editando.precio_venta) return
    const { data } = await supabase.from('productos').update({
      nombre: editando.nombre,
      categoria: editando.categoria,
      precio_lista: Number(editando.precio_lista),
      precio_venta: Number(editando.precio_venta),
      precio: Number(editando.precio_venta),
      activo: editando.activo,
    }).eq('id', editando.id).select()
    if (data) setProductos(productos.map(p => p.id === editando.id ? data[0] : p))
    setEditando(null)
  }

  async function borrarProducto(id) {
    if (!confirm('¿Seguro que querés borrar este producto?')) return
    await supabase.from('productos').delete().eq('id', id)
    setProductos(productos.filter(p => p.id !== id))
  }

  async function importarExcel(e) {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = async (evt) => {
      const workbook = XLSX.read(evt.target.result, { type: 'binary' })
      const hoja = workbook.Sheets[workbook.SheetNames[0]]
      const filas = XLSX.utils.sheet_to_json(hoja)
      const nuevos = filas.map(fila => ({
        nombre: fila['nombre'] || fila['Nombre'] || '',
        categoria: fila['categoria'] || fila['Categoría'] || 'Sin categoría',
        precio_lista: Number(fila['precio_lista'] || fila['Precio Lista'] || 0),
        precio_venta: Number(fila['precio_venta'] || fila['Precio Venta'] || 0),
        precio: Number(fila['precio_venta'] || fila['Precio Venta'] || 0),
        stock: 0,
        activo: true,
      })).filter(p => p.nombre)
      if (nuevos.length === 0) return alert('No se encontraron productos')
      const { data } = await supabase.from('productos').insert(nuevos).select()
      if (data) setProductos([...data, ...productos])
      alert(`✅ Se importaron ${nuevos.length} productos`)
    }
    reader.readAsBinaryString(file)
  }

  function getEstado(producto) {
    if (!producto.activo) return { texto: 'Inactivo', clase: 'bg-gray-100 text-gray-400' }
    return { texto: 'Activo', clase: 'bg-green-50 text-green-700' }
  }

  const categorias = ['todas', ...new Set(productos.map(p => p.categoria).filter(Boolean))]

  const productosFiltrados = productos.filter(p => {
    const coincideBusqueda = p.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      p.categoria?.toLowerCase().includes(busqueda.toLowerCase())
    const coincideCategoria = categoriaFiltro === 'todas' || p.categoria === categoriaFiltro
    return coincideBusqueda && coincideCategoria
  })

  return (
    <div className="flex-1 flex flex-col overflow-auto">
      <div className="bg-stone-100 border-b border-gray-200 px-4 lg:px-6 py-3 flex items-center justify-between">
        <p className="font-medium text-gray-900">Productos</p>
        <div className="flex gap-2">
          <label className="border border-gray-200 text-gray-500 text-xs px-3 py-2 rounded-lg cursor-pointer hover:bg-gray-50 bg-stone-100">
            Importar Excel
            <input type="file" accept=".xlsx,.xls" className="hidden" onChange={importarExcel} />
          </label>
          <button
            onClick={() => { setMostrarForm(true); setEditando(null) }}
            className="text-white text-xs px-3 py-2 rounded-lg"
            style={{ background: '#1a1a1a' }}
          >
            + Nuevo
          </button>
        </div>
      </div>

      <div className="p-4 lg:p-5 flex flex-col gap-4">

        {mostrarForm && (
          <div className="bg-stone-100 border border-gray-200 rounded-xl p-4">
            <p className="text-sm font-medium text-gray-900 mb-4">Nuevo producto</p>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 mb-4">
              <div className="lg:col-span-2">
                <label className="text-xs text-gray-400 block mb-1">Nombre *</label>
                <input type="text" value={nuevoProducto.nombre} onChange={(e) => setNuevoProducto({ ...nuevoProducto, nombre: e.target.value })} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none bg-stone-100" placeholder="Ej: Aceite girasol x12" />
              </div>
              <div>
                <label className="text-xs text-gray-400 block mb-1">Categoría</label>
                <input type="text" value={nuevoProducto.categoria} onChange={(e) => setNuevoProducto({ ...nuevoProducto, categoria: e.target.value })} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none bg-stone-100" placeholder="Ej: Aceites" />
              </div>
              <div></div>
              <div>
                <label className="text-xs text-gray-400 block mb-1">Precio lista</label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-sm text-gray-400">$</span>
                  <input type="number" value={nuevoProducto.precio_lista} onChange={(e) => setNuevoProducto({ ...nuevoProducto, precio_lista: e.target.value })} className="w-full border border-gray-200 rounded-lg pl-7 pr-3 py-2 text-sm outline-none bg-stone-100" placeholder="0" />
                </div>
              </div>
              <div>
                <label className="text-xs text-gray-400 block mb-1">Precio venta *</label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-sm text-gray-400">$</span>
                  <input type="number" value={nuevoProducto.precio_venta} onChange={(e) => setNuevoProducto({ ...nuevoProducto, precio_venta: e.target.value })} className="w-full border border-gray-200 rounded-lg pl-7 pr-3 py-2 text-sm outline-none bg-stone-100" placeholder="0" />
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={agregarProducto} className="text-white text-xs px-4 py-2 rounded-lg" style={{ background: '#1a1a1a' }}>Guardar</button>
              <button onClick={() => setMostrarForm(false)} className="border border-gray-200 text-gray-500 text-xs px-4 py-2 rounded-lg">Cancelar</button>
            </div>
          </div>
        )}

        {editando && (
          <div className="bg-stone-100 border-2 border-gray-900 rounded-xl p-4">
            <p className="text-sm font-medium text-gray-900 mb-4">Editando producto</p>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 mb-4">
              <div className="lg:col-span-2">
                <label className="text-xs text-gray-400 block mb-1">Nombre *</label>
                <input type="text" value={editando.nombre} onChange={(e) => setEditando({ ...editando, nombre: e.target.value })} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none bg-stone-100" />
              </div>
              <div>
                <label className="text-xs text-gray-400 block mb-1">Categoría</label>
                <input type="text" value={editando.categoria} onChange={(e) => setEditando({ ...editando, categoria: e.target.value })} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none bg-stone-100" />
              </div>
              <div></div>
              <div>
                <label className="text-xs text-gray-400 block mb-1">Precio lista</label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-sm text-gray-400">$</span>
                  <input type="number" value={editando.precio_lista} onChange={(e) => setEditando({ ...editando, precio_lista: e.target.value })} className="w-full border border-gray-200 rounded-lg pl-7 pr-3 py-2 text-sm outline-none bg-stone-100" />
                </div>
              </div>
              <div>
                <label className="text-xs text-gray-400 block mb-1">Precio venta *</label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-sm text-gray-400">$</span>
                  <input type="number" value={editando.precio_venta} onChange={(e) => setEditando({ ...editando, precio_venta: e.target.value })} className="w-full border border-gray-200 rounded-lg pl-7 pr-3 py-2 text-sm outline-none bg-stone-100" />
                </div>
              </div>
              <div className="lg:col-span-2 flex items-center gap-3">
                <div
                  onClick={() => setEditando({ ...editando, activo: !editando.activo })}
                  className="w-10 h-5 rounded-full transition-colors cursor-pointer flex-shrink-0"
                  style={{ background: editando.activo ? '#1a1a1a' : '#e5e7eb' }}
                >
                  <div className={`w-4 h-4 bg-white rounded-full mt-0.5 transition-transform ${editando.activo ? 'translate-x-5' : 'translate-x-0.5'}`}></div>
                </div>
                <span className="text-sm text-gray-600">{editando.activo ? 'Producto activo' : 'Producto inactivo'}</span>
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={guardarEdicion} className="text-white text-xs px-4 py-2 rounded-lg" style={{ background: '#1a1a1a' }}>Guardar cambios</button>
              <button onClick={() => setEditando(null)} className="border border-gray-200 text-gray-500 text-xs px-4 py-2 rounded-lg">Cancelar</button>
            </div>
          </div>
        )}

        <div className="flex gap-3">
          <div className="bg-stone-100 border border-gray-200 rounded-xl px-4 py-2 flex items-center gap-2 flex-1">
            <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
            <input type="text" placeholder="Buscar producto..." value={busqueda} onChange={(e) => setBusqueda(e.target.value)} className="flex-1 text-sm outline-none bg-transparent" />
          </div>
          <select
            value={categoriaFiltro}
            onChange={(e) => setCategoriaFiltro(e.target.value)}
            className="bg-stone-100 border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none text-gray-600"
          >
            {categorias.map(cat => (
              <option key={cat} value={cat}>{cat === 'todas' ? 'Todas' : cat}</option>
            ))}
          </select>
        </div>

        {/* Tabla desktop */}
        <div className="hidden lg:block bg-stone-100 border border-gray-200 rounded-xl overflow-hidden">
          {cargando ? (
            <p className="text-xs text-gray-300 text-center py-12">Cargando productos...</p>
          ) : (
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-gray-100 text-gray-400">
                  <th className="text-left px-4 py-3 font-normal">Producto</th>
                  <th className="text-left px-4 py-3 font-normal">Categoría</th>
                  <th className="text-left px-4 py-3 font-normal">Precio lista</th>
                  <th className="text-left px-4 py-3 font-normal">Precio venta</th>
                  <th className="text-left px-4 py-3 font-normal">Estado</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {productosFiltrados.length === 0 ? (
                  <tr><td colSpan="6" className="text-center py-12 text-gray-300">No hay productos</td></tr>
                ) : (
                  productosFiltrados.map((producto) => {
                    const estado = getEstado(producto)
                    return (
                      <tr key={producto.id} className={`border-b border-gray-50 hover:bg-gray-50 ${!producto.activo ? 'opacity-50' : ''}`}>
                        <td className="px-4 py-3 font-medium text-gray-900">{producto.nombre}</td>
                        <td className="px-4 py-3 text-gray-400">{producto.categoria}</td>
                        <td className="px-4 py-3 text-gray-400">${(producto.precio_lista || 0).toLocaleString()}</td>
                        <td className="px-4 py-3 font-medium">${(producto.precio_venta || 0).toLocaleString()}</td>
                        <td className="px-4 py-3"><span className={`px-2 py-1 rounded-full ${estado.clase}`}>{estado.texto}</span></td>
                        <td className="px-4 py-3 text-right flex items-center justify-end gap-1">
                          <button onClick={() => { setEditando(producto); setMostrarForm(false) }} className="text-gray-400 hover:text-gray-700 text-xs border border-gray-200 px-2 py-1 rounded-lg hover:bg-gray-50">Editar</button>
                          <button onClick={() => borrarProducto(producto.id)} className="text-red-400 hover:text-red-600 text-xs border border-red-100 px-2 py-1 rounded-lg hover:bg-red-50">Borrar</button>
                        </td>
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          )}
        </div>

        {/* Tarjetas mobile */}
        <div className="lg:hidden flex flex-col gap-3">
          {cargando ? (
            <p className="text-xs text-gray-300 text-center py-12">Cargando productos...</p>
          ) : productosFiltrados.length === 0 ? (
            <p className="text-xs text-gray-300 text-center py-12">No hay productos</p>
          ) : (
            productosFiltrados.map((producto) => {
              const estado = getEstado(producto)
              return (
                <div key={producto.id} className={`bg-stone-100 border border-gray-200 rounded-xl p-4 ${!producto.activo ? 'opacity-50' : ''}`}>
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{producto.nombre}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{producto.categoria}</p>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full ml-2 flex-shrink-0 ${estado.clase}`}>{estado.texto}</span>
                  </div>
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex gap-4">
                      <div>
                        <p className="text-xs text-gray-400">Precio lista</p>
                        <p className="text-sm text-gray-500">${(producto.precio_lista || 0).toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400">Precio venta</p>
                        <p className="text-sm font-medium text-gray-900">${(producto.precio_venta || 0).toLocaleString()}</p>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <button onClick={() => { setEditando(producto); setMostrarForm(false) }} className="text-gray-400 text-xs border border-gray-200 px-2 py-1 rounded-lg">Editar</button>
                      <button onClick={() => borrarProducto(producto.id)} className="text-red-400 text-xs border border-red-100 px-2 py-1 rounded-lg">Borrar</button>
                    </div>
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

export default Productos