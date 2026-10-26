import React, { useState } from "react";
import { 
  MapPin, Mail, Send, MessageSquare, Clock, 
  ChevronDown, Check, RotateCcw, ShieldCheck, 
  Package, Zap, ArrowRight, HelpCircle
} from "lucide-react";
import { Button, BackButton } from "../components/ui";
import { useToast } from "../context/ToastContext";

const faqs = [
  {
    q: "How fast will my order dispatch from the warehouse?",
    a: "All in-stock drop orders placed before 2:00 PM IST dispatch the same business day. Delivery across major Indian metros takes 24 to 48 hours, and 3 to 4 business days for all other tier-2/3 pincodes.",
  },
  {
    q: "How does the 14-day reverse doorstep exchange work?",
    a: "If the size or silhouette isn't exactly how you like it, simply contact our concierge team or WhatsApp with your Order ID. We arrange an automated free doorstep reverse pickup and dispatch your replacement size simultaneously.",
  },
  {
    q: "Are all garments true 280+ GSM heavyweight cotton?",
    a: "Yes. Every tee and hoodie in our archive is crafted from 280 to 400 GSM 100% combed ring-spun organic cotton. Pre-shrunk and bio-enzyme washed so that the fabric maintains its sharp, structured boxy drape.",
  },
  {
    q: "Do you offer Cash on Delivery (COD) across India?",
    a: "Yes, COD is active across 26,000+ Indian pincodes. You can also pay seamlessly online via UPI, Credit/Debit Cards, and Net Banking.",
  },
  {
    q: "What are the recommended care instructions for high-density prints?",
    a: "Wash inside-out in cold water using gentle cycle detergent. Do not bleach or tumble dry on high heat. Iron on reverse side of prints to preserve archival pigment crispness.",
  },
];

