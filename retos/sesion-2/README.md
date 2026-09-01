# Retos de la Sesión 2

La tarea entre la Sesión 2 y la Sesión 3 es **escoger un reto, resolverlo y
enviarlo como pull request** a este repositorio.

Hay nueve retos de dificultad escalonada. Escoge **uno** — el que te quede
cómodo. No hay premio por escoger el difícil, y sí hay reconocimiento público
en la Sesión 3 para las mejores contribuciones de cada universidad.

**Varios pueden escoger el mismo reto.** No hay que "reservarlo" ni avisar.
Cada quien entrega en su propia carpeta, así que nunca se pisan entre ustedes
y tampoco compiten por un cupo. Diez soluciones al mismo reto son diez formas
distintas de resolverlo, y eso es justamente lo interesante de revisarlas.

## Cómo entregar

1. Haz **fork** de este repositorio.
2. Crea la carpeta `retos/sesion-2/soluciones/TU-USUARIO-DE-GITHUB/`.
3. Pon ahí tu solución y un `README.md` corto explicando qué hiciste.
4. Abre un **pull request** hacia `main` con el título `Reto N — tu usuario`.

Una carpeta por persona. Así nadie pisa el trabajo de nadie y no hay
conflictos al mezclar los pull requests.

Si nunca has enviado un PR, [`CONTRIBUTING.md`](../../CONTRIBUTING.md) tiene el
paso a paso.

## El entorno: cero instalación

Todos los retos de código se pueden hacer **desde el navegador**, sin instalar
nada, con GitHub Codespaces:

👉 **https://codespaces.new/QuillaBlocks/stellar-sdk-examples?quickstart=1**

Trae Node, el SDK de Stellar y el Stellar CLI ya configurados. También puedes
trabajar local si prefieres.

---

## Datos que vas a necesitar

