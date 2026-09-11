# Solución a preguntas del reto

1. ¿Qué habría que hacer para lanzar una campaña en USDC en vez de XLM?

Al momento de desplegar el contrato (por ejemplo, usando el SDK de Stellar) con el ID del contrato, al llamar la función `initialize`, usar la dirección del asset de USDC de Stellar, por ejemplo `USDC:GBBD47IF6LWK7P7MDEVSCWR7DPUWV3NY3DTQEVFL4NAT4AQH3ZLLFLA5`, en lugar de usar el nativo de Stellar

2. ¿Por qué un asistente con una wallet recién creada no podría contribuir a esa campaña? ¿Qué le falta a su cuenta?

Para la campaña creada en USDC, las personas necesitarían configurar la trustline de su cuenta para poder enviar o recibir un asset diferente a XLM, por lo que una persona con su cuenta recién creada no podría contribuir.

3. ¿Qué le agregarías al contrato o al frontend para que esa persona no se quede trabada?

Añadiría una función como `can_donate` en el contrato para validar que la persona que está realizando la transacción esté autorizada a tener USDC dada su trustline, y lo llamaría desde  el frontend. La función podría contener algo como `let usdc = StellarAssetClient::new(&env, &usdc_sac);` y `usdc.authorized(&donor)`, usando [Stellar Asset Contract](https://developers.stellar.org/docs/tokens/stellar-asset-contract) para USDC.
O usaría RPC de Soroban, según se indica en la [documentación](https://developers.stellar.org/docs/build/guides/basics/verify-trustlines), de la siguiente manera:
```
const USDC = new Asset(
  "USDC",
  "${wallet_address}",
);
```
y
`rpc.getAssetBalance(receiver, USDC));` para poder confirmar la trustline para ese asset en específico.
Finalmente le mostraría un mensaje al usuario indicando que debe configurar este asset en su wallet.
