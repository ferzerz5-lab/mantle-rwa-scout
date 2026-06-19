"use client";
import { useState, useEffect } from "react";

const MANTLE_ASSETS = [
  {
    id: "spcxx",
    symbol: "SPCXx",
    name: "Tokenized SpaceX",
    type: "Tokenized Equity",
    issuer: "xStocks",
    tvl: "$24M",
    status: "live",
    distributionScore: 42,
    tags: ["RWA", "Equity", "IPO"],
  },
  {
    id: "tslax",
    symbol: "TSLAx",
    name: "Tokenized Tesla",
    type: "Tokenized Equity",
    issuer: "xStocks",
    tvl: "$18.3M",
    status: "live",
    distributionScore: 71,
    tags: ["RWA", "Equity"],
  },
  {
    id: "nvdax",
    symbol: "NVDAx",
    name: "Tokenized NVIDIA",
    type: "Tokenized Equity",
    issuer: "xStocks",
    tvl: "$22.1M",
    status: "live",
    distributionScore: 74,
    tags: ["RWA", "Equity"],
  },
  {
    id: "syrupusdt",
    symbol: "syrupUSDT",
    name: "Maple Institutional Yield",
    type: "Yield-Bearing Stablecoin",
    issuer: "Maple Finance",
    tvl: "$90.1M",
    status: "live",
    distributionScore: 89,
    tags: ["RWA", "Yield", "Institutional"],
  },
  {
    id: "meth",
    symbol: "mETH",
    name: "Mantle Staked ETH",
    type: "Liquid Staking Token",
    issuer: "Mantle LSP",
    tvl: "$1.2B",
    status: "live",
    distributionScore: 94,
    tags: ["LST", "Yield"],
  },
];

const AGENT_CARD = {
  type: "https://eips.ethereum.org/EIPS/eip-8004#registration-v1",
  name: "Mantle RWA Scout",
  description:
    "An AI research agent that surfaces structured intelligence on Mantle ecosystem RWA assets. Analyzes distribution readiness, TVL context, narrative events, and allocation risk using the SpaceX distribution gap framework.",
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
      <div
        style={{
          height: "100%",
          width: `${score}%`,
          background: color,
          borderRadius: 4,
          transition: "width 1s cubic-bezier(0.4,0,0.2,1)",
        }}
      />
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
    <span
      style={{
        background: "#1e1e1e",
        border: "1px solid #2a2a2a",
        color: "#888",
        fontSize: 10,
        padding: "2px 7px",
        borderRadius: 3,
        letterSpacing: "0.05em",
        fontFamily: "monospace",
      }}
    >
      {label}
    </span>
  );
}

