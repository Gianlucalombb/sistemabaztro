function Dashboard() {
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
          <button className="flex items-center gap-2 px-3 py-2 rounded-lg text-white bg-white/10 text-sm w-full text-left">📊 Dashboard</button>
          <button className="flex items-center gap-2 px-3 py-2 rounded-lg text-white/50 hover:text-white/80 hover:bg-white/5 text-sm w-full text-left">📦 Productos</button>
          <button className="flex items-center gap-2 px-3 py-2 rounded-lg text-white/50 hover:text-white/80 hover:bg-white/5 text-sm w-full text-left">🧾 Ventas</button>
          <button className="flex items-center gap-2 px-3 py-2 rounded-lg text-white/50 hover:text-white/80 hover:bg-white/5 text-sm w-full text-left">📋 Cotizaciones</button>
          <p className="text-white/25 text-xs px-2 pt-3 pb-1 uppercase tracking-wider">Gestión</p>
          <button className="flex items-center gap-2 px-3 py-2 rounded-lg text-white/50 hover:text-white/80 hover:bg-white/5 text-sm w-full text-left">👥 Clientes</button>
          <button className="flex items-center gap-2 px-3 py-2 rounded-lg text-white/50 hover:text-white/80 hover:bg-white/5 text-sm w-full text-left">⚙️ Ajustes</button>
        </nav>

        <div className="p-4 border-t border-white/10 flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-green-800 flex items-center justify-center text-green-300 text-xs font-medium">AD</div>
          <p className="text-white/60 text-xs">Admin</p>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="flex-1 flex flex-col">

        {/* Topbar */}
        <div className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between">
          <p className="font-medium text-gray-900">Dashboard</p>
          <p className="text-xs text-gray-400">Mayo 2026</p>
        </div>

        {/* Contenido */}
        <div className="p-5 flex flex-col gap-4">

          {/* Métricas */}
          <div className="grid grid-cols-4 gap-3">
            <div className="bg-white border border-gray-200 rounded-xl p-4">
              <p className="text-xs text-gray-400 mb-2">Ventas del mes</p>
              <p className="text-2xl font-medium text-gray-900">$284k</p>
              <p className="text-xs text-green-700 mt-1">↑ 12% vs. mes anterior</p>
            </div>
            <div className="bg-white border border-gray-200 rounded-xl p-4">
              <p className="text-xs text-gray-400 mb-2">Pedidos</p>
              <p className="text-2xl font-medium text-gray-900">147</p>
              <p className="text-xs text-green-700 mt-1">↑ 8 nuevos hoy</p>
            </div>
            <div className="bg-white border border-gray-200 rounded-xl p-4">
              <p className="text-xs text-gray-400 mb-2">Productos activos</p>
              <p className="text-2xl font-medium text-gray-900">312</p>
              <p className="text-xs text-gray-400 mt-1">en catálogo</p>
            </div>
            <div className="bg-white border border-gray-200 rounded-xl p-4">
              <p className="text-xs text-gray-400 mb-2">Stock bajo</p>
              <p className="text-2xl font-medium text-gray-900">18</p>
              <p className="text-xs text-red-500 mt-1">↓ requieren atención</p>
            </div>
          </div>

          {/* Tabla + más vendidos */}
          <div className="grid grid-cols-5 gap-3">
            <div className="col-span-3 bg-white border border-gray-200 rounded-xl p-4">
              <p className="text-sm font-medium text-gray-900 mb-3">Últimas ventas</p>
              <table className="w-full text-xs">
                <thead>
                  <tr className="text-gray-400 border-b border-gray-100">
                    <th className="text-left pb-2 font-normal">Cliente</th>
                    <th className="text-left pb-2 font-normal">Monto</th>
                    <th className="text-left pb-2 font-normal">Estado</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-50">
                    <td className="py-2">Distribuidora López</td>
                    <td className="py-2">$12.400</td>
                    <td className="py-2"><span className="bg-green-50 text-green-700 px-2 py-1 rounded-full text-xs">Pagado</span></td>
                  </tr>
                  <tr className="border-b border-gray-50">
                    <td className="py-2">Mercado El Sol</td>
                    <td className="py-2">$8.750</td>
                    <td className="py-2"><span className="bg-yellow-50 text-yellow-700 px-2 py-1 rounded-full text-xs">Pendiente</span></td>
                  </tr>
                  <tr className="border-b border-gray-50">
                    <td className="py-2">Almacén Don Pepe</td>
                    <td className="py-2">$5.200</td>
                    <td className="py-2"><span className="bg-green-50 text-green-700 px-2 py-1 rounded-full text-xs">Pagado</span></td>
                  </tr>
                  <tr>
                    <td className="py-2">Súper Familia</td>
                    <td className="py-2">$19.800</td>
                    <td className="py-2"><span className="bg-red-50 text-red-700 px-2 py-1 rounded-full text-xs">Sin pagar</span></td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="col-span-2 bg-white border border-gray-200 rounded-xl p-4">
              <p className="text-sm font-medium text-gray-900 mb-3">Más vendidos</p>
              <div className="flex flex-col gap-3">
                {[
                  { nombre: 'Aceite x12', valor: 88 },
                  { nombre: 'Arroz 5kg', valor: 72 },
                  { nombre: 'Azúcar 2kg', valor: 60 },
                  { nombre: 'Harina x10', valor: 45 },
                  { nombre: 'Yerba 500g', valor: 38 },
                ].map((item) => (
                  <div key={item.nombre} className="flex items-center gap-2">
                    <p className="text-xs text-gray-400 w-20 truncate">{item.nombre}</p>
                    <div className="flex-1 bg-gray-100 rounded-full h-1.5">
                      <div className="bg-gray-900 h-1.5 rounded-full" style={{ width: `${item.valor}%` }}></div>
                    </div>
                    <p className="text-xs text-gray-400 w-8 text-right">{item.valor}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

export default Dashboard