import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

/**
 * PromoBanner Component
 * A sleek, full-width promotional banner to break up the homepage and drive sales.
 */
const PromoBanner = () => {
  return (
    <section className="relative w-full py-16 md:py-24 overflow-hidden bg-black text-white">
      {/* Background Texture/Image (Subtle) */}
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-30 mix-blend-overlay"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1550639525-c97d455acf70?auto=format&fit=crop&q=80')" }}
      />
      
      {/* Dark overlay for text readability */}
      <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-8 flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/20 bg-white/10 backdrop-blur-md mb-6">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-white/80">Limited Time Offer</span>
          </div>
          
          <h2 
            className="text-5xl md:text-6xl lg:text-7xl font-black uppercase tracking-tighter leading-none mb-6"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Summer <span className="text-transparent" style={{ WebkitTextStroke: "2px white" }}>Blowout</span>
          </h2>
          
          <p className="text-white/70 text-base md:text-lg font-medium max-w-md mb-8 leading-relaxed">
            Upgrade your streetwear rotation. Get a flat 20% off on all oversized tees and baggy cargos. Valid till stocks last.
          </p>
          
          <Link 
            to="/collections/oversized-tees"
            className="inline-flex items-center justify-center gap-3 whitespace-nowrap bg-white text-black px-8 py-4 rounded-full font-bold uppercase tracking-wider text-sm hover:bg-[var(--color-primary)] hover:text-white transition-colors duration-300 group"
          >
            Shop The Sale 
            <ArrowRight size={18} strokeWidth={2.5} className="transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Floating Discount Badge */}
        <div className="hidden md:flex flex-col items-center justify-center w-40 h-40 rounded-full border border-white/20 bg-white/5 backdrop-blur-xl shrink-0 animate-[spin_10s_linear_infinite]">
          <span className="text-4xl font-black text-white" style={{ fontFamily: "var(--font-heading)" }}>20%</span>
          <span className="text-xs font-bold text-white/60 uppercase tracking-widest">OFF</span>
        </div>
      </div>
    </section>
  );
};

export default PromoBanner;
