# Implementación de Pagos en Línea — Tapazi v2

> **Contexto:** Tapazi es una SPA/PWA de React puro sin backend propio — toda la lógica vive en una API REST externa. Esto es el punto más importante al planear pagos: **no se puede procesar un pago de forma segura solo desde el frontend.**

---

## 1. El problema fundamental: necesitas un backend

Los proveedores de pagos (Stripe, MercadoPago, PayPal) requieren una **clave secreta** para crear sesiones de pago, webhooks para confirmar cobros, y lógica para verificar el estado del pago antes de activar acceso. Todo eso **no puede vivir en el cliente** (cualquiera podría verlo en el código fuente).

**Opciones para el backend:**

| Opción | Descripción | Complejidad |
|---|---|---|
| Agregar endpoints al API existente | Lo más limpio — el backend actual maneja pagos también | Baja (si tienes acceso al backend) |
| Serverless functions en Vercel | Archivos en `/api/*.ts` que Vercel ejecuta como funciones Node.js | Baja-Media |
| Servicio separado (Express, FastAPI, etc.) | Backend independiente | Media-Alta |

**Recomendación para Tapazi:** Serverless functions en Vercel (opción 2) o agregar endpoints al API existente, dependiendo de quién controla el backend.

---

## 2. Proveedores recomendados

### Stripe ⭐ (recomendado global)

- El estándar de la industria, mejor documentación, SDK robusto
- Ideal si los usuarios pagan con tarjeta de crédito/débito internacional
- Disponible en México y Latinoamérica
- **Comisión:** 2.9% + $0.30 USD por transacción (tarjeta nacional); varía por país
- **Sin costo mensual fijo**

### MercadoPago ⭐ (recomendado LATAM)

- Dominante en México, Argentina, Colombia, Chile, Brasil
- Acepta: tarjetas, OXXO, SPEI, transferencias bancarias locales
- Muy usado si tu base de usuarios es latinoamericana
- **Comisión:** ~3.6% + IVA por transacción (México); varía por método de pago
- **Sin costo mensual fijo**

### PayPal

- Buena cobertura internacional, pero comisiones más altas
- Mejor para usuarios que ya tienen cuenta PayPal
- **Comisión:** 3.49% + cargo fijo por transacción
- Menos popular en LATAM comparado con MercadoPago

---

## 3. Flujo de pago recomendado (Stripe como ejemplo)

```
Usuario hace clic en "Pagar"
        ↓
Frontend llama a tu backend: POST /api/create-payment-session
        ↓
Backend crea una sesión en Stripe con la clave secreta
Backend devuelve un { sessionId } o { url }
        ↓
Frontend redirige al usuario a la URL de pago de Stripe (Checkout)
        ↓
Stripe procesa el pago
Stripe llama a tu webhook: POST /api/stripe-webhook
        ↓
Backend verifica el pago, activa acceso del usuario en la DB
        ↓
Usuario regresa a Tapazi con acceso desbloqueado
```

---

## 4. Implementación paso a paso

### Paso 1 — Crear cuenta en Stripe

1. Registrarse en [stripe.com](https://stripe.com)
2. Completar verificación de negocio (nombre, RFC/EIN, cuenta bancaria para depósitos)
3. Obtener las claves: `STRIPE_PUBLIC_KEY` y `STRIPE_SECRET_KEY`

### Paso 2 — Configurar el backend

**Si usas Vercel Serverless Functions**, crear el archivo:

```
tapazi-v2/
└── api/
    ├── create-payment-session.ts   ← crea la sesión de pago
    └── stripe-webhook.ts           ← confirma el pago
```

```ts
// api/create-payment-session.ts
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export default async function handler(req, res) {
  const { userId, priceId } = req.body;

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: [{ price: priceId, quantity: 1 }],
    mode: "payment", // o "subscription" para cobros recurrentes
    success_url: `https://tapazi.com/sports/${userId}?payment=success`,
    cancel_url: `https://tapazi.com/sports/${userId}?payment=cancelled`,
    metadata: { userId },
  });

  res.json({ url: session.url });
}
```

```ts
// api/stripe-webhook.ts
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export default async function handler(req, res) {
  const sig = req.headers["stripe-signature"];
  const event = stripe.webhooks.constructEvent(
    req.body,
    sig,
    process.env.STRIPE_WEBHOOK_SECRET!
  );

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const userId = session.metadata.userId;
    // Llamar al API de Tapazi para activar acceso del usuario
    await activateUserAccess(userId);
  }

  res.json({ received: true });
}
```

### Paso 3 — Integrar en el frontend (React)

```bash
npm install @stripe/stripe-js
```

```ts
// src/api/PaymentsAPI.ts
import { apiEnv } from "@/lib/axios";