| Dato | Valor |
| --- | --- |
| Contrato del Pool Comunitario | `CBMBKCV3I474M7MLNGPTIVSDK53IGGQPT6YOS2P7SNKMQNYX65L2CZXJ` |
| Red | testnet |
| RPC | `https://soroban-testnet.stellar.org` |
| Horizon | `https://horizon-testnet.stellar.org` |
| Explorador | [stellar.expert/explorer/testnet](https://stellar.expert/explorer/testnet) |

---

## Los retos

### 🟢 Reto 1 — Glosario (fácil, sin código)

Escribe **tres términos** con su definición corta y en tus palabras, en un
archivo `glosario.md` dentro de **tu carpeta**.

Términos que hacen falta: *stroop, trustline, anchor, SAC, TTL, quorum slice,
Wasm, ledger, Friendbot, keypair, testnet, Horizon, RPC, deadline, Soroban*.
Escoge tres que no estén ya en [`GLOSARIO.md`](./GLOSARIO.md).

No vale copiar y pegar de la documentación. La gracia es explicarlo como se lo
explicarías a un compañero que llegó tarde.

> Los escribes en tu carpeta, no en `GLOSARIO.md` directamente. Ese archivo es
> compartido: si quince personas lo editan a la vez, los pull requests chocan.
> Después de la Sesión 3 consolidamos todos los aportes ahí.

**Qué se evalúa:** claridad y que sea correcto.

---

### 🟢 Reto 2 — Documenta un tropiezo (fácil, sin código)

¿Algo no te funcionó en la Sesión 1 o 2? ¿La transacción falló, Freighter no
conectaba, el Lab no cargaba, te equivocaste de red?

Escribe en tu carpeta un `README.md` con: qué intentabas hacer, qué error te
salió (el texto exacto), y cómo lo resolviste.

**Qué se evalúa:** que sirva para que el próximo no se trabe igual. Este reto
es oro para el programa y no requiere saber programar.

---

### 🟡 Reto 3 — Consulta el estado del Pool (medio, SDK)

Escribe un script en JavaScript o TypeScript que lea el contrato del Pool y
muestre en consola, con buen formato:

- El nombre de la campaña
- Cuánto se ha recaudado y cuál es la meta
- El porcentaje de avance
- Cuántos contribuyentes hay
- Cuántos días faltan para el deadline

Pista: las funciones `get_status()`, `name()` y `goal()` del contrato son de
solo lectura, así que no necesitas firmar nada ni tener fondos.

**Qué se evalúa:** que corra sin errores y que la salida se entienda.

---

### 🟡 Reto 4 — Lista los contribuyentes (medio, SDK + eventos)

Escribe un script que lea los **eventos** `contribute` del contrato del Pool y
liste quién aportó, cuánto y cuándo, ordenado por fecha.

⚠️ Ojo con una trampa real: el RPC público de testnet solo retiene eventos de
una ventana reciente. Si pides un `startLedger` demasiado viejo, la respuesta
vuelve **vacía y sin error**. Nos pasó construyendo la dApp.

**Qué se evalúa:** que maneje la paginación y que no se rompa si no hay eventos.

---

### 🔴 Reto 5 — Contribuye sin wallet (difícil, SDK + firma)

En la sesión contribuiste al Pool con Freighter. Ahora hazlo **desde código**:
un script que construya la invocación a `contribute`, la firme con una clave
secreta de testnet y la envíe.

Es la misma operación, pero ahora tú controlas cada paso: simular, ensamblar,
firmar, enviar y esperar confirmación.

**Qué se evalúa:** que la transacción quede en la cadena. Incluye el hash en tu
README.

---

### 🔴 Reto 6 — El contrato y USDC (difícil, Soroban)

El contrato recibe el token como parámetro en `initialize(admin, name, goal,
deadline, **token**)`, así que en teoría ya soporta cualquier asset — incluido
USDC.

Lee el contrato en
[`crowdfunding-dapp`](https://github.com/QuillaBlocks/crowdfunding-dapp/blob/main/contracts/crowdfunding/src/contract.rs)
y escribe un análisis en tu carpeta respondiendo:

1. ¿Qué habría que hacer para lanzar una campaña en USDC en vez de XLM?
2. ¿Por qué un asistente con una wallet recién creada **no podría** contribuir
   a esa campaña? ¿Qué le falta a su cuenta?
3. ¿Qué le agregarías al contrato o al frontend para que esa persona no se
   quede trabada?

No hay que escribir Rust. Hay que **entender** el contrato. Este reto es la
mejor preparación para la Sesión 3.

**Qué se evalúa:** que el análisis sea correcto y concreto.

---

### 🟢 Reto 7 — Dibuja el flujo de una contribución (fácil, sin código)

Cuando aprietas "Aportar" en la dApp pasan como seis cosas antes de que tu XLM
llegue al contrato. Dibújalas.

Haz un diagrama que muestre el recorrido completo: **tú → el navegador →
Freighter → el RPC → el contrato → el ledger**, y qué pasa en cada paso.

Puedes entregarlo como imagen, o mejor aún en
[Mermaid](https://mermaid.js.org/syntax/sequenceDiagram.html) dentro de tu
`README.md` — GitHub lo renderiza solo y así se puede revisar en el diff.

Pista: la slide de la sesión y el archivo
[`crowdfunding.ts`](https://github.com/QuillaBlocks/crowdfunding-dapp/blob/main/frontend/lib/crowdfunding.ts)
tienen todo lo que necesitas.

**Qué se evalúa:** que el flujo esté completo y en el orden correcto. No que sea
bonito.

---

### 🟢 Reto 8 — Escribe la guía de instalación local (fácil)

En la sesión usamos Codespaces para no perder tiempo instalando. Pero varios van
a querer trabajar en su propia máquina.

Escribe la guía para montar `stellar-sdk-examples` en local, desde cero:
qué instalar, en qué orden, cómo configurar el `.env`, y cómo verificar que
quedó bien.

**Tiene que estar probada por ti**, en tu sistema operativo. Di cuál usaste.
Si algo te falló, ponlo también — eso es lo más valioso de la guía.

**Qué se evalúa:** que alguien más pueda seguirla sin trabarse.

---

### 🟡 Reto 9 — ¿Esta cuenta puede recibir USDC? (medio, SDK)

En Stellar una cuenta no puede recibir un asset que no sea XLM hasta que
establece una **trustline** con ese asset. Por eso los premios de la Sesión 1 se
pagaron en XLM y no en USDC.

Escribe un script que reciba una dirección y responda:

- ¿La cuenta existe en la red?
- ¿Tiene trustline de USDC?
- Si la tiene, ¿cuál es su balance y cuánto más puede recibir?
- Si no la tiene, ¿qué tendría que hacer?

Pruébalo con tu propia cuenta de testnet y con la de un compañero.

Pista: Horizon devuelve los `balances` de una cuenta, y cada trustline aparece
ahí con su `asset_code` y su `asset_issuer`.

**Qué se evalúa:** que responda bien los cuatro casos, incluido el de una cuenta
que no existe.

---

## Fechas

Los pull requests se revisan **en vivo** al abrir la Sesión 3. Envía el tuyo
antes de esa fecha para que entre en la revisión.
