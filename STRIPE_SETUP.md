Guía de configuración de Stripe para producción

Resumen

Este documento describe los cambios necesarios para poner en producción la pasarela de pago con Stripe usada en este proyecto Next.js (App Router).

Variables de entorno necesarias

- DATABASE_URL -> URL de Postgres (usada por Prisma)
- NEXTAUTH_URL -> URL de la app (https://mi-dominio.com)
- NEXTAUTH_SECRET -> Secreto para NextAuth
- STRIPE*SECRET_KEY -> Clave secreta de Stripe (ej: sk_live*...)
- STRIPE_WEBHOOK_SECRET -> Secreto del webhook (lo provee Stripe cuando creas el endpoint)
- NEXT_PUBLIC_BASE_URL -> URL pública de la app (https://mi-dominio.com)

Recomendaciones y pasos

1. Usar runtime Node en las rutas de Stripe

- Las funciones de Stripe enrutadas necesitan acceso al cuerpo crudo (Buffer) y conexiones de BD; exportar `export const runtime = 'nodejs'` en las rutas.

2. Proteger la ruta de webhook

- En Stripe Dashboard configura el endpoint con la URL: https://mi-dominio.com/api/stripe/webhook
- Copia el valor de Signing secret y configúralo en STRIPE_WEBHOOK_SECRET.
- Habilita sólo los eventos necesarios (ej: checkout.session.completed).

3. Metadata: claves y valores

- Usar sólo claves ASCII simples: nombre, fecha, tourId, telefono, userId, adultos, ninos
- Evitar acentos y caracteres especiales en las claves.
- Serializar valores: fechas en ISO o timestamp.

4. Evitar duplicados

- El webhook implementa una comprobación para evitar insertar la misma reserva varias veces buscando por { correo, tourId, nombre, fecha }.

5. Validaciones estrictas

- Validar fecha antes de guardar. Si la fecha no puede parsearse, rechazar el webhook con 400.
- Revisar que el tour exista en la BD antes de crear la reserva.

6. Reintentos y idempotencia

- Stripe reintentará webhooks. Considera usar un campo `stripeSessionId` en `Reserva` y marcarlo único para idempotencia adicional en migraciones futuras.

7. Logs y monitoreo

- Mantén logs de error y éxito. Monitorea errores 5xx y respuestas con 4xx cuando falten campos.

8. Pruebas locales

- Usa `stripe listen --forward-to localhost:3000/api/stripe/webhook` para probar webhooks localmente.
- Prueba crear sesión de checkout en desarrollo y verificar que el success_url y metadata estén bien.

9. Migraciones y Prisma

- Asegúrate de que `prisma migrate deploy` se ejecute en deploy para sincronizar la BD.

10. Seguridad extra

- Considera encriptar datos sensibles en la BD (teléfonos) si lo requiere tu política.

Notas finales

Migración Prisma (añadir stripeSessionId)

Si quieres aplicar el nuevo campo `stripeSessionId` en la tabla `Reserva` sigue una de estas opciones:

1. En producción (recomendado):


    - Sube el repo con la carpeta `prisma/migrations/20250903_add_stripeSessionId` (ya incluida).
    - Ejecuta en el servidor/CI (con DATABASE_URL apuntando a tu BD de producción):

```bash
npx prisma migrate deploy
```

    - `prisma migrate deploy` aplicará las migraciones pendientes sin perder datos.

2. En desarrollo local (si quieres probar primero):


    - Asegúrate de tener backup o snapshot de tu DB de desarrollo.
    - Ejecuta:

```bash
npx prisma migrate dev --name add-stripeSessionId
```

    - Nota: si la herramienta detecta drift entre historial de migraciones y la BD, revisa antes de forzar reset. Evita `prisma migrate reset` en bases con datos que no quieres perder.

3. Si tu entorno no puede alcanzar la BD desde este entorno (error P1001), puedes aplicar manualmente el SQL en `prisma/migrations/20250903_add_stripeSessionId/migration.sql` usando tu cliente de BD preferido.

Precauciones:

- El índice único creado permite NULLs. Si tu BD ya tiene múltiples filas con NULL en `stripeSessionId`, no habrá conflicto.
- Testea en staging antes de aplicar en producción.

Si usas Vercel, configura las variables en el panel de Environment Variables. Para otros hosts, asegúrate de no exponer claves en repositorios.
