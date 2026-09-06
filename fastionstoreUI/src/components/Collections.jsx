import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { fetchAllCollections } from "../services/collectionService";

const defaultCollectionData = [
  {
    _id: "cargos",
    name: "Cargos & Baggy Pants",
    subtitle: "Relaxed Fit Cargos",
    image: "/collections/baggy_pants.png",
    link: "/collections/cargos",
    colSpan: "md:col-span-8",
    height: "h-[350px] md:h-[500px]",
  },
  {
    _id: "oversized-tees",
    name: "Oversized Tees",
    subtitle: "Relaxed Fit",
    image: "/collections/oversized_tees.png",
    link: "/collections/oversized-tees",
    colSpan: "md:col-span-4",
    height: "h-[350px] md:h-[500px]",
  },
  {
    _id: "men",
    name: "Men's Core",
    subtitle: "Modern Tailoring",
    image: "https://images.unsplash.com/photo-1490578474895-699cd4e2cf59?auto=format&fit=crop&q=80",
    link: "/collections/men",
    colSpan: "md:col-span-6",
    height: "h-[300px] md:h-[400px]",
  },
  {
    _id: "women",
    name: "Women's Edit",
    subtitle: "The New Elegance",
    image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80",
    link: "/collections/women",
    colSpan: "md:col-span-6",
    height: "h-[300px] md:h-[400px]",
  },
];

const Collections = () => {
  const [collectionData, setCollectionData] = useState(defaultCollectionData);

  useEffect(() => {
    const loadCollections = async () => {
      try {
        const data = await fetchAllCollections();
        if (data && data.length > 0) {
          setCollectionData(data);
        }
      } catch (err) {
        console.error("Failed to fetch dynamic collections for grid:", err);
      }
    };
    loadCollections();
  }, []);

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
<<<<<<< HEAD
            <h2 className="text-2xl sm:text-4xl md:text-5xl font-black text-[var(--color-text)] tracking-tight uppercase break-words" style={{ fontFamily: "var(--font-heading)" }}>
              Shop By <span className="text-outline-primary ml-1">Collection</span>
=======
            <h2 className="text-4xl md:text-5xl font-black text-[var(--color-text)] tracking-tight uppercase" style={{ fontFamily: "var(--font-heading)" }}>
              Shop By <span className="text-[var(--color-primary)]">Collection</span>
>>>>>>> 7081665a6d106e8c80164200e2652d9cda3ac5f8
            </h2>
          </div>
          
          <p className="text-[var(--color-text-muted)] max-w-sm text-sm" style={{ fontFamily: "var(--font-body)" }}>
            Explore our meticulously crafted collections designed to elevate your everyday wardrobe. 
          </p>
        </div>

        {/* Dynamic Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {collectionData.map((item, index) => (
            <Link
              key={item._id || index}
              to={item.link || `/collections/${item.slug || ''}`}
              className={`group relative overflow-hidden rounded-2xl block ${item.colSpan || (index % 3 === 0 ? 'md:col-span-8' : 'md:col-span-4')} ${item.height || 'h-[350px] md:h-[450px]'} bg-[var(--color-surface)]`}
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
                  {item.subtitle && (
                    <p className="text-white/80 text-sm font-bold tracking-[0.2em] uppercase mb-2">
                      {item.subtitle}
                    </p>
                  )}
                  
                  {/* Title with solid typography */}
<<<<<<< HEAD
                  <h3 className="text-2xl sm:text-3xl md:text-5xl font-black text-white uppercase mb-6 tracking-tight break-words" style={{ fontFamily: "var(--font-heading)" }}>
=======
                  <h3 className="text-3xl md:text-5xl font-black text-white uppercase mb-6 tracking-tight" style={{ fontFamily: "var(--font-heading)" }}>
>>>>>>> 7081665a6d106e8c80164200e2652d9cda3ac5f8
                    {item.name || item.title}
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
