import React from "react";
import { 
  Flame, Zap, ArrowRight 
} from "lucide-react";
import { Button, BackButton } from "../components/ui";

const About = () => {
  return (
    <div className="min-h-screen bg-[var(--color-bg)] pb-16">
      
      {/* Editorial Hero Header */}
      <section className="relative bg-neutral-900 text-white py-16 md:py-24 px-4 sm:px-6 lg:px-8 overflow-hidden border-b border-neutral-800">
        <div className="relative z-20 max-w-7xl mx-auto flex mb-6">
          <BackButton variant="dark" />
        </div>

        {/* Ambient Dark Streetwear Background Overlay */}
        <div className="absolute inset-0 opacity-25">
          <img 
            src="/models/model1.png" 
            alt="Streetwear Culture" 
            className="w-full h-full object-cover object-top filter grayscale"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-neutral-900/80 to-transparent"></div>

        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full bg-[var(--color-primary)]/20 border border-[var(--color-primary)] text-[var(--color-primary)] px-4 py-1 text-xs font-black uppercase tracking-widest">
            <Flame size={13} className="fill-[var(--color-primary)]" />
            The Genz Manifesto
          </div>

          <h1
<<<<<<< HEAD
            className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-black uppercase tracking-tight text-white leading-tight break-words max-w-full"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Born on the streets. <br />
            <span className="text-outline-primary mt-2">Crafted for the culture.</span>
=======
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black uppercase tracking-tight text-white leading-none"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Born on the streets. <br />
            <span className="text-[var(--color-primary)]">Crafted for the culture.</span>
>>>>>>> 7081665a6d106e8c80164200e2652d9cda3ac5f8
          </h1>

          <p className="text-sm sm:text-base md:text-lg text-neutral-300 max-w-2xl mx-auto font-medium leading-relaxed pt-2">
            We started Genz Store with one obsession: creating unapologetic, heavyweight streetwear with architectural boxy fits that last forever.
          </p>
        </div>
      </section>

      {/* Brand Story Section */}
      <section className="py-12 md:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-[var(--color-primary)]">
              <Zap size={14} />
              Our DNA
            </div>

            <h2
              className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-neutral-900 leading-tight"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Anti-Fast Fashion. <br />
              <span className="text-neutral-500">Pure Heavyweight Fabric.</span>
            </h2>

            <div className="space-y-4 text-xs sm:text-sm text-neutral-600 font-medium leading-relaxed">
              <p>
                Fast fashion gave everyone flimsy, paper-thin tees that lose their collar after two washes. We refused to accept that.
              </p>
              <p>
                Every piece in our rotation is precision-milled from <strong>280 to 380 GSM heavyweight combed organic cotton</strong>. Sourced and manufactured in India, engineered with drop-shoulder cuts, high-density archival prints, and bio-washed for zero shrinkage.
              </p>
              <p>
                Whether it's an oversized graphic tee, tactical cargo, or an everyday heavyweight hoodie, we design clothing for individuals who let their silhouette speak.
              </p>
            </div>

            <div className="pt-2 flex items-center gap-4">
              <Button to="/collections/oversized" variant="primary" size="lg" icon={<ArrowRight size={16} />}>
                Explore Drops
              </Button>
              <Button to="/new-arrivals" variant="white" size="lg">
                New Arrivals
              </Button>
            </div>
          </div>

          {/* Right Image Collage */}
          <div className="lg:col-span-6 grid grid-cols-2 gap-4">
            <div className="space-y-4">
              <div className="overflow-hidden rounded-3xl bg-neutral-100 border border-neutral-200/80 shadow-xs h-64 sm:h-80">
                <img
                  src="/models/model2.png"
                  alt="Streetwear fit"
                  className="h-full w-full object-cover object-center hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-5 rounded-3xl bg-neutral-900 text-white space-y-1">
                <p className="text-2xl font-black" style={{ fontFamily: "var(--font-heading)" }}>280+ GSM</p>
                <p className="text-xs text-neutral-400 font-medium">Standard Heavyweight Combed Cotton</p>
              </div>
            </div>

            <div className="space-y-4 pt-6 sm:pt-10">
              <div className="p-5 rounded-3xl bg-white border border-neutral-200/80 shadow-2xs space-y-1">
                <p className="text-2xl font-black text-[var(--color-primary)]" style={{ fontFamily: "var(--font-heading)" }}>100%</p>
                <p className="text-xs text-neutral-600 font-medium">Made in India with ethical labor</p>
              </div>
              <div className="overflow-hidden rounded-3xl bg-neutral-100 border border-neutral-200/80 shadow-xs h-64 sm:h-80">
                <img
                  src="/models/model3.png"
                  alt="Streetwear details"
                  className="h-full w-full object-cover object-center hover:scale-105 transition-transform duration-500"
                />
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* The 4 Core Brand Pillars */}
      <section className="py-12 md:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2
            className="text-3xl font-black uppercase tracking-tight text-neutral-900"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            The Streetwear <span className="text-[var(--color-primary)]">Standard</span>
          </h2>
          <p className="text-xs sm:text-sm text-neutral-500 mt-1 font-medium">
            What makes every Genz Store drop radically different
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-6 rounded-3xl border border-neutral-200/80 shadow-2xs space-y-3">
            <div className="h-10 w-10 rounded-2xl bg-neutral-100 flex items-center justify-center text-neutral-900 font-black">
              01
            </div>
            <h3 className="text-sm font-black uppercase text-neutral-900">280 GSM Pure Cotton</h3>
            <p className="text-xs text-neutral-600 leading-relaxed font-medium">
              Heavyweight, structured yarn that maintains its boxy drape without clinging to your body.
            </p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-neutral-200/80 shadow-2xs space-y-3">
            <div className="h-10 w-10 rounded-2xl bg-neutral-100 flex items-center justify-center text-neutral-900 font-black">
              02
            </div>
            <h3 className="text-sm font-black uppercase text-neutral-900">Drop-Shoulder Cut</h3>
            <p className="text-xs text-neutral-600 leading-relaxed font-medium">
              Engineered sleeves and wider chests designed for the authentic urban silhouette.
            </p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-neutral-200/80 shadow-2xs space-y-3">
            <div className="h-10 w-10 rounded-2xl bg-neutral-100 flex items-center justify-center text-neutral-900 font-black">
              03
            </div>
            <h3 className="text-sm font-black uppercase text-neutral-900">Archival Screenprints</h3>
            <p className="text-xs text-neutral-600 leading-relaxed font-medium">
              High-density, crack-resistant pigments that look crisp even after repeated washes.
            </p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-neutral-200/80 shadow-2xs space-y-3">
            <div className="h-10 w-10 rounded-2xl bg-neutral-100 flex items-center justify-center text-neutral-900 font-black">
              04
            </div>
            <h3 className="text-sm font-black uppercase text-neutral-900">14-Day Free Exchange</h3>
            <p className="text-xs text-neutral-600 leading-relaxed font-medium">
              Hassle-free reverse doorstep pickup across India if you ever need a size swap.
            </p>
          </div>
        </div>
      </section>

      {/* Fabric Breakdown / Comparison Table */}
      <section className="py-8 md:py-14 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="bg-neutral-900 text-white rounded-3xl p-6 sm:p-10 border border-neutral-800">
          <div className="max-w-3xl mb-8">
            <span className="text-xs font-black uppercase tracking-widest text-[var(--color-primary)]">The Fabric Lab</span>
            <h3 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white mt-1" style={{ fontFamily: "var(--font-heading)" }}>
              Standard Fast-Fashion vs. Genz Store Heavyweight
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-5 rounded-2xl bg-neutral-800/50 border border-neutral-700/50 space-y-3">
              <p className="text-xs font-black uppercase tracking-wider text-red-400">Regular Fast Fashion</p>
              <ul className="space-y-2 text-xs text-neutral-400 font-medium">
                <li>❌ 140 – 160 GSM lightweight poly-blend</li>
                <li>❌ Collars bacon-curl after 2 washes</li>
                <li>❌ Flimsy fabric clings awkwardly</li>
                <li>❌ Low quality plastisol prints that peel</li>
              </ul>
            </div>

            <div className="p-5 rounded-2xl bg-[var(--color-primary)]/10 border border-[var(--color-primary)]/40 space-y-3">
              <p className="text-xs font-black uppercase tracking-wider text-[var(--color-primary)]">Genz Store Heavyweight</p>
              <ul className="space-y-2 text-xs text-neutral-200 font-medium">
                <li>✅ 280+ GSM 100% Combed Pure Organic Cotton</li>
                <li>✅ 1.2" Thick lycra-reinforced non-sagging collar</li>
                <li>✅ Architectural boxy drape that holds its shape</li>
                <li>✅ High-density archival screenprints</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Final Call to Action */}
      <section className="text-center py-10 px-4">
        <h3
          className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-neutral-900"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          Ready to level up your rotation?
        </h3>
        <p className="text-xs sm:text-sm text-neutral-500 mt-1 mb-6 font-medium">
          Discover our latest streetwear drop now.
        </p>
        <Button to="/collections/all" variant="primary" size="lg" icon={<ArrowRight size={16} />}>
          Shop All Collections
        </Button>
      </section>

    </div>
  );
};

export default About;
