"use client";
import { useState, useEffect } from "react";

const MANTLE_ASSETS = [
  { id: "spcxx", symbol: "SPCXx", name: "Tokenized SpaceX", type: "Tokenized Equity", issuer: "xStocks", tvl: "$24M", status: "live", distributionScore: 42, tags: ["RWA", "Equity", "IPO"] },
  { id: "tslax", symbol: "TSLAx", name: "Tokenized Tesla", type: "Tokenized Equity", issuer: "xStocks", tvl: "$18.3M", status: "live", distributionScore: 71, tags: ["RWA", "Equity"] },
  { id: "nvdax", symbol: "NVDAx", name: "Tokenized NVIDIA", type: "Tokenized Equity", issuer: "xStocks", tvl: "$22.1M", status: "live", distributionScore: 74, tags: ["RWA", "Equity"] },
  { id: "syrupusdt", symbol: "syrupUSDT", name: "Maple Institutional Yield", type: "Yield-Bearing Stablecoin", issuer: "Maple Finance", tvl: "$90.1M", status: "live", distributionScore: 89, tags: ["RWA", "Yield", "Institutional"] },
  { id: "meth", symbol: "mETH", name: "Mantle Staked ETH", type: "Liquid Staking Token", issuer: "Mantle LSP", tvl: "$1.2B", status: "live", distributionScore: 94, tags: ["LST", "Yield"] },
];

const AGENT_CARD = {
  type: "https://eips.ethereum.org/EIPS/eip-8004#registration-v1",
  name: "Mantle RWA Scout",
  description: "An AI research agent that surfaces structured intelligence on Mantle ecosystem RWA assets.",
  services: [
    { name: "web", endpoint: "https://mantle-rwa-scout.vercel.app/" },
    { name: "MCP", endpoint: "https://mcp.mantle-rwa-scout.xyz/", version: "2025-06-18" },
  ],
  x402Support: true,
  active: true,
  skills: ["rwa-research", "distribution-scoring", "narrative-tracking"],
  domains: ["defi", "rwa", "tokenized-equities"],
};

function ScoreBar({ score, color }: { score: number; color: string }) {
  return (
    <div style={{ background: "#1a1a1a", borderRadius: 4, height: 6, width: "100%", overflow: "hidden" }}>
      <div style={{ height: "100%", width: `${score}%`, background: color, borderRadius: 4 }} />
    </div>
  );
}

function ScoreLabel({ score }: { score: number }) {
  if (score >= 80) return <span style={{ color: "#C8F135", fontSize: 11, fontWeight: 700 }}>HIGH</span>;
  if (score >= 55) return <span style={{ color: "#f5c518", fontSize: 11, fontWeight: 700 }}>MEDIUM</span>;
  return <span style={{ color: "#ff5c5c", fontSize: 11, fontWeight: 700 }}>LOW</span>;
}

function Tag({ label }: { label: string }) {
  return (
    <span style={{ background: "#1e1e1e", border: "1px solid #2a2a2a", color: "#888", fontSize: 10, padding: "2px 7px", borderRadius: 3, fontFamily: "monospace" }}>
      {label}
    </span>
  );
}

function ResearchBrief({ asset, brief, loading }: { asset: any; brief: string | null; loading: boolean }) {
  return (
    <div style={{ background: "#0f0f0f", border: "1px solid #1e1e1e", borderRadius: 8, padding: 24, marginTop: 16, minHeight: 180 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
        <div style={{ width: 7, height: 7, borderRadius: "50%", background: loading ? "#f5c518" : "#C8F135" }} />
        <span style={{ color: "#555", fontSize: 11, fontFamily: "monospace" }}>
          {loading ? "AGENT RUNNING..." : `RESEARCH BRIEF — ${asset?.symbol}`}
        </span>
      </div>
      {loading ? (
        <div style={{ color: "#444", fontSize: 13 }}>Loading...</div>
      ) : brief ? (
        <div style={{ color: "#c0c0c0", fontSize: 13.5, lineHeight: 1.75, fontFamily: "Georgia, serif" }}>{brief}</div>
      ) : (
        <div style={{ color: "#333", fontSize: 13, fontStyle: "italic" }}>Select an asset above to run a research brief.</div>
      )}
    </div>
  );
}

function AgentCardPanel() {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ marginTop: 24 }}>
      <button onClick={() => setOpen(!open)} style={{ background: "transparent", border: "1px solid #2a2a2a", color: "#555", fontSize: 11, fontFamily: "monospace", padding: "7px 14px", borderRadius: 4, cursor: "pointer" }}>
        {open ? "HIDE" : "VIEW"} ERC-8004 AGENT CARD
      </button>
      {open && (
        <div style={{ marginTop: 10, background: "#0a0a0a", border: "1px solid #1e1e1e", borderRadius: 6, padding: 20, fontFamily: "monospace", fontSize: 11.5, color: "#5a9e6f", whiteSpace: "pre-wrap" }}>
          {JSON.stringify(AGENT_CARD, null, 2)}
        </div>
      )}
    </div>
  );
}

export default function MantleRWAScout() {
  const [selected, setSelected] = useState<any>(null);
  const [brief, setBrief] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const runAgent = async (asset: any) => {
    setSelected(asset);
    setBrief(null);
    setLoading(true);

    const prompt = `Analyze this Mantle ecosystem asset and produce a concise research brief: ${asset.name} (${asset.symbol}), Type: ${asset.type}, Issuer: ${asset.issuer}, TVL: ${asset.tvl}, Distribution Score: ${asset.distributionScore}/100. Reference the SpaceX IPO episode from June 2026 where over $1 billion in crypto orders for tokenized SpaceX shares were refunded because xStocks could not source allocation from Goldman Sachs and Morgan Stanley. Keep it under 200 words, no em dashes.`;

    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-6",
          max_tokens: 1000,
          messages: [{ role: "user", content: prompt }],
        }),
      });
      const data = await response.json();
      const text = data.content?.map((b: any) => b.text || "").join("") || "Unable to generate brief.";
      setBrief(text);
    } catch {
      setBrief("Agent encountered an error. Check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };
