import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Droplets,
  Activity,
  Factory,
  Leaf,
  ArrowRight,
  Moon,
  Sun,
  ShieldCheck,
  Gauge,
  LineChart as LineChartIcon,
  BarChart4,
  Calculator,
  DollarSign,
  Percent,
  TrendingUp,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  AreaChart,
  Area,
} from "recharts";

// ==========================================================
// Tailwind Custom Theme Colors (configure in tailwind.config.js)
// ==========================================================
// theme: {
//   extend: {
//     colors: {
//       brand: {
//         blue: "#0090C0", // Trucent primary cyan-blue
//         green: "#8DC63E", // Trucent accent green
//       }
//     }
//   }
// }
// Then use classes like: bg-brand-blue hover:bg-brand-blue/80 text-brand-green

// ==========================================================
// Local icons / fallbacks
// ==========================================================
// Some environments pin an older lucide-react where `Sparkles` isn't exported.
// To avoid build failures, we provide a local fallback icon and use it instead of importing Sparkles.
function SparklesIcon({ className = "w-4 h-4", style }) {
  return (
    <svg
      className={className}
      style={style}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path d="M12 2l1.8 4.6L18 8.4l-4.2 1.8L12 15l-1.8-4.8L6 8.4l4.2-1.8L12 2z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
      <path d="M4 14l1 2.6L8 18l-3 1.4L4 22l-1-2.6L0 18l3-1.4L4 14zM20 10l.9 2.2L24 13l-3.1 1L20 16l-.9-2.1L16 13l3.1-.8L20 10z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/>
    </svg>
  );
}

// ==========================================================
// Shared helpers
// ==========================================================
function KpiCard({ icon: Icon, label, value, sub }) {
  return (
    <div className="rounded-2xl bg-white/70 dark:bg-zinc-900/70 border border-zinc-200/60 dark:border-zinc-800 p-5 shadow-sm backdrop-blur">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-xl bg-brand-blue/10 border border-brand-blue/20">
          <Icon className="w-5 h-5 text-brand-blue" />
        </div>
        <div>
          <p className="text-xs uppercase tracking-wider text-zinc-500 dark:text-zinc-400">{label}</p>
          <p className="text-2xl font-semibold leading-tight">{value}</p>
          {sub && <p className="text-xs mt-1 text-brand-green">{sub}</p>}
        </div>
      </div>
    </div>
  );
}

function Section({ id, eyebrow, title, subtitle, children, actions }) {
  return (
    <section id={id} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        {eyebrow && (
          <div className="text-xs uppercase tracking-[0.2em] font-semibold text-brand-blue">{eyebrow}</div>
        )}
        {title && (
          <h2 className="mt-2 text-3xl md:text-4xl font-bold text-zinc-900 dark:text-zinc-50">{title}</h2>
        )}
        {subtitle && (
          <p className="mt-3 text-zinc-600 dark:text-zinc-300 max-w-3xl">{subtitle}</p>
        )}
        {actions && <div className="mt-6 flex flex-wrap gap-3">{actions}</div>}
      </div>
      {children}
    </section>
  );
}

function BeforeAfter() {
  const [pos, setPos] = useState(55);
  return (
    <div
      className="relative w-full rounded-2xl overflow-hidden border border-zinc-200 dark:border-zinc-800 bg-gradient-to-br from-brand-blue/10 to-brand-blue/30"
      style={{ height: 280 }}
    >
      {/* AFTER (clean) */}
      <div className="absolute inset-0 bg-gradient-to-br from-brand-blue/20 to-brand-blue/40" />
      {/* BEFORE (turbid) clipped */}
      <div
        className="absolute inset-0"
        style={{
          clipPath: `polygon(0 0, ${pos}% 0, ${pos}% 100%, 0% 100%)`,
          background: "linear-gradient(135deg, rgba(180,120,40,0.35), rgba(180,120,40,0.6))",
          backdropFilter: "blur(1px)",
        }}
      />
      <div className="pointer-events-none absolute left-3 top-3 text-xs font-semibold px-2 py-1 rounded-full bg-white/70 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-700">
        BEFORE
      </div>
      <div className="pointer-events-none absolute right-3 bottom-3 text-xs font-semibold px-2 py-1 rounded-full bg-white/70 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-700">
        AFTER
      </div>
      <input
        aria-label="Before/After slider"
        type="range"
        min={5}
        max={95}
        value={pos}
        onChange={(e) => setPos(Number(e.target.value))}
        className="absolute left-0 right-0 bottom-4 mx-auto w-2/3 appearance-none h-2 rounded-full bg-brand-blue"
      />
      <div
        className="absolute top-0 bottom-0 w-[2px] bg-brand-blue"
        style={{ left: `${pos}%`, transform: "translateX(-1px)" }}
      />
    </div>
  );
}

