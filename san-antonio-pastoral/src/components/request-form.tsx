"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { requestFormSchema, type RequestFormValues } from "@/lib/validation/request"
import { createClient } from "@/lib/supabase/client"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { HeartHandshake, User, HeartPulse, Info, ShieldCheck, Loader2 } from "lucide-react"

export function RequestForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const supabase = createClient()

  const { error: requestError } = await supabase
        .from('requests')
        .insert({
          id: requestId,
          applicant_id: applicantId,
          patient_id: patientId,
          support_type: ["VISITA_PASTORAL"], // <-- Cambio aquí
          situation_description: data.situationDescription,
          patient_awareness: data.patientAwareness,
          additional_notes: data.additionalNotes,
          status: 'NUEVA',
          priority: 'VERDE'
        })

  async function onSubmit(data: RequestFormValues) {
    setIsSubmitting(true)
    
    try {
      const applicantId = crypto.randomUUID()
      const patientId = crypto.randomUUID()
      const requestId = crypto.randomUUID()

      const { error: applicantError } = await supabase
        .from('applicants')
        .insert({
          id: applicantId,
          full_name: data.applicantName,
          phone: data.applicantPhone,
          email: data.applicantEmail || null,
          relation_to_patient: data.relationToPatient,
          preferred_contact: data.preferredContact
        })
      if (applicantError) throw applicantError

      const { error: patientError } = await supabase
        .from('patients_or_persons')
        .insert({
          id: patientId,
          full_name: data.patientName,
          phone: data.patientPhone || null,
          age_range: data.ageRange,
          neighborhood: data.neighborhood,
          exact_address: data.exactAddress,
          location_type: data.locationType
        })
      if (patientError) throw patientError

      const { error: requestError } = await supabase
        .from('requests')
        .insert({
          id: requestId,
          applicant_id: applicantId,
          patient_id: patientId,
          support_type: ["VISITA_PASTORAL"], // <-- Cambio aquí
          situation_description: data.situationDescription,
          patient_awareness: data.patientAwareness,
          additional_notes: data.additionalNotes,
          status: 'NUEVA',
          priority: 'VERDE'
        })
      if (requestError) throw requestError

      const { error: consentError } = await supabase
        .from('consents')
        .insert({
          request_id: requestId,
          policy_version: 'v1.0-2026',
          user_agent: window.navigator.userAgent
        })
      if (consentError) throw consentError

      setIsSuccess(true)
    } catch (error) {
      console.error("Error al guardar la solicitud:", error)
      alert("Hubo un problema al enviar tu solicitud. Revisa la consola para más detalles.")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSuccess) {
    return (
      <div className="py-16 px-4 text-center space-y-6 animate-in fade-in zoom-in duration-500">
        <div className="mx-auto w-24 h-24 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center shadow-sm">
          <HeartHandshake size={48} strokeWidth={1.5} />
        </div>
        <div className="space-y-2">
          <h2 className="text-3xl font-semibold text-slate-800">Hemos recibido tu petición</h2>
          <p className="text-slate-600 max-w-md mx-auto leading-relaxed">
            Gracias por confiar en nuestra comunidad. Tu solicitud ha sido registrada de manera confidencial y pronto un miembro del equipo pastoral se pondrá en contacto contigo.
          </p>
        </div>
        <div className="pt-4">
          <span className="text-sm font-medium text-emerald-700 bg-emerald-50 border border-emerald-100 py-2.5 px-6 rounded-full inline-block shadow-sm">
            La Iglesia camina contigo.
          </span>
        </div>
      </div>
    )
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 pb-4">
        
        {/* SECCIÓN 1 */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-100 shadow-sm space-y-6">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
            <div className="bg-emerald-50 p-2 rounded-lg text-emerald-600">
              <User size={20} />
            </div>
            <h3 className="text-xl font-semibold text-slate-800">Tus Datos</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField control={form.control} name="applicantName" render={({ field }) => (
              <FormItem><FormLabel className="text-slate-700">Tu Nombre Completo</FormLabel><FormControl><Input className="bg-slate-50/50 focus:bg-white" placeholder="Ej. María Pérez" {...field} disabled={isSubmitting} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="applicantPhone" render={({ field }) => (
              <FormItem><FormLabel className="text-slate-700">Tu Teléfono (WhatsApp)</FormLabel><FormControl><Input className="bg-slate-50/50 focus:bg-white" placeholder="Ej. 300 123 4567" {...field} disabled={isSubmitting} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="relationToPatient" render={({ field }) => (
              <FormItem><FormLabel className="text-slate-700">Relación con el enfermo</FormLabel><FormControl><Input className="bg-slate-50/50 focus:bg-white" placeholder="Ej. Hijo, Esposa, Vecino" {...field} disabled={isSubmitting} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="preferredContact" render={({ field }) => (
              <FormItem>
                <FormLabel className="text-slate-700">Medio de contacto preferido</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isSubmitting}>
                  <FormControl><SelectTrigger className="bg-slate-50/50 focus:bg-white"><SelectValue placeholder="Selecciona una opción" /></SelectTrigger></FormControl>
                  <SelectContent>
                    <SelectItem value="WHATSAPP">WhatsApp</SelectItem>
                    <SelectItem value="TELEFONO">Llamada telefónica</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )} />
          </div>
        </div>

        {/* SECCIÓN 2 */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-100 shadow-sm space-y-6">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
            <div className="bg-blue-50 p-2 rounded-lg text-blue-600">
              <HeartPulse size={20} />
            </div>
            <h3 className="text-xl font-semibold text-slate-800">Datos de la persona</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField control={form.control} name="patientName" render={({ field }) => (
              <FormItem><FormLabel className="text-slate-700">Nombre del enfermo</FormLabel><FormControl><Input className="bg-slate-50/50 focus:bg-white" placeholder="Ej. Juan Pérez" {...field} disabled={isSubmitting} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="ageRange" render={({ field }) => (
              <FormItem>
                <FormLabel className="text-slate-700">Rango de Edad</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isSubmitting}>
                  <FormControl><SelectTrigger className="bg-slate-50/50 focus:bg-white"><SelectValue placeholder="Selecciona edad aproximada" /></SelectTrigger></FormControl>
                  <SelectContent>
                    <SelectItem value="NINO">Niño/a</SelectItem>
                    <SelectItem value="JOVEN">Joven</SelectItem>
                    <SelectItem value="ADULTO">Adulto</SelectItem>
                    <SelectItem value="ADULTO_MAYOR">Adulto Mayor</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="locationType" render={({ field }) => (
              <FormItem>
                <FormLabel className="text-slate-700">¿Dónde se encuentra?</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isSubmitting}>
                  <FormControl><SelectTrigger className="bg-slate-50/50 focus:bg-white"><SelectValue placeholder="Lugar" /></SelectTrigger></FormControl>
                  <SelectContent>
                    <SelectItem value="CASA">En su casa</SelectItem>
                    <SelectItem value="HOSPITAL">En el hospital</SelectItem>
                    <SelectItem value="OTRO">Otro lugar</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="neighborhood" render={({ field }) => (
              <FormItem><FormLabel className="text-slate-700">Barrio o Sector</FormLabel><FormControl><Input className="bg-slate-50/50 focus:bg-white" placeholder="Ej. Centro, Los Pinos..." {...field} disabled={isSubmitting} /></FormControl><FormMessage /></FormItem>
            )} />
          </div>
          <FormField control={form.control} name="exactAddress" render={({ field }) => (
            <FormItem><FormLabel className="text-slate-700">Dirección exacta</FormLabel><FormControl><Input className="bg-slate-50/50 focus:bg-white" placeholder="Calle, Carrera, Número de casa..." {...field} disabled={isSubmitting} /></FormControl><FormMessage /></FormItem>
          )} />
        </div>

        {/* SECCIÓN 3 */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-100 shadow-sm space-y-6">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
            <div className="bg-amber-50 p-2 rounded-lg text-amber-600">
              <Info size={20} />
            </div>
            <h3 className="text-xl font-semibold text-slate-800">Sobre la situación</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField control={form.control} name="situationDescription" render={({ field }) => (
              <FormItem>
                <FormLabel className="text-slate-700">¿Cómo describirías la situación?</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isSubmitting}>
                  <FormControl><SelectTrigger className="bg-slate-50/50 focus:bg-white"><SelectValue placeholder="Selecciona una descripción" /></SelectTrigger></FormControl>
                  <SelectContent>
                    <SelectItem value="ENFERMEDAD_RECIENTE">Enfermedad reciente</SelectItem>
                    <SelectItem value="ENFERMEDAD_PROLONGADA">Enfermedad prolongada</SelectItem>
                    <SelectItem value="SITUACION_DELICADA">Situación delicada / Urgente</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="patientAwareness" render={({ field }) => (
              <FormItem>
                <FormLabel className="text-slate-700">¿El enfermo sabe de esta visita?</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isSubmitting}>
                  <FormControl><SelectTrigger className="bg-slate-50/50 focus:bg-white"><SelectValue placeholder="Selecciona una opción" /></SelectTrigger></FormControl>
                  <SelectContent>
                    <SelectItem value="SI">Sí</SelectItem>
                    <SelectItem value="NO">No</SelectItem>
                    <SelectItem value="NO_SEGURO">No estamos seguros</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )} />
          </div>
          <FormField control={form.control} name="additionalNotes" render={({ field }) => (
            <FormItem><FormLabel className="text-slate-700">¿Algo más que debamos saber? (Opcional)</FormLabel><FormControl><Textarea className="bg-slate-50/50 focus:bg-white resize-none" rows={3} placeholder="Escribe aquí si hay detalles adicionales para el equipo pastoral..." {...field} disabled={isSubmitting} /></FormControl><FormMessage /></FormItem>
          )} />
        </div>

        {/* CONSENTIMIENTO */}
        <FormField control={form.control} name="consentAccepted" render={({ field }) => (
          <FormItem className="flex flex-row items-start space-x-4 space-y-0 rounded-2xl border border-emerald-100 p-6 shadow-sm bg-emerald-50/40">
            <FormControl>
              <div className="mt-1">
                <Checkbox checked={field.value} onCheckedChange={field.onChange} disabled={isSubmitting} className="border-emerald-500 data-[state=checked]:bg-emerald-600 data-[state=checked]:border-emerald-600" />
              </div>
            </FormControl>
            <div className="space-y-1.5 leading-none">
              <FormLabel className="text-base font-medium text-slate-800 flex items-center gap-2">
                <ShieldCheck size={18} className="text-emerald-600" />
                He leído y acepto el tratamiento de datos
              </FormLabel>
              <p className="text-sm text-slate-600 leading-relaxed">
                Acepto que estos datos sean utilizados únicamente por la red parroquial para fines de acompañamiento pastoral, respetando mi privacidad en todo momento.
              </p>
            </div>
          </FormItem>
        )} />

        <Button 
          type="submit" 
          disabled={isSubmitting}
          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-7 text-lg rounded-2xl shadow-md hover:shadow-lg transition-all duration-200" 
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Procesando solicitud...
            </>
          ) : (
            "Solicitar Acompañamiento"
          )}
        </Button>
      </form>
    </Form>
  )
}