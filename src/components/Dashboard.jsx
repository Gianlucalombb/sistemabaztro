import { useState, useEffect } from 'react'
import { supabase } from '../supabase'

function Dashboard() {
  const [stats, setStats] = useState({
    cantidadVentas: 0,
    ingresosSemana: 0,
    ventasSemana: 0,
    cotizacionesPendientes: 0,
    productosInactivos: 0,
  })
  const [ultimasVentas, setUltimasVentas] = useState([])
  const [cotizacionesPendientes, setCotizacionesPendientes] = useState([])
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    cargarDatos()
    const intervalo = setInterval(cargarDatos, 15000)
    return () => clearInterval(intervalo)
  }, [])

  async function cargarDatos() {
    const haceUnaSemana = new Date()
    haceUnaSemana.setDate(haceUnaSemana.getDate() - 7)

    const [{ data: ventas }, { data: cotizaciones }, { data: productos }] = await Promise.all([
      supabase.from('ventas').select('*').order('fecha', { ascending: false }),
      supabase.from('cotizaciones').select('*').eq('estado', 'Pendiente'),
      supabase.from('productos').select('*'),
    ])

    if (ventas) {
      const ventasSemana = ventas.filter(v => {
        const fechaVenta = new Date(v.fecha + 'T12:00:00')
        return fechaVenta >= haceUnaSemana
      })
      const ingresosSemana = ventasSemana.reduce((acc, v) => acc + (v.ganancia || 0), 0)
      setUltimasVentas(ventas.slice(0, 5))
      setStats(prev => ({
        ...prev,
        cantidadVentas: ventas.length,
        ingresosSemana,
        ventasSemana: ventasSemana.length,
      }))
    }

    if (cotizaciones) {
      setStats(prev => ({ ...prev, cotizacionesPendientes: cotizaciones.length }))
      setCotizacionesPendientes(cotizaciones.slice(0,5))
    }

    if (productos) {
      const inactivos = productos.filter(p => !p.activo).length
      setStats(prev => ({ ...prev, productosInactivos: inactivos }))
    }

    setCargando(false)
  }

  if (cargando) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p className="text-sm" style={{ color: '#9ca3af' }}>Cargando...</p>
      </div>
    )
  }

  return (
    <div className="flex-1 flex flex-col overflow-auto">
      <div className="bg-stone-100 border-b border-gray-200 px-4 lg:px-6 py-3 flex items-center justify-between">
        <p className="font-medium text-gray-900">Dashboard</p>
        <p className="text-xs text-gray-400 hidden lg:block">
          {new Date().toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
        </p>
      </div>

      <div className="p-4 lg:p-5 flex flex-col gap-4">

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="bg-stone-100 border border-gray-200 rounded-xl p-4">
            <p className="text-xs text-gray-400 mb-2">Total de ventas</p>
            <p className="text-2xl font-medium text-gray-900">{stats.cantidadVentas}</p>
            <p className="text-xs text-gray-400 mt-1">registrados</p>
          </div>
          <div className="bg-stone-100 border border-gray-200 rounded-xl p-4">
            <p className="text-xs text-gray-400 mb-2">Ganancia semana</p>
            <p className="text-2xl font-medium text-gray-900">${stats.ingresosSemana.toLocaleString()}</p>
            <p className="text-xs text-gray-400 mt-1">últimos 7 días</p>
          </div>
          <div className="bg-stone-100 border border-gray-200 rounded-xl p-4">
            <p className="text-xs text-gray-400 mb-2">Ventas semana</p>
            <p className="text-2xl font-medium text-gray-900">{stats.ventasSemana}</p>
            <p className="text-xs text-gray-400 mt-1">esta semana</p>
          </div>
          <div className="bg-stone-100 border border-gray-200 rounded-xl p-4">
            <p className="text-xs text-gray-400 mb-2">Inactivos</p>
            <p className="text-2xl font-medium text-gray-900">{stats.productosInactivos}</p>
            <p className="text-xs text-gray-400 mt-1">sin stock</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-3">
          <div className="lg:col-span-3 bg-stone-100 border border-gray-200 rounded-xl p-4">
            <p className="text-sm font-medium text-gray-900 mb-3">Últimas ventas</p>
            {ultimasVentas.length === 0 ? (
              <p className="text-xs text-gray-300 text-center py-8">Todavía no hay ventas</p>
            ) : (
              <div className="flex flex-col gap-2">
                {ultimasVentas.map(venta => (
                  <div key={venta.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{venta.cliente}</p>
                      <p className="text-xs text-gray-400">{new Date(venta.fecha + 'T12:00:00').toLocaleDateString('es-AR')} · {venta.quien}</p>
                    </div>
                    <p className="text-sm font-medium text-green-700">${(venta.ganancia || 0).toLocaleString()}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="lg:col-span-2 bg-stone-100 border border-gray-200 rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-medium text-gray-900">Cotizaciones pendientes</p>
              <span className="text-xs bg-yellow-50 text-yellow-700 px-2 py-0.5 rounded-full">{stats.cotizacionesPendientes}</span>
            </div>
            {cotizacionesPendientes.length === 0 ? (
              <p className="text-xs text-gray-300 text-center py-8">No hay pendientes</p>
            ) : (
              <div className="flex flex-col gap-1">
                {cotizacionesPendientes.map((cot) => (
                  <div key={cot.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                    <div>
                      <p className="text-xs font-medium text-gray-900">{cot.cliente}</p>
                      <p className="text-xs text-gray-400">{new Date(cot.created_at).toLocaleDateString('es-AR')}</p>
                    </div>
                    <span className="text-xs font-medium text-gray-900">${(cot.total || 0).toLocaleString()}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  )
}

export default Dashboard