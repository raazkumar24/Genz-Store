import React, { useState } from "react";
import { 
  MapPin, Mail, Send, MessageSquare, Clock, 
  ChevronDown, CheckCircle2, Zap
} from "lucide-react";
import { Button, BackButton } from "../components/ui";
import { useToast } from "../context/ToastContext";

const faqs = [
  {
    q: "How fast will my order dispatch?",
    a: "All in-stock drop orders placed before 2:00 PM IST dispatch the same business day. Delivery across major metro cities takes 24 to 48 hours, and 3 to 4 days for rest of India.",
  },
  {
    q: "How do 14-day doorstep exchanges work?",
    a: "If the size doesn't fit your desired streetwear silhouette, simply contact our concierge team or WhatsApp with your Order ID. We arrange a free doorstep reverse pickup and courier your replacement size immediately.",
  },
  {
    q: "Are the fabrics really 280+ GSM heavyweight cotton?",
    a: "Yes! Every Genz Store tee and hoodie is engineered with 280 to 380 GSM combed pure organic cotton. Pre-shrunk and bio-washed for lasting structural drape that won't fade or warp.",
  },
  {
    q: "Do you offer Cash on Delivery (COD)?",
    a: "Yes, COD is available across 26,000+ pincodes in India. You can also pay seamlessly online via UPI, Credit/Debit Cards, and Net Banking.",
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
      addToast("Message received! Our streetwear concierge will reply within 2 hours.", "success");
      setFormData({
        name: "",
        email: "",
        orderId: "",
        subject: "Order Tracking & Dispatch",
        message: "",
      });
    }, 800);
  };

  return (
    <div className="min-h-screen bg-[var(--color-bg)] py-8 md:py-14 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Back Button & Header */}
        <div className="flex flex-col items-start gap-4">
          <BackButton />
          
          <div className="w-full text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 rounded-full bg-neutral-900 text-white px-3.5 py-1 text-xs font-black uppercase tracking-widest mb-3">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--color-primary)] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--color-primary)]"></span>
              </span>
              24/7 Streetwear Concierge
            </div>
            
            <h1
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black uppercase tracking-tight text-neutral-900 leading-tight break-words max-w-full"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Get In <span className="text-outline-primary ml-1">Touch</span>
            </h1>
            <p className="mt-3 text-sm md:text-base text-neutral-600 font-medium max-w-xl mx-auto">
              Questions about an exclusive drop, size advice, or doorstep exchange? Our crew is ready to assist.
            </p>
          </div>
        </div>

        {/* 4 Quick Direct Contact Channels */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* WhatsApp */}
          <a
            href="https://wa.me/919876543210"
            target="_blank"
            rel="noreferrer"
            className="flex items-start gap-4 p-5 rounded-3xl bg-white border border-neutral-200/80 shadow-2xs hover:border-neutral-900 transition-all group cursor-pointer"
          >
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
              <MessageSquare size={20} />
            </div>
            <div>
              <p className="text-xs font-black uppercase tracking-wider text-neutral-400">Instant Chat</p>
              <p className="text-sm font-bold text-neutral-900 mt-0.5">WhatsApp VIP</p>
              <p className="text-xs text-neutral-500 mt-1">+91 98765 43210</p>
            </div>
          </a>

          {/* Email */}
          <a
            href="mailto:support@genzstore.com"
            className="flex items-start gap-4 p-5 rounded-3xl bg-white border border-neutral-200/80 shadow-2xs hover:border-neutral-900 transition-all group cursor-pointer"
          >
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-sky-50 text-sky-600 group-hover:bg-sky-600 group-hover:text-white transition-colors">
              <Mail size={20} />
            </div>
            <div>
              <p className="text-xs font-black uppercase tracking-wider text-neutral-400">Email Support</p>
              <p className="text-sm font-bold text-neutral-900 mt-0.5">Concierge Desk</p>
              <p className="text-xs text-neutral-500 mt-1">support@genzstore.com</p>
            </div>
          </a>

          {/* Studio Flagship */}
          <div className="flex items-start gap-4 p-5 rounded-3xl bg-white border border-neutral-200/80 shadow-2xs">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-orange-50 text-orange-600">
              <MapPin size={20} />
            </div>
            <div>
              <p className="text-xs font-black uppercase tracking-wider text-neutral-400">Studio & HQ</p>
              <p className="text-sm font-bold text-neutral-900 mt-0.5">Bandra West, Mumbai</p>
              <p className="text-xs text-neutral-500 mt-1">Linking Road 400050</p>
            </div>
          </div>

          {/* Instagram Concierge */}
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noreferrer"
            className="flex items-start gap-4 p-5 rounded-3xl bg-white border border-neutral-200/80 shadow-2xs hover:border-neutral-900 transition-all group cursor-pointer"
          >
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-pink-50 text-pink-600 group-hover:bg-pink-600 group-hover:text-white transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-instagram" viewBox="0 0 16 16">
  <path d="M8 0C5.829 0 5.556.01 4.703.048 3.85.088 3.269.222 2.76.42a3.9 3.9 0 0 0-1.417.923A3.9 3.9 0 0 0 .42 2.76C.222 3.268.087 3.85.048 4.7.01 5.555 0 5.827 0 8.001c0 2.172.01 2.444.048 3.297.04.852.174 1.433.372 1.942.205.526.478.972.923 1.417.444.445.89.719 1.416.923.51.198 1.09.333 1.942.372C5.555 15.99 5.827 16 8 16s2.444-.01 3.298-.048c.851-.04 1.434-.174 1.943-.372a3.9 3.9 0 0 0 1.416-.923c.445-.445.718-.891.923-1.417.197-.509.332-1.09.372-1.942C15.99 10.445 16 10.173 16 8s-.01-2.445-.048-3.299c-.04-.851-.175-1.433-.372-1.941a3.9 3.9 0 0 0-.923-1.417A3.9 3.9 0 0 0 13.24.42c-.51-.198-1.092-.333-1.943-.372C10.443.01 10.172 0 7.998 0zm-.717 1.442h.718c2.136 0 2.389.007 3.232.046.78.035 1.204.166 1.486.275.373.145.64.319.92.599s.453.546.598.92c.11.281.24.705.275 1.485.039.843.047 1.096.047 3.231s-.008 2.389-.047 3.232c-.035.78-.166 1.203-.275 1.485a2.5 2.5 0 0 1-.599.919c-.28.28-.546.453-.92.598-.28.11-.704.24-1.485.276-.843.038-1.096.047-3.232.047s-2.39-.009-3.233-.047c-.78-.036-1.203-.166-1.485-.276a2.5 2.5 0 0 1-.92-.598 2.5 2.5 0 0 1-.6-.92c-.109-.281-.24-.705-.275-1.485-.038-.843-.046-1.096-.046-3.233s.008-2.388.046-3.231c.036-.78.166-1.204.276-1.486.145-.373.319-.64.599-.92s.546-.453.92-.598c.282-.11.705-.24 1.485-.276.738-.034 1.024-.044 2.515-.045zm4.988 1.328a.96.96 0 1 0 0 1.92.96.96 0 0 0 0-1.92m-4.27 1.122a4.109 4.109 0 1 0 0 8.217 4.109 4.109 0 0 0 0-8.217m0 1.441a2.667 2.667 0 1 1 0 5.334 2.667 2.667 0 0 1 0-5.334"/>
