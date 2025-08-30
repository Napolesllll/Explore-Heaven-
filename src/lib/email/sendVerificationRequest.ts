import nodemailer from "nodemailer";
import type { EmailConfig } from "next-auth/providers/email";

// Crear un tipo que acepta tanto EmailConfig de NextAuth como nuestro objeto personalizado
type EmailProviderConfig = EmailConfig | {
    server: string | nodemailer.TransportOptions | {
        host: string;
        port: number;
        auth: {
            user: string;
            pass: string;
        };
    };
    from: string;
};

interface SendVerificationRequestParams {
    identifier: string;
    url: string;
    provider: EmailProviderConfig;
}

export async function sendVerificationRequest({
    identifier: email,
    url,
    provider,
}: SendVerificationRequestParams) {
    try {
        console.log(`Preparing to send verification email to: ${email}`);

        // Crear el transportador de nodemailer usando el server que envía NextAuth
        // NextAuth puede enviar el server como string (URL) o como objeto
        const transporter = nodemailer.createTransport(provider.server);

        // Verificar la conexión SMTP
        await transporter.verify();
        console.log("SMTP connection verified successfully");

        // Template del email (HTML)
        const html = `
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Verifica tu cuenta - Explore Heaven</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            margin: 0;
            padding: 20px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
        }
        
        .container {
            max-width: 600px;
            margin: 0 auto;
            background: white;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 10px 30px rgba(0,0,0,0.2);
        }
        
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            padding: 30px;
            text-align: center;
            color: white;
        }
        
        .logo {
            width: 60px;
            height: 60px;
            background: rgba(255,255,255,0.2);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 20px;
            font-size: 24px;
            font-weight: bold;
        }
        
        .content {
            padding: 40px 30px;
        }
        
        .title {
            color: #333;
            font-size: 28px;
            margin-bottom: 20px;
            text-align: center;
        }
        
        .message {
            color: #666;
            font-size: 16px;
            line-height: 1.6;
            margin-bottom: 30px;
            text-align: center;
        }
        
        .button-container {
            text-align: center;
            margin: 30px 0;
        }
        
        .verify-button {
            display: inline-block;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 15px 30px;
            text-decoration: none;
            border-radius: 8px;
            font-weight: bold;
            font-size: 16px;
            transition: transform 0.2s ease;
        }
        
        .verify-button:hover {
            transform: translateY(-2px);
        }
        
        .expire-info {
            background: #f8f9fa;
            padding: 15px;
            border-radius: 8px;
            text-align: center;
            color: #666;
            font-size: 14px;
            margin: 20px 0;
        }
        
        .divider {
            height: 1px;
            background: #eee;
            margin: 30px 0;
        }
        
        .security-note {
            background: #f8f9fa;
            padding: 20px;
            border-radius: 8px;
            border-left: 4px solid #667eea;
        }
        
        .security-note h4 {
            margin: 0 0 10px 0;
            color: #333;
            font-size: 16px;
        }
        
        .security-note p {
            margin: 0;
            color: #666;
            font-size: 14px;
            line-height: 1.5;
        }
        
        .url-fallback {
            background: #f8f9fa;
            padding: 15px;
            border-radius: 8px;
            word-break: break-all;
            font-size: 12px;
            color: #666;
            text-align: center;
            margin-top: 10px;
        }
        
        .footer {
            background: #f8f9fa;
            padding: 20px;
            text-align: center;
            color: #999;
            font-size: 12px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">EH</div>
            <h1 style="color: white; margin: 0; font-size: 24px;">Explore Heaven</h1>
            <p style="color: rgba(255,255,255,0.8); margin: 10px 0 0 0; font-size: 14px;">
                Descubre experiencias únicas
            </p>
        </div>
        
        <div class="content">
            <h2 class="title">¡Verifica tu cuenta!</h2>
            
            <p class="message">
                ¡Hola! Gracias por registrarte en Explore Heaven. Para completar tu registro y acceder a todas nuestras funcionalidades, necesitamos verificar tu dirección de correo electrónico.
            </p>
            
            <div class="button-container">
                <a href="${url}" class="verify-button">
                    ✨ Verificar mi cuenta
                </a>
            </div>
            
            <div class="expire-info">
                ⏰ Este enlace expira en 24 horas
            </div>
            
            <div class="divider"></div>
            
            <div class="security-note">
                <h4>🔒 Nota de Seguridad</h4>
                <p>
                    Si no te registraste en Explore Heaven, puedes ignorar este correo de forma segura. 
                    Tu dirección de email no será utilizada sin tu consentimiento.
                </p>
            </div>
            
            <p style="font-size: 14px; color: #aaa; text-align: center; margin-top: 30px;">
                Si el botón no funciona, puedes copiar y pegar este enlace en tu navegador:
            </p>
            <div class="url-fallback">
                ${url}
            </div>
        </div>
        
        <div class="footer">
            <p>© ${new Date().getFullYear()} Explore Heaven. Todos los derechos reservados.</p>
            <p style="margin-top: 10px; font-size: 12px;">
                Este es un correo automático, por favor no responder.
            </p>
        </div>
    </div>
</body>
</html>`;

        // Texto plano como fallback
        const text = `¡Hola!

Gracias por registrarte en Explore Heaven. Para completar tu registro, haz clic en el siguiente enlace para verificar tu dirección de correo electrónico:

${url}

Este enlace expira en 24 horas.

Si no te registraste en Explore Heaven, puedes ignorar este correo de forma segura.

---
© ${new Date().getFullYear()} Explore Heaven
Este es un correo automático, por favor no responder.
    `.trim();

        // Configuración del mensaje
        const mailOptions = {
            from: `"Explore Heaven" <${provider.from}>`,
            to: email,
            subject: "🌟 Verifica tu cuenta en Explore Heaven",
            text,
            html,
            headers: {
                'X-Priority': '1',
                'X-MSMail-Priority': 'High',
                'Importance': 'high',
            },
        };

        // Enviar el email
        const result = await transporter.sendMail(mailOptions);
        console.log(`Verification email sent successfully to ${email}:`, result.messageId);

        return result;

    } catch (error) {
        console.error("Error sending verification email:", error);
        throw new Error(`Failed to send verification email: ${error}`);
    }
}