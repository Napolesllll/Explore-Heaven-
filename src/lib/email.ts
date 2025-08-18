import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendVerificationEmail(
  email: string,
  name: string,
  verifyUrl: string
) {
  // 1. Usa SIEMPRE tu dominio verificado en Resend
  const from = "noreply@tudominio.com"; // ¡REEMPLAZA CON TU DOMINIO VERIFICADO!

  // 2. Enviar SIEMPRE al usuario real (sin desvíos)
  const to = email;

  try {
    await resend.emails.send({
      from,
      to,
      subject: "Verifica tu cuenta - Explore Heaven",
      html: `
        <p>Hola ${name},</p>
        <p>Por favor verifica tu cuenta haciendo clic en este enlace:</p>
        <p><a href="${verifyUrl}" style="
          display: inline-block;
          padding: 10px 20px;
          background-color: #4f46e5;
          color: white;
          text-decoration: none;
          border-radius: 5px;
          font-weight: bold;
        ">Verificar cuenta</a></p>
        
        <p>O copia esta URL en tu navegador:<br>
        <code>${verifyUrl}</code></p>
        
        <p>El enlace expira en 24 horas.</p>
        <p>¡Gracias por unirte a nosotros!</p>
      `,
      text: `Hola ${name},\n\nPor favor verifica tu cuenta haciendo clic en este enlace:\n${verifyUrl}\n\nEl enlace expira en 24 horas.\n\n¡Gracias por unirte a nosotros!`
    });

    console.log(`✅ Email enviado a: ${to}`);
    return true;
  } catch (error) {
    console.error("❌ Error de Resend:", error);
    throw new Error("Error al enviar el correo de verificación");
  }
}