function ResearchBrief({ asset, brief, loading }: { asset: any; brief: string | null; loading: boolean }) {
  return (
    <div
      style={{
        background: "#0f0f0f",
        border: "1px solid #1e1e1e",
        borderRadius: 8,
        padding: 24,
        marginTop: 16,
        minHeight: 180,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
        <div
          style={{
            width: 7,
            height: 7,
            borderRadius: "50%",
            background: loading ? "#f5c518" : "#C8F135",
            boxShadow: loading ? "0 0 8px #f5c518" : "0 0 8px #C8F135",
            animation: loading ? "pulse 1s infinite" : "none",
          }}
        />
        <span style={{ color: "#555", fontSize: 11, fontFamily: "monospace", letterSpacing: "0.08em" }}>
          {loading ? "AGENT RUNNING..." : `RESEARCH BRIEF — ${asset?.symbol}`}
        </span>
      </div>
      {loading ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {[90, 70, 85, 55].map((w, i) => (
            <div
              key={i}
              style={{
                height: 10,
                width: `${w}%`,
                background: "#1a1a1a",
                borderRadius: 3,
                animation: "shimmer 1.5s infinite",
              }}
            />
          ))}
        </div>
      ) : brief ? (
        <div style={{ color: "#c0c0c0", fontSize: 13.5, lineHeight: 1.75, fontFamily: "Georgia, serif" }}>
          {brief}
        </div>
      ) : (
        <div style={{ color: "#333", fontSize: 13, fontStyle: "italic" }}>
          Select an asset above to run a research brief.
        </div>
      )}
    </div>
  );
}

function AgentCardPanel() {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ marginTop: 24 }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          background: "transparent",
          border: "1px solid #2a2a2a",
          color: "#555",
          fontSize: 11,
          fontFamily: "monospace",
          letterSpacing: "0.08em",
          padding: "7px 14px",
          borderRadius: 4,
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          gap: 8,
        }}
      >
        <span style={{ color: "#C8F135" }}>▸</span>
        {open ? "HIDE" : "VIEW"} ERC-8004 AGENT CARD
      </button>
      {open && (
        <div
          style={{
            marginTop: 10,
            background: "#0a0a0a",
            border: "1px solid #1e1e1e",
            borderRadius: 6,
            padding: 20,
            fontFamily: "monospace",
            fontSize: 11.5,
            color: "#5a9e6f",
            lineHeight: 1.7,
            whiteSpace: "pre-wrap",
            overflowX: "auto",
          }}
        >
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

  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = `
      @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.3} }
      @keyframes shimmer { 0%{opacity:0.4} 50%{opacity:0.8} 100%{opacity:0.4} }
      @keyframes fadeIn { from{opacity:0;transform:translateY(6px)} to{opacity:1;transform:translateY(0)} }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  const runAgent = async (asset: any) => {
    setSelected(asset);
    setBrief(null);
    setLoading(true);

    const prompt = `You are Mantle RWA Scout, an onchain research agent built on Mantle Network.

Analyze this Mantle ecosystem asset and produce a concise research brief (3-4 tight paragraphs, no bullet points, no headers, no em dashes, no hype language):

Asset: ${asset.name} (${asset.symbol})
Type: ${asset.type}
Issuer: ${asset.issuer}
TVL: ${asset.tvl}
Distribution Readiness Score: ${asset.distributionScore}/100

Your brief must cover:
1. What this asset is and what it represents on Mantle
2. The current distribution dynamics — is it reaching its target audience, or is there a gap between what's live onchain and what's gatekept off it?
3. The forward thesis — what needs to happen for this asset to scale meaningfully on Mantle's distribution layer

Reference the SpaceX IPO episode where relevant: in June 2026, over $1 billion in crypto orders for tokenized SpaceX shares were refunded because xStocks couldn't source the underlying allocation from Goldman Sachs and Morgan Stanley. This exposed the core distribution problem in tokenized equities. Use this as a lens where appropriate.

Write like someone who actually understands onchain finance, not like a press release. Keep it under 200 words. No em dashes.`;

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

  return (
    <div style={{ minHeight: "100vh", background: "#080808", color: "#e0e0e0", fontFamily: "'Inter', 'Helvetica Neue', sans-serif", padding: "0 0 60px" }}>
      <div style={{ borderBottom: "1px solid #161616", padding: "20px 32px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 28, height: 28, background: "#C8F135", borderRadius: 5, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ color: "#080808", fontWeight: 900, fontSize: 13 }}>M</span>
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 14, letterSpacing: "-0.01em", color: "#f0f0f0" }}>Mantle RWA Scout</div>
            <div style={{ fontSize: 10, color: "#444", fontFamily: "monospace", letterSpacing: "0.06em" }}>ERC-8004 REGISTERED AGENT</div>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#C8F135", boxShadow: "0 0 6px #C8F135" }} />
          <span style={{ fontSize: 10, color: "#555", fontFamily: "monospace", letterSpacing: "0.06em" }}>LIVE ON MANTLE</span>
        </div>
      </div>

      <div style={{ maxWidth: 720, margin: "0 auto", padding: "36px 24px 0" }}>
        <div style={{ marginBottom: 36 }}>
          <div style={{ fontSize: 10, color: "#C8F135", fontFamily: "monospace", letterSpacing: "0.12em", marginBottom: 10 }}>DISTRIBUTION INTELLIGENCE</div>
          <h1 style={{ fontSize: 28, fontWeight: 800, letterSpacing: "-0.03em", color: "#f4f4f4", lineHeight: 1.2, margin: "0 0 12px" }}>
            The gap between what's live onchain and what's gatekept off it.
          </h1>
          <p style={{ fontSize: 13.5, color: "#666", lineHeight: 1.65, margin: 0, maxWidth: 560 }}>
            Select a Mantle ecosystem asset to run a live research brief. The agent analyzes TVL context, distribution dynamics, and forward thesis using Mantle's RWA infrastructure stack.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 1, background: "#111", border: "1px solid #1a1a1a", borderRadius: 8, overflow: "hidden", marginBottom: 28 }}>
          {[
            { label: "RWA TVL", value: "$247.5M", sub: "Q1 2026" },
            { label: "QoQ Growth", value: "+27.4%", sub: "Messari verified" },
            { label: "Agent Stack", value: "4 primitives", sub: "ERC-8004, Skills, Scaffold, x402" },
          ].map((s) => (
            <div key={s.label} style={{ padding: "16px 18px", background: "#0c0c0c" }}>
              <div style={{ fontSize: 11, color: "#444", fontFamily: "monospace", letterSpacing: "0.06em", marginBottom: 4 }}>{s.label}</div>
              <div style={{ fontSize: 18, fontWeight: 800, color: "#C8F135", letterSpacing: "-0.02em" }}>{s.value}</div>
              <div style={{ fontSize: 10, color: "#333", marginTop: 2 }}>{s.sub}</div>
            </div>
          ))}
        </div>

        <div style={{ marginBottom: 8 }}>
          <div style={{ fontSize: 10, color: "#444", fontFamily: "monospace", letterSpacing: "0.08em", marginBottom: 12 }}>SELECT ASSET TO RESEARCH</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {MANTLE_ASSETS.map((asset) => {
              const isSelected = selected?.id === asset.id;
              return (
                <button
                  key={asset.id}
                  onClick={() => runAgent(asset)}
                  style={{
                    background: isSelected ? "#111" : "#0c0c0c",
                    border: `1px solid ${isSelected ? "#C8F135" : "#1a1a1a"}`,
                    borderRadius: 6,
                    padding: "14px 18px",
                    cursor: "pointer",
                    textAlign: "left",
                    transition: "all 0.15s",
                    display: "grid",
                    gridTemplateColumns: "1fr auto",
                    alignItems: "center",
                    gap: 16,
                  }}
                >
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                      <span style={{ fontWeight: 700, fontSize: 13.5, color: isSelected ? "#C8F135" : "#d0d0d0" }}>{asset.symbol}</span>
                      <span style={{ color: "#444", fontSize: 12 }}>{asset.name}</span>
                      <span style={{ fontSize: 9, background: "rgba(200,241,53,0.08)", color: "#C8F135", padding: "2px 6px", borderRadius: 3, fontFamily: "monospace", letterSpacing: "0.06em" }}>
                        {asset.status.toUpperCase()}
                      </span>
                    </div>
                    <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                      {asset.tags.map((t) => <Tag key={t} label={t} />)}
                      <Tag label={asset.issuer} />
                    </div>
                  </div>
                  <div style={{ textAlign: "right", minWidth: 120 }}>
                    <div style={{ fontSize: 11, color: "#333", fontFamily: "monospace", marginBottom: 5 }}>DISTRIBUTION SCORE</div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, justifyContent: "flex-end", marginBottom: 6 }}>
                      <span style={{ fontSize: 16, fontWeight: 800, color: "#f0f0f0" }}>{asset.distributionScore}</span>
                      <ScoreLabel score={asset.distributionScore} />
                    </div>
                    <ScoreBar score={asset.distributionScore} color={asset.distributionScore >= 80 ? "#C8F135" : asset.distributionScore >= 55 ? "#f5c518" : "#ff5c5c"} />
                    <div style={{ fontSize: 11, color: "#444", marginTop: 5 }}>TVL {asset.tvl}</div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <ResearchBrief asset={selected} brief={brief} loading={loading} />

        <div style={{ marginTop: 24, background: "#0a0a0a", border: "1px solid #161616", borderRadius: 8, padding: "18px 20px" }}>
          <div style={{ fontSize: 10, color: "#444", fontFamily: "monospace", letterSpacing: "0.08em", marginBottom: 10 }}>DISTRIBUTION SCORE METHODOLOGY</div>
          <p style={{ fontSize: 12.5, color: "#555", lineHeight: 1.65, margin: 0 }}>
            Scores reflect allocation pipeline readiness: whether an asset's underlying supply can be sourced, allocated, and custodied without a TradFi gatekeeper controlling the bottleneck. The SpaceX episode (June 2026) established the benchmark — $1B+ in onchain demand, zero allocation delivered. Assets with issuer-direct minting, post-IPO sourcing, or native onchain yield score higher than assets dependent on traditional underwriter relationships.
          </p>
        </div>

        <AgentCardPanel />

        <div style={{ marginTop: 16, padding: "14px 18px", background: "#0a0a0a", border: "1px solid #161616", borderRadius: 6, display: "flex", alignItems: "flex-start", gap: 12 }}>
          <div style={{ width: 20, height: 20, background: "rgba(200,241,53,0.08)", borderRadius: 4, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 1 }}>
            <span style={{ color: "#C8F135", fontSize: 10, fontWeight: 700 }}>₿</span>
          </div>
          <div>
            <div style={{ fontSize: 11, color: "#C8F135", fontFamily: "monospace", letterSpacing: "0.06em", marginBottom: 4 }}>x402 PAYMENT LAYER</div>
            <p style={{ fontSize: 12, color: "#444", lineHeight: 1.6, margin: 0 }}>
              This agent is architected for x402 monetization. Premium research briefs, real-time TVL alerts, and institutional allocation signals can be gated behind micropayment endpoints — agents and users pay per query in stablecoins at the HTTP layer, no API keys required. QuestFlow integration on Mantle handles settlement.
            </p>
          </div>
        </div>

        <div style={{ marginTop: 36, paddingTop: 20, borderTop: "1px solid #111", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: 11, color: "#2a2a2a", fontFamily: "monospace" }}>MANTLE RWA SCOUT — TRACK 2 SUBMISSION</span>
          <span style={{ fontSize: 11, color: "#2a2a2a", fontFamily: "monospace" }}>BUILT FOR MANTLE RESEARCH CHALLENGE 2026</span>
        </div>
      </div>
    </div>
  );
}
