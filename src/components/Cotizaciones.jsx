import { useState } from 'react'

const productosDisponibles = [
  { id: 1, nombre: 'Aceite girasol x12', precio: 4200 },
  { id: 2, nombre: 'Arroz largo fino 5kg', precio: 1850 },
  { id: 3, nombre: 'Azúcar blanca 2kg', precio: 890 },
  { id: 4, nombre: 'Harina 000 x10', precio: 2100 },
  { id: 5, nombre: 'Yerba mate 500g', precio: 650 },
  { id: 6, nombre: 'Jabón en polvo 3kg', precio: 1320 },
]

function Cotizaciones() {
  const [cliente, setCliente] = useState('')
  const [validez, setValidez] = useState('7')
  const [descuento, setDescuento] = useState(0)
  const [items, setItems] = useState([])
  const [cotizaciones, setCotizaciones] = useState([])
  const [vista, setVista] = useState('nueva')

  function agregarItem(producto) {
    const existe = items.find(p => p.id === producto.id)
    if (existe) {
      setItems(items.map(p => p.id === producto.id ? { ...p, cantidad: p.cantidad + 1 } : p))
    } else {
      setItems([...items, { ...producto, cantidad: 1 }])
    }
  }

  function quitarItem(id) {
    setItems(items.filter(p => p.id !== id))
  }

  function cambiarCantidad(id, cantidad) {
    if (cantidad < 1) return
    setItems(items.map(p => p.id === id ? { ...p, cantidad: Number(cantidad) } : p))
  }

  const subtotal = items.reduce((acc, p) => acc + p.precio * p.cantidad, 0)
  const descuentoMonto = subtotal * (descuento / 100)
  const total = subtotal - descuentoMonto

  function guardarCotizacion() {
    if (!cliente || items.length === 0) return
    const cotizacion = {
      id: cotizaciones.length + 1,
      cliente,
      validez,
      descuento,
      items,
      subtotal,
      total,
      fecha: new Date().toLocaleDateString('es-AR'),
      estado: 'Borrador',
    }
    setCotizaciones([cotizacion, ...cotizaciones])
    setCliente('')
    setItems([])
    setDescuento(0)
    setVista('historial')
  }

  return (
    <div className="flex-1 flex flex-col">
      <div className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between">
        <p className="font-medium text-gray-900">Cotizaciones</p>
        <div className="flex gap-2">
          <button
            onClick={() => setVista('nueva')}
            className={`text-xs px-4 py-2 rounded-lg ${vista === 'nueva' ? 'bg-gray-900 text-white' : 'border border-gray-200 text-gray-500'}`}
          >
            + Nueva cotización
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
                      <p className="text-xs text-gray-400">${producto.precio.toLocaleString()}</p>
                    </div>
                    <button
                      onClick={() => agregarItem(producto)}
                      className="text-xs border border-gray-200 px-3 py-1 rounded-lg text-gray-500 hover:bg-gray-50"
                    >
                      + añadir
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Cotización */}
            <div className="bg-white border border-gray-200 rounded-xl p-4 flex flex-col gap-4">
              <p className="text-sm font-medium text-gray-900">Detalle de cotización</p>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-gray-400 block mb-1">Cliente *</label>
                  <input
                    type="text"
                    value={cliente}
                    onChange={(e) => setCliente(e.target.value)}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-gray-400"
                    placeholder="Nombre del cliente"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-400 block mb-1">Validez (días)</label>
                  <input
                    type="number"
                    value={validez}
                    onChange={(e) => setValidez(e.target.value)}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-gray-400"
                  />
                </div>
              </div>

              {items.length === 0 ? (
                <p className="text-xs text-gray-300 text-center py-6">Agregá productos a la cotización</p>
              ) : (
                <div className="flex flex-col gap-1">
                  {items.map(item => (
                    <div key={item.id} className="flex items-center gap-2 text-xs py-2 border-b border-gray-50">
                      <p className="flex-1 text-gray-900">{item.nombre}</p>
                      <input
                        type="number"
                        value={item.cantidad}
                        onChange={(e) => cambiarCantidad(item.id, e.target.value)}
                        className="w-14 border border-gray-200 rounded px-2 py-1 text-center outline-none"
                      />
                      <p className="w-20 text-right text-gray-600">${(item.precio * item.cantidad).toLocaleString()}</p>
                      <button onClick={() => quitarItem(item.id)} className="text-gray-300 hover:text-red-400">✕</button>
                    </div>
                  ))}
                </div>
              )}

              <div>
                <label className="text-xs text-gray-400 block mb-1">Descuento (%)</label>
                <input
                  type="number"
                  value={descuento}
                  onChange={(e) => setDescuento(Number(e.target.value))}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-gray-400"
                  min="0"
                  max="100"
                />
              </div>

              <div className="border-t border-gray-100 pt-3 flex flex-col gap-1">
                <div className="flex justify-between text-xs text-gray-400">
                  <span>Subtotal</span>
                  <span>${subtotal.toLocaleString()}</span>
                </div>
                {descuento > 0 && (
                  <div className="flex justify-between text-xs text-gray-400">
                    <span>Descuento ({descuento}%)</span>
                    <span>-${descuentoMonto.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm font-medium text-gray-900 mt-1">
                  <span>Total</span>
                  <span>${total.toLocaleString()}</span>
                </div>
              </div>

              <button
                onClick={guardarCotizacion}
                disabled={!cliente || items.length === 0}
                className="bg-gray-900 text-white text-sm py-2 rounded-lg disabled:opacity-30"
              >
                Guardar cotización
              </button>
            </div>
          </div>
        )}

        {vista === 'historial' && (
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
            {cotizaciones.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-gray-300 text-sm">Todavía no hay cotizaciones</p>
                <button onClick={() => setVista('nueva')} className="mt-3 text-xs text-gray-400 underline">Crear primera cotización</button>
              </div>
            ) : (
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-gray-100 text-gray-400">
                    <th className="text-left px-4 py-3 font-normal">#</th>
                    <th className="text-left px-4 py-3 font-normal">Cliente</th>
                    <th className="text-left px-4 py-3 font-normal">Fecha</th>
                    <th className="text-left px-4 py-3 font-normal">Validez</th>
                    <th className="text-left px-4 py-3 font-normal">Total</th>
                    <th className="text-left px-4 py-3 font-normal">Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {cotizaciones.map(cot => (
                    <tr key={cot.id} className="border-b border-gray-50 hover:bg-gray-50">
                      <td className="px-4 py-3 text-gray-400">#{String(cot.id).padStart(4, '0')}</td>
                      <td className="px-4 py-3 font-medium text-gray-900">{cot.cliente}</td>
                      <td className="px-4 py-3 text-gray-400">{cot.fecha}</td>
                      <td className="px-4 py-3 text-gray-400">{cot.validez} días</td>
                      <td className="px-4 py-3">${cot.total.toLocaleString()}</td>
                      <td className="px-4 py-3"><span className="bg-yellow-50 text-yellow-700 px-2 py-1 rounded-full">{cot.estado}</span></td>
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

export default Cotizaciones