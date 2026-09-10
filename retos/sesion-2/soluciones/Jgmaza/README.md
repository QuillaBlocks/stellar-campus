# Retos 3, 4 y 5 — Jgmaza

Soluciones de la Sesión 2 del [Stellar Campus](https://github.com/QuillaBlocks/stellar-campus)
contra el Pool Comunitario en testnet.

**Contrato del Pool:** `CDF5IJWNCGNPBWTFCW3PWRXKPWZTPKQSHHRRYTSSCXKQ37U2CPDONSZ2`

## Cómo correr

Node 18+.

```bash
npm install
npm run status        # Reto 3
npm run contributors  # Reto 4
npm run contribute    # Reto 5 (opcional: SENDER_SECRET en .env)
```

No subas un `.env` con claves al PR.

---

## Reto 3 — Estado del Pool

`pool-status.ts` llama `name()`, `goal()` y `get_status()` por simulación (sin firmar).

Muestra campaña, recaudado/meta, %, contribuyentes y días restantes.

---

## Reto 4 — Lista contribuyentes (eventos)

`list-contributors.ts` lee eventos `contribute` con `getEvents`, pagina con `cursor`
y ordena por fecha.

Trampa del reto: si `startLedger` queda fuera de la retención del RPC, la
respuesta viene **vacía y sin error**. El script ancla la ventana en
`oldestLedger` del RPC (~7 días en testnet público).

---

## Reto 5 — Contribute desde código

`contribute.ts` arma la invocación, la simula, firma con una clave de testnet,
envía y espera confirmación.

El Pool oficial estaba en estado **Withdrawn** (meta alcanzada y fondos
retirados), así que `contribute` ahí falla con `NotActive`. El script detecta
eso, despliega una campaña de prueba con el **mismo Wasm** del Pool, la
inicializa y aporta 1 XLM.

### Hash de la contribución (on-chain)

| Campo | Valor |
| --- | --- |
| Contrato (prueba) | `CC77QRWUO7VP2I2TTQWBV6P4L6VAXSQWLZS4EAQWTBEERYXMQOZYKT3V` |
| Hash | `f4ac3ebc578061c44001b9d6168392b1d802a5cc0114ba210872f087c3160747` |
| Explorador | [ver tx](https://stellar.expert/explorer/testnet/tx/f4ac3ebc578061c44001b9d6168392b1d802a5cc0114ba210872f087c3160747) |
| initialize | [tx](https://stellar.expert/explorer/testnet/tx/7c8e6e374391557d11988fea5d5b5b550148427637a3b6397d8233ce7f3f8d4d) |

Para usar tu propia cuenta:

```bash
cp .env.example .env   # pega SENDER_SECRET=S...
npm run contribute
```

---

## Archivos

| Archivo | Reto |
| --- | --- |
| `pool-status.ts` | 3 |
| `list-contributors.ts` | 4 |
| `contribute.ts` | 5 |
| `package.json` | deps + scripts |
