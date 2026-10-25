import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, Sparkles } from "lucide-react";
import { fetchAllCollections } from "../services/collectionService";
import { useProducts } from "../context/ProductContext";

/**
 * Curated Streetwear Category Archetypes
 * Using local lookbook assets as default, and dynamic backend products when loaded.
 */
const defaultCategories = [
  {
    name: "Oversized Tees",
    tag: "280 GSM Boxy",
    image: "/models/model1.png",
    link: "/collections/oversized-tees",
    bgColor: "bg-[#eaf0ed]",
    categoryMatch: "tee",
  },
  {
    name: "Heavy Hoodies",
    tag: "380 GSM Fleece",
    image: "/models/model3.png",
    link: "/collections/hoodies",
    bgColor: "bg-[#f5ebd9]",
    categoryMatch: "hoodie",
  },
  {
    name: "Parachute Cargos",
    tag: "Multi-Pocket",
    image: "/collections/baggy_pants.png",
    link: "/collections/cargos",
    bgColor: "bg-[#e9eff5]",
    categoryMatch: "cargo",
  },
  {
    name: "Menswear Core",
    tag: "Drop Shoulder",
    image: "/models/model4.png",
    link: "/collections/men",
    bgColor: "bg-[#ede8f5]",
    categoryMatch: "men",
  },
  {
    name: "Womenswear Fits",
    tag: "Street Relaxed",
    image: "/models/model2.png",
    link: "/collections/women",
    bgColor: "bg-[#fcedf0]",
    categoryMatch: "women",
  },
];

/**
 * Senior Developer Note:
 * Category showcase designed as an editorial horizontal carousel with bento card aesthetics.
 * Automatically resolves dynamic product photos from backend database without any external links.
 */
const CategoryScroll = () => {
  const [categories, setCategories] = useState(defaultCategories);
  const { products } = useProducts();

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const response = await fetchAllCollections();

        let collections = [];
        if (Array.isArray(response)) {
          collections = response;
        } else if (Array.isArray(response?.collections)) {
          collections = response.collections;
        } else if (Array.isArray(response?.data)) {
          collections = response.data;
        } else if (Array.isArray(response?.data?.collections)) {
          collections = response.data.collections;
        }

        if (collections.length > 0) {
          const formattedCategories = collections.map((collection, index) => {
            const fallback = defaultCategories[index % defaultCategories.length];
            
            // Try to find a real matching product image from backend data
            let dynamicImg = collection.image || collection.thumbnail || collection.coverImage;
            if (!dynamicImg && products && products.length > 0) {
              const matchedProduct = products.find((p) => {
                const text = [p.name, ...(p.category || []), ...(p.collection || [])].join(" ").toLowerCase();
                return fallback.categoryMatch && text.includes(fallback.categoryMatch);
              });
              dynamicImg = matchedProduct?.variants?.[0]?.images?.[0] || matchedProduct?.image;
            }

            return {
              ...collection,
              name: collection.name || collection.title || fallback.name,
              tag: collection.tag || fallback.tag,
              image: dynamicImg || fallback.image,
              link: collection.link || `/collections/${collection.slug || collection._id}`,
              bgColor: collection.bgColor || fallback.bgColor,
            };
          });

          setCategories(formattedCategories);
        } else if (products && products.length > 0) {
          // If collections API returned empty, map default categories with live product images
          const liveMapped = defaultCategories.map((cat) => {
            const matched = products.find((p) => {
              const text = [p.name, ...(p.category || []), ...(p.collection || [])].join(" ").toLowerCase();
              return cat.categoryMatch && text.includes(cat.categoryMatch);
            });
            return {
              ...cat,
              image: matched?.variants?.[0]?.images?.[0] || matched?.image || cat.image,
            };
          });
          setCategories(liveMapped);
        }
      } catch (err) {
        setCategories(defaultCategories);
      }
    };

    loadCategories();
  }, [products]);

  return (
    <section className="w-full bg-[#F3F4F0] py-8 md:py-12 border-b border-neutral-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-neutral-900 text-white">
              <Sparkles size={12} className="text-[var(--color-primary)]" />
            </span>
            <h2 className="text-sm md:text-base font-black uppercase tracking-wider text-neutral-900">
              Curated Silhouettes
            </h2>
          </div>

          <span className="text-[11px] font-bold uppercase tracking-widest text-neutral-400">
            Swipe To Explore ➔
          </span>
        </div>

        {/* Horizontal Bento Cards Container */}
        <div className="flex overflow-x-auto gap-3.5 md:gap-5 pb-2 hide-scrollbar snap-x snap-mandatory lg:justify-between">
          {Array.isArray(categories) &&
            categories.map((category, index) => (
              <Link
                key={category._id || category.id || index}
                to={category.link || `/collections/${category.slug || ""}`}
                className="group relative flex-1 min-w-[140px] sm:min-w-[170px] md:min-w-[200px] snap-start bg-white rounded-[24px] border border-neutral-200/90 p-3 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 flex flex-col justify-between"
              >
                {/* Category Visual Arch Frame */}
                <div
                  className={`relative w-full aspect-[4/5] rounded-[18px] overflow-hidden flex items-center justify-center ${category.bgColor || "bg-neutral-100"}`}
                >
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-contain object-bottom p-1 transition-transform duration-500 group-hover:scale-108 select-none"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = "/models/model1.png";
                    }}
                  />

                  {/* Corner Diagonal Arrow badge */}
                  <div className="absolute top-2 right-2 flex h-7 w-7 items-center justify-center rounded-full bg-white/85 backdrop-blur-xs text-neutral-900 shadow-2xs group-hover:bg-neutral-900 group-hover:text-white transition-all duration-200">
                    <ArrowUpRight size={14} strokeWidth={2.5} />
                  </div>
                </div>

                {/* Information Footer */}
                <div className="pt-3 pb-1 px-1">
                  <span className="text-[9px] font-black uppercase tracking-wider text-neutral-400 block mb-0.5">
                    {category.tag}
                  </span>
                  <h3 className="text-xs sm:text-sm font-black uppercase tracking-tight text-neutral-900 group-hover:text-[var(--color-primary)] transition-colors truncate">
                    {category.name}
                  </h3>
                </div>
              </Link>
            ))}
        </div>
      </div>
    </section>
  );
};

export default CategoryScroll;