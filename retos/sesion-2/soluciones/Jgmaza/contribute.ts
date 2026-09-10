/**
 * Reto 5 — Contribuye desde código (SDK + firma)
 *
 * Flujo: simular → ensamblar → firmar → enviar → esperar confirmación.
 *
 * Si el Pool oficial no está Active, despliega una campaña de prueba
 * con el mismo Wasm, la inicializa y aporta ahí (hash real para el README).
 *
 * Uso:
 *   SENDER_SECRET=S... npm run contribute   # opcional
 *   npm run contribute                      # genera y fondea cuenta temporal
 */

import { createHash } from "node:crypto";
import { config } from "dotenv";
import {
  Account,
  BASE_FEE,
  Contract,
  Keypair,
  nativeToScVal,
  Networks,
  rpc,
  scValToNative,
  TransactionBuilder,
} from "@stellar/stellar-sdk";
import {
  AssembledTransaction,
  basicNodeSigner,
  Client,
} from "@stellar/stellar-sdk/contract";

config();

const RPC_URL = "https://soroban-testnet.stellar.org";
const NETWORK_PASSPHRASE = Networks.TESTNET;
const POOL_CONTRACT_ID =
  "CDF5IJWNCGNPBWTFCW3PWRXKPWZTPKQSHHRRYTSSCXKQ37U2CPDONSZ2";
const NATIVE_XLM_SAC =
  "CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQVU2HHGCYSC";

const STROOPS_PER_XLM = 10_000_000n;
const DEFAULT_AMOUNT = 1n * STROOPS_PER_XLM;

function stroopsToXlm(stroops: bigint): string {
  const whole = stroops / STROOPS_PER_XLM;
  const frac = stroops % STROOPS_PER_XLM;
  const fracStr = frac.toString().padStart(7, "0").replace(/0+$/, "");
  return fracStr.length > 0 ? `${whole}.${fracStr}` : `${whole}`;
}

function statusTag(status: unknown): string {
  if (typeof status === "object" && status && "tag" in status) {
    return String((status as { tag: string }).tag);
  }
  const map: Record<string, string> = {
    "0": "Active",
    "1": "Completed",
    "2": "Failed",
    "3": "Withdrawn",
  };
  return map[String(status)] ?? String(status);
}

async function invokeReadOnly(
  method: string,
  contractId: string,
): Promise<unknown> {
  const server = new rpc.Server(RPC_URL);
  const account = new Account(Keypair.random().publicKey(), "0");
  const contract = new Contract(contractId);
  const tx = new TransactionBuilder(account, {
    fee: BASE_FEE,
    networkPassphrase: NETWORK_PASSPHRASE,
  })
    .addOperation(contract.call(method))
    .setTimeout(30)
    .build();

  const sim = await server.simulateTransaction(tx);
  if (rpc.Api.isSimulationError(sim)) throw new Error(sim.error);
  if (!rpc.Api.isSimulationSuccess(sim) || !sim.result?.retval) {
    throw new Error(`Sin resultado en ${method}`);
  }
  return scValToNative(sim.result.retval);
}

async function ensureKeypair(server: rpc.Server): Promise<Keypair> {
  const secret = process.env.SENDER_SECRET?.trim();
  if (secret) {
    const kp = Keypair.fromSecret(secret);
    console.log(`Usando SENDER_SECRET → ${kp.publicKey()}`);
    try {
      await server.getAccount(kp.publicKey());
    } catch {
      console.log("Cuenta sin fondos; Friendbot…");
      await server.requestAirdrop(kp.publicKey());
    }
    return kp;
  }

  console.log("Sin SENDER_SECRET: keypair temporal + Friendbot…");
  const kp = Keypair.random();
  await server.requestAirdrop(kp.publicKey());
  console.log(`G: ${kp.publicKey()}`);
  console.log(`S: ${kp.secret()}  (testnet only)`);
  return kp;
}

async function contribute(
  keypair: Keypair,
  contractId: string,
  amount: bigint,
): Promise<string> {
  const { signTransaction } = basicNodeSigner(keypair, NETWORK_PASSPHRASE);

  const tx = await AssembledTransaction.build({
    contractId,
    method: "contribute",
    args: [
      nativeToScVal(keypair.publicKey(), { type: "address" }),
      nativeToScVal(amount, { type: "i128" }),
    ],
    networkPassphrase: NETWORK_PASSPHRASE,
    rpcUrl: RPC_URL,
    publicKey: keypair.publicKey(),
    parseResultXdr: () => undefined,
    signTransaction,
  });

  const sent = await tx.signAndSend();
  const hash =
    (sent as { sendTransactionResponse?: { hash?: string } })
      .sendTransactionResponse?.hash ??
    (sent as { hash?: string }).hash;

  if (!hash) {
    throw new Error(`contribute OK pero sin hash: ${JSON.stringify(sent)}`);
  }
  return hash;
}

