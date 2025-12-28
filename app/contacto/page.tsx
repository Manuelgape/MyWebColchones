export default function ContactoPage() {
  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
          Contacto
        </p>
        <h1 className="font-display text-3xl text-slate-900 md:text-4xl">
          Solo email para casos excepcionales.
        </h1>
        <p className="max-w-2xl text-base text-slate-600">
          La tienda esta pensada para pedidos automaticos. Si necesitas ayuda
          fuera del flujo normal, escribenos y te responderemos en horario
          laboral.
        </p>
      </div>

      <div className="rounded-3xl border border-slate-200/60 bg-white/80 p-8 shadow-sm">
        <p className="text-sm font-semibold text-slate-500">
          Email de soporte
        </p>
        <p className="mt-2 text-2xl font-semibold text-slate-900">
          hola@agustindescanso.es
        </p>
        <p className="mt-4 text-sm text-slate-600">
          Sin WhatsApp, sin telefono. Respuesta en 24-48h laborales.
        </p>
      </div>
    </div>
  );
}
