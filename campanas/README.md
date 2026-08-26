# Campañas desplegadas

Aquí queda el registro público de los contratos que cada persona despliega en la
**Sesión 3**.

## Cómo registrar la tuya

1. Haz **fork** de este repositorio.
2. Crea un archivo nuevo en esta carpeta con el nombre `tu-usuario-de-github.json`.
3. Cópialo de [`ejemplo.json`](./ejemplo.json) y cambia los valores por los tuyos.
4. Abre un **pull request** hacia `main`.

Un archivo por persona. Así nadie pisa el trabajo de nadie y no hay conflictos al
mezclar los pull requests.

## Campos

| Campo | Qué va | Obligatorio |
| --- | --- | --- |
| `campana` | El nombre que le pusiste a tu campaña en el contrato | sí |
| `descripcion` | Una línea sobre qué financia | sí |
| `contract_id` | El ID que te devolvió `stellar contract deploy`. Empieza por `C` | sí |
| `github` | Tu usuario, sin `@` y sin URL | sí |
| `red` | `testnet` | sí |
| `sede` | `cuc` o `uninorte` | sí |

## Cómo verificar la tuya

Pega tu `contract_id` en
[Stellar Expert (testnet)](https://stellar.expert/explorer/testnet) y deberías ver tu
contrato desplegado, con tu cuenta como administrador.
