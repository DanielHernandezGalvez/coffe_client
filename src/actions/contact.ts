import { defineAction } from "astro:actions"
import { z } from "astro:schema";
import { nullToEmptyString } from "../helpers";

export const contact = {
    sendEmail: defineAction({
        accept: 'form',
        input: z.object({
            name: z.preprocess(
                nullToEmptyString,
                z.string().min(1, { message: 'El nombre no puede ir vacío' })
            ),
            email: z.preprocess(
                nullToEmptyString,
                z.string().min(1, { message: 'El correo no puede ir vacío' })
                .email({ message: 'El correo no es válido'  })
            ),
            subject: z.preprocess(
                nullToEmptyString,
                z.string().min(1, { message: 'El asunto no puede ir vacío' })
            ),
            message: z.preprocess(
                nullToEmptyString,
                z.string().min(10, { message: 'El mensaje no puede ir vacío' })
            ),
        }),
        handler: async (input) => {
           const url = `${import.meta.env.HOME_URL}/wp-json/contact-form-7/v1/contact-forms/140/feedback`

           const formData = new FormData()
           formData.append('your-name', input.name)
           formData.append('your-email', input.email)
           formData.append('your-subject', input.subject)
           formData.append('your-message', input.message)
           formData.append('_wpcf7_unit_tag', 'wpcf7-123')

           const res = await fetch(url, {
            method: 'POST',
            body: formData
           })

           const json = await res.json()


           return {
            error: false,
            message: 'Tu mensaje se envió correctamente, te responderemos pronto.'
           }
        }
    })
}