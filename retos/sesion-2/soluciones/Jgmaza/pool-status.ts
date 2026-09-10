/**
 * Reto 3 — Consulta el estado del Pool Comunitario (Sesión 2)
 *
 * Lee name(), goal() y get_status() del contrato en testnet.
 * Solo lectura: no firma ni necesita fondos.
 */

import {
  Account,
  BASE_FEE,
  Contract,
  Keypair,
  Networks,
  TransactionBuilder,
  rpc,
  scValToNative,
} from "@stellar/stellar-sdk";

const RPC_URL = "https://soroban-testnet.stellar.org";
const NETWORK_PASSPHRASE = Networks.TESTNET;
const CONTRACT_ID =
  "CDF5IJWNCGNPBWTFCW3PWRXKPWZTPKQSHHRRYTSSCXKQ37U2CPDONSZ2";

const STROOPS_PER_XLM = 10_000_000n;
const SECONDS_PER_DAY = 86_400;

type StatusTag = "Active" | "Completed" | "Failed" | "Withdrawn";

type StatusInfo = {
  status: StatusTag | { tag: StatusTag } | number;
  total_raised: bigint | number | string;
  goal: bigint | number | string;
  deadline: bigint | number | string;
  now: bigint | number | string;
  contributors: number;
  percent_bps: number;
};

const STATUS_LABELS: Record<string, string> = {
  Active: "Activa",
  Completed: "Completada (meta alcanzada)",
  Failed: "Fallida (deadline sin meta)",
  Withdrawn: "Retirada (admin ya sacó fondos)",
  "0": "Activa",
  "1": "Completada (meta alcanzada)",
  "2": "Fallida (deadline sin meta)",
  "3": "Retirada (admin ya sacó fondos)",
};

function toBigInt(value: bigint | number | string): bigint {
  return typeof value === "bigint" ? value : BigInt(value);
}

function stroopsToXlm(stroops: bigint | number | string): string {
  const n = toBigInt(stroops);
  const whole = n / STROOPS_PER_XLM;
  const frac = n % STROOPS_PER_XLM;
  const fracStr = frac.toString().padStart(7, "0").replace(/0+$/, "");
  return fracStr.length > 0 ? `${whole}.${fracStr}` : `${whole}`;
}

function statusLabel(status: StatusInfo["status"]): string {
  if (typeof status === "object" && status !== null && "tag" in status) {
    return STATUS_LABELS[status.tag] ?? status.tag;
  }
  return STATUS_LABELS[String(status)] ?? String(status);
}

function daysLeft(deadline: bigint | number | string, now: bigint | number | string): string {
  const remaining = Number(toBigInt(deadline) - toBigInt(now));
  if (remaining <= 0) return "0 (deadline pasado)";
  const days = remaining / SECONDS_PER_DAY;
  if (days >= 1) return `${days.toFixed(1)} días`;
  const hours = remaining / 3600;
  return `${hours.toFixed(1)} horas`;
}

function percentFromBps(bps: number): string {
  return `${(bps / 100).toFixed(2)}%`;
}

/** Invoca un método de solo lectura vía simulación (sin firmar ni enviar). */
async function invokeReadOnly(method: string): Promise<unknown> {
  const server = new rpc.Server(RPC_URL, { allowHttp: false });
  // Cuenta fantasma solo para armar la tx de simulación; no se usa en la red.
  const account = new Account(Keypair.random().publicKey(), "0");
  const contract = new Contract(CONTRACT_ID);

  const tx = new TransactionBuilder(account, {
    fee: BASE_FEE,
    networkPassphrase: NETWORK_PASSPHRASE,
  })
    .addOperation(contract.call(method))
    .setTimeout(30)
    .build();

  const sim = await server.simulateTransaction(tx);

  if (rpc.Api.isSimulationError(sim)) {
    throw new Error(`Error al simular ${method}(): ${sim.error}`);
  }
  if (!rpc.Api.isSimulationSuccess(sim) || !sim.result?.retval) {
    throw new Error(`Simulación de ${method}() sin resultado`);
  }

  return scValToNative(sim.result.retval);
}

function printBanner(): void {
  console.log("");
  console.log("══════════════════════════════════════════════");
  console.log("  Pool Comunitario — estado on-chain (testnet)");
  console.log("══════════════════════════════════════════════");
  console.log(`  Contrato: ${CONTRACT_ID}`);
  console.log(`  RPC:      ${RPC_URL}`);
  console.log("══════════════════════════════════════════════");
  console.log("");
}

async function main(): Promise<void> {
  printBanner();

  console.log("Consultando name(), goal() y get_status()…\n");

  const [name, goal, statusRaw] = await Promise.all([
    invokeReadOnly("name"),
    invokeReadOnly("goal"),
    invokeReadOnly("get_status"),
  ]);

  const status = statusRaw as StatusInfo;
  const raised = status.total_raised;
  const goalFromStatus = status.goal;

  console.log(`Campaña:          ${String(name)}`);
  console.log(`Estado:           ${statusLabel(status.status)}`);
  console.log(
    `Recaudado:        ${stroopsToXlm(raised)} / ${stroopsToXlm(goalFromStatus)} XLM`,
  );
  console.log(`Meta (goal()):    ${stroopsToXlm(goal as bigint | number | string)} XLM`);
  console.log(`Avance:           ${percentFromBps(status.percent_bps)}`);
  console.log(`Contribuyentes:   ${status.contributors}`);
  console.log(`Días restantes:   ${daysLeft(status.deadline, status.now)}`);
  console.log("");
  console.log(
    `Explorador: https://stellar.expert/explorer/testnet/contract/${CONTRACT_ID}`,
  );
  console.log("");
}

main().catch((err) => {
  console.error("\nFalló la consulta:\n", err);
  process.exit(1);
});
