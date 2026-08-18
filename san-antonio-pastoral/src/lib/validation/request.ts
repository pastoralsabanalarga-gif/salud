import * as z from "zod"

export const requestFormSchema = z.object({
  // Datos del Solicitante
  applicantName: z.string().min(3, { message: "El nombre debe tener al menos 3 caracteres." }),
  applicantPhone: z.string().min(7, { message: "Ingresa un número de teléfono válido." }),
  applicantEmail: z.string().email({ message: "Correo inválido." }).optional().or(z.literal("")),
  relationToPatient: z.string().min(2, { message: "Indica tu relación con la persona (ej. Hijo, Esposa, Amigo)." }),
  preferredContact: z.enum(["TELEFONO", "WHATSAPP", "CORREO"], {
    required_error: "Selecciona un medio de contacto preferido.",
  }),

  // Datos de la Persona Acompañada
  patientName: z.string().min(3, { message: "El nombre debe tener al menos 3 caracteres." }),
  patientPhone: z.string().optional(),
  ageRange: z.string({ required_error: "Selecciona un rango de edad aproximado." }),
  neighborhood: z.string().min(3, { message: "Indica el barrio o sector." }),
  exactAddress: z.string().min(5, { message: "La dirección es necesaria para la visita." }),
  locationType: z.enum(["CASA", "HOSPITAL", "OTRO"], {
    required_error: "Indica dónde se encuentra la persona.",
  }),

  // Preguntas Pastorales
  supportType: z.array(z.string()).min(1, { message: "Selecciona al menos un tipo de acompañamiento." }),
  situationDescription: z.string({ required_error: "Selecciona cómo describirías la situación." }),
  patientAwareness: z.enum(["SI", "NO", "NO_SEGURO"], {
    required_error: "Indica si la persona sabe de esta solicitud.",
  }),
  additionalNotes: z.string().optional(),

  // Consentimiento (Obligatorio)
  consentAccepted: z.boolean().refine((val) => val === true, {
    message: "Debes aceptar el tratamiento de datos para poder continuar.",
  }),
})

export type RequestFormValues = z.infer<typeof requestFormSchema>