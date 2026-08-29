export const defaultProducts = [
  {
    _id: "prod-1",
    name: "Heavyweight Graphic Oversized Tee",
    description: "240 GSM ultra-combed cotton oversized streetwear t-shirt with high-density screen print and dropped shoulders.",
    brand: "GENZ ORIGINALS",
    gender: "Unisex",
    category: ["T-Shirts", "Oversized", "Streetwear"],
    collection: ["Oversized Tees", "Trending", "Men", "Women"],
    productDetails: {
      topHighlights: [
        "240 GSM 100% Super Combed Cotton",
        "Bio-washed & Pre-shrunk Fabric",
        "Dropped shoulder relaxed streetwear boxy fit",
        "High-density tactile screen graphic print"
      ],
      specifications: [
        { key: "Fit", value: "Boxy Oversized Fit" },
        { key: "Fabric", value: "100% French Terry Cotton" },
        { key: "Weight", value: "240 GSM" },
        { key: "Neck", value: "Ribbed Crew Neck" },
        { key: "Care", value: "Machine wash cold inside out" }
      ],
      style: "Cyber-Y2K Streetwear aesthetic paired with relaxed baggy cargo pants.",
      itemDetails: "Designed in our underground studio for maximum comfort and bold visual presence."
    },
    variants: [
      {
        _id: "var-1-1",
        size: "M",
        color: "black",
        price: 1499,
        salePrice: 999,
        isSale: true,
        isTrending: true,
        isNewArrival: false,
        keywords: ["hot", "bestseller", "graphic"],
        stock: 25,
        images: [
          "/models/model1.png",
          "/collections/oversized_tees.png"
        ]
      },
      {
        _id: "var-1-2",
        size: "L",
        color: "white",
        price: 1499,
        salePrice: 999,
        isSale: true,
        isTrending: true,
        isNewArrival: false,
        keywords: ["hot", "clean"],
        stock: 18,
        images: [
          "/models/model2.png"
        ]
      },
      {
        _id: "var-1-3",
        size: "XL",
        color: "red",
        price: 1499,
        salePrice: 999,
        isSale: true,
        isTrending: false,
        isNewArrival: false,
        keywords: ["bold", "street"],
        stock: 12,
        images: [
          "/models/model1.png"
        ]
      }
    ]
  },
  {
    _id: "prod-2",
    name: "Acid Wash Boxy Street Hoodie",
    description: "400 GSM heavy brushed fleece pullover hoodie with vintage acid wash treatment, double-layered hood, and metal eyelets.",
    brand: "GENZ ORIGINALS",
    gender: "Men",
    category: ["Hoodies", "Winterwear", "Sweatshirts"],
    collection: ["Hoodies", "Trending", "Men"],
    productDetails: {
      topHighlights: [
        "400 GSM Heavyweight Brushed Fleece",
        "Custom mineral acid-wash finish",
        "Double-lined hood with structured drape",
        "Kangaroo pouch pocket with reinforced stitching"
      ],
      specifications: [
        { key: "Fit", value: "Relaxed Boxy Silhouette" },
        { key: "Fabric", value: "80% Cotton, 20% Polyester Fleece" },
        { key: "Weight", value: "400 GSM" },
        { key: "Cuffs", value: "2x2 Heavy Spandex Ribbing" },
        { key: "Care", value: "Hand wash or gentle cycle" }
      ],
      style: "Layer over oversized basics with vintage sneakers.",
      itemDetails: "Every piece undergoes individual acid-wash processing, making each pattern completely unique."
    },
    variants: [
      {
        _id: "var-2-1",
        size: "L",
        color: "gray",
        price: 2999,
        salePrice: 2199,
        isSale: true,
        isTrending: true,
        isNewArrival: true,
        keywords: ["hot", "hoodie", "acidwash"],
        stock: 15,
        images: [
          "/models/model3.png",
          "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&q=80&w=800"
        ]
      },
      {
        _id: "var-2-2",
        size: "XL",
        color: "black",
        price: 2999,
        salePrice: 2199,
        isSale: true,
        isTrending: true,
        isNewArrival: true,
        keywords: ["hoodie", "essential"],
        stock: 20,
        images: [
          "/models/model4.png"
        ]
      }
    ]
  },
  {
    _id: "prod-3",
    name: "Tactical Multi-Pocket Baggy Cargo Pants",
    description: "Relaxed fit 8-pocket tactical cargo pants with adjustable bungee cords, snap closures, and reinforced knee panels.",
    brand: "CYBERPUNK DIVISION",
    gender: "Unisex",
    category: ["Cargos", "Pants", "Bottoms"],
    collection: ["Cargos", "Trending", "Men", "Women"],
    productDetails: {
      topHighlights: [
        "High-density cotton ripstop construction",
        "8 functional utility pockets with snap buttons",
        "Adjustable bungee hem toggles for custom fit",
        "Elasticated waistband with drawstrings"
      ],
      specifications: [
        { key: "Fit", value: "Wide Leg Baggy" },
        { key: "Fabric", value: "100% Cotton Ripstop" },
        { key: "Closure", value: "Elastic waist + Drawstring" },
        { key: "Pockets", value: "8 Utility compartments" }
      ],
      style: "Pair with chunky skate shoes or high-top runners.",
      itemDetails: "Built for urban utility and street mobility with maximum durability."
    },
    variants: [
      {
        _id: "var-3-1",
        size: "M",
        color: "olive",
        price: 2499,
        salePrice: 1799,
        isSale: true,
        isTrending: true,
        isNewArrival: false,
        keywords: ["hot", "cargo", "tactical"],
        stock: 30,
        images: [
          "/collections/baggy_pants.png",
          "/models/model2.png"
        ]
      },
      {
        _id: "var-3-2",
        size: "L",
        color: "black",
        price: 2499,
        salePrice: 1799,
        isSale: true,
        isTrending: true,
        isNewArrival: false,
        keywords: ["cargo", "bestseller"],
        stock: 22,
        images: [
          "/collections/baggy_pants.png"
        ]
      },
      {
        _id: "var-3-3",
        size: "S",
        color: "beige",
        price: 2499,
        salePrice: 1799,
        isSale: false,
        isTrending: false,
        isNewArrival: true,
        keywords: ["cargo", "clean"],
        stock: 14,
        images: [
          "/collections/baggy_pants.png"
        ]
      }
    ]
  },
  {
    _id: "prod-4",
    name: "Cyber Matrix Oversized Graphic Drop Tee",
    description: "Premium acid-treated oversized jersey tee featuring futuristic typography and gradient screen art.",
    brand: "GENZ ORIGINALS",
    gender: "Men",
    category: ["T-Shirts", "Oversized"],
    collection: ["Oversized Tees", "New Arrivals", "Men"],
    productDetails: {
      topHighlights: [
        "260 GSM Heavy Combed Cotton Jersey",
        "Soft-hand discharge print with glow accents",
        "Anti-pilling enzyme treated"
      ],
      specifications: [
        { key: "Fit", value: "Street Oversized" },
        { key: "Fabric", value: "100% Combed Cotton" },
        { key: "Weight", value: "260 GSM" }
      ],
      style: "Statement piece for night-out & streetwear fits.",
      itemDetails: "Part of the Cyberdrop Autumn Capsule collection."
    },
    variants: [
      {
        _id: "var-4-1",
        size: "L",
        color: "black",
        price: 1699,
        salePrice: 1199,
        isSale: false,
        isTrending: true,
        isNewArrival: true,
        keywords: ["new", "cyber", "graphic"],
        stock: 28,
        images: [
          "/models/model1.png",
          "/collections/oversized_tees.png"
        ]
      },
      {
        _id: "var-4-2",
        size: "XL",
        color: "blue",
        price: 1699,
        salePrice: 1199,
        isSale: false,
        isTrending: false,
        isNewArrival: true,
        keywords: ["blue", "new"],
        stock: 16,
        images: [
          "/models/model3.png"
        ]
      }
    ]
  },
  {
    _id: "prod-5",
    name: "Minimalist Utility Cropped Windbreaker",
    description: "Lightweight weather-resistant technical windbreaker with matte zipper hardware and breathable mesh interior.",
    brand: "STREET TECH",
    gender: "Women",
    category: ["Jackets", "Outerwear", "Womenswear"],
    collection: ["Womenswear", "New Arrivals", "Women"],
    productDetails: {
      topHighlights: [
        "Water-repellent nylon shell",
        "Cropped cinched bungee hem",
        "Full YKK waterproof zipper"
      ],
      specifications: [
        { key: "Fit", value: "Cropped Boxy" },
        { key: "Fabric", value: "100% Technical Nylon" },
        { key: "Lining", value: "Breathable Polyester Mesh" }
      ],
      style: "Combine with high-waist cargos and combat boots.",
      itemDetails: "Engineered for active urban lifestyle and effortless layering."
    },
    variants: [
      {
        _id: "var-5-1",
        size: "S",
        color: "pink",
        price: 3299,
        salePrice: 2499,
        isSale: true,
        isTrending: true,
        isNewArrival: true,
        keywords: ["hot", "windbreaker", "jacket"],
        stock: 19,
        images: [
          "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=800",
          "/models/model4.png"
        ]
      },
      {
        _id: "var-5-2",
        size: "M",
        color: "black",
        price: 3299,
        salePrice: 2499,
        isSale: true,
        isTrending: false,
        isNewArrival: true,
        keywords: ["black", "essential"],
        stock: 15,
        images: [
          "/models/model2.png"
        ]
      }
    ]
  },
  {
    _id: "prod-6",
    name: "Vintage Distressed Relaxed Denim Jacket",
    description: "13.5 Oz classic indigo washed denim jacket with custom brass buttons, chest flap pockets, and worn edge details.",
    brand: "DENIM LAB",
    gender: "Men",
    category: ["Jackets", "Menswear", "Denim"],
    collection: ["Menswear", "Sale", "Men"],
    productDetails: {
      topHighlights: [
        "13.5 Oz rigid cotton denim",
        "Authentic vintage enzyme fading",
        "Antiqued brass hardware with embossed branding"
      ],
      specifications: [
        { key: "Fit", value: "Relaxed Vintage Fit" },
        { key: "Fabric", value: "100% Indigo Cotton Denim" }
      ],
      style: "Throw over hoodies or plain white tees.",
      itemDetails: "Timeless streetwear staple built to get better with every wear."
    },
    variants: [
      {
        _id: "var-6-1",
        size: "L",
        color: "blue",
        price: 3999,
        salePrice: 2799,
        isSale: true,
        isTrending: false,
        isNewArrival: false,
        keywords: ["sale", "denim", "jacket"],
        stock: 10,
        images: [
          "https://images.unsplash.com/photo-1490578474895-699cd4e2cf59?auto=format&fit=crop&q=80&w=800",
          "/models/model1.png"
        ]
      }
    ]
  },
  {
    _id: "prod-7",
    name: "Cyber Crossbody Streetwear Messenger Bag",
    description: "Compact waterproof cordura chest rig bag with magnetic quick-release fidlock buckle and MOLLE webbing.",
    brand: "CYBERPUNK DIVISION",
    gender: "Unisex",
    category: ["Accessories", "Bags"],
    collection: ["Accessories", "Trending", "Men", "Women"],
    productDetails: {
      topHighlights: [
        "1000D Ballistic Nylon Fabric",
        "Fidlock magnetic quick-release buckle",
        "Waterproof sealed YKK zippers"
      ],
      specifications: [
        { key: "Dimensions", value: "24cm x 16cm x 6cm" },
        { key: "Capacity", value: "3.5 Liters" },
        { key: "Strap", value: "Adjustable padded nylon webbing" }
      ],
      style: "Essential everyday carry for streetwear enthusiasts.",
      itemDetails: "Keep your daily essentials secure on the move."
    },
    variants: [
      {
        _id: "var-7-1",
        size: "Free Size",
        color: "black",
        price: 1899,
        salePrice: 1299,
        isSale: true,
        isTrending: true,
        isNewArrival: true,
        keywords: ["hot", "bag", "accessory"],
        stock: 40,
        images: [
          "/collections/accessories.png",
          "/models/model3.png"
        ]
      }
    ]
  }
];
