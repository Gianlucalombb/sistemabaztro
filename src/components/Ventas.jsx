import { useState } from 'react'

const productosDisponibles = [
  { id: 1, nombre: 'Aceite girasol x12', precio: 4200, stock: 240 },
  { id: 2, nombre: 'Arroz largo fino 5kg', precio: 1850, stock: 180 },
  { id: 3, nombre: 'Azúcar blanca 2kg', precio: 890, stock: 12 },
  { id: 4, nombre: 'Harina 000 x10', precio: 2100, stock: 95 },
  { id: 5, nombre: 'Yerba mate 500g', precio: 650, stock: 0 },
  { id: 6, nombre: 'Jabón en polvo 3kg', precio: 1320, stock: 310 },
]

function Ventas() {
  const [cliente, setCliente] = useState('')
  const [carrito, setCarrito] = useState([])
  const [ventas, setVentas] = useState([])
  const [vista, setVista] = useState('nueva')

  function agregarAlCarrito(producto) {
    const existe = carrito.find(p => p.id === producto.id)
    if (existe) {
      setCarrito(carrito.map(p => p.id === producto.id ? { ...p, cantidad: p.cantidad + 1 } : p))
    } else {
      setCarrito([...carrito, { ...producto, cantidad: 1 }])
    }
  }

  function quitarDelCarrito(id) {
    setCarrito(carrito.filter(p => p.id !== id))
  }

  const total = carrito.reduce((acc, p) => acc + p.precio * p.cantidad, 0)

  function confirmarVenta() {
    if (!cliente || carrito.length === 0) return
    const venta = {
      id: ventas.length + 1,
      cliente,
      total,
      items: carrito.length,
      fecha: new Date().toLocaleDateString('es-AR'),
      estado: 'Pendiente',
    }
    setVentas([venta, ...ventas])
    setCarrito([])
    setCliente('')
    setVista('historial')
  }

  return (
    <div className="flex-1 flex flex-col">
      <div className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between">
        <p className="font-medium text-gray-900">Ventas</p>
        <div className="flex gap-2">
          <button
            onClick={() => setVista('nueva')}
            className={`text-xs px-4 py-2 rounded-lg ${vista === 'nueva' ? 'bg-gray-900 text-white' : 'border border-gray-200 text-gray-500'}`}
          >
            + Nueva venta
          </button>
          <button
            onClick={() => setVista('historial')}
            className={`text-xs px-4 py-2 rounded-lg ${vista === 'historial' ? 'bg-gray-900 text-white' : 'border border-gray-200 text-gray-500'}`}
          >
            Historial
          </button>
        </div>
      </div>

      <div className="p-5 flex flex-col gap-4">

        {vista === 'nueva' && (
          <div className="grid grid-cols-2 gap-4">

            {/* Productos */}
            <div className="bg-white border border-gray-200 rounded-xl p-4">
              <p className="text-sm font-medium text-gray-900 mb-3">Productos</p>
              <div className="flex flex-col gap-2">
                {productosDisponibles.map(producto => (
                  <div key={producto.id} className="flex items-center justify-between py-2 border-b border-gray-50">
                    <div>
                      <p className="text-xs font-medium text-gray-900">{producto.nombre}</p>
                      <p className="text-xs text-gray-400">${producto.precio.toLocaleString()} · {producto.stock} en stock</p>
                    </div>
                    <button
                      onClick={() => agregarAlCarrito(producto)}
                      disabled={producto.stock === 0}
                      className="text-xs border border-gray-200 px-3 py-1 rounded-lg text-gray-500 hover:bg-gray-50 disabled:opacity-30"
                    >
                      + añadir
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Carrito */}
            <div className="bg-white border border-gray-200 rounded-xl p-4 flex flex-col">
              <p className="text-sm font-medium text-gray-900 mb-3">Resumen del pedido</p>

              <div className="mb-4">
                <label className="text-xs text-gray-400 block mb-1">Cliente</label>
                <input
                  type="text"
                  value={cliente}
                  onChange={(e) => setCliente(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-gray-400"
                  placeholder="Nombre del cliente"
                />
              </div>

              {carrito.length === 0 ? (
                <p className="text-xs text-gray-300 text-center py-8">Agregá productos al pedido</p>
              ) : (
                <div className="flex flex-col gap-2 flex-1">
                  {carrito.map(item => (
                    <div key={item.id} className="flex items-center justify-between text-xs py-2 border-b border-gray-50">
                      <span className="text-gray-900">{item.nombre} <span className="text-gray-400">x{item.cantidad}</span></span>
                      <div className="flex items-center gap-2">
                        <span>${(item.precio * item.cantidad).toLocaleString()}</span>
                        <button onClick={() => quitarDelCarrito(item.id)} className="text-gray-300 hover:text-red-400">✕</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="border-t border-gray-100 mt-4 pt-4 flex items-center justify-between">
                <p className="text-sm font-medium text-gray-900">Total</p>
                <p className="text-lg font-medium text-gray-900">${total.toLocaleString()}</p>
              </div>

              <button
                onClick={confirmarVenta}
                disabled={!cliente || carrito.length === 0}
                className="mt-4 bg-gray-900 text-white text-sm py-2 rounded-lg disabled:opacity-30"
              >
                Confirmar venta
              </button>
            </div>
          </div>
        )}

        {vista === 'historial' && (
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
            {ventas.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-gray-300 text-sm">Todavía no hay ventas registradas</p>
                <button onClick={() => setVista('nueva')} className="mt-3 text-xs text-gray-400 underline">Registrar primera venta</button>
              </div>
            ) : (
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-gray-100 text-gray-400">
                    <th className="text-left px-4 py-3 font-normal">#</th>
                    <th className="text-left px-4 py-3 font-normal">Cliente</th>
                    <th className="text-left px-4 py-3 font-normal">Fecha</th>
                    <th className="text-left px-4 py-3 font-normal">Items</th>
                    <th className="text-left px-4 py-3 font-normal">Total</th>
                    <th className="text-left px-4 py-3 font-normal">Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {ventas.map(venta => (
                    <tr key={venta.id} className="border-b border-gray-50 hover:bg-gray-50">
                      <td className="px-4 py-3 text-gray-400">#{venta.id}</td>
                      <td className="px-4 py-3 font-medium text-gray-900">{venta.cliente}</td>
                      <td className="px-4 py-3 text-gray-400">{venta.fecha}</td>
                      <td className="px-4 py-3 text-gray-400">{venta.items} productos</td>
                      <td className="px-4 py-3">${venta.total.toLocaleString()}</td>
                      <td className="px-4 py-3"><span className="bg-yellow-50 text-yellow-700 px-2 py-1 rounded-full">{venta.estado}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

      </div>
    </div>
  )
}

export default Ventas