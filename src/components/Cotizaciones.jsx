import { useState, useEffect } from 'react'
import { supabase } from '../supabase'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

function Cotizaciones() {
  const [productos, setProductos] = useState([])
  const [cotizaciones, setCotizaciones] = useState([])
  const [vista, setVista] = useState('nueva')
  const [cliente, setCliente] = useState('')
  const [descuento, setDescuento] = useState(0)
  const [filas, setFilas] = useState([
    { id: 1, cantidad: '', descripcion: '', precio: '', precio_lista: 0, sugerencias: [], mostrarSugerencias: false }
  ])

  useEffect(() => {
    cargarProductos()
    cargarCotizaciones()
  }, [])

  async function cargarProductos() {
    const { data } = await supabase.from('productos').select('*').eq('activo', true).order('nombre')
    if (data) setProductos(data)
  }

  async function cargarCotizaciones() {
    const { data } = await supabase.from('cotizaciones').select('*').order('created_at', { ascending: false })
    if (data) setCotizaciones(data)
  }

  function agregarFila() {
    const nuevaId = filas.length > 0 ? Math.max(...filas.map(f => f.id)) + 1 : 1
    setFilas([...filas, { id: nuevaId, cantidad: '', descripcion: '', precio: '', precio_lista: 0, sugerencias: [], mostrarSugerencias: false }])
  }

  function borrarFila(id) {
    if (filas.length === 1) return
    setFilas(filas.filter(f => f.id !== id))
  }

  function actualizarFila(id, campo, valor) {
    setFilas(filas.map(f => {
      if (f.id !== id) return f
      const actualizada = { ...f, [campo]: valor }
      if (campo === 'descripcion') {
        const sugerencias = valor.length > 1
          ? productos.filter(p => p.nombre.toLowerCase().includes(valor.toLowerCase())).slice(0, 5)
          : []
        actualizada.sugerencias = sugerencias
        actualizada.mostrarSugerencias = sugerencias.length > 0
      }
      return actualizada
    }))
  }

  function elegirProducto(filaId, producto) {
    setFilas(filas.map(f => f.id === filaId ? {
      ...f,
      descripcion: producto.nombre,
      precio: producto.precio_venta || producto.precio || '',
      precio_lista: producto.precio_lista || 0,
      sugerencias: [],
      mostrarSugerencias: false,
    } : f))
  }

  const subtotal = filas.reduce((acc, f) => acc + ((Number(f.cantidad) || 0) * (Number(f.precio) || 0)), 0)
  const costoTotal = filas.reduce((acc, f) => acc + ((Number(f.cantidad) || 0) * (Number(f.precio_lista) || 0)), 0)
  const descuentoMonto = subtotal * (descuento / 100)
  const total = subtotal - descuentoMonto
  const gananciaReal = total - costoTotal

  async function guardarCotizacion() {
    if (!cliente) return alert('Agregá un cliente')
    const itemsValidos = filas.filter(f => f.descripcion && f.cantidad && f.precio)
    if (itemsValidos.length === 0) return alert('Agregá al menos un producto')
    const { data } = await supabase.from('cotizaciones').insert([{
      cliente,
      validez: '7',
      descuento,
      subtotal,
      total,
      estado: 'Pendiente',
      items: JSON.stringify(itemsValidos),
    }]).select()
    if (data) setCotizaciones([data[0], ...cotizaciones])
    setCliente('')
    setDescuento(0)
    setFilas([{ id: 1, cantidad: '', descripcion: '', precio: '', precio_lista: 0, sugerencias: [], mostrarSugerencias: false }])
    setVista('historial')
  }

  async function cambiarEstado(id, estado) {
    await supabase.from('cotizaciones').update({ estado }).eq('id', id)
    setCotizaciones(cotizaciones.map(c => c.id === id ? { ...c, estado } : c))
  }

  async function borrarCotizacion(id) {
    if (!confirm('¿Seguro que querés borrar esta cotización?')) return
    await supabase.from('cotizaciones').delete().eq('id', id)
    setCotizaciones(cotizaciones.filter(c => c.id !== id))
  }

  function exportarPDF(cot) {
    const doc = new jsPDF()
    const items = JSON.parse(cot.items || '[]')
    const pageWidth = doc.internal.pageSize.getWidth()
    const img = new Image()
    img.src = '/logo.png'
    img.onload = () => {
      doc.addImage(img, 'PNG', pageWidth / 2 - 20, 8, 40, 28)
      doc.setFontSize(20)
      doc.setFont('helvetica', 'bold')
      doc.setTextColor(20, 20, 20)
      doc.text('Presupuesto', 14, 18)
      doc.setFontSize(9)
      doc.setFont('helvetica', 'normal')
      doc.setTextColor(120, 120, 120)
      doc.text(new Date().toLocaleDateString('es-AR'), 14, 24)
      doc.text(`Cliente: ${cot.cliente}`, 14, 30)
      doc.setFontSize(11)
      doc.setFont('helvetica', 'bold')
      doc.setTextColor(20, 20, 20)
      doc.text('Baztro Mayorista', pageWidth - 14, 14, { align: 'right' })
      doc.setFontSize(8)
      doc.setFont('helvetica', 'normal')
      doc.setTextColor(100, 100, 100)
      doc.text('Teléfono: 11-68660232', pageWidth - 14, 20, { align: 'right' })
      doc.text('Av. Juan de Garay 2537', pageWidth - 14, 25, { align: 'right' })
      doc.text('San Cristobal CABA CP: 1256', pageWidth - 14, 30, { align: 'right' })
      doc.setDrawColor(220, 220, 220)
      doc.setLineWidth(0.3)
      doc.line(14, 40, pageWidth - 14, 40)
      const subtotalCot = cot.subtotal || 0
      const descuentoMonto = subtotalCot - (cot.total || 0)
      const tieneDescuento = cot.descuento > 0
      autoTable(doc, {
        startY: 45,
        head: [['Cantidad', 'Descripción', 'Precio Unitario', 'Total']],
        body: items.map(i => [
          i.cantidad,
          i.descripcion,
          `$ ${Number(i.precio).toLocaleString('es-AR')}`,
          `$ ${(Number(i.cantidad) * Number(i.precio)).toLocaleString('es-AR')}`,
        ]),
        styles: { fontSize: 9, cellPadding: 4, textColor: [40, 40, 40] },
        headStyles: { fillColor: [20, 20, 20], textColor: [255, 255, 255], fontStyle: 'bold' },
        alternateRowStyles: { fillColor: [248, 248, 248] },
        columnStyles: {
          0: { halign: 'center', cellWidth: 25 },
          1: { cellWidth: 'auto' },
          2: { halign: 'right', cellWidth: 38 },
          3: { halign: 'right', cellWidth: 35 },
        },
        tableLineColor: [220, 220, 220],
        tableLineWidth: 0.1,
      })
      const finalY = doc.lastAutoTable.finalY + 8
      const footerX = pageWidth - 14
      doc.setFontSize(9)
      doc.setFont('helvetica', 'normal')
      doc.setTextColor(100, 100, 100)
      doc.text('Sub-Total:', footerX - 38, finalY, { align: 'right' })
      doc.setTextColor(20, 20, 20)
      doc.text(`$ ${subtotalCot.toLocaleString('es-AR')}`, footerX, finalY, { align: 'right' })
      doc.setTextColor(100, 100, 100)
      doc.text('Descuento:', footerX - 38, finalY + 7, { align: 'right' })
      doc.setTextColor(20, 20, 20)
      if (tieneDescuento) {
        doc.text(`$ ${descuentoMonto.toLocaleString('es-AR')}`, footerX, finalY + 7, { align: 'right' })
      } else {
        doc.setTextColor(150, 150, 150)
        doc.setFont('helvetica', 'italic')
        doc.text('Ya aplicado', footerX, finalY + 7, { align: 'right' })
      }
      doc.setDrawColor(180, 180, 180)
      doc.setLineWidth(0.3)
      doc.line(footerX - 65, finalY + 11, footerX, finalY + 11)
      doc.setFillColor(20, 20, 20)
      doc.roundedRect(footerX - 65, finalY + 13, 65, 11, 2, 2, 'F')
      doc.setFontSize(10)
      doc.setFont('helvetica', 'bold')
      doc.setTextColor(255, 255, 255)
      doc.text('TOTAL', footerX - 38, finalY + 20, { align: 'right' })
      doc.text(`$ ${(tieneDescuento ? cot.total : subtotalCot).toLocaleString('es-AR')}`, footerX - 2, finalY + 20, { align: 'right' })
      const footerY = 284
      doc.setDrawColor(200, 200, 200)
      doc.setLineWidth(0.3)
      doc.line(14, footerY - 5, pageWidth - 14, footerY - 5)
      doc.setFontSize(7.5)
      doc.setFont('helvetica', 'normal')
      doc.setTextColor(140, 140, 140)
      doc.text('Baztro Mayorista  ·  CUIT: 20464990640  ·  Tel: 1168660232  ·  Instagram: BaztroMayorista  ·  Facebook: Baztro Mayorista Online', pageWidth / 2, footerY, { align: 'center' })
      doc.save(`presupuesto-${cot.cliente}-${String(cot.id).padStart(4, '0')}.pdf`)
    }
  }

  function getBadge(estado) {
    if (estado === 'Confirmada') return 'bg-green-50 text-green-700'
    return 'bg-yellow-50 text-yellow-700'
  }

  return (
    <div className="flex-1 flex flex-col overflow-auto">
      <div className="bg-stone-100 border-b border-gray-200 px-4 lg:px-6 py-3 flex items-center justify-between">
        <p className="font-medium text-gray-900">Cotizaciones</p>
        <div className="flex gap-2">
          <button onClick={() => setVista('nueva')} className="text-xs px-3 py-2 rounded-lg transition-all" style={{ background: vista === 'nueva' ? '#1a1a1a' : 'transparent', color: vista === 'nueva' ? 'white' : '#9ca3af', border: vista === 'nueva' ? 'none' : '1px solid #e5e7eb' }}>+ Nueva</button>
          <button onClick={() => setVista('historial')} className="text-xs px-3 py-2 rounded-lg transition-all" style={{ background: vista === 'historial' ? '#1a1a1a' : 'transparent', color: vista === 'historial' ? 'white' : '#9ca3af', border: vista === 'historial' ? 'none' : '1px solid #e5e7eb' }}>Historial</button>
        </div>
      </div>

      <div className="p-4 lg:p-5 flex flex-col gap-4">
        {vista === 'nueva' && (
          <>
            <div className="bg-stone-100 border border-gray-200 rounded-xl p-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 mb-4">
                <div>
                  <label className="text-xs text-gray-400 block mb-1">Cliente *</label>
                  <input type="text" value={cliente} onChange={(e) => setCliente(e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none bg-stone-100" placeholder="Nombre del cliente" />
                </div>
                <div>
                  <label className="text-xs text-gray-400 block mb-1">Descuento (%)</label>
                  <input type="number" value={descuento} onChange={(e) => setDescuento(Number(e.target.value))} className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none bg-stone-100" min="0" max="100" />
                </div>
              </div>

              <div className="flex flex-col gap-2 mb-3">
                <div className="hidden lg:grid lg:grid-cols-12 gap-2 text-xs text-gray-400 px-1">
                  <div className="col-span-2">Cantidad</div>
                  <div className="col-span-5">Descripción</div>
                  <div className="col-span-3">Precio unit.</div>
                  <div className="col-span-1">Total</div>
                  <div className="col-span-1"></div>
                </div>

                {filas.map(fila => (
                  <div key={fila.id} className="grid grid-cols-12 gap-2 items-start">
                    <div className="col-span-3 lg:col-span-2">
                      <input
                        type="number"
                        value={fila.cantidad}
                        onChange={(e) => actualizarFila(fila.id, 'cantidad', e.target.value)}
                        className="w-full border border-gray-200 rounded-lg px-2 py-2.5 text-sm outline-none bg-stone-100"
                        placeholder="0"
                      />
                    </div>
                    <div className="col-span-9 lg:col-span-5 relative">
                      <input
                        type="text"
                        value={fila.descripcion}
                        onChange={(e) => actualizarFila(fila.id, 'descripcion', e.target.value)}
                        onBlur={() => setTimeout(() => actualizarFila(fila.id, 'mostrarSugerencias', false), 150)}
                        className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none bg-stone-100"
                        placeholder="Escribí para buscar..."
                      />
                      {fila.mostrarSugerencias && fila.sugerencias.length > 0 && (
                        <div className="absolute z-10 top-full left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg mt-1">
                          {fila.sugerencias.map(p => (
                            <div key={p.id} onMouseDown={() => elegirProducto(fila.id, p)} className="px-3 py-2.5 hover:bg-gray-50 cursor-pointer flex justify-between text-sm">
                              <span>{p.nombre}</span>
                              <span className="text-gray-400 ml-2">${(p.precio_venta || p.precio || 0).toLocaleString()}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="col-span-5 lg:col-span-3">
                      <div className="relative">
                        <span className="absolute left-2 top-2.5 text-gray-400 text-sm">$</span>
                        <input
                          type="number"
                          value={fila.precio}
                          onChange={(e) => actualizarFila(fila.id, 'precio', e.target.value)}
                          className="w-full border border-gray-200 rounded-lg pl-5 pr-2 py-2.5 text-sm outline-none bg-stone-100"
                          placeholder="0"
                        />
                      </div>
                    </div>
                    <div className="col-span-6 lg:col-span-1 flex items-center">
                      <span className="text-sm text-gray-600">${((Number(fila.cantidad) || 0) * (Number(fila.precio) || 0)).toLocaleString()}</span>
                    </div>
                    <div className="col-span-1 flex items-center justify-center">
                      <button onClick={() => borrarFila(fila.id)} className="text-gray-300 hover:text-red-400 text-lg leading-none">×</button>
                    </div>
                  </div>
                ))}
              </div>

              <button onClick={agregarFila} className="text-xs text-gray-400 border border-dashed border-gray-200 rounded-lg px-4 py-2.5 hover:bg-gray-50 w-full mb-4">
                + Agregar fila
              </button>

              <div className="flex flex-col items-end gap-1">
                <div className="flex justify-between text-xs text-gray-400 w-48">
                  <span>Subtotal</span>
                  <span>${subtotal.toLocaleString()}</span>
                </div>
                {descuento > 0 && (
                  <div className="flex justify-between text-xs text-gray-400 w-48">
                    <span>Descuento ({descuento}%)</span>
                    <span>-${descuentoMonto.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm font-medium text-gray-900 border-t border-gray-100 pt-2 mt-1 w-48">
                  <span>Total</span>
                  <span>${total.toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
              <div className="grid grid-cols-3 gap-2">
                <div className="bg-stone-100 border border-gray-200 rounded-xl px-3 py-2.5">
                  <p className="text-xs text-gray-400 mb-0.5">Costo total</p>
                  <p className="text-sm font-medium text-gray-900">${costoTotal.toLocaleString()}</p>
                </div>
                <div className="bg-stone-100 border border-gray-200 rounded-xl px-3 py-2.5">
                  <p className="text-xs text-gray-400 mb-0.5">Sin descuento</p>
                  <p className="text-sm font-medium text-gray-900">${subtotal.toLocaleString()}</p>
                </div>
                <div className="bg-green-50 border border-green-100 rounded-xl px-3 py-2.5">
                  <p className="text-xs text-green-600 mb-0.5">Ganancia</p>
                  <p className="text-sm font-medium text-green-700">${gananciaReal.toLocaleString()}</p>
                </div>
              </div>
              <button onClick={guardarCotizacion} className="text-white text-sm px-6 py-2.5 rounded-xl w-full lg:w-auto" style={{ background: '#1a1a1a' }}>
                Guardar cotización
              </button>
            </div>
          </>
        )}

        {vista === 'historial' && (
          <div className="flex flex-col gap-3">
            {cotizaciones.length === 0 ? (
              <div className="text-center py-16 bg-stone-100 border border-gray-200 rounded-xl">
                <p className="text-gray-300 text-sm">No hay cotizaciones todavía</p>
                <button onClick={() => setVista('nueva')} className="mt-3 text-xs text-gray-400 underline">Crear primera cotización</button>
              </div>
            ) : (
              cotizaciones.map(cot => (
                <div key={cot.id} className="bg-stone-100 border border-gray-200 rounded-xl p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{cot.cliente}</p>
                      <p className="text-xs text-gray-400 mt-0.5">#{String(cot.id).padStart(4, '0')} · {new Date(cot.created_at).toLocaleDateString('es-AR')}</p>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full ${getBadge(cot.estado)}`}>{cot.estado}</span>
                  </div>
                  <div className="flex items-center justify-between mt-3">
                    <p className="text-base font-medium text-gray-900">${(cot.total || 0).toLocaleString()}</p>
                    <div className="flex gap-1">
                      {cot.estado === 'Pendiente' && (
                        <button onClick={() => cambiarEstado(cot.id, 'Confirmada')} className="text-xs bg-green-50 text-green-700 px-2 py-1 rounded-lg">Confirmar</button>
                      )}
                      {cot.items && (
                        <button onClick={() => exportarPDF(cot)} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-lg">PDF</button>
                      )}
                      <button onClick={() => borrarCotizacion(cot.id)} className="text-xs bg-red-50 text-red-400 px-2 py-1 rounded-lg">Borrar</button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default Cotizaciones