const Contact = () => {
  const { addToast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    orderId: "",
    subject: "Order Tracking & Dispatch",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      addToast("Inquiry logged! Our streetwear concierge will reply within 2 business hours.", "success");
      setFormData({
        name: "",
        email: "",
        orderId: "",
        subject: "Order Tracking & Dispatch",
        message: "",
      });
    }, 700);
  };

  return (
    <div className="min-h-screen bg-[var(--color-bg)] py-8 sm:py-14 px-4 sm:px-6 lg:px-8 pb-24">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Top Header & Breadcrumb */}
        <div className="flex flex-col items-start gap-4">
          <BackButton fallbackPath="/" className="rounded-none border-neutral-300 hover:border-black" />
          
          <div className="w-full text-center max-w-3xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-2 rounded-none bg-neutral-950 text-white px-3.5 py-1 text-xs font-mono font-bold uppercase tracking-widest">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span>CLIENT CONCIERGE DESK</span>
            </div>
            
            <h1
              className="text-3xl sm:text-5xl md:text-6xl font-black uppercase tracking-tight text-neutral-950 leading-tight"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              GET IN <span className="text-[var(--color-primary)]">TOUCH</span>
            </h1>

            <p className="text-xs sm:text-sm text-neutral-600 font-mono max-w-xl mx-auto leading-relaxed">
              Have questions regarding an exclusive drop, size advice, or reverse exchange? Our Mumbai crew responds in real time.
            </p>
          </div>
        </div>

        {/* 4 Direct Contact Bento Channels */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* WhatsApp VIP */}
          <a
            href="https://wa.me/919876543210"
            target="_blank"
            rel="noreferrer"
            className="flex items-start gap-4 p-5 rounded-none bg-white border border-neutral-300 shadow-2xs hover:border-neutral-950 hover:shadow-xs transition-all group cursor-pointer"
          >
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-none bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
              <MessageSquare size={19} />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] font-mono font-black uppercase tracking-wider text-neutral-400">INSTANT CHAT</p>
              <p className="text-sm font-black font-mono text-neutral-950 mt-0.5">WhatsApp VIP</p>
              <p className="text-xs font-mono text-neutral-600 mt-1 truncate">+91 98765 43210</p>
            </div>
          </a>

          {/* Email Concierge */}
          <a
            href="mailto:support@genzstore.com"
            className="flex items-start gap-4 p-5 rounded-none bg-white border border-neutral-300 shadow-2xs hover:border-neutral-950 hover:shadow-xs transition-all group cursor-pointer"
          >
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-none bg-sky-50 text-sky-600 group-hover:bg-sky-600 group-hover:text-white transition-colors">
              <Mail size={19} />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] font-mono font-black uppercase tracking-wider text-neutral-400">EMAIL SUPPORT</p>
              <p className="text-sm font-black font-mono text-neutral-950 mt-0.5">Concierge Desk</p>
              <p className="text-xs font-mono text-neutral-600 mt-1 truncate">support@genzstore.com</p>
            </div>
          </a>

          {/* Studio Flagship */}
          <div className="flex items-start gap-4 p-5 rounded-none bg-white border border-neutral-300 shadow-2xs">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-none bg-amber-50 text-amber-600">
              <MapPin size={19} />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] font-mono font-black uppercase tracking-wider text-neutral-400">STUDIO ARCHIVE</p>
              <p className="text-sm font-black font-mono text-neutral-950 mt-0.5">Bandra West, Mumbai</p>
              <p className="text-xs font-mono text-neutral-600 mt-1 truncate">Linking Road, 400050</p>
            </div>
          </div>

          {/* 14-Day Exchange Desk */}
          <div className="flex items-start gap-4 p-5 rounded-none bg-white border border-neutral-300 shadow-2xs">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-none bg-[var(--color-primary)]/10 text-[var(--color-primary)]">
              <RotateCcw size={19} />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] font-mono font-black uppercase tracking-wider text-neutral-400">REVERSE DISPATCH</p>
              <p className="text-sm font-black font-mono text-neutral-950 mt-0.5">14-Day Exchanges</p>
              <p className="text-xs font-mono text-neutral-600 mt-1 truncate">Doorstep Pickup Service</p>
            </div>
          </div>
        </div>

        {/* Main Section: Interactive Form + Studio Logistics */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Inquiry Form (7 Columns) */}
          <div className="lg:col-span-7 bg-white rounded-none p-6 sm:p-10 border border-neutral-300 shadow-xs space-y-6">
            <div>
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[var(--color-primary)]">DIRECT DISPATCH INQUIRY</span>
              <h2
                className="text-xl sm:text-2xl md:text-3xl font-black uppercase text-neutral-950 tracking-tight mt-1"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                Send Us A Message
              </h2>
              <p className="text-xs font-mono text-neutral-500 mt-1">
                Fill in your order information below. Our team responds within 2 hours.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono font-bold uppercase tracking-wider text-neutral-800 mb-1.5">
                    Your Full Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Kabir Sen"
                    className="w-full rounded-none border border-neutral-300 bg-neutral-50 px-4 py-3 text-xs font-mono font-bold text-neutral-900 focus:border-neutral-950 focus:bg-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono font-bold uppercase tracking-wider text-neutral-800 mb-1.5">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="kabir@example.com"
                    className="w-full rounded-none border border-neutral-300 bg-neutral-50 px-4 py-3 text-xs font-mono font-bold text-neutral-900 focus:border-neutral-950 focus:bg-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono font-bold uppercase tracking-wider text-neutral-800 mb-1.5">
                    Order ID (Optional)
                  </label>
                  <input
                    type="text"
                    name="orderId"
                    value={formData.orderId}
                    onChange={handleChange}
                    placeholder="e.g. GNZ-89240"
                    className="w-full rounded-none border border-neutral-300 bg-neutral-50 px-4 py-3 text-xs font-mono font-bold text-neutral-900 focus:border-neutral-950 focus:bg-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono font-bold uppercase tracking-wider text-neutral-800 mb-1.5">
                    Subject Topic
                  </label>
                  <select
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full rounded-none border border-neutral-300 bg-neutral-50 px-4 py-3 text-xs font-mono font-bold text-neutral-900 focus:border-neutral-950 focus:bg-white focus:outline-none cursor-pointer"
                  >
                    <option>Order Tracking & Dispatch</option>
                    <option>14-Day Size Exchange</option>
                    <option>Product Fit & GSM Advice</option>
                    <option>Payment & COD Query</option>
                    <option>Wholesale & Collaborations</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono font-bold uppercase tracking-wider text-neutral-800 mb-1.5">
                  Message Description *
                </label>
                <textarea
                  name="message"
                  required
                  rows={5}
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Detail your inquiry or size exchange specifications..."
                  className="w-full rounded-none border border-neutral-300 bg-neutral-50 px-4 py-3 text-xs font-mono text-neutral-900 focus:border-neutral-950 focus:bg-white focus:outline-none resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full h-12 rounded-none bg-neutral-950 hover:bg-black text-white text-xs font-mono font-black uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs disabled:opacity-50"
              >
                {loading ? (
                  <span>TRANSMITTING MESSAGE...</span>
                ) : (
                  <>
                    <Send size={14} />
                    <span>TRANSMIT INQUIRY</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Logistics & Studio Desk (5 Columns) */}
          <div className="lg:col-span-5 space-y-5">
            {/* Operating Hours Card */}
            <div className="bg-[#0D0D11] text-white rounded-none p-6 sm:p-8 border border-neutral-800 space-y-5">
              <div className="flex items-center justify-between border-b border-neutral-800 pb-4">
                <div className="flex items-center gap-2">
                  <Clock size={16} className="text-[var(--color-primary)]" />
                  <span className="text-xs font-mono font-black uppercase tracking-wider">Studio Operating Hours</span>
                </div>
                <span className="flex items-center gap-1.5 text-[10px] font-mono text-emerald-400 font-bold">
                  <span className="inline-block h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Active Now</span>
                </span>
              </div>

              <div className="space-y-3 font-mono text-xs">
                <div className="flex justify-between items-center text-neutral-300">
                  <span>Monday - Saturday</span>
                  <span className="font-bold text-white">10:00 AM - 9:00 PM IST</span>
                </div>
                <div className="flex justify-between items-center text-neutral-300">
                  <span>Sunday Desk</span>
                  <span className="font-bold text-white">11:00 AM - 6:00 PM IST</span>
                </div>
                <div className="flex justify-between items-center text-neutral-300">
                  <span>Dispatch Cutoff</span>
                  <span className="font-bold text-[var(--color-primary)]">2:00 PM Daily</span>
                </div>
              </div>

              <div className="pt-2 border-t border-neutral-800 space-y-2 text-[11px] font-mono text-neutral-400">
                <p className="flex items-center gap-2">
                  <Check size={13} className="text-emerald-400 shrink-0" />
                  <span>Same-day dispatch for in-stock drops</span>
                </p>
                <p className="flex items-center gap-2">
                  <Check size={13} className="text-emerald-400 shrink-0" />
                  <span>Reverse doorstep pickup across 26,000+ pincodes</span>
                </p>
                <p className="flex items-center gap-2">
                  <Check size={13} className="text-emerald-400 shrink-0" />
                  <span>Zero restocking fees on size swaps</span>
                </p>
              </div>
            </div>

            {/* Quick WhatsApp Card */}
            <div className="bg-emerald-950/20 border border-emerald-900/40 p-6 rounded-none space-y-3">
              <div className="flex items-center gap-2">
                <Zap size={16} className="text-emerald-500" />
                <span className="text-xs font-mono font-black uppercase tracking-wider text-emerald-400">Fastest Resolution Channel</span>
              </div>
              <p className="text-xs font-mono text-neutral-700 leading-relaxed">
                Need instantaneous order tracking or sizing assistance before checking out? Ping our WhatsApp line directly for under-5-minute response times.
              </p>
              <a
                href="https://wa.me/919876543210"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 text-xs font-mono font-black uppercase tracking-wider text-emerald-700 hover:text-emerald-800 transition-colors"
              >
                <span>Launch WhatsApp Hotline</span>
                <ArrowRight size={13} />
              </a>
            </div>
          </div>

        </div>

        {/* Streetwear FAQ Accordion Module */}
        <div className="bg-white rounded-none p-6 sm:p-10 border border-neutral-300 shadow-xs space-y-6">
          <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-[var(--color-primary)]">
            <HelpCircle size={15} />
            <span>KNOWLEDGE BASE & FAQS</span>
          </div>

          <div>
            <h2
              className="text-xl sm:text-2xl md:text-3xl font-black uppercase text-neutral-950 tracking-tight"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Frequently Asked Questions
            </h2>
            <p className="text-xs font-mono text-neutral-500 mt-1">
              Quick answers regarding dispatch, fabric density, reverse pickups, and care.
            </p>
          </div>

          <div className="divide-y divide-neutral-200 border-t border-neutral-200">
            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div key={idx} className="py-4">
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full flex items-center justify-between text-left gap-4 cursor-pointer"
                  >
                    <span className="text-xs sm:text-sm font-mono font-black uppercase text-neutral-950">
                      {faq.q}
                    </span>
                    <span className={`p-1 rounded-none border border-neutral-300 text-neutral-700 transition-transform duration-200 shrink-0 ${isOpen ? "rotate-180 bg-neutral-950 text-white border-neutral-950" : "bg-neutral-50"}`}>
                      <ChevronDown size={14} />
                    </span>
                  </button>

                  {isOpen && (
                    <div className="pt-3 text-xs font-mono text-neutral-600 leading-relaxed pr-6 animate-in fade-in">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Contact;