// Demo chart data
const genSeries = () => {
  const base = 1200;
  return Array.from({ length: 12 }).map((_, i) => ({
    month: new Date(2024, i, 1).toLocaleString("en-US", { month: "short" }),
    gallons: Math.round(base + Math.sin(i / 1.5) * 200 + i * 40),
    uptime: Math.round(97 + Math.sin(i / 2) * 1.2 + i / 100),
    waste: Math.max(0, Math.round(28 - i * 1.6 + Math.cos(i) * 2)),
  }));
};
const series = genSeries();

function LeadForm() {
  const [sent, setSent] = useState(false);
  const onSubmit = (e) => {
    e.preventDefault();
    setSent(true);
  };
  return (
    <form onSubmit={onSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <input
        required
        placeholder="Full name"
        className="px-4 py-3 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900"
      />
      <input
        required
        type="email"
        placeholder="Work email"
        className="px-4 py-3 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900"
      />
      <input
        placeholder="Company"
        className="px-4 py-3 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900"
      />
      <select className="px-4 py-3 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900">
        <option>Industry</option>
        <option>Automotive</option>
        <option>Food & Beverage</option>
        <option>Energy</option>
        <option>Metals</option>
        <option>Pharma</option>
      </select>
      <textarea
        placeholder="What would you like to pilot?"
        className="md:col-span-2 px-4 py-3 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900"
        rows={4}
      />
      <div className="md:col-span-2 flex gap-3 items-center">
        <button
          type="submit"
          className="px-5 py-3 rounded-xl bg-brand-blue hover:bg-brand-blue/80 text-white font-semibold inline-flex items-center gap-2"
        >
          <SparklesIcon className="w-4 h-4" /> Request a Pilot
        </button>
        {sent && (
          <span className="text-brand-green">Thanks! We'll follow up with an NDA & next steps.</span>
        )}
      </div>
    </form>
  );
}

// ==========================================================
// ROI Calculator (pure helper + UI)
// ==========================================================
export function computeROI(inputs) {
  const baseMonthly = (inputs.disposal + inputs.consumables) * (inputs.reduction / 100);
  // If opexDelta is negative (extra savings), we don't reduce savings again (no double‑count)
  const monthlySavings = baseMonthly - Math.max(0, inputs.opexDelta);

  const paybackMonths = monthlySavings > 0 ? inputs.impl / monthlySavings : Infinity;
  const roi12 = inputs.impl > 0 ? (monthlySavings * 12 - inputs.impl) / inputs.impl : 0;

  const r = inputs.rate / 100 / 12; // monthly discount
  const months = Math.max(1, Math.round(inputs.horizon * 12));
  let npv = -inputs.impl;
  let cum = -inputs.impl;
  const series = [];
  for (let m = 1; m <= months; m++) {
    const cf = monthlySavings;
    npv += cf / Math.pow(1 + r, m);
    cum += cf;
    series.push({ month: `M${m}`, cum: Math.round(cum) });
  }
  return { monthlySavings, paybackMonths, roi12, npv, series };
}

function currency(n) {
  if (Number.isFinite(n)) {
    return n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
  }
  return "—";
}

function ROICalc() {
  const [inputs, setInputs] = useState({
    disposal: 12000, // $/mo baseline waste, hauling, surcharges
    consumables: 8000, // $/mo coolant/filters/chemicals
    reduction: 35, // % savings expected
    impl: 65000, // one-time implementation cost
    opexDelta: -1500, // monthly net OPEX change (+cost / -savings). Negative => extra savings
    rate: 10, // annual discount rate %
    horizon: 3, // years
  });

  const onNum = (k) => (e) => setInputs((v) => ({ ...v, [k]: Number(e.target.value) }));
  const { monthlySavings, paybackMonths, roi12, npv, series } = useMemo(() => computeROI(inputs), [inputs]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
      <div className="lg:col-span-2 rounded-2xl bg-white/70 dark:bg-zinc-900/70 border border-zinc-200 dark:border-zinc-800 p-5">
        <div className="font-semibold mb-3 flex items-center gap-2">
          <Calculator className="w-4 h-4 text-brand-blue" /> ROI Inputs
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
          <label className="grid gap-1">
            <span>Baseline waste & surcharges ($/mo)</span>
            <input type="number" value={inputs.disposal} onChange={onNum("disposal")} className="px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900" />
          </label>
          <label className="grid gap-1">
            <span>Consumables (coolant/filters) ($/mo)</span>
            <input type="number" value={inputs.consumables} onChange={onNum("consumables")} className="px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900" />
          </label>
          <label className="grid gap-1">
            <span>Expected reduction (%)</span>
            <input type="number" value={inputs.reduction} onChange={onNum("reduction")} className="px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900" />
          </label>
          <label className="grid gap-1">
            <span>Implementation cost ($ one‑time)</span>
            <input type="number" value={inputs.impl} onChange={onNum("impl")} className="px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900" />
          </label>
          <label className="grid gap-1">
            <span>Monthly OPEX change ($/mo)</span>
            <input type="number" value={inputs.opexDelta} onChange={onNum("opexDelta")} className="px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900" />
            <span className="text-xs text-zinc-500">Positive = extra cost, negative = extra savings.</span>
          </label>
          <label className="grid gap-1">
            <span>Discount rate (%/yr)</span>
            <input type="number" value={inputs.rate} onChange={onNum("rate")} className="px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900" />
          </label>
          <label className="grid gap-1">
            <span>Horizon (years)</span>
            <input type="number" value={inputs.horizon} onChange={onNum("horizon")} className="px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900" />
          </label>
        </div>
      </div>

      <div className="lg:col-span-3 grid grid-cols-1 gap-4">
        <div className="rounded-2xl bg-white/70 dark:bg-zinc-900/70 border border-zinc-200 dark:border-zinc-800 p-5">
          <div className="font-semibold mb-3 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-brand-blue" /> Results
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <KpiCard icon={DollarSign} label="Monthly Savings" value={currency(monthlySavings)} />
            <KpiCard icon={Percent} label="12‑mo ROI" value={(roi12 * 100).toFixed(0) + "%"} />
            <KpiCard icon={Activity} label="Payback" value={Number.isFinite(paybackMonths) ? paybackMonths.toFixed(1) + " mo" : "—"} />
            <KpiCard icon={ShieldCheck} label="NPV (horizon)" value={currency(npv)} />
          </div>
        </div>
        <div className="rounded-2xl bg-white/70 dark:bg-zinc-900/70 border border-zinc-200 dark:border-zinc-800 p-4">
          <div className="font-semibold mb-2 flex items-center gap-2">
            <LineChartIcon className="w-4 h-4 text-brand-blue" /> Cumulative Cashflow
          </div>
          <div className="h-40">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={series} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="g2" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="currentColor" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="currentColor" stopOpacity={0.05} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="cum" stroke="currentColor" fillOpacity={1} fill="url(#g2)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

// ==========================================================
// Floating Assistant (mock)
// ==========================================================
function FloatingAssistant() {
  const [open, setOpen] = useState(false);
  const [transcript, setTranscript] = useState(
    "Hi! I can answer questions about uptime, ROI, and service schedules. Ask me anything."
  );
  const [msg, setMsg] = useState("");
  return (
    <div className="fixed bottom-4 right-4 z-50">
      {open && (
        <div className="w-80 rounded-2xl shadow-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden">
          <div className="px-4 py-3 flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800">
            <div className="font-semibold">Trucent AI Assistant</div>
            <button onClick={() => setOpen(false)} className="text-sm px-2 py-1 rounded-lg bg-zinc-100 dark:bg-zinc-800">
              ×
            </button>
          </div>
          <div className="p-3 h-44 text-sm overflow-y-auto whitespace-pre-wrap text-zinc-700 dark:text-zinc-200">
            {transcript}
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setTranscript(
                (t) =>
                  t +
                  "\n\nYou: " +
                  msg +
                  "\nAssistant: Based on the demo data, your uptime trend is 99.1% with 18% waste reduction.\n"
              );
              setMsg("");
            }}
            className="p-3 border-t border-zinc-200 dark:border-zinc-800 flex gap-2"
          >
            <input
              value={msg}
              onChange={(e) => setMsg(e.target.value)}
              placeholder="Type a message"
              className="flex-1 px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900"
            />
            <button className="px-3 py-2 rounded-lg bg-brand-blue hover:bg-brand-blue/80 text-white font-medium">Send</button>
          </form>
        </div>
      )}

      <button
        onClick={() => setOpen((v) => !v)}
        className="rounded-full p-4 shadow-lg bg-brand-blue hover:bg-brand-blue/80 text-white inline-flex items-center gap-2"
      >
        <Droplets className="w-5 h-5" />
        <span className="hidden sm:inline">Ask Trucent AI</span>
      </button>
    </div>
  );
}

// ==========================================================
// Main App
// ==========================================================
export default function App() {
  const [dark, setDark] = useState(true);
  useEffect(() => {
    const root = document.documentElement;
    if (dark) root.classList.add("dark");
    else root.classList.remove("dark");
  }, [dark]);

  // Runtime sanity tests for computeROI (do not modify unless wrong)
  useEffect(() => {
    const approx = (a, b, tol = 1e-6) => Math.abs(a - b) <= tol;

    // Test 1: basic positive savings
    const t1 = computeROI({
      disposal: 10000,
      consumables: 5000,
      reduction: 40,
      impl: 60000,
      opexDelta: 0,
      rate: 12,
      horizon: 1,
    });
    console.assert(t1.monthlySavings === (10000 + 5000) * 0.4, "TEST1 monthlySavings");
    console.assert(approx(t1.paybackMonths, 60000 / ((10000 + 5000) * 0.4)), "TEST1 payback");

    // Test 2: negative opexDelta (extra savings) should not be double-counted
    const t2 = computeROI({
      disposal: 12000,
      consumables: 8000,
      reduction: 35,
      impl: 65000,
      opexDelta: -1500,
      rate: 10,
      horizon: 3,
    });
    const expectedMonthly = (12000 + 8000) * 0.35 - 0; // Math.max(0, -1500) -> 0
    console.assert(approx(t2.monthlySavings, expectedMonthly), "TEST2 monthlySavings (no double count)");

    // Test 3: zero monthly savings => infinite payback
    const t3 = computeROI({
      disposal: 0,
      consumables: 0,
      reduction: 0,
      impl: 50000,
      opexDelta: 0,
      rate: 10,
      horizon: 2,
    });
    console.assert(!Number.isFinite(t3.paybackMonths), "TEST3 payback should be Infinity when no savings");
  }, []);

  const totals = useMemo(
    () => ({
      uptime: "99.2%",
      waste: "-36%",
      gallons: "14,820/mo",
      co2: "-28.4t/yr",
    }),
    []
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-zinc-50 dark:from-zinc-950 dark:to-zinc-900 text-zinc-900 dark:text-zinc-50">
      {/* Top bar */}
      <div className="border-b border-zinc-200 dark:border-zinc-800 bg-white/70 dark:bg-zinc-900/60 backdrop-blur sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2 font-semibold">
            <div className="w-8 h-8 rounded-xl bg-brand-blue grid place-items-center text-white">
              <Droplets className="w-4 h-4" />
            </div>
            Trucent Partner Prototype
          </div>
          <div className="flex items-center gap-3">
            <a href="#portal" className="text-sm px-3 py-1.5 rounded-lg border border-zinc-300 dark:border-zinc-700">
              Client Portal
            </a>
            <button
              onClick={() => setDark((d) => !d)}
              className="text-sm px-3 py-1.5 rounded-lg bg-zinc-100 dark:bg-zinc-800 inline-flex items-center gap-2"
            >
              {dark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              {dark ? "Light" : "Dark"}
            </button>
            <a
              href="#contact"
              className="text-sm px-3 py-1.5 rounded-lg bg-brand-blue hover:bg-brand-blue/80 text-white inline-flex items-center gap-2"
            >
              <ArrowRight className="w-4 h-4" /> Request a Pilot
            </a>
          </div>
        </div>
      </div>

      {/* Hero */}
      <Section
        eyebrow="Tailored for Trucent"
        title={
          <>
            Fluid Purification <span className="text-brand-blue">meets</span> Real‑Time Data
          </>
        }
        subtitle="A clickable prototype to demonstrate how an integrated website + client portal can accelerate Trucent's sales cycle, prove ROI with live KPIs, and strengthen customer loyalty."
        actions={[
          <a key="1" href="#portal" className="px-4 py-2 rounded-xl bg-brand-blue hover:bg-brand-blue/80 text-white inline-flex items-center gap-2"><LineChartIcon className="w-4 h-4"/> Explore Portal</a>,
          <a key="2" href="#cases" className="px-4 py-2 rounded-xl border border-zinc-300 dark:border-zinc-700 inline-flex items-center gap-2"><BarChart4 className="w-4 h-4"/> See Case Studies</a>,
        ]}
      >
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
          <div className="lg:col-span-3">
            <BeforeAfter />
          </div>
          <div className="lg:col-span-2 grid grid-cols-2 gap-4">
            <KpiCard icon={Activity} label="Uptime" value={totals.uptime} sub="↑ +1.2% YoY" />
            <KpiCard icon={Droplets} label="Gallons Processed" value={totals.gallons} sub="↑ +9.4% YoY" />
            <KpiCard icon={Factory} label="Waste Reduced" value={totals.waste} sub="↓ -14% OPEX" />
            <KpiCard icon={Leaf} label="CO₂e Avoided" value={totals.co2} sub="Scope 1 & 2" />
          </div>
        </div>
      </Section>

      {/* Portal Demo */}
      <Section
        id="portal"
        eyebrow="Client Experience"
        title="Live portal that proves ROI"
        subtitle="Give customers a real-time view of equipment health, compliance, and savings. Sales teams can demo this on day one; service teams get predictive signals to intervene before downtime."
      >
        <div className="grid grid-cols-1 lg:grid-cols-7 gap-6">
          <div className="lg:col-span-4 rounded-2xl bg-white/70 dark:bg-zinc-900/70 border border-zinc-200 dark:border-zinc-800 p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="font-semibold flex items-center gap-2"><Gauge className="w-4 h-4 text-brand-blue"/> System Throughput (gallons/mo)</div>
              <div className="text-xs text-zinc-500">Demo data</div>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={series} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="currentColor" stopOpacity={0.35}/>
                      <stop offset="95%" stopColor="currentColor" stopOpacity={0.05}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.2}/>
                  <XAxis dataKey="month"/>
                  <YAxis/>
                  <Tooltip/>
                  <Area type="monotone" dataKey="gallons" stroke="currentColor" fillOpacity={1} fill="url(#g1)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="lg:col-span-3 grid grid-cols-1 gap-4">
            <div className="rounded-2xl bg-white/70 dark:bg-zinc-900/70 border border-zinc-200 dark:border-zinc-800 p-4">
              <div className="font-semibold mb-2 flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-brand-blue"/> Compliance Snapshot</div>
              <ul className="text-sm space-y-1 text-zinc-700 dark:text-zinc-300">
                <li>• ISO clean‑oil threshold: <span className="font-medium text-brand-green">PASS</span></li>
                <li>• Discharge BOD/COD limits: <span className="font-medium text-brand-green">PASS</span></li>
                <li>• Filter ΔP trend: <span className="font-medium">Stable</span></li>
                <li>• Upcoming service: <span className="font-medium">Sep 12</span></li>
              </ul>
            </div>

            <div className="rounded-2xl bg-white/70 dark:bg-zinc-900/70 border border-zinc-200 dark:border-zinc-800 p-4">
              <div className="font-semibold mb-2 flex items-center gap-2"><LineChartIcon className="w-4 h-4 text-brand-blue"/> Uptime vs Waste</div>
              <div className="h-40">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={series}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.2}/>
                    <XAxis dataKey="month"/>
                    <YAxis yAxisId="left"/>
                    <YAxis yAxisId="right" orientation="right"/>
                    <Tooltip/>
                    <Legend />
                    <Line yAxisId="left" type="monotone" dataKey="uptime" stroke="currentColor" dot={false} name="Uptime %" />
                    <Line yAxisId="right" type="monotone" dataKey="waste" stroke="currentColor" strokeDasharray="5 3" dot={false} name="Waste (tons)" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* Case Studies */}
      <Section
        id="cases"
        eyebrow="Proof"
        title="Clickable case studies"
        subtitle="Drill into outcomes by industry. Each mini‑page can be exported as a one‑pager for sales or procurement due diligence."
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              name: "Automotive – Coolant Reclamation",
              bullets: ["99.4% uptime across 14 lines", "42% coolant spend reduced", "Payback in 7.8 months"],
            },
            {
              name: "Food & Beverage – Wastewater Polishing",
              bullets: ["BOD down 33%", "Surcharges avoided", "Remote monitoring 24/7"],
            },
            {
              name: "Metals – Oil Mist & Tramp Oil",
              bullets: ["Air quality OSHA‑compliant", "Scrap value improved", "45% less unplanned downtime"],
            },
          ].map((c, i) => (
            <motion.div key={i} initial={{opacity:0, y:10}} whileInView={{opacity:1, y:0}} viewport={{once:true}} transition={{delay:i*0.05}}
              className="rounded-2xl bg-white/70 dark:bg-zinc-900/70 border border-zinc-200 dark:border-zinc-800 p-5 flex flex-col">
              <div className="font-semibold mb-2">{c.name}</div>
              <ul className="text-sm text-zinc-700 dark:text-zinc-300 space-y-1 mb-4">
                {c.bullets.map((b, j)=> <li key={j}>• {b}</li>)}
              </ul>
              <button className="mt-auto self-start text-sm px-3 py-1.5 rounded-lg bg-zinc-100 dark:bg-zinc-800">Open demo »</button>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* ROI Calculator */}
      <Section
        id="roi"
        eyebrow="Financials"
        title="ROI calculator"
        subtitle="Adjust a few assumptions to generate payback, 12‑month ROI, and multi‑year NPV your buyers and CFOs care about."
      >
        <ROICalc />
      </Section>

      {/* Contact / Pilot */}
      <Section
        id="contact"
        eyebrow="Next Step"
        title="Spin up a 2‑week pilot"
        subtitle="We’ll connect a demo portal to your selected asset (or sandbox data) and hand your sales team a live ROI story."
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="rounded-2xl bg-white/70 dark:bg-zinc-900/70 border border-zinc-200 dark:border-zinc-800 p-6">
            <LeadForm />
          </div>
          <div className="rounded-2xl bg-white/70 dark:bg-zinc-900/70 border border-zinc-200 dark:border-zinc-800 p-6">
            <h3 className="font-semibold mb-3">What’s included</h3>
            <ul className="text-sm text-zinc-700 dark:text-zinc-300 space-y-2">
              <li>• Discovery & KPI mapping (uptime, gallons, waste, CO₂e)</li>
              <li>• Branded web experience + client portal</li>
              <li>• Data hooks (CSV, API, PLC/IoT gateway optional)</li>
              <li>• Sales one‑pager + ROI calculator</li>
              <li>• Handover & scale plan</li>
            </ul>
            <h3 className="font-semibold mt-6 mb-3">Security & scale</h3>
            <ul className="text-sm text-zinc-700 dark:text-zinc-300 space-y-2">
              <li>• SSO (Okta/Azure AD), RBAC, audit logs</li>
              <li>• Cloud native (AWS/Azure), IaC ready</li>
              <li>• SOC2‑friendly processes and data isolation</li>
              <li>• API‑first for future integrations (CRM/ERP)</li>
            </ul>
          </div>
        </div>
      </Section>

      <footer className="py-10 text-center text-sm text-zinc-500">
        Prototype for discussion purposes only. Not affiliated with Trucent.
      </footer>

      <FloatingAssistant />
    </div>
  );
}
