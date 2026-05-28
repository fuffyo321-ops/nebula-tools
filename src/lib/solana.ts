export const USDC_MINT = "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v";
export const USDC_DECIMALS = 6;

export const PLAN_USDC: Record<"PRO" | "ELITE", number> = {
  PRO: 19,
  ELITE: 49,
};

export function usdcToRaw(dollars: number): number {
  return dollars * 10 ** USDC_DECIMALS;
}

export async function verifySolanaPayment({
  signature,
  expectedAmountUsd,
  treasuryAddress,
}: {
  signature: string;
  expectedAmountUsd: number;
  treasuryAddress: string;
}): Promise<boolean> {
  const rpcUrl = process.env.SOLANA_RPC_URL ?? "https://api.mainnet-beta.solana.com";

  const res = await fetch(rpcUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      jsonrpc: "2.0",
      id: 1,
      method: "getTransaction",
      params: [
        signature,
        {
          encoding: "jsonParsed",
          commitment: "confirmed",
          maxSupportedTransactionVersion: 0,
        },
      ],
    }),
  });

  const json = await res.json();
  const tx = json.result;

  if (!tx || tx.meta?.err !== null) return false;

  // Reject transactions older than 15 minutes (prevents replays of old txns)
  const blockTime: number = tx.blockTime ?? 0;
  if (Date.now() / 1000 - blockTime > 900) return false;

  const expectedRaw = usdcToRaw(expectedAmountUsd);
  const preBalances: any[] = tx.meta?.preTokenBalances ?? [];
  const postBalances: any[] = tx.meta?.postTokenBalances ?? [];

  for (const post of postBalances) {
    if (post.mint !== USDC_MINT) continue;
    if (post.owner !== treasuryAddress) continue;

    const pre = preBalances.find((p: any) => p.accountIndex === post.accountIndex);
    const postAmount = Number(post.uiTokenAmount.amount);
    const preAmount = pre ? Number(pre.uiTokenAmount.amount) : 0;

    if (postAmount - preAmount >= expectedRaw) return true;
  }

  return false;
}
