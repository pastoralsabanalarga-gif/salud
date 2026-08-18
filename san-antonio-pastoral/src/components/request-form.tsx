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

  const form = useForm<RequestFormValues>({
    resolver: zodResolver(requestFormSchema),
    defaultValues: {
      applicantName: "",
      applicantPhone: "",
      applicantEmail: "",
      relationToPatient: "",
      patientName: "",
      neighborhood: "",
      exactAddress: "",
      consentAccepted: false,
    },
  })

  async function onSubmit(data: RequestFormValues) {
    setIsSubmitting(true)
    try {
      const applicantId = crypto.randomUUID()
      const patientId = crypto.randomUUID()
      const requestId = crypto.randomUUID()

      const { error: applicantError } = await supabase.from('applicants').insert({
        id: applicantId, full_name: data.applicantName, phone: data.applicantPhone, email: data.applicantEmail || null, relation_to_patient: data.relationToPatient, preferred_contact: data.preferredContact
      })
      if (applicantError) throw applicantError

      const { error: patientError } = await supabase.from('patients_or_persons').insert({
        id: patientId, full_name: data.patientName, phone: data.patientPhone || null, age_range: data.ageRange, neighborhood: data.neighborhood, exact_address: data.exactAddress, location_type: data.locationType
      })
      if (patientError) throw patientError

      const { error: requestError } = await supabase.from('requests').insert({
        id: requestId, applicant_id: applicantId, patient_id: patientId, support_type: ["VISITA_PASTORAL"], situation_description: data.situationDescription, patient_awareness: data.patientAwareness, additional_notes: data.additionalNotes, status: 'NUEVA', priority: 'VERDE'
      })
      if (requestError) throw requestError

      const { error: consentError } = await supabase.from('consents').insert({
        request_id: requestId, policy_version: 'v1.0-2026', user_agent: window.navigator.userAgent
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
      <div className="py-20 px-6 text-center space-y-8 bg-[#F9F9F6] rounded-3xl border-2 border-emerald-100 shadow-lg animate-in fade-in zoom-in duration-500 max-w-2xl mx-auto">
        <div className="mx-auto w-32 h-32 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center shadow-md border-4 border-white">
          <HeartHandshake size={64} strokeWidth={2} />
        </div>
        <div className="space-y-4">
          <h2 className="text-4xl font-bold text-slate-900">¡Mensaje Enviado!</h2>
          <p className="text-xl text-slate-700 max-w-md mx-auto leading-relaxed font-medium">
            Hemos recibido su información correctamente. Muy pronto alguien de la parroquia se comunicará con usted.
          </p>
        </div>
        <div className="pt-6">
          <span className="text-lg font-bold text-emerald-800 bg-emerald-100 border-2 border-emerald-200 py-4 px-8 rounded-full inline-block shadow-sm">
            La Iglesia camina con usted
          </span>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-[#F9F9F6] min-h-screen p-4 sm:p-8 rounded-3xl shadow-inner font-sans">
      <div className="max-w-2xl mx-auto">
        
        {/* Encabezado del Formulario */}
        <div className="mb-8 text-center space-y-3">
          <h1 className="text-3xl font-bold text-slate-900">Solicitud Pastoral</h1>
          <p className="text-lg text-slate-700 font-medium">Por favor, llene los recuadros en blanco.</p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-10">
            
            {/* SECCIÓN 1 */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border-2 border-slate-200 shadow-md space-y-8">
              <div className="flex items-center gap-4 border-b-2 border-slate-100 pb-4">
                <div className="bg-emerald-100 p-3 rounded-xl text-emerald-700">
                  <User size={28} />
                </div>
                <h3 className="text-2xl font-bold text-slate-900">1. Sus Datos</h3>
              </div>
              <div className="grid grid-cols-1 gap-8">
                <FormField control={form.control} name="applicantName" render={({ field }) => (
                  <FormItem><FormLabel className="text-xl font-bold text-slate-900">Su Nombre Completo</FormLabel><FormControl><Input className="h-16 text-xl px-4 bg-slate-50 border-2 border-slate-300 focus:border-emerald-600 focus:ring-emerald-600 rounded-2xl" placeholder="Escriba su nombre..." {...field} disabled={isSubmitting} /></FormControl><FormMessage className="text-lg text-red-600 font-medium" /></FormItem>
                )} />
                <FormField control={form.control} name="applicantPhone" render={({ field }) => (
                  <FormItem><FormLabel className="text-xl font-bold text-slate-900">Su Número de Celular</FormLabel><FormControl><Input className="h-16 text-xl px-4 bg-slate-50 border-2 border-slate-300 focus:border-emerald-600 focus:ring-emerald-600 rounded-2xl" type="tel" placeholder="Ej. 300 123 4567" {...field} disabled={isSubmitting} /></FormControl><FormMessage className="text-lg text-red-600 font-medium" /></FormItem>
                )} />
                <FormField control={form.control} name="relationToPatient" render={({ field }) => (
                  <FormItem><FormLabel className="text-xl font-bold text-slate-900">¿Qué es usted del enfermo?</FormLabel><FormControl><Input className="h-16 text-xl px-4 bg-slate-50 border-2 border-slate-300 focus:border-emerald-600 focus:ring-emerald-600 rounded-2xl" placeholder="Ej. Hijo, Hermano, Vecino..." {...field} disabled={isSubmitting} /></FormControl><FormMessage className="text-lg text-red-600 font-medium" /></FormItem>
                )} />
                <FormField control={form.control} name="preferredContact" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xl font-bold text-slate-900">¿Cómo prefiere que le contactemos?</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isSubmitting}>
                      <FormControl><SelectTrigger className="h-16 text-xl px-4 bg-slate-50 border-2 border-slate-300 focus:border-emerald-600 focus:ring-emerald-600 rounded-2xl"><SelectValue placeholder="Toque aquí para elegir" /></SelectTrigger></FormControl>
                      <SelectContent className="text-xl">
                        <SelectItem className="text-xl py-3" value="WHATSAPP">Por mensaje de WhatsApp</SelectItem>
                        <SelectItem className="text-xl py-3" value="TELEFONO">Por Llamada telefónica</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage className="text-lg text-red-600 font-medium" />
                  </FormItem>
                )} />
              </div>
            </div>

            {/* SECCIÓN 2 */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border-2 border-slate-200 shadow-md space-y-8">
              <div className="flex items-center gap-4 border-b-2 border-slate-100 pb-4">
                <div className="bg-blue-100 p-3 rounded-xl text-blue-700">
                  <HeartPulse size={28} />
                </div>
                <h3 className="text-2xl font-bold text-slate-900">2. Datos del Enfermo</h3>
              </div>
              <div className="grid grid-cols-1 gap-8">
                <FormField control={form.control} name="patientName" render={({ field }) => (
                  <FormItem><FormLabel className="text-xl font-bold text-slate-900">Nombre del enfermo</FormLabel><FormControl><Input className="h-16 text-xl px-4 bg-slate-50 border-2 border-slate-300 focus:border-emerald-600 focus:ring-emerald-600 rounded-2xl" placeholder="Escriba el nombre..." {...field} disabled={isSubmitting} /></FormControl><FormMessage className="text-lg text-red-600 font-medium" /></FormItem>
                )} />
                <FormField control={form.control} name="ageRange" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xl font-bold text-slate-900">¿Qué edad aproximada tiene?</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isSubmitting}>
                      <FormControl><SelectTrigger className="h-16 text-xl px-4 bg-slate-50 border-2 border-slate-300 focus:border-emerald-600 focus:ring-emerald-600 rounded-2xl"><SelectValue placeholder="Toque aquí para elegir" /></SelectTrigger></FormControl>
                      <SelectContent className="text-xl">
                        <SelectItem className="text-xl py-3" value="NINO">Es un Niño/a</SelectItem>
                        <SelectItem className="text-xl py-3" value="JOVEN">Es Joven</SelectItem>
                        <SelectItem className="text-xl py-3" value="ADULTO">Es Adulto</SelectItem>
                        <SelectItem className="text-xl py-3" value="ADULTO_MAYOR">Es Adulto Mayor (Abuelo/a)</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage className="text-lg text-red-600 font-medium" />
                  </FormItem>
                )} />
                <FormField control={form.control} name="locationType" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xl font-bold text-slate-900">¿Dónde se encuentra ahora?</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isSubmitting}>
                      <FormControl><SelectTrigger className="h-16 text-xl px-4 bg-slate-50 border-2 border-slate-300 focus:border-emerald-600 focus:ring-emerald-600 rounded-2xl"><SelectValue placeholder="Toque aquí para elegir" /></SelectTrigger></FormControl>
                      <SelectContent className="text-xl">
                        <SelectItem className="text-xl py-3" value="CASA">Está en su casa</SelectItem>
                        <SelectItem className="text-xl py-3" value="HOSPITAL">Está en el hospital</SelectItem>
                        <SelectItem className="text-xl py-3" value="OTRO">En otro lugar</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage className="text-lg text-red-600 font-medium" />
                  </FormItem>
                )} />
                <FormField control={form.control} name="neighborhood" render={({ field }) => (
                  <FormItem><FormLabel className="text-xl font-bold text-slate-900">Barrio donde está ubicado</FormLabel><FormControl><Input className="h-16 text-xl px-4 bg-slate-50 border-2 border-slate-300 focus:border-emerald-600 focus:ring-emerald-600 rounded-2xl" placeholder="Nombre del barrio..." {...field} disabled={isSubmitting} /></FormControl><FormMessage className="text-lg text-red-600 font-medium" /></FormItem>
                )} />
                <FormField control={form.control} name="exactAddress" render={({ field }) => (
                  <FormItem><FormLabel className="text-xl font-bold text-slate-900">Dirección Completa</FormLabel><FormControl><Input className="h-16 text-xl px-4 bg-slate-50 border-2 border-slate-300 focus:border-emerald-600 focus:ring-emerald-600 rounded-2xl" placeholder="Calle, Carrera, Número..." {...field} disabled={isSubmitting} /></FormControl><FormMessage className="text-lg text-red-600 font-medium" /></FormItem>
                )} />
              </div>
            </div>

            {/* SECCIÓN 3 */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border-2 border-slate-200 shadow-md space-y-8">
              <div className="flex items-center gap-4 border-b-2 border-slate-100 pb-4">
                <div className="bg-amber-100 p-3 rounded-xl text-amber-700">
                  <Info size={28} />
                </div>
                <h3 className="text-2xl font-bold text-slate-900">3. Estado de Salud</h3>
              </div>
              <div className="grid grid-cols-1 gap-8">
                <FormField control={form.control} name="situationDescription" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xl font-bold text-slate-900">¿Cómo se encuentra el enfermo?</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isSubmitting}>
                      <FormControl><SelectTrigger className="h-16 text-xl px-4 bg-slate-50 border-2 border-slate-300 focus:border-emerald-600 focus:ring-emerald-600 rounded-2xl"><SelectValue placeholder="Toque aquí para elegir" /></SelectTrigger></FormControl>
                      <SelectContent className="text-xl">
                        <SelectItem className="text-xl py-3" value="ENFERMEDAD_RECIENTE">Es una enfermedad reciente</SelectItem>
                        <SelectItem className="text-xl py-3" value="ENFERMEDAD_PROLONGADA">Lleva mucho tiempo enfermo</SelectItem>
                        <SelectItem className="text-xl py-3" value="SITUACION_DELICADA">Está muy delicado / Urgente</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage className="text-lg text-red-600 font-medium" />
                  </FormItem>
                )} />
                <FormField control={form.control} name="patientAwareness" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xl font-bold text-slate-900">¿El enfermo sabe que pedimos esta visita?</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isSubmitting}>
                      <FormControl><SelectTrigger className="h-16 text-xl px-4 bg-slate-50 border-2 border-slate-300 focus:border-emerald-600 focus:ring-emerald-600 rounded-2xl"><SelectValue placeholder="Toque aquí para elegir" /></SelectTrigger></FormControl>
                      <SelectContent className="text-xl">
                        <SelectItem className="text-xl py-3" value="SI">Sí lo sabe</SelectItem>
                        <SelectItem className="text-xl py-3" value="NO">No lo sabe</SelectItem>
                        <SelectItem className="text-xl py-3" value="NO_SEGURO">No estoy seguro</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage className="text-lg text-red-600 font-medium" />
                  </FormItem>
                )} />
                <FormField control={form.control} name="additionalNotes" render={({ field }) => (
                  <FormItem><FormLabel className="text-xl font-bold text-slate-900">¿Algo más que nos quiera decir? (Opcional)</FormLabel><FormControl><Textarea className="min-h-[120px] text-xl p-4 bg-slate-50 border-2 border-slate-300 focus:border-emerald-600 focus:ring-emerald-600 rounded-2xl resize-none" placeholder="Escriba aquí los detalles..." {...field} disabled={isSubmitting} /></FormControl><FormMessage className="text-lg text-red-600 font-medium" /></FormItem>
                )} />
              </div>
            </div>

            {/* CONSENTIMIENTO */}
            <FormField control={form.control} name="consentAccepted" render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-5 space-y-0 rounded-3xl border-2 border-emerald-200 p-6 sm:p-8 shadow-md bg-emerald-50">
                <FormControl>
                  <div className="mt-1 flex-shrink-0">
                    <Checkbox checked={field.value} onCheckedChange={field.onChange} disabled={isSubmitting} className="h-8 w-8 border-2 border-emerald-600 data-[state=checked]:bg-emerald-700 data-[state=checked]:text-white" />
                  </div>
                </FormControl>
                <div className="space-y-2">
                  <FormLabel className="text-xl font-bold text-slate-900 flex items-center gap-3 cursor-pointer">
                    Sí, acepto enviar mis datos
                  </FormLabel>
                  <p className="text-lg text-slate-700 font-medium leading-relaxed">
                    Acepto que la parroquia use esta información únicamente para contactarme y visitar al enfermo de manera segura.
                  </p>
                </div>
              </FormItem>
            )} />

            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full bg-emerald-700 hover:bg-emerald-800 text-white h-20 text-2xl font-bold rounded-full shadow-xl hover:shadow-2xl transition-all duration-200" 
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-4 h-8 w-8 animate-spin" />
                  Enviando información...
                </>
              ) : (
                "ENVIAR SOLICITUD"
              )}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  )
}