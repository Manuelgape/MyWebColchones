export default function CondicionesPage() {
  return (
    <div className="space-y-10">
      <div className="space-y-3">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
          Como funciona
        </p>
        <h1 className="font-display text-3xl text-slate-900 md:text-4xl">
          Compra clara, sin llamadas ni dudas.
        </h1>
        <p className="max-w-2xl text-base text-slate-600">
          Nuestra tienda online esta pensada para pedidos sin decisiones
          manuales. Si no estas dentro de la zona o necesitas algo fuera de las
          reglas, el pedido no se procesa.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="rounded-3xl border border-slate-200/60 bg-white/80 p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">Entrega</h2>
          <ul className="mt-4 space-y-2 text-sm text-slate-600">
            <li>Solo Salamanca y Zamora</li>
            <li>Equipo de entrega propio</li>
            <li>Plazo indicado en cada producto</li>
          </ul>
        </div>
        <div className="rounded-3xl border border-slate-200/60 bg-white/80 p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">Pago</h2>
          <ul className="mt-4 space-y-2 text-sm text-slate-600">
            <li>Pago 100% online</li>
            <li>Sin reserva telefonica</li>
            <li>Pedido solo tras confirmacion de pago</li>
          </ul>
        </div>
        <div className="rounded-3xl border border-slate-200/60 bg-white/80 p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">No incluido</h2>
          <ul className="mt-4 space-y-2 text-sm text-slate-600">
            <li>No retiramos colchon antiguo</li>
            <li>No gestionamos citas por telefono</li>
            <li>No entregamos fuera de zona</li>
          </ul>
        </div>
      </div>

      <div className="rounded-3xl border border-slate-200/60 bg-white/80 p-8 shadow-sm">
        <h2 className="text-xl font-semibold text-slate-900">
          Politica de devoluciones basica
        </h2>
        <div className="mt-4 grid gap-6 md:grid-cols-2">
          <p className="text-sm text-slate-600">
            Aceptamos devoluciones en 14 dias naturales si el producto esta
            intacto y sin uso. El embalaje debe mantenerse.
          </p>
          <p className="text-sm text-slate-600">
            Los costes de devolucion corren a cargo del cliente. No gestionamos
            recogidas urgentes ni desmontajes especiales.
          </p>
        </div>
      </div>

      <div className="rounded-3xl border border-slate-200/60 bg-white/80 p-6 text-sm text-slate-700 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
          Importante
        </p>
        <p className="mt-3">
          Si tu codigo postal no esta en la zona de entrega, no podras finalizar
          el pedido.
        </p>
      </div>
    </div>
  );
}
