import { RequestForm } from "@/components/request-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function SolicitarAcompanamientoPage() {
  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-6">
        
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Queremos acompañarte</h1>
          <p className="text-lg text-slate-600">
            Si tú o alguien que conoces está atravesando una enfermedad, nuestra comunidad quiere acompañarte con oración, escucha, fe y esperanza.
          </p>
        </div>

        <Card className="border-slate-200 shadow-sm">
          <CardHeader className="bg-white border-b border-slate-100 pb-6">
            <CardTitle className="text-xl text-slate-800">Formulario de Solicitud</CardTitle>
            <CardDescription className="text-slate-500">
              Por favor, completa los siguientes datos. Esta información es confidencial y será tratada con el mayor de los respetos por nuestro equipo pastoral.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6 bg-white">
            
            {/* AQUÍ INYECTAMOS NUESTRO FORMULARIO */}
            <RequestForm />

          </CardContent>
        </Card>

        <p className="text-xs text-center text-slate-400">
          Esta plataforma organiza el acompañamiento pastoral. Si se trata de una emergencia médica, por favor comunícate inmediatamente con los servicios de salud locales.
        </p>
      </div>
    </div>
  )
}