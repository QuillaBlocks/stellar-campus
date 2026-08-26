# Stellar Campus Barranquilla

Programa de tres sesiones prácticas para aprender a construir sobre la blockchain de
**Stellar**, en la Universidad de la Costa y en la Universidad del Norte.

Organiza [QuillaBlocks](https://quillablocks.org) con el apoyo de la
[Blockchain Acceleration Foundation](https://www.blockchainacceleration.org/).

La convocatoria es abierta. No hay que ser estudiante de ninguna de las dos
universidades: egresados, profesionales y cualquier persona curiosa de la comunidad
pueden participar.

---

## Tu tarea después de la Sesión 1

Una sola cosa y toma dos minutos:

### 👉 [Abre tu issue de presentación aquí](https://github.com/QuillaBlocks/stellar-campus/issues/new?template=presentacion.yml)

Llena los campos, incluida la dirección de testnet que creaste hoy, y publica.
Con eso confirmamos que tu entorno quedó funcionando y arrancamos la próxima sesión sin
perder tiempo.

Quien haga la tarea queda primero en la fila para el reto con premio de la Sesión 3.

> Si quieres, dale **Fork** y **Star** al repo para tenerlo a mano. En la Sesión 2 vas a
> necesitar el fork sí o sí, porque la tarea será un pull request.

Antes de abrir el tuyo, mira el
[issue de ejemplo](https://github.com/QuillaBlocks/stellar-campus/issues?q=is%3Aissue+label%3Aejemplo) para ver el formato.

---

## Formulario de la sesión

Además del issue, llena el formulario con tu nombre, correo, usuario de GitHub, clave
pública y el link de tu transacción:

**https://forms.gle/bubf5E2DuNHuH9acA**

---

## Cuenta recolectora de cada sesión

Es la dirección a la que envías tus 10 XLM de prueba durante el hands-on.
Cópiala desde aquí — **no la teclees a mano desde el proyector**, son 56 caracteres y un
solo error hace que la transacción falle.

| Sesión | Sede | Dirección de testnet |
| --- | --- | --- |
| Sesión 1 · miércoles 26 de agosto | Universidad de la Costa | `GCNOD2V5JFF4ZDM6QDR55U2C7RMFEOPAMDLDDECLLSHUYOZ5FBRED2DM` |
| Sesión 1 · jueves 27 de agosto | Universidad del Norte | _se publica el jueves_ |

Verifica tu transacción en
[Stellar Expert (testnet)](https://stellar.expert/explorer/testnet).

---

## Las tres sesiones

### Sesión 1 — Introducción a blockchain y Stellar

Qué problema resuelve blockchain, conceptos base (bloque, hash, nodo, tipos de red),
anatomía de una transacción y claves pública/privada. Qué es Stellar y por qué importa:
liquidación en 3 a 5 segundos, costo por debajo de un centavo y casos de uso reales en
Colombia.

Práctica en [Stellar Lab](https://lab.stellar.org): creas tu keypair, lo fondeas con
Friendbot, construyes y firmas una transacción, y la verificas en Stellar Expert.

**Tarea:** abrir el issue de presentación con tu dirección de testnet.

### Sesión 2 — Stellar y Soroban en la práctica

Del Lab al código: cada acción de la Sesión 1 traducida a llamadas del SDK oficial de
JavaScript. Recorrido por el Stellar Stack, las tres redes y el rol de los anchors.

Segunda mitad dedicada a Soroban: qué es un contrato inteligente, por qué Rust y
WebAssembly, y el ciclo completo de `build`, `upload`, `deploy` e `invoke` con la Stellar
CLI. Demostración en vivo con una dApp de Crowdfunding desplegada en testnet, a la que
vas a contribuir desde tu propia wallet.

**Tarea:** escoger uno de los retos de [`retos/`](./retos) y enviar tu solución como pull
request.

### Sesión 3 — Despliega y contribuye

Revisión pública de los pull requests recibidos, con premio a la mejor contribución de
cada universidad. Luego modificas el contrato antes de desplegarlo, compilas, obtienes tu
propio Wasm y despliegas tu instancia en testnet como administrador de tu campaña.

Registras tu despliegue con un pull request a [`campanas/`](./campanas) y contribuyes a
las campañas de tus compañeros.

Cierre con ideación en equipos y la ruta completa del ecosistema: bootcamp con Ruta N,
Demo Day, hackathon y financiamiento vía SCF.

**Entregable:** contrato desplegado y registrado por PR, más el issue con la idea de
proyecto de tu equipo.

---

## Calendario

| Sesión | Universidad de la Costa | Universidad del Norte |
| --- | --- | --- |
| Sesión 1 | miércoles 26 de agosto | jueves 27 de agosto |
| Sesión 2 | semana del 1 al 3 de septiembre | semana del 1 al 3 de septiembre |
| Sesión 3 | semana del 8 al 10 de septiembre | semana del 8 al 10 de septiembre |

La hora exacta de cada sesión se confirma por los canales de QuillaBlocks y de cada
universidad.

---

## Herramientas que vas a usar

| Herramienta | Para qué | Cuándo |
| --- | --- | --- |
| [Stellar Lab](https://lab.stellar.org) | crear cuentas y enviar transacciones sin escribir código | Sesión 1 |
| [Stellar Expert](https://stellar.expert/explorer/testnet) | explorador para verificar transacciones | todas |
| [Freighter](https://freighter.app) | wallet en el navegador | Sesión 1 y 2 |
| [GitHub Codespaces](https://github.com/features/codespaces) | entorno de desarrollo en el navegador, sin instalar nada | Sesión 2 y 3 |
| [Stellar CLI](https://developers.stellar.org/docs/tools/developer-tools/cli/stellar-cli) | compilar y desplegar contratos Soroban | Sesión 3 |

## Licencia

[MIT](./LICENSE). Todo el material del programa es libre de reusar.
