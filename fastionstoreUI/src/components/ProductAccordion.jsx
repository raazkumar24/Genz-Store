import React, { useState } from "react";
import { 
<<<<<<< HEAD
  CheckCircle2, ShieldCheck, Truck, RotateCcw, 
  Award, Droplets, Scissors, ThumbsUp, Layers
} from "lucide-react";

const StarSVG = ({ size = 14, className = "" }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);
=======
  Sparkles, CheckCircle2, ShieldCheck, Truck, RotateCcw, 
  Star, Award, Droplets, Scissors, ThumbsUp
} from "lucide-react";
>>>>>>> 7081665a6d106e8c80164200e2652d9cda3ac5f8

/**
 * ProductAccordion Component
 * Renders the product details in a cohesive streetwear accordion / tabbed layout.
 */
const ProductAccordion = ({ product }) => {
  const [activeTab, setActiveTab] = useState("overview");

  if (!product) return null;

  const reviews = [
    {
      id: 1,
      author: "Aryan K.",
      rating: 5,
      date: "2 days ago",
      fit: "True to Size (Oversized)",
      comment: "Fabric quality is insane! Heavyweight 280 GSM cotton with clean drop shoulders. Flexes so well with baggy cargos and Jordan 1s.",
      verified: true,
      likes: 24,
    },
    {
      id: 2,
      author: "Rohan M.",
      rating: 5,
      date: "1 week ago",
      fit: "Boxy Drop Shoulder",
      comment: "Best streetwear fit in India right now. Stitching and print feel ultra premium, didn't shrink or fade after 3 machine washes.",
      verified: true,
      likes: 19,
    },
    {
      id: 3,
      author: "Simran S.",
      rating: 5,
      date: "2 weeks ago",
      fit: "Relaxed Fit",
      comment: "Loved the eco packaging and delivery took only 36 hours to Bangalore. Ordered Size M for an oversized boyfriend tee look and it's perfect.",
      verified: true,
      likes: 15,
    },
  ];

  return (
    <div className="w-full" style={{ fontFamily: "var(--font-body)" }}>
      
      {/* Tab Navigation Header */}
      <div className="flex items-center gap-2 overflow-x-auto hide-scrollbar border-b border-neutral-200 pb-3 mb-6">
        {[
          { id: "overview", label: "Drop Overview" },
          { id: "specs", label: "280 GSM Material & Care" },
          { id: "shipping", label: "Shipping & 14-Day Returns" },
          { id: "reviews", label: "Customer Reviews (142)" },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`shrink-0 px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all duration-200 cursor-pointer ${
              activeTab === tab.id
                ? "bg-neutral-900 text-white shadow-xs"
                : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200 hover:text-neutral-900"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab 1: Overview & Highlights */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          {product.description && (
            <div className="rounded-2xl bg-neutral-50 p-5 border border-neutral-100">
              <h4 className="text-xs font-black uppercase tracking-widest text-neutral-400 mb-2">Drop Narrative</h4>
              <p className="text-sm text-neutral-700 leading-relaxed font-medium">
                {product.description}
              </p>
            </div>
          )}

          <div>
            <h4 className="text-xs font-black uppercase tracking-widest text-neutral-900 mb-3 flex items-center gap-1.5">
<<<<<<< HEAD
              <Layers size={14} className="text-[var(--color-primary)]" />
=======
              <Sparkles size={14} className="text-[var(--color-primary)]" />
>>>>>>> 7081665a6d106e8c80164200e2652d9cda3ac5f8
              Key Drop Highlights
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="flex items-start gap-2.5 rounded-xl border border-neutral-200 bg-white p-3.5 shadow-2xs">
                <CheckCircle2 size={16} className="text-emerald-500 shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-bold text-neutral-900">280 GSM Heavyweight Terry</p>
                  <p className="text-[11px] text-neutral-500">100% Combed pure cotton with pre-shrunk bio-wash.</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5 rounded-xl border border-neutral-200 bg-white p-3.5 shadow-2xs">
                <CheckCircle2 size={16} className="text-emerald-500 shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-bold text-neutral-900">Engineered Drop-Shoulder</p>
                  <p className="text-[11px] text-neutral-500">Signature boxy street drape with reinforced ribbed collar.</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5 rounded-xl border border-neutral-200 bg-white p-3.5 shadow-2xs">
                <CheckCircle2 size={16} className="text-emerald-500 shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-bold text-neutral-900">High-Density Screenprint</p>
                  <p className="text-[11px] text-neutral-500">Cracking-resistant archival inks that withstand 50+ washes.</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5 rounded-xl border border-neutral-200 bg-white p-3.5 shadow-2xs">
                <CheckCircle2 size={16} className="text-emerald-500 shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-bold text-neutral-900">Zero Plastic Packaging</p>
                  <p className="text-[11px] text-neutral-500">Delivered in 100% biodegradable compostable garment bags.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Specs & Material Care */}
      {activeTab === "specs" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="rounded-2xl bg-neutral-50 p-4 border border-neutral-100 flex items-start gap-3">
              <div className="h-9 w-9 rounded-xl bg-neutral-200 flex items-center justify-center shrink-0">
                <Droplets size={18} className="text-neutral-700" />
              </div>
              <div>
                <p className="text-xs font-bold text-neutral-900">Wash Inside Out</p>
                <p className="text-[11px] text-neutral-500 mt-0.5">Machine wash cold on delicate cycle to protect colors.</p>
              </div>
            </div>

            <div className="rounded-2xl bg-neutral-50 p-4 border border-neutral-100 flex items-start gap-3">
              <div className="h-9 w-9 rounded-xl bg-neutral-200 flex items-center justify-center shrink-0">
                <Scissors size={18} className="text-neutral-700" />
              </div>
              <div>
                <p className="text-xs font-bold text-neutral-900">Do Not Iron Print</p>
                <p className="text-[11px] text-neutral-500 mt-0.5">Steam iron inside out; avoid direct heat on graphics.</p>
              </div>
            </div>

            <div className="rounded-2xl bg-neutral-50 p-4 border border-neutral-100 flex items-start gap-3">
              <div className="h-9 w-9 rounded-xl bg-neutral-200 flex items-center justify-center shrink-0">
                <Award size={18} className="text-neutral-700" />
              </div>
              <div>
                <p className="text-xs font-bold text-neutral-900">Tumble Dry Low</p>
                <p className="text-[11px] text-neutral-500 mt-0.5">Flat air drying recommended for lifelong longevity.</p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl bg-white border border-neutral-200 p-4 text-xs space-y-2 text-neutral-700">
            <div className="flex justify-between py-1.5 border-b border-neutral-100">
              <span className="font-semibold text-neutral-500">Fabric Composition</span>
              <span className="font-bold text-neutral-900">100% Combed Pure Cotton (280 GSM)</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-neutral-100">
              <span className="font-semibold text-neutral-500">Silhouette & Cut</span>
              <span className="font-bold text-neutral-900">Boxy Drop-Shoulder Relaxed Fit</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-neutral-100">
              <span className="font-semibold text-neutral-500">Neckline</span>
              <span className="font-bold text-neutral-900">1.2" Thick Ribbed Lycra Crew Neck</span>
            </div>
            <div className="flex justify-between py-1.5">
              <span className="font-semibold text-neutral-500">Origin</span>
              <span className="font-bold text-neutral-900">Crafted & Milled in India</span>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Shipping & Returns */}
      {activeTab === "shipping" && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="rounded-2xl bg-neutral-50 p-4 border border-neutral-100 text-center">
              <Truck size={24} className="text-[var(--color-primary)] mx-auto mb-2" />
              <h5 className="text-xs font-black uppercase text-neutral-900">Fast 24-48h Dispatch</h5>
              <p className="text-[11px] text-neutral-500 mt-1">Orders placed before 2 PM dispatch same business day.</p>
            </div>

            <div className="rounded-2xl bg-neutral-50 p-4 border border-neutral-100 text-center">
              <RotateCcw size={24} className="text-[var(--color-primary)] mx-auto mb-2" />
              <h5 className="text-xs font-black uppercase text-neutral-900">14-Day Easy Return</h5>
              <p className="text-[11px] text-neutral-500 mt-1">Hassle-free reverse doorstep pickup across India.</p>
            </div>

            <div className="rounded-2xl bg-neutral-50 p-4 border border-neutral-100 text-center">
              <ShieldCheck size={24} className="text-[var(--color-primary)] mx-auto mb-2" />
              <h5 className="text-xs font-black uppercase text-neutral-900">COD Available</h5>
              <p className="text-[11px] text-neutral-500 mt-1">Pay on delivery with contactless verification.</p>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Reviews */}
      {activeTab === "reviews" && (
        <div className="space-y-6">
          {/* Summary Box */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-5 rounded-2xl bg-neutral-50 border border-neutral-200">
            <div className="flex items-center gap-4">
              <div className="text-center">
                <span className="text-4xl font-black text-neutral-900" style={{ fontFamily: "var(--font-heading)" }}>4.9</span>
                <div className="flex items-center text-amber-400 mt-1">
<<<<<<< HEAD
                  <StarSVG size={14} className="fill-amber-400 text-amber-400" />
                  <StarSVG size={14} className="fill-amber-400 text-amber-400" />
                  <StarSVG size={14} className="fill-amber-400 text-amber-400" />
                  <StarSVG size={14} className="fill-amber-400 text-amber-400" />
                  <StarSVG size={14} className="fill-amber-400 text-amber-400" />
=======
                  <Star size={14} className="fill-amber-400" />
                  <Star size={14} className="fill-amber-400" />
                  <Star size={14} className="fill-amber-400" />
                  <Star size={14} className="fill-amber-400" />
                  <Star size={14} className="fill-amber-400" />
>>>>>>> 7081665a6d106e8c80164200e2652d9cda3ac5f8
                </div>
                <span className="text-[10px] font-bold text-neutral-400 uppercase">142 verified drops</span>
              </div>
              <div className="h-12 w-[1px] bg-neutral-200 hidden sm:block"></div>
              <div className="space-y-1 text-xs text-neutral-600">
                <p>• <strong>96%</strong> said the fit was true to oversized streetwear sizing</p>
                <p>• <strong>99%</strong> loved the 280 GSM heavyweight cotton feel</p>
              </div>
            </div>
          </div>

          {/* Review List */}
          <div className="space-y-4">
            {reviews.map((rev) => (
              <div key={rev.id} className="p-4 sm:p-5 rounded-2xl bg-white border border-neutral-200/80 shadow-2xs space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black text-neutral-900">{rev.author}</span>
                    {rev.verified && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800">
                        <CheckCircle2 size={11} />
                        Verified Drop Buyer
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] font-medium text-neutral-400">{rev.date}</span>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex text-amber-400">
                    {[...Array(rev.rating)].map((_, i) => (
<<<<<<< HEAD
                      <StarSVG key={i} size={13} className="fill-amber-400 text-amber-400" />
=======
                      <Star key={i} size={13} className="fill-amber-400" />
>>>>>>> 7081665a6d106e8c80164200e2652d9cda3ac5f8
                    ))}
                  </div>
                  <span className="text-[11px] font-semibold text-neutral-500">• {rev.fit}</span>
                </div>

                <p className="text-xs text-neutral-700 leading-relaxed">{rev.comment}</p>

                <div className="flex items-center gap-1 text-[11px] text-neutral-400 pt-1">
                  <ThumbsUp size={12} />
                  <span>Helpful ({rev.likes})</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};

export default ProductAccordion;