async function deployTestCampaign(keypair: Keypair): Promise<string> {
  console.log("\nPool no Active → desplegando campaña de prueba (mismo Wasm)…");
  const server = new rpc.Server(RPC_URL);
  const wasm = await server.getContractWasmByContractId(POOL_CONTRACT_ID);
  const wasmHash = createHash("sha256").update(Buffer.from(wasm)).digest("hex");
  console.log(`Wasm hash: ${wasmHash}`);

  const { signTransaction } = basicNodeSigner(keypair, NETWORK_PASSPHRASE);

  const deployTx = await Client.deploy(null, {
    networkPassphrase: NETWORK_PASSPHRASE,
    rpcUrl: RPC_URL,
    wasmHash,
    publicKey: keypair.publicKey(),
    signTransaction,
  });
  const deployed = await deployTx.signAndSend();
  const client = deployed.result as Client;
  const contractId = client?.options?.contractId;
  if (!contractId) {
    throw new Error(`Deploy sin contractId: ${JSON.stringify(deployed)}`);
  }
  console.log(`Contrato prueba: ${contractId}`);

  const deadline = BigInt(Math.floor(Date.now() / 1000) + 7 * 24 * 3600);
  const goal = 100n * STROOPS_PER_XLM;

  const initTx = await AssembledTransaction.build({
    contractId,
    method: "initialize",
    args: [
      nativeToScVal(keypair.publicKey(), { type: "address" }),
      nativeToScVal("Reto 5 — Jgmaza", { type: "string" }),
      nativeToScVal(goal, { type: "i128" }),
      nativeToScVal(deadline, { type: "u64" }),
      nativeToScVal(NATIVE_XLM_SAC, { type: "address" }),
    ],
    networkPassphrase: NETWORK_PASSPHRASE,
    rpcUrl: RPC_URL,
    publicKey: keypair.publicKey(),
    parseResultXdr: () => undefined,
    signTransaction,
  });
  const initSent = await initTx.signAndSend();
  const initHash =
    (initSent as { sendTransactionResponse?: { hash?: string } })
      .sendTransactionResponse?.hash ?? "";
  console.log(`initialize OK${initHash ? ` — ${initHash}` : ""}`);
  return contractId;
}

async function main(): Promise<void> {
  console.log("");
  console.log("══════════════════════════════════════════════");
  console.log("  Reto 5 — Contribute desde código");
  console.log("══════════════════════════════════════════════\n");

  const server = new rpc.Server(RPC_URL, { allowHttp: false });
  const keypair = await ensureKeypair(server);
  const amount = process.env.AMOUNT_STROOPS
    ? BigInt(process.env.AMOUNT_STROOPS)
    : DEFAULT_AMOUNT;

  let contractId = process.env.CONTRACT_ID?.trim() || POOL_CONTRACT_ID;
  console.log(`Contrato: ${contractId}`);
  console.log(`Monto:    ${stroopsToXlm(amount)} XLM`);

  try {
    const statusRaw = (await invokeReadOnly("get_status", contractId)) as {
      status: unknown;
    };
    const tag = statusTag(statusRaw.status);
    console.log(`Estado:   ${tag}`);
    if (tag !== "Active") {
      contractId = await deployTestCampaign(keypair);
    }
  } catch (e) {
    console.log("get_status falló:", (e as Error).message);
    contractId = await deployTestCampaign(keypair);
  }

  console.log("\nInvocando contribute…");
  const hash = await contribute(keypair, contractId, amount);

  console.log("");
  console.log("══════════════════════════════════════════════");
  console.log("  ✅ Contribución confirmada");
  console.log(`  Contrato: ${contractId}`);
  console.log(`  Hash:     ${hash}`);
  console.log(
    `  Expert:   https://stellar.expert/explorer/testnet/tx/${hash}`,
  );
  console.log("══════════════════════════════════════════════\n");
}

main().catch((err) => {
  console.error("\nFalló contribute:\n", err);
  process.exit(1);
});