export const createPaymentSession = async (userId: string, priceId: string) => {
  const { data } = await apiEnv.post("/create-payment-session", {
    userId,
    priceId,
  });
  return data.url; // URL de Stripe Checkout
};
```

```tsx
// En el componente donde quieres el botón de pago
import { createPaymentSession } from "@/api/PaymentsAPI";

const handlePayment = async () => {
  const url = await createPaymentSession(userId, "price_xxxxx");
  window.location.href = url; // redirige a Stripe Checkout
};

<Button onClick={handlePayment}>Suscribirse</Button>
```

### Paso 4 — Variables de entorno

En Vercel Dashboard → Settings → Environment Variables:

```
STRIPE_PUBLIC_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

En local (`.env.development`):
```
VITE_STRIPE_PUBLIC_KEY=pk_test_...
```

### Paso 5 — Configurar webhook en Stripe Dashboard

1. Stripe Dashboard → Developers → Webhooks
2. Agregar endpoint: `https://tapazi.com/api/stripe-webhook`
3. Seleccionar evento: `checkout.session.completed`
4. Copiar el "Signing secret" → `STRIPE_WEBHOOK_SECRET`

---

## 5. Modelos de cobro posibles para Tapazi

| Modelo | Descripción | Stripe setup |
|---|---|---|
| Pago único por torneo | El usuario paga para unirse a un torneo específico | `mode: "payment"` |
| Suscripción mensual | Acceso a todos los torneos por $X/mes | `mode: "subscription"` |
| Créditos / tokens | El usuario compra créditos y los gasta en torneos | Pago único + lógica en backend |

---

## 6. Costos totales estimados

### Stripe (modelo pago único por torneo)

| Concepto | Costo |
|---|---|
| Cuenta Stripe | Gratis |
| Por transacción (tarjeta) | 2.9% + $0.30 USD |
| Ejemplo: cobro de $10 USD | ~$0.59 USD de comisión → recibes ~$9.41 |
| Ejemplo: cobro de $5 USD | ~$0.44 USD de comisión → recibes ~$4.56 |
| Conversión de moneda (MXN→USD) | +1.5% adicional si cobras en MXN |

### MercadoPago (México)

| Concepto | Costo |
|---|---|
| Cuenta | Gratis |
| Tarjeta de crédito | ~3.6% + IVA (≈4.18%) |
| OXXO | ~4.0% + IVA fijo |
| SPEI / Transferencia | ~1.2% + IVA |
| Ejemplo: cobro de $100 MXN con tarjeta | ~$4.18 MXN de comisión → recibes ~$95.82 |

### Costo de desarrollo estimado

| Tarea | Tiempo estimado |
|---|---|
| Setup cuenta + claves + productos en Stripe | 2–4 horas |
| Serverless functions (backend) | 4–8 horas |
| Integración en frontend (React) | 4–6 horas |
| Pruebas con tarjetas de test | 2–3 horas |
| **Total** | **~12–21 horas** |

---

## 7. Checklist de implementación

- [ ] Decidir proveedor (Stripe o MercadoPago)
- [ ] Decidir modelo de cobro (pago único / suscripción / créditos)
- [ ] Decidir dónde vive el backend (API existente vs Vercel Functions)
- [ ] Crear cuenta y verificar negocio en el proveedor
- [ ] Crear los productos/precios en el dashboard del proveedor
- [ ] Implementar endpoint `create-payment-session`
- [ ] Implementar endpoint `stripe-webhook` (o equivalente)
- [ ] Integrar botón de pago en el frontend
- [ ] Configurar variables de entorno en Vercel
- [ ] Probar con tarjetas de prueba (`4242 4242 4242 4242` en Stripe)
- [ ] Activar modo producción y verificar primer cobro real

---

## 8. Recursos

- [Stripe Docs — Checkout](https://stripe.com/docs/payments/checkout)
- [Stripe Docs — Webhooks](https://stripe.com/docs/webhooks)
- [MercadoPago Docs — Checkout Pro](https://www.mercadopago.com.mx/developers/es/docs/checkout-pro/landing)
- [Vercel Serverless Functions](https://vercel.com/docs/functions)
- [Stripe tarjetas de prueba](https://stripe.com/docs/testing#cards)
