import { Contract, Keypair, TransactionBuilder, scValToNative } from "@stellar/stellar-sdk";
import { server, networkPassphrase, fee, optionalEnv, requireEnv } from "./lib/config.ts";

// Reto 3 — Consulta el estado del Pool (sesion-2)
// Contrato de crowdfunding en testnet: llama funciones de solo lectura
// (get_status, name) simulando la transacción, sin firmar ni enviarla.
const POOL_CONTRACT_ID =
  "CDF5IJWNCGNPBWTFCW3PWRXKPWZTPKQSHHRRYTSSCXKQ37U2CPDONSZ2";

// Enum Status del contrato (contract.rs): Active=0, Completed=1, Failed=2, Withdrawn=3
const STATUS_LABELS = ["Active", "Completed", "Failed", "Withdrawn"];

async function callReadOnly(contract: Contract, method: string, source: string) {
  // Solo se necesita una cuenta existente en testnet como "fuente" de la tx
  // de simulación (para el sequence number) — no se firma ni se envía.
  const account = await server.getAccount(source);

  const tx = new TransactionBuilder(account, {
    fee,
    networkPassphrase,
  })
    .addOperation(contract.call(method))
    .setTimeout(30)
    .build();

  const sim = await server.simulateTransaction(tx);

  if ("error" in sim) {
    throw new Error(`Simulación falló en ${method}(): ${sim.error}`);
  }
  if (!sim.result) {
    throw new Error(`Sin resultado al simular ${method}()`);
  }

  return scValToNative(sim.result.retval);
}

function daysRemaining(deadline: bigint, now: bigint): number {
  const seconds = Number(deadline - now);
  return Math.max(0, Math.ceil(seconds / 86400));
}

async function main() {
  const contract = new Contract(POOL_CONTRACT_ID);

  const envQuery = optionalEnv("QUERY_PUBLIC_KEY");
  const source = envQuery ?? Keypair.fromSecret(requireEnv("SENDER_SECRET")).publicKey();

  const [name, status] = await Promise.all([
    callReadOnly(contract, "name", source),
    callReadOnly(contract, "get_status", source),
  ]);

  const totalRaised = Number(status.total_raised) / 1e7; // stroops -> unidad
  const goal = Number(status.goal) / 1e7;
  const percent = (Number(status.percent_bps) / 100).toFixed(2);
  const label = STATUS_LABELS[status.status] ?? `Desconocido (${status.status})`;

  console.log(`Campaña: ${name}`);
  console.log(`Estado: ${label}`);
  console.log(`Recaudado: ${totalRaised} / ${goal} (${percent}%)`);
  console.log(`Contribuyentes: ${status.contributors}`);
  console.log(
    `Días restantes: ${daysRemaining(BigInt(status.deadline), BigInt(status.now))}`
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
