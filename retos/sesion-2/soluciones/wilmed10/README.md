# Reto 3 - Consulta el estado del Pool

Script en TypeScript que consulta el contrato de crowdfunding en testnet
(`CDF5IJWNCGNPBWTFCW3PWRXKPWZTPKQSHHRRYTSSCXKQ37U2CPDONSZ2`) y muestra:

- Nombre de la campaña
- Estado (Active / Completed / Failed / Withdrawn)
- Recaudado, meta y % de avance
- Contribuyentes
- Días restantes hasta el deadline

## Cómo lo hice

Llamo a `name()` y `get_status()`, que son funciones de solo lectura del
contrato, así que no hace falta firmar ni enviar nada, solo simulo la
transacción contra el RPC de testnet y leo el resultado. La cuenta que uso
como "fuente" solo sirve para tener un sequence number con el que armar la
transacción de simulación, no gasta fees ni firma.

Lo corrí sobre el proyecto `stellar-sdk-examples` porque ya tenía ahí el
setup de conexión al RPC/testnet (`src/lib/config.ts`).

## Cómo correrlo

```bash
npm install
cp .env.example .env
npx tsx src/01-generate-keypair.ts
npx tsx src/02-fund-friendbot.ts <PUBLIC_KEY>
# pegar la S... en .env como SENDER_SECRET
npx tsx src/11-pool-status.ts

Salida

Campaña: Stellar Campus CUC
Estado: Withdrawn
Recaudado: 310 / 300 (100.00%)
Contribuyentes: 6
Días restantes: 2