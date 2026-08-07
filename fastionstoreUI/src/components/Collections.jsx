import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const Collections = () => {
  const collectionData = [
    {
      id: "cargos",
      title: "Cargos & Baggy Pants",
      subtitle: "Relaxed Fit Cargos",
      image: "/collections/baggy_pants.png",
      link: "/collections/cargos",
      colSpan: "md:col-span-8",
      height: "h-[350px] md:h-[500px]",
    },
    {
      id: "oversized-tees",
      title: "Oversized Tees",
      subtitle: "Relaxed Fit",
      image: "/collections/oversized_tees.png",
      link: "/collections/oversized-tees",
      colSpan: "md:col-span-4",
      height: "h-[350px] md:h-[500px]",
    },
    {
      id: "men",
      title: "Men's Core",
      subtitle: "Modern Tailoring",
      image: "https://images.unsplash.com/photo-1490578474895-699cd4e2cf59?auto=format&fit=crop&q=80",
      link: "/collections/men",
      colSpan: "md:col-span-6",
      height: "h-[300px] md:h-[400px]",
    },
    {
      id: "women",
      title: "Women's Edit",
      subtitle: "The New Elegance",
      image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80",
      link: "/collections/women",
      colSpan: "md:col-span-6",
      height: "h-[300px] md:h-[400px]",
    },
  ];

  return (
    <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 bg-[var(--color-bg)] overflow-hidden border-y border-[var(--color-border)]">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Area styled like Featured Drops */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-[var(--color-text)]/10 bg-[var(--color-surface)] px-4 py-1.5 text-xs font-black uppercase tracking-[0.2em] text-[var(--color-text)] mb-4">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--color-primary)] opacity-40"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-[var(--color-primary)]"></span>
              </span>
              Curated For You
            </span>
            <h2 className="text-4xl md:text-5xl font-black text-[var(--color-text)] tracking-tight uppercase" style={{ fontFamily: "var(--font-heading)" }}>
              Shop By <span className="text-transparent" style={{ WebkitTextStroke: '1px var(--color-text)' }}>Collection</span>
            </h2>
          </div>
          
          <p className="text-[var(--color-text-muted)] max-w-sm text-sm" style={{ fontFamily: "var(--font-body)" }}>
            Explore our meticulously crafted collections designed to elevate your everyday wardrobe. 
          </p>
        </div>

        {/* Dynamic Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {collectionData.map((item) => (
            <Link
              key={item.id}
              to={item.link}
              className={`group relative overflow-hidden rounded-2xl block ${item.colSpan} ${item.height} bg-[var(--color-surface)]`}
            >
              {/* Image with zoom effect */}
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] group-hover:scale-105"
                style={{ backgroundImage: `url(${item.image})` }}
              />
              
              {/* Gradient Overlay for text readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500" />
              
              {/* Content block */}
              <div className="absolute inset-0 p-8 md:p-12 flex flex-col justify-end">
                <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 ease-out">
                  <p className="text-white/80 text-sm font-bold tracking-[0.2em] uppercase mb-2">
                    {item.subtitle}
                  </p>
                  
                  {/* Title with stroke effect on hover */}
                  <h3 className="text-4xl md:text-6xl font-black text-white uppercase mb-6 transition-all duration-500 group-hover:text-transparent" style={{ fontFamily: "var(--font-heading)", WebkitTextStroke: '1px white' }}>
                    {item.title}
                  </h3>
                  
                  {/* Animated Button */}
                  <div className="inline-flex items-center gap-3 text-white font-bold uppercase tracking-wider text-sm bg-white/10 backdrop-blur-md border border-white/20 px-6 py-3 rounded-full hover:bg-white hover:text-black transition-colors duration-300">
                    Explore <ArrowRight size={16} />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Collections;
