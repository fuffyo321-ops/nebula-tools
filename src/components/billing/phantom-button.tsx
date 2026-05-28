"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

const USDC_MINT = "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v";
const PLAN_USDC: Record<"PRO" | "ELITE", number> = { PRO: 19, ELITE: 49 };
const USDC_DECIMALS = 6;

interface PhantomProvider {
  isPhantom: boolean;
  publicKey: { toBuffer: () => Buffer; toString: () => string } | null;
  connect: () => Promise<{ publicKey: { toBuffer: () => Buffer; toString: () => string } }>;
  signAndSendTransaction: (tx: unknown) => Promise<{ signature: string }>;
}

declare global {
  interface Window {
    solana?: PhantomProvider;
  }
}

interface Props {
  plan: "PRO" | "ELITE";
  className?: string;
  size?: "sm" | "default";
  variant?: "outline" | "default";
  onSuccess?: () => void;
}

export function PhantomButton({ plan, className, size = "sm", variant = "outline", onSuccess }: Props) {
  const [loading, setLoading] = useState(false);

  async function handlePay() {
    const provider = typeof window !== "undefined" ? window.solana : undefined;

    if (!provider?.isPhantom) {
      window.open("https://phantom.app", "_blank");
      return;
    }

    setLoading(true);
    try {
      const [{ Connection, PublicKey, Transaction }, { getAssociatedTokenAddress, createTransferInstruction, createAssociatedTokenAccountInstruction }] =
        await Promise.all([
          import("@solana/web3.js"),
          import("@solana/spl-token"),
        ]);

      const treasuryAddress = process.env.NEXT_PUBLIC_SOLANA_TREASURY_ADDRESS;
      if (!treasuryAddress) throw new Error("Treasury wallet not configured");

      const rpcUrl = process.env.NEXT_PUBLIC_SOLANA_RPC_URL ?? "https://api.mainnet-beta.solana.com";
      const connection = new Connection(rpcUrl, "confirmed");

      const { publicKey: walletPubkey } = await provider.connect();
      const senderKey = new PublicKey(walletPubkey.toString());
      const treasuryKey = new PublicKey(treasuryAddress);
      const usdcMint = new PublicKey(USDC_MINT);

      const rawAmount = PLAN_USDC[plan] * 10 ** USDC_DECIMALS;

      const senderATA = await getAssociatedTokenAddress(usdcMint, senderKey);
      const receiverATA = await getAssociatedTokenAddress(usdcMint, treasuryKey);

      // Verify sender has enough USDC
      const senderBalance = await connection.getTokenAccountBalance(senderATA).catch(() => null);
      if (!senderBalance || parseInt(senderBalance.value.amount) < rawAmount) {
        throw new Error(`Insufficient USDC. You need ${PLAN_USDC[plan]} USDC in your Phantom wallet.`);
      }

      const { blockhash } = await connection.getLatestBlockhash("confirmed");
      const tx = new Transaction({ recentBlockhash: blockhash, feePayer: senderKey });

      // Create receiver ATA if it doesn't exist yet
      const receiverATAInfo = await connection.getAccountInfo(receiverATA);
      if (!receiverATAInfo) {
        tx.add(
          createAssociatedTokenAccountInstruction(senderKey, receiverATA, treasuryKey, usdcMint)
        );
      }

      tx.add(createTransferInstruction(senderATA, receiverATA, senderKey, rawAmount));

      const { signature } = await provider.signAndSendTransaction(tx);

      toast.loading("Confirming on Solana...", { id: "sol-tx" });
      await connection.confirmTransaction(signature, "confirmed");
      toast.dismiss("sol-tx");

      const res = await fetch("/api/solana/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ signature, plan }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      toast.success(`${plan} plan activated for 30 days! 🎉`);
      onSuccess?.();
      setTimeout(() => window.location.reload(), 1500);
    } catch (err: unknown) {
      toast.dismiss("sol-tx");
      const msg = err instanceof Error ? err.message : "Payment failed";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }

  const hasPhantom = typeof window !== "undefined" && !!window.solana?.isPhantom;

  return (
    <Button
      size={size}
      variant={variant}
      className={className}
      onClick={handlePay}
      disabled={loading}
    >
      {loading ? (
        <Loader2 className="w-3.5 h-3.5 animate-spin" />
      ) : (
        <PhantomIcon />
      )}
      {hasPhantom ? `PAY WITH PHANTOM` : "GET PHANTOM"}
    </Button>
  );
}

function PhantomIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 128 128" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="128" height="128" rx="24" fill="#AB9FF2" />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M110 64C110 89.4 89.4 110 64 110S18 89.4 18 64 38.6 18 64 18s46 20.6 46 46zm-29-18.5c0 2.5-2 4.5-4.5 4.5S72 48 72 45.5 74 41 76.5 41 81 43 81 45.5zM52 45.5C52 48 50 50 47.5 50S43 48 43 45.5 45 41 47.5 41 52 43 52 45.5zM64 90c14.9 0 27-12.1 27-27 0-1.7-.2-3.4-.5-5H37.5c-.3 1.6-.5 3.3-.5 5 0 14.9 12.1 27 27 27z"
        fill="white"
      />
    </svg>
  );
}
