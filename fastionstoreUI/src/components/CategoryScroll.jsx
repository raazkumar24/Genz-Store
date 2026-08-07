import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { fetchAllCollections } from "../services/collectionService";

const defaultCategories = [
  {
    name: "Oversized Tees",
    image: "/models/model1.png", 
    link: "/collections/oversized-tees",
    bgColor: "bg-[#e0f2fe]",
  },
  {
    name: "Hoodies",
    image: "/models/model3.png",
    link: "/collections/hoodies",
    bgColor: "bg-[#ffedd5]",
  },
  {
    name: "Cargos",
    image: "/collections/baggy_pants.png",
    link: "/collections/cargos",
    bgColor: "bg-[#f1f5f9]",
  },
  {
    name: "Menswear",
    image: "https://images.unsplash.com/photo-1490578474895-699cd4e2cf59?auto=format&fit=crop&q=80",
    link: "/collections/men",
    bgColor: "bg-[#f3e8ff]",
  },
  {
    name: "Womenswear",
    image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80",
    link: "/collections/women",
    bgColor: "bg-[#ffe4e6]",
  }
];

/**
 * CategoryScroll Component
 * Dynamic horizontal scrollable list of collection categories.
 */
const CategoryScroll = () => {
  const [categories, setCategories] = useState(defaultCategories);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await fetchAllCollections();
        if (data && data.length > 0) {
          setCategories(data);
        }
      } catch (err) {
        console.error("Failed to fetch dynamic categories for CategoryScroll:", err);
      }
    };
    loadCategories();
  }, []);

  return (
    <div className="w-full bg-[var(--color-bg)] py-6 md:py-10 border-b border-[var(--color-border)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Horizontal scroll container */}
        <div className="flex overflow-x-auto gap-4 md:gap-8 lg:gap-12 pb-6 pt-6 hide-scrollbar snap-x snap-mandatory lg:justify-center">
          {categories.map((category, index) => (
            <Link
              key={category._id || index}
              to={category.link || `/collections/${category.slug || ''}`}
              className="flex flex-col items-center gap-3 min-w-[90px] md:min-w-[140px] lg:min-w-[160px] snap-start group"
            >
              {/* Arched Image Container */}
              <div
                className={`relative w-[85px] h-[100px] md:w-[140px] md:h-[180px] lg:w-[160px] lg:h-[200px] rounded-t-[50px] md:rounded-t-[80px] rounded-b-xl md:rounded-b-2xl overflow-hidden flex items-center justify-center transition-all duration-300 group-hover:-translate-y-2 ring-2 ring-transparent group-hover:ring-[var(--color-primary)] group-hover:ring-offset-4 group-hover:ring-offset-[var(--color-bg)] ${category.bgColor || 'bg-gray-100'}`}
              >
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80";
                  }}
                />
              </div>

              {/* Category Name */}
              <span className="mt-1 text-[11px] md:text-sm lg:text-base font-bold text-center text-gray-800 uppercase tracking-wider leading-tight w-full truncate px-2 group-hover:text-[var(--color-primary)] transition-colors duration-300">
                {category.name}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategoryScroll;
