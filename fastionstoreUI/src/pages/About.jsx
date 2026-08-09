import React from 'react';
import { Button, BackButton } from '../components/ui';

const About = () => {
  return (
    <div className="min-h-screen bg-[var(--color-bg)]">
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-black text-white text-center overflow-hidden">
        <div className="relative z-20 max-w-7xl mx-auto flex mb-4">
          <BackButton variant="dark" />
        </div>
        <div className="absolute inset-0 opacity-40">
          <img 
            src="https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?auto=format&fit=crop&q=80" 
            alt="About us banner" 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="relative z-10 max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-black uppercase mb-6" style={{ fontFamily: 'var(--font-heading)' }}>
            Our <span className="text-transparent" style={{ WebkitTextStroke: '1px white' }}>Story</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-300 font-medium leading-relaxed">
            Redefining modern fashion with a blend of classic elegance and contemporary trends. We believe in quality, sustainability, and empowering your personal style.
          </p>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6 uppercase" style={{ fontFamily: 'var(--font-heading)' }}>
              Crafted With <span className="text-transparent" style={{ WebkitTextStroke: '1px #111' }}>Passion</span>
            </h2>
            <div className="space-y-4 text-gray-600 leading-relaxed text-lg" style={{ fontFamily: 'var(--font-body)' }}>
              <p>
                Founded in 2024, FashionStore began with a simple mission: to provide high-quality, fashionable clothing that makes you feel confident and comfortable. 
              </p>
              <p>
                We carefully source our materials from sustainable suppliers and work with skilled artisans to bring our designs to life. Every piece in our collection is thoughtfully created to stand the test of time, both in durability and style.
              </p>
              <p>
                Our vision is to become your go-to destination for everyday luxury. Whether you're dressing for a special occasion or looking for casual comfort, we have something perfect for you.
              </p>
            </div>
            <div className="mt-8">
              <Button to="/collections/all" variant="primary" size="lg">
                Explore Collections
              </Button>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <img 
              src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80" 
              alt="Fashion model" 
              className="rounded-2xl w-full h-64 object-cover mt-8"
            />
            <img 
              src="https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&q=80" 
              alt="Shopping bags" 
              className="rounded-2xl w-full h-64 object-cover"
            />
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="bg-gray-50 py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 uppercase" style={{ fontFamily: 'var(--font-heading)' }}>
            Our <span className="text-transparent" style={{ WebkitTextStroke: '1px #111' }}>Values</span>
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
              <h3 className="text-xl font-bold text-gray-900 mb-4" style={{ fontFamily: 'var(--font-heading)' }}>Quality First</h3>
              <p className="text-gray-600">We never compromise on the materials we use or the craftsmanship of our products.</p>
            </div>
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
              <h3 className="text-xl font-bold text-gray-900 mb-4" style={{ fontFamily: 'var(--font-heading)' }}>Sustainability</h3>
              <p className="text-gray-600">Committed to ethical manufacturing and reducing our environmental footprint.</p>
            </div>
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
              <h3 className="text-xl font-bold text-gray-900 mb-4" style={{ fontFamily: 'var(--font-heading)' }}>Customer Focus</h3>
              <p className="text-gray-600">Your satisfaction is our priority. We design with your comfort and style in mind.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
