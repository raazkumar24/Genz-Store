import React from "react";
import { Link } from "react-router-dom";
import { Button } from "./ui";
import SocialIcon from "./SocialIcon";

const Footer = () => {
  return (
    <footer className="bg-[#111111] text-white pt-16 pb-8 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          
          {/* Brand & Description */}
          <div className="space-y-6">
            <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight" style={{ fontFamily: "var(--font-heading)" }}>
              GENZ<span className="text-[var(--color-primary)]">STORE</span>
            </h2>
            <p className="text-gray-400 text-sm leading-relaxed" style={{ fontFamily: "var(--font-body)" }}>
              Elevate your style with our premium collection of apparel. Designed for the modern trendsetter, crafted with uncompromising quality.
            </p>
            <div className="flex gap-4">
              <SocialIcon platform="facebook" href="#" variant="glass" />
              <SocialIcon platform="twitter" href="#" variant="glass" />
              <SocialIcon platform="instagram" href="#" variant="glass" />
              <SocialIcon platform="linkedin" href="#" variant="glass" />
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold mb-6 uppercase tracking-wider" style={{ fontFamily: "var(--font-heading)" }}>Quick Links</h3>
            <ul className="space-y-4">
              <li><Link to="/new-arrivals" className="text-gray-400 hover:text-white transition-colors text-sm">New Arrivals</Link></li>
              <li><Link to="/sale" className="text-gray-400 hover:text-white transition-colors text-sm">Sale & Offers</Link></li>
              <li><Link to="/collections/men" className="text-gray-400 hover:text-white transition-colors text-sm">Men's Collection</Link></li>
              <li><Link to="/collections/women" className="text-gray-400 hover:text-white transition-colors text-sm">Women's Collection</Link></li>
              <li><Link to="/about" className="text-gray-400 hover:text-white transition-colors text-sm">About Us</Link></li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="text-lg font-bold mb-6 uppercase tracking-wider" style={{ fontFamily: "var(--font-heading)" }}>Customer Care</h3>
            <ul className="space-y-4">
              <li><Link to="/contact" className="text-gray-400 hover:text-white transition-colors text-sm">Contact Us</Link></li>
              <li><Link to="#" className="text-gray-400 hover:text-white transition-colors text-sm">Shipping Policy</Link></li>
              <li><Link to="#" className="text-gray-400 hover:text-white transition-colors text-sm">Returns & Exchanges</Link></li>
              <li><Link to="#" className="text-gray-400 hover:text-white transition-colors text-sm">Size Guide</Link></li>
              <li><Link to="#" className="text-gray-400 hover:text-white transition-colors text-sm">FAQs</Link></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-lg font-bold mb-6 uppercase tracking-wider" style={{ fontFamily: "var(--font-heading)" }}>Stay in the loop</h3>
            <p className="text-gray-400 text-sm mb-4" style={{ fontFamily: "var(--font-body)" }}>
              Subscribe to get special offers, free giveaways, and once-in-a-lifetime deals.
            </p>
            <form className="flex flex-col gap-3" onSubmit={(e) => e.preventDefault()}>
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[var(--color-primary)] text-white"
                required
              />
              <Button type="submit" variant="primary" fullWidth className="py-3">
                Subscribe
              </Button>
            </form>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} FashionStore. All rights reserved.
          </p>
          <div className="flex items-center gap-6 text-gray-500 text-sm">
            <Link to="#" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link to="#" className="hover:text-white transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
