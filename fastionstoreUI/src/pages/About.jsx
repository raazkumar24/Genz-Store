import React from "react";
import { Link } from "react-router-dom";
import { 
  Flame, Zap, ArrowRight, ShieldCheck, RotateCcw, 
  Layers, Sparkles, Check, X, Award, Scissors, Compass
} from "lucide-react";
import { Button, BackButton } from "../components/ui";

const About = () => {
  return (
    <div className="min-h-screen bg-[var(--color-bg)] pb-20">
      
      {/* Editorial Hero Header */}
      <section className="relative bg-[#0D0D11] text-white py-16 sm:py-24 px-4 sm:px-6 lg:px-8 overflow-hidden border-b border-neutral-800">
        <div className="relative z-20 max-w-7xl mx-auto flex mb-6 sm:mb-8">
          <BackButton variant="dark" className="rounded-none border-neutral-700 hover:border-white" />
        </div>

        {/* Ambient Dark Streetwear Background Overlay */}
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <img 
            src="/models/model1.png" 
            alt="Streetwear Culture" 
            className="w-full h-full object-cover object-top filter grayscale contrast-125"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#0D0D11] via-[#0D0D11]/85 to-transparent pointer-events-none" />

        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-5">
          <div className="inline-flex items-center gap-2 rounded-none bg-[var(--color-primary)]/15 border border-[var(--color-primary)] text-[var(--color-primary)] px-3.5 py-1 text-xs font-mono font-bold uppercase tracking-widest">
            <Flame size={13} className="fill-[var(--color-primary)]" />
            <span>GENZ ARCHIVE MANIFESTO</span>
          </div>

          <h1
            className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black uppercase tracking-tight text-white leading-tight break-words"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            BORN ON THE STREETS. <br />
            <span className="text-[var(--color-primary)]">ENGINEERED TO LAST.</span>
          </h1>

          <p className="text-xs sm:text-sm md:text-base text-neutral-300 max-w-2xl mx-auto font-mono leading-relaxed pt-2">
            We built Genz Store on an uncompromising principle: creating heavyweight, architectural streetwear silhouettes with 280 to 400 GSM fabrics that never compromise.
          </p>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 max-w-3xl mx-auto">
            <div className="p-3.5 rounded-none bg-white/5 border border-white/10 backdrop-blur-xs text-left">
              <span className="block text-[10px] font-mono text-neutral-400 uppercase tracking-wider">FABRIC DENSITY</span>
              <span className="text-xl sm:text-2xl font-black text-white font-mono">280-400</span>
              <span className="text-[10px] font-mono text-[var(--color-primary)] block">GSM COMBED COTTON</span>
            </div>

            <div className="p-3.5 rounded-none bg-white/5 border border-white/10 backdrop-blur-xs text-left">
              <span className="block text-[10px] font-mono text-neutral-400 uppercase tracking-wider">SILHOUETTE</span>
              <span className="text-xl sm:text-2xl font-black text-white font-mono">BOXY</span>
              <span className="text-[10px] font-mono text-emerald-400 block">DROP SHOULDER CUT</span>
            </div>

            <div className="p-3.5 rounded-none bg-white/5 border border-white/10 backdrop-blur-xs text-left">
              <span className="block text-[10px] font-mono text-neutral-400 uppercase tracking-wider">SYNTHETIC BLEND</span>
              <span className="text-xl sm:text-2xl font-black text-white font-mono">0%</span>
              <span className="text-[10px] font-mono text-neutral-400 block">PURE ORGANIC YARN</span>
            </div>

            <div className="p-3.5 rounded-none bg-white/5 border border-white/10 backdrop-blur-xs text-left">
              <span className="block text-[10px] font-mono text-neutral-400 uppercase tracking-wider">ORIGIN</span>
              <span className="text-xl sm:text-2xl font-black text-white font-mono">INDIA</span>
              <span className="text-[10px] font-mono text-amber-400 block">ETHICALLY MILLED</span>
            </div>
          </div>
        </div>
      </section>

      {/* Brand Story & The Heavyweight Thesis */}
      <section className="py-14 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-widest text-[var(--color-primary)]">
              <Zap size={14} />
              <span>THE HEAVYWEIGHT THESIS</span>
            </div>

            <h2
              className="text-2xl sm:text-4xl font-black uppercase tracking-tight text-neutral-950 leading-tight"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              ANTI-FAST FASHION. <br />
              <span className="text-neutral-400">UNAPOLOGETIC STRUCTURE.</span>
            </h2>

            <div className="space-y-4 text-xs sm:text-sm text-neutral-600 font-medium leading-relaxed">
              <p>
                Mass market fast-fashion is addicted to cheap 140 GSM poly-blends—flimsy garments designed to curl at the collar and pill after 2 laundry cycles. We refuse that model entirely.
              </p>
              <p>
                Every drop in our archive is custom-knitted in India from <strong>280 to 400 GSM 100% combed organic cotton</strong>. Engineered with relaxed drop-shoulder patterns, twin-needle reinforced hems, and 1.2-inch lycra-ribbed collars that hold their sharp posture forever.
              </p>
              <p>
                Whether it's an oversized acid-washed tee, heavyweight fleece hoodie, or multi-pocket tactical cargo, we engineer uniforms for individuals who let their silhouette speak.
              </p>
            </div>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <Button to="/collections/oversized-tees" variant="primary" size="lg" icon={<ArrowRight size={16} />} className="rounded-none font-mono text-xs font-black uppercase">
                Explore The Archive
              </Button>
              <Button to="/new-arrivals" variant="white" size="lg" className="rounded-none border-neutral-300 font-mono text-xs font-black uppercase">
                View New Drops
              </Button>
            </div>
          </div>

          {/* Right Image Lookbook Collage */}
          <div className="lg:col-span-6 grid grid-cols-2 gap-4">
            <div className="space-y-4">
              <div className="overflow-hidden rounded-none bg-neutral-100 border border-neutral-300/80 shadow-xs h-64 sm:h-84">
                <img
                  src="/models/model2.png"
                  alt="Streetwear fit"
                  className="h-full w-full object-cover object-top hover:scale-105 transition-transform duration-700"
                />
              </div>
              <div className="p-4 sm:p-5 rounded-none bg-neutral-950 text-white space-y-1 border border-neutral-800">
                <p className="text-xl sm:text-2xl font-black font-mono text-[var(--color-primary)]">280+ GSM</p>
                <p className="text-xs text-neutral-400 font-mono">Standard Heavyweight Combed Cotton</p>
              </div>
            </div>

            <div className="space-y-4 pt-6 sm:pt-10">
              <div className="p-4 sm:p-5 rounded-none bg-white border border-neutral-300 shadow-xs space-y-1">
                <p className="text-xl sm:text-2xl font-black text-neutral-950 font-mono">100%</p>
                <p className="text-xs text-neutral-600 font-mono">Pre-Shrunk & Bio-Enzyme Washed</p>
              </div>
              <div className="overflow-hidden rounded-none bg-neutral-100 border border-neutral-300/80 shadow-xs h-64 sm:h-84">
                <img
                  src="/models/model3.png"
                  alt="Streetwear details"
                  className="h-full w-full object-cover object-center hover:scale-105 transition-transform duration-700"
                />
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Fabric Technical Breakdown & Comparison Matrix */}
      <section className="py-10 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="bg-[#0D0D11] text-white rounded-none p-6 sm:p-10 md:p-12 border border-neutral-800 space-y-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-neutral-800 pb-6">
            <div>
              <span className="text-xs font-mono font-bold uppercase tracking-widest text-[var(--color-primary)] flex items-center gap-2">
                <Scissors size={14} />
                <span>FABRIC SPECIFICATION MATRIX</span>
              </span>
              <h3 className="text-2xl sm:text-3xl md:text-4xl font-black uppercase tracking-tight text-white mt-1" style={{ fontFamily: "var(--font-heading)" }}>
                Fast Fashion vs. Genz Store Standard
              </h3>
            </div>
            <p className="text-xs font-mono text-neutral-400 max-w-md">
              A side-by-side technical dissection between disposable retail garments and our archival builds.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Column 1: Fast Fashion (Deficient) */}
            <div className="p-6 rounded-none bg-neutral-900/60 border border-neutral-800 space-y-4">
              <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
                <span className="text-xs font-mono font-black uppercase tracking-wider text-red-400">Regular Fast Fashion</span>
                <span className="text-[10px] font-mono text-neutral-500 uppercase">Mass Retail</span>
              </div>
              
              <ul className="space-y-3 text-xs font-mono text-neutral-400">
                <li className="flex items-start gap-2.5">
                  <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-none bg-red-500/10 text-red-400 border border-red-500/20 mt-0.5">
                    <X size={12} strokeWidth={3} />
                  </span>
                  <span>140 to 160 GSM lightweight poly-cotton blends</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-none bg-red-500/10 text-red-400 border border-red-500/20 mt-0.5">
                    <X size={12} strokeWidth={3} />
                  </span>
                  <span>Collars bacon-curl and sag after 2 to 3 home washes</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-none bg-red-500/10 text-red-400 border border-red-500/20 mt-0.5">
                    <X size={12} strokeWidth={3} />
                  </span>
                  <span>Flimsy, clingy drape that collapses against your frame</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-none bg-red-500/10 text-red-400 border border-red-500/20 mt-0.5">
                    <X size={12} strokeWidth={3} />
                  </span>
                  <span>Plastisol rubber prints that crack and peel quickly</span>
                </li>
              </ul>
            </div>

            {/* Column 2: Genz Store Standard (Premium) */}
            <div className="p-6 rounded-none bg-[var(--color-primary)]/10 border border-[var(--color-primary)]/40 space-y-4">
              <div className="flex items-center justify-between border-b border-[var(--color-primary)]/30 pb-3">
                <span className="text-xs font-mono font-black uppercase tracking-wider text-[var(--color-primary)]">Genz Store Heavyweight</span>
                <span className="text-[10px] font-mono text-emerald-400 uppercase font-black">Archive Grade</span>
              </div>
              
              <ul className="space-y-3 text-xs font-mono text-neutral-200">
                <li className="flex items-start gap-2.5">
                  <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-none bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 mt-0.5">
                    <Check size={12} strokeWidth={3} />
                  </span>
                  <span>280 to 400 GSM 100% Combed Ring-Spun Organic Cotton</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-none bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 mt-0.5">
                    <Check size={12} strokeWidth={3} />
                  </span>
                  <span>1.2-inch Lycra-reinforced anti-sagging ribbed neckline</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-none bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 mt-0.5">
                    <Check size={12} strokeWidth={3} />
                  </span>
                  <span>Architectural boxy drape that holds its structured silhouette</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-none bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 mt-0.5">
                    <Check size={12} strokeWidth={3} />
                  </span>
                  <span>High-density crack-resistant archival discharge screenprints</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* The 4 Core Architectural Pillars */}
      <section className="py-10 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-[var(--color-primary)]">OUR QUALITY BENCHMARK</span>
          <h2
            className="text-2xl sm:text-4xl font-black uppercase tracking-tight text-neutral-950"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            THE FOUR <span className="text-[var(--color-primary)]">PILLARS</span>
          </h2>
          <p className="text-xs sm:text-sm text-neutral-500 font-mono">
            Every garment released under our badge adheres strictly to these parameters.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-6 rounded-none border border-neutral-300 shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="h-8 w-8 rounded-none bg-neutral-950 text-white flex items-center justify-center font-mono font-black text-xs">
                01
              </span>
              <Layers size={18} className="text-neutral-400" />
            </div>
            <h3 className="text-xs sm:text-sm font-black uppercase text-neutral-950 font-mono">280-400 GSM Yarn</h3>
            <p className="text-xs text-neutral-600 leading-relaxed font-mono">
              Dense, structured cotton yarns that give each garment an unmistakable substantial hand-feel.
            </p>
          </div>

          <div className="bg-white p-6 rounded-none border border-neutral-300 shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="h-8 w-8 rounded-none bg-neutral-950 text-white flex items-center justify-center font-mono font-black text-xs">
                02
              </span>
              <Compass size={18} className="text-neutral-400" />
            </div>
            <h3 className="text-xs sm:text-sm font-black uppercase text-neutral-950 font-mono">Slouchy Boxy Cut</h3>
            <p className="text-xs text-neutral-600 leading-relaxed font-mono">
              Drop-shoulder seams, widened chest proportions, and calibrated lengths for the signature silhouette.
            </p>
          </div>

          <div className="bg-white p-6 rounded-none border border-neutral-300 shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="h-8 w-8 rounded-none bg-neutral-950 text-white flex items-center justify-center font-mono font-black text-xs">
                03
              </span>
              <Sparkles size={18} className="text-neutral-400" />
            </div>
            <h3 className="text-xs sm:text-sm font-black uppercase text-neutral-950 font-mono">Archival Screenprints</h3>
            <p className="text-xs text-neutral-600 leading-relaxed font-mono">
              High-density, crack-resistant pigment formulations that survive intense real-world daily wear.
            </p>
          </div>

          <div className="bg-white p-6 rounded-none border border-neutral-300 shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="h-8 w-8 rounded-none bg-neutral-950 text-white flex items-center justify-center font-mono font-black text-xs">
                04
              </span>
              <RotateCcw size={18} className="text-neutral-400" />
            </div>
            <h3 className="text-xs sm:text-sm font-black uppercase text-neutral-950 font-mono">14-Day Free Exchange</h3>
            <p className="text-xs text-neutral-600 leading-relaxed font-mono">
              Doorstep reverse pickups across 26,000+ pincodes in India so your fit is guaranteed accurate.
            </p>
          </div>
        </div>
      </section>

      {/* Final Call to Action */}
      <section className="text-center py-12 px-4 max-w-3xl mx-auto border-t border-neutral-300 space-y-4">
        <h3
          className="text-2xl sm:text-3xl md:text-4xl font-black uppercase tracking-tight text-neutral-950"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          READY TO UPGRADE YOUR ROTATION?
        </h3>
        <p className="text-xs sm:text-sm text-neutral-500 font-mono max-w-md mx-auto">
          Explore our limited drop collections with instant express dispatch across India.
        </p>
        <div className="pt-2">
          <Button to="/collections/all" variant="primary" size="lg" icon={<ArrowRight size={16} />} className="rounded-none font-mono text-xs font-black uppercase px-8">
            Shop All Collections
          </Button>
        </div>
      </section>

    </div>
  );
};

export default About;