</svg>
            </div>
            <div>
              <p className="text-xs font-black uppercase tracking-wider text-neutral-400">Community</p>
              <p className="text-sm font-bold text-neutral-900 mt-0.5">Instagram DMs</p>
              <p className="text-xs text-neutral-500 mt-1">@genzstore.drops</p>
            </div>
          </a>
        </div>

        {/* Main Grid: Contact Form + Hours / Info */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Contact Form (7 Cols) */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-10 border border-neutral-200/80 shadow-xs">
            <h2
              className="text-2xl font-black uppercase text-neutral-900 mb-2 tracking-tight"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Send Us a <span className="text-[var(--color-primary)]">Message</span>
            </h2>
            <p className="text-xs text-neutral-500 mb-8 font-medium">
              Fill out the details below. We typically respond within 2 to 4 business hours.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-neutral-700 mb-1.5">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Kabir Sen"
                    className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-xs font-semibold text-neutral-900 focus:border-neutral-900 focus:bg-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-neutral-700 mb-1.5">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="kabir@example.com"
                    className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-xs font-semibold text-neutral-900 focus:border-neutral-900 focus:bg-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-neutral-700 mb-1.5">
                    Order ID (Optional)
                  </label>
                  <input
                    type="text"
                    name="orderId"
                    value={formData.orderId}
                    onChange={handleChange}
                    placeholder="e.g. #GZ-8921"
                    className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-xs font-semibold text-neutral-900 focus:border-neutral-900 focus:bg-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-neutral-700 mb-1.5">
                    Subject Topic *
                  </label>
                  <select
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-xs font-bold text-neutral-900 focus:border-neutral-900 focus:bg-white focus:outline-none"
                  >
                    <option value="Order Tracking & Dispatch">Order Tracking & Dispatch</option>
                    <option value="Size Exchange & Return Request">Size Exchange & Return Request</option>
                    <option value="Product & Fabric Sizing Advice">Product & Fabric Sizing Advice</option>
                    <option value="Brand Collaborations & Wholesale">Brand Collaborations & Wholesale</option>
                    <option value="Other Inquiries">Other Inquiries</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-neutral-700 mb-1.5">
                  Message *
                </label>
                <textarea
                  name="message"
                  required
                  rows={4}
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Tell us what you need help with..."
                  className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-xs font-semibold text-neutral-900 focus:border-neutral-900 focus:bg-white focus:outline-none resize-none"
                ></textarea>
              </div>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                loading={loading}
                className="w-full sm:w-auto px-8 text-xs font-black uppercase tracking-wider shadow-md"
                icon={<Send size={15} />}
              >
                Send Message
              </Button>
            </form>
          </div>

          {/* Support Guarantee & Operating Hours (5 Cols) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Hours Box */}
            <div className="rounded-3xl bg-neutral-900 text-white p-6 sm:p-8 shadow-sm space-y-4">
              <div className="flex items-center gap-2">
                <Clock size={18} className="text-[var(--color-primary)]" />
                <h3 className="text-base font-black uppercase tracking-wide">Concierge Hours</h3>
              </div>
              <div className="space-y-2 text-xs text-neutral-300">
                <div className="flex justify-between py-1 border-b border-neutral-800">
                  <span className="font-semibold text-neutral-400">Monday – Saturday</span>
                  <span className="font-bold text-white">9:00 AM – 9:00 PM IST</span>
                </div>
                <div className="flex justify-between py-1 border-b border-neutral-800">
                  <span className="font-semibold text-neutral-400">Sunday</span>
                  <span className="font-bold text-white">10:00 AM – 6:00 PM IST</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="font-semibold text-neutral-400">WhatsApp Dispatch</span>
                  <span className="font-bold text-emerald-400">Active Now ⚡</span>
                </div>
              </div>
            </div>

            {/* Our Streetwear Promise */}
            <div className="rounded-3xl bg-white border border-neutral-200/80 p-6 sm:p-8 space-y-4 shadow-2xs">
              <div className="flex items-center gap-2">
                <Zap size={18} className="text-[var(--color-primary)]" />
                <h3 className="text-base font-black uppercase tracking-wide text-neutral-900">Our Streetwear Promise</h3>
              </div>
              
              <ul className="space-y-3 text-xs text-neutral-600 font-medium">
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />
                  <span><strong>14-Day Free Exchange</strong> with reverse doorstep courier pickup.</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />
                  <span><strong>Fast Dispatch</strong> within 24 to 48 business hours.</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />
                  <span><strong>100% Authentic</strong> heavyweight 280+ GSM combed cotton.</span>
                </li>
              </ul>
            </div>

          </div>

        </div>

        {/* Streetwear FAQ Section */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-neutral-200/80 shadow-xs">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <h2
              className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-neutral-900"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Frequently Asked <span className="text-[var(--color-primary)]">Questions</span>
            </h2>
            <p className="text-xs text-neutral-500 mt-1 font-medium">Quick answers to standard drop inquiries</p>
          </div>

          <div className="max-w-3xl mx-auto space-y-3">
            {faqs.map((faq, index) => {
              const isOpen = openFaq === index;
              return (
                <div
                  key={index}
                  className="rounded-2xl border border-neutral-200/80 overflow-hidden transition-all bg-neutral-50/50"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : index)}
                    className="w-full flex items-center justify-between p-4 sm:p-5 text-left text-xs sm:text-sm font-black uppercase tracking-wider text-neutral-900 hover:text-[var(--color-primary)] transition cursor-pointer"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown
                      size={18}
                      className={`shrink-0 text-neutral-400 transition-transform duration-200 ${
                        isOpen ? "rotate-180 text-[var(--color-primary)]" : ""
                      }`}
                    />
                  </button>

                  {isOpen && (
                    <div className="px-4 sm:px-5 pb-5 text-xs text-neutral-600 leading-relaxed border-t border-neutral-100 pt-3">
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
