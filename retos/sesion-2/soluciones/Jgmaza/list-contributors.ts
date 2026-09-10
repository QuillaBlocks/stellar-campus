/**
 * Reto 4 — Lista los contribuyentes del Pool (eventos `contribute`)
 *
 * Lee eventos del contrato vía RPC, pagina, y ordena por fecha.
 * Ojo: el RPC público de testnet solo retiene una ventana reciente;
 * un startLedger demasiado viejo devuelve vacío sin error.
 */

import { Address, rpc, scValToNative, xdr } from "@stellar/stellar-sdk";

const RPC_URL = "https://soroban-testnet.stellar.org";
const CONTRACT_ID =
  "CDF5IJWNCGNPBWTFCW3PWRXKPWZTPKQSHHRRYTSSCXKQ37U2CPDONSZ2";

/**
 * La dApp usa ~4.000 ledgers (~5,5 h). El RPC público retiene ~7 días
 * (~120k ledgers). Usamos la ventana completa vía oldestLedger para no
 * perder aportes de la sesión; si pides más atrás, vuelve vacío sin error.
 */
const PAGE_SIZE = 100;
const MAX_PAGES = 20;

const STROOPS_PER_XLM = 10_000_000n;

type Contribution = {
  address: string;
  amount: bigint;
  totalRaised: bigint | null;
  timestamp: number;
  ledger: number;
  txHash: string;
};

function stroopsToXlm(stroops: bigint): string {
  const whole = stroops / STROOPS_PER_XLM;
  const frac = stroops % STROOPS_PER_XLM;
  const fracStr = frac.toString().padStart(7, "0").replace(/0+$/, "");
  return fracStr.length > 0 ? `${whole}.${fracStr}` : `${whole}`;
}

function toBigInt(value: unknown): bigint | null {
  if (typeof value === "bigint") return value;
  if (typeof value === "string" || typeof value === "number") return BigInt(value);
  return null;
}

function parseAmount(payload: unknown): { amount: bigint; totalRaised: bigint | null } {
  if (payload && typeof payload === "object" && !Array.isArray(payload)) {
    const record = payload as Record<string, unknown>;
    const amount = toBigInt(record.amount) ?? 0n;
    const totalRaised = toBigInt(record.total_raised);
    return { amount, totalRaised };
  }
  if (Array.isArray(payload) && payload.length > 0) {
    return { amount: toBigInt(payload[0]) ?? 0n, totalRaised: toBigInt(payload[1]) };
  }
  return { amount: 0n, totalRaised: null };
}

function contributeTopicFilter(): string[] {
  // topics: ["contribute", from] — from es wildcard
  const symbol = xdr.ScVal.scvSymbol("contribute");
  return [symbol.toXDR("base64"), "*"];
}

async function fetchContributeEvents(
  server: rpc.Server,
  contractId: string,
): Promise<{ events: Contribution[]; startLedger: number; latestLedger: number }> {
  const latest = await server.getLatestLedger();
  const filters: rpc.Api.EventFilter[] = [
    {
      type: "contract",
      contractIds: [contractId],
      topics: [contributeTopicFilter()],
    },
  ];

  // Primera página: ancla en un ledger reciente para leer oldestLedger real.
  const probe = await server.getEvents({
    startLedger: Math.max(latest.sequence - 100, 1),
    filters,
    limit: 1,
  });
  const startLedger = Math.max(probe.oldestLedger ?? latest.sequence - 4_000, 1);

  const all: Contribution[] = [];
  let cursor: string | undefined;

  for (let page = 0; page < MAX_PAGES; page += 1) {
    const req = cursor
      ? { cursor, filters, limit: PAGE_SIZE }
      : { startLedger, filters, limit: PAGE_SIZE };

    const res = await server.getEvents(req);

    for (const ev of res.events) {
      const topics = (ev.topic ?? []) as xdr.ScVal[];
      if (topics.length < 2) continue;

      let address: string;
      try {
        address = Address.fromScVal(topics[1]).toString();
      } catch {
        continue;
      }

      const { amount, totalRaised } = parseAmount(scValToNative(ev.value as xdr.ScVal));
      const timestamp = ev.ledgerClosedAt
        ? Math.floor(Date.parse(ev.ledgerClosedAt) / 1000)
        : 0;

      all.push({
        address,
        amount,
        totalRaised,
        timestamp,
        ledger: ev.ledger,
        txHash: ev.txHash ?? "",
      });
    }

    if (!res.cursor || res.events.length === 0) break;
    cursor = res.cursor;
  }

  // Más antiguos primero (el reto pide ordenado por fecha)
  all.sort((a, b) => a.timestamp - b.timestamp || a.ledger - b.ledger);
  return { events: all, startLedger, latestLedger: latest.sequence };
}

function formatWhen(ts: number): string {
  if (!ts) return "(sin fecha)";
  return new Date(ts * 1000).toISOString().replace("T", " ").replace(/\.\d+Z$/, " UTC");
}

async function main(): Promise<void> {
  console.log("");
  console.log("══════════════════════════════════════════════");
  console.log("  Reto 4 — Contribuyentes del Pool (eventos)");
  console.log("══════════════════════════════════════════════");
  console.log(`  Contrato: ${CONTRACT_ID}`);
  console.log("══════════════════════════════════════════════");
  console.log("");

  const server = new rpc.Server(RPC_URL, { allowHttp: false });
  const { events, startLedger, latestLedger } = await fetchContributeEvents(
    server,
    CONTRACT_ID,
  );

  console.log(`Ventana: ledgers ${startLedger} → ${latestLedger}`);
  console.log(`Eventos contribute encontrados: ${events.length}\n`);

  if (events.length === 0) {
    console.log("No hay eventos en la ventana del RPC (vacío sin error).");
    console.log("Puede que los aportes sean más viejos que la retención,");
    console.log("o que nadie haya contribuido recientemente.");
    console.log("");
    return;
  }

  console.log(
    "Fecha (UTC)".padEnd(22),
    "XLM".padStart(12),
    "  ",
    "Quién",
  );
  console.log("-".repeat(78));

  for (const ev of events) {
    console.log(
      formatWhen(ev.timestamp).padEnd(22),
      stroopsToXlm(ev.amount).padStart(12),
      "  ",
      ev.address,
    );
    if (ev.txHash) {
      console.log(
        "".padEnd(22),
        "".padStart(12),
        "  ",
        `tx: https://stellar.expert/explorer/testnet/tx/${ev.txHash}`,
      );
    }
  }

  console.log("");
}

main().catch((err) => {
  console.error("\nFalló la consulta de eventos:\n", err);
  process.exit(1);
});
