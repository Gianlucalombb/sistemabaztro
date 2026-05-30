import { useState, useEffect } from 'react'
import { supabase } from '../supabase'

function Productos() {
  const [productos, setProductos] = useState([])
  const [busqueda, setBusqueda] = useState('')
  const [mostrarForm, setMostrarForm] = useState(false)
  const [nuevoProducto, setNuevoProducto] = useState({ nombre: '', categoria: '', precio: '', stock: '' })
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
    if (!nuevoProducto.nombre || !nuevoProducto.precio) return
    const { data } = await supabase.from('productos').insert([{
      nombre: nuevoProducto.nombre,
      categoria: nuevoProducto.categoria || 'Sin categoría',
      precio: Number(nuevoProducto.precio),
      stock: Number(nuevoProducto.stock) || 0,
    }]).select()
    if (data) setProductos([data[0], ...productos])
    setNuevoProducto({ nombre: '', categoria: '', precio: '', stock: '' })
    setMostrarForm(false)
  }

  function getEstado(producto) {
    if (producto.stock === 0) return { texto: 'Sin stock', clase: 'bg-red-50 text-red-700' }
    if (producto.stock < 20) return { texto: 'Stock bajo', clase: 'bg-yellow-50 text-yellow-700' }
    return { texto: 'Activo', clase: 'bg-green-50 text-green-700' }
  }

  const productosFiltrados = productos.filter(p =>
    p.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
    p.categoria?.toLowerCase().includes(busqueda.toLowerCase())
  )

  return (
    <div className="flex-1 flex flex-col">
      <div className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between">
        <p className="font-medium text-gray-900">Productos</p>
        <button
          onClick={() => setMostrarForm(true)}
          className="bg-gray-900 text-white text-xs px-4 py-2 rounded-lg"
        >
          + Nuevo producto
        </button>
      </div>

      <div className="p-5 flex flex-col gap-4">

        {mostrarForm && (
          <div className="bg-white border border-gray-200 rounded-xl p-4">
            <p className="text-sm font-medium text-gray-900 mb-4">Nuevo producto</p>
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div>
                <label className="text-xs text-gray-400 block mb-1">Nombre *</label>
                <input
                  type="text"
                  value={nuevoProducto.nombre}
                  onChange={(e) => setNuevoProducto({ ...nuevoProducto, nombre: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-gray-400"
                  placeholder="Ej: Aceite girasol x12"
                />
              </div>
              <div>
                <label className="text-xs text-gray-400 block mb-1">Categoría</label>
                <input
                  type="text"
                  value={nuevoProducto.categoria}
                  onChange={(e) => setNuevoProducto({ ...nuevoProducto, categoria: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-gray-400"
                  placeholder="Ej: Aceites"
                />
              </div>
              <div>
                <label className="text-xs text-gray-400 block mb-1">Precio mayorista *</label>
                <input
                  type="number"
                  value={nuevoProducto.precio}
                  onChange={(e) => setNuevoProducto({ ...nuevoProducto, precio: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-gray-400"
                  placeholder="Ej: 4200"
                />
              </div>
              <div>
                <label className="text-xs text-gray-400 block mb-1">Stock inicial</label>
                <input
                  type="number"
                  value={nuevoProducto.stock}
                  onChange={(e) => setNuevoProducto({ ...nuevoProducto, stock: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-gray-400"
                  placeholder="Ej: 100"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={agregarProducto} className="bg-gray-900 text-white text-xs px-4 py-2 rounded-lg">Guardar producto</button>
              <button onClick={() => setMostrarForm(false)} className="border border-gray-200 text-gray-500 text-xs px-4 py-2 rounded-lg">Cancelar</button>
            </div>
          </div>
        )}

        <div className="bg-white border border-gray-200 rounded-xl px-4 py-2 flex items-center gap-2">
          <span className="text-gray-400">🔍</span>
          <input
            type="text"
            placeholder="Buscar producto, categoría..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="flex-1 text-sm outline-none"
          />
        </div>

        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          {cargando ? (
            <p className="text-xs text-gray-300 text-center py-12">Cargando productos...</p>
          ) : (
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-gray-100 text-gray-400">
                  <th className="text-left px-4 py-3 font-normal">Producto</th>
                  <th className="text-left px-4 py-3 font-normal">Categoría</th>
                  <th className="text-left px-4 py-3 font-normal">Precio may.</th>
                  <th className="text-left px-4 py-3 font-normal">Stock</th>
                  <th className="text-left px-4 py-3 font-normal">Estado</th>
                </tr>
              </thead>
              <tbody>
                {productosFiltrados.length === 0 ? (
                  <tr><td colSpan="5" className="text-center py-12 text-gray-300">No hay productos todavía</td></tr>
                ) : (
                  productosFiltrados.map((producto) => {
                    const estado = getEstado(producto)
                    return (
                      <tr key={producto.id} className="border-b border-gray-50 hover:bg-gray-50">
                        <td className="px-4 py-3 font-medium text-gray-900">{producto.nombre}</td>
                        <td className="px-4 py-3 text-gray-400">{producto.categoria}</td>
                        <td className="px-4 py-3">${producto.precio.toLocaleString()}</td>
                        <td className="px-4 py-3">{producto.stock} un.</td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 rounded-full ${estado.clase}`}>{estado.texto}</span>
                        </td>
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          )}
        </div>

      </div>
    </div>
  )
}

export default Productos