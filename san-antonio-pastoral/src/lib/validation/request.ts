import { z } from "zod"

export const requestFormSchema = z.object({
  // Datos del Solicitante
  applicantName: z.string().min(2, { message: "El nombre es obligatorio" }),
  applicantPhone: z.string().min(7, { message: "El teléfono es obligatorio" }),
  applicantEmail: z.string().email({ message: "Correo inválido" }).optional().or(z.literal("")),
  relationToPatient: z.string().min(2, { message: "La relación es obligatoria" }),
  preferredContact: z.enum(["WHATSAPP", "TELEFONO"], { message: "Selecciona un medio de contacto" }),

  // Datos del Paciente
  patientName: z.string().min(2, { message: "El nombre del enfermo es obligatorio" }),
  patientPhone: z.string().optional(),
  ageRange: z.enum(["NINO", "JOVEN", "ADULTO", "ADULTO_MAYOR"], { message: "Selecciona un rango de edad" }),
  locationType: z.enum(["CASA", "HOSPITAL", "OTRO"], { message: "Selecciona dónde se encuentra" }),
  neighborhood: z.string().min(2, { message: "El barrio es obligatorio" }),
  exactAddress: z.string().min(5, { message: "La dirección exacta es obligatoria" }),

  // Situación Pastoral
  situationDescription: z.enum(["ENFERMEDAD_RECIENTE", "ENFERMEDAD_PROLONGADA", "SITUACION_DELICADA"], { 
    message: "Selecciona una descripción" 
  }),
  patientAwareness: z.enum(["SI", "NO", "NO_SEGURO"], { 
    message: "Selecciona una opción" 
  }),
  additionalNotes: z.string().optional(),

  // Datos Internos del Sistema
  supportType: z.array(z.string()).default(["VISITA_PASTORAL"]),
  
  // Consentimiento
  consentAccepted: z.boolean().refine((val) => val === true, {
    message: "Debes aceptar el tratamiento de datos",
  }),
})

export type RequestFormValues = z.infer<typeof requestFormSchema>