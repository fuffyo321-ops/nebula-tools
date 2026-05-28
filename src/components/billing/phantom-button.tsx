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
  publicKey: { toString: () => string } | null;
  connect: () => Promise<{ publicKey: { toString: () => string } }>;
  signAndSendTransaction: (tx: unknown, opts?: unknown) => Promise<{ signature: string }>;
  isConnected: boolean;
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
      toast.info("Install Phantom wallet, then come back and try again.");
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
      if (!treasuryAddress) throw new Error("Treasury wallet not configured. Contact support.");

      const rpcUrl = process.env.NEXT_PUBLIC_SOLANA_RPC_URL ?? "https://api.mainnet-beta.solana.com";
      const connection = new Connection(rpcUrl, "confirmed");

      // Connect wallet
      toast.loading("Connecting Phantom wallet...", { id: "sol-tx" });
      const { publicKey: walletPubkeyObj } = await provider.connect();
      const senderKey = new PublicKey(walletPubkeyObj.toString());
      const treasuryKey = new PublicKey(treasuryAddress);
      const usdcMint = new PublicKey(USDC_MINT);

      const rawAmount = BigInt(PLAN_USDC[plan] * 10 ** USDC_DECIMALS);

      const senderATA = await getAssociatedTokenAddress(usdcMint, senderKey);
      const receiverATA = await getAssociatedTokenAddress(usdcMint, treasuryKey);

      // Get latest blockhash (needed for both tx and reliable confirmation)
      toast.loading("Building transaction...", { id: "sol-tx" });
      const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash("confirmed");

      const tx = new Transaction({
        recentBlockhash: blockhash,
        feePayer: senderKey,
      });

      // Create receiver ATA if it doesn't exist
      const receiverATAInfo = await connection.getAccountInfo(receiverATA).catch(() => null);
      if (!receiverATAInfo) {
        tx.add(
          createAssociatedTokenAccountInstruction(senderKey, receiverATA, treasuryKey, usdcMint)
        );
      }

      tx.add(createTransferInstruction(senderATA, receiverATA, senderKey, rawAmount));

      // Sign & send via Phantom
      toast.loading("Approve the transaction in Phantom...", { id: "sol-tx" });
      const { signature } = await provider.signAndSendTransaction(tx);

      // Confirm using blockhash strategy (reliable)
      toast.loading("Confirming on Solana blockchain...", { id: "sol-tx" });
      await connection.confirmTransaction(
        { signature, blockhash, lastValidBlockHeight },
        "confirmed"
      );
      toast.dismiss("sol-tx");

      // Verify server-side and activate plan
      toast.loading("Activating your plan...", { id: "sol-verify" });
      const res = await fetch("/api/solana/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ signature, plan }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Verification failed");

      toast.dismiss("sol-verify");
      toast.success(`🎉 ${plan} plan activated! Enjoy NebulaTools.`);
      onSuccess?.();
      setTimeout(() => window.location.reload(), 1500);
    } catch (err: unknown) {
      toast.dismiss("sol-tx");
      toast.dismiss("sol-verify");
      const msg = err instanceof Error ? err.message : "Payment failed";
      // User rejected
      if (msg.includes("User rejected") || msg.includes("Transaction rejected")) {
        toast.error("Transaction cancelled.");
      } else if (msg.includes("insufficient")) {
        toast.error(`You need ${PLAN_USDC[plan]} USDC in your Phantom wallet.`);
      } else {
        toast.error(msg);
      }
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
      {hasPhantom ? `PAY ${PLAN_USDC[plan]} USDC` : "GET PHANTOM"}
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
