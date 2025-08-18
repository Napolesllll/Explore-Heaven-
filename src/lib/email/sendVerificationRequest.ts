// src/lib/email/sendVerificationRequest.ts
import nodemailer from "nodemailer";

interface SendVerificationRequestParams {
    identifier: string;
    url: string;
    provider: {
        server: string;
        from: string;
    };
}

export async function sendVerificationRequest({
    identifier: email,
    url,
    provider,
}: SendVerificationRequestParams) {
    try {
        console.log(`Preparing to send verification email to: ${email}`);

        // Crear el transportador de nodemailer
        const transporter = nodemailer.createTransport(provider.server);

        // Verificar la conexión
        await transporter.verify();
        console.log("SMTP connection verified successfully");

        // Template del email
        const html = `
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Verifica tu cuenta - Explore Heaven</title>
    <style>
        body {
            margin: 0;
            padding: 0;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
            color: #ffffff;
            line-height: 1.6;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
        }
        .header {
            text-align: center;
            padding: 40px 0;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            border-radius: 15px 15px 0 0;
            margin-bottom: 0;
        }
        .logo {
            width: 80px;
            height: 80px;
            background: #ffd700;
            border-radius: 50%;
            margin: 0 auto 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 24px;
            font-weight: bold;
            color: #1a1a2e;
            box-shadow: 0 10px 30px rgba(255, 215, 0, 0.3);
        }
        .content {
            background: rgba(255, 255, 255, 0.05);
            padding: 40px;
            border-radius: 0 0 15px 15px;
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.1);
        }
        .title {
            font-size: 28px;
            font-weight: bold;
            color: #ffd700;
            margin-bottom: 20px;
            text-align: center;
        }
        .message {
            font-size: 16px;
            color: #e0e0e0;
            margin-bottom: 30px;
            text-align: center;
        }
        .button-container {
            text-align: center;
            margin: 40px 0;
        }
        .verify-button {
            display: inline-block;
            background: linear-gradient(135deg, #ffd700 0%, #ffed4a 100%);
            color: #1a1a2e;
            text-decoration: none;
            padding: 15px 30px;
            border-radius: 50px;
            font-weight: bold;
            font-size: 16px;
            box-shadow: 0 10px 30px rgba(255, 215, 0, 0.3);
            transition: transform 0.2s ease;
        }
        .verify-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 15px 40px rgba(255, 215, 0, 0.4);
        }
        .divider {
            height: 1px;
            background: linear-gradient(90deg, transparent, #ffd700, transparent);
            margin: 30px 0;
        }
        .footer {
            text-align: center;
            padding: 20px;
            color: #888;
            font-size: 14px;
        }
        .security-note {
            background: rgba(255, 215, 0, 0.1);
            border: 1px solid rgba(255, 215, 0, 0.2);
            border-radius: 10px;
            padding: 20px;
            margin: 20px 0;
        }
        .security-note h4 {
            color: #ffd700;
            margin: 0 0 10px 0;
            font-size: 16px;
        }
        .security-note p {
            margin: 0;
            font-size: 14px;
            color: #cccccc;
        }
        .expire-info {
            background: rgba(108, 117, 125, 0.1);
            border-radius: 8px;
            padding: 15px;
            margin: 20px 0;
            text-align: center;
            font-size: 14px;
            color: #aaa;
        }
        .url-fallback {
            background: rgba(255, 255, 255, 0.05);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 8px;
            padding: 15px;
            margin: 20px 0;
            word-break: break-all;
            font-family: monospace;
            font-size: 12px;
            color: #ccc;
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
        const text = `
¡Hola!

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
        throw new Error(`Failed to send verification email: ${error.message}`);
    }
}