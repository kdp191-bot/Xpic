/**
 * EcoVault Product Data
 * =======================
 * Product data sourced from researcher (products.json) with 
 * descriptions from content writer (product-descriptions.json).
 * Edit this file to add, remove, or update products.
 * 
 * Structure:
 * {
 *   id: unique string identifier (eco-001 through eco-020),
 *   name: product name,
 *   category: category slug,
 *   categoryDisplay: human-readable category name,
 *   price: number (retail_price in USD),
 *   wholesale_price: number,
 *   supplier: supplier name,
 *   shipping_days: shipping time range string,
 *   rating: number (1-5),
 *   reviewCount: number,
 *   image: image filename (local) or URL,
 *   image_url: full URL from supplier,
 *   badge: "Bestseller" | "New" | "Sale" | "Eco-Approved" | null,
 *   description: short description for catalog cards,
 *   fullDescription: detailed description for product page,
 *   sustainability: sustainability info string,
 *   features: array of feature strings,
 *   specs: object of key-value specifications,
 *   inStock: boolean,
 *   weight: shipping weight in grams (approx),
 *   material: primary material
 * }
 */

// Map categories from the researcher to our display categories
const categoryMap = {
  "reusable kitchenware": { slug: "kitchen", display: "Reusable Kitchenware", emoji: "🍽️" },
  "bamboo accessories": { slug: "bamboo", display: "Bamboo Accessories", emoji: "🎋" },
  "compostable goods": { slug: "compostable", display: "Compostable Goods", emoji: "♻️" },
  "natural cleaning tools": { slug: "cleaning", display: "Natural Cleaning", emoji: "🧹" },
  "lifestyle": { slug: "lifestyle", display: "Lifestyle", emoji: "🌿" },
  "home": { slug: "home", display: "Home & Living", emoji: "🏠" }
};

/**
 * Full description content from the content writer
 */
const descriptionContent = {
  "eco-001": "Say goodbye to single-use plastic bags forever with our Premium 10-Piece Reusable Silicone Food Storage Set. Crafted from high-quality, food-grade silicone, these leak-proof bags are perfect for everything from meal prep and snacks to sous vide cooking. The set includes various sizes to fit all your storage needs. Durable, easy to clean, and non-toxic, they are a must-have for any conscious kitchen looking to reduce its environmental footprint without sacrificing convenience.",
  "eco-002": "Transform your morning routine with our Zero-Waste Dental Care Kit. This comprehensive set includes 10 biodegradable bamboo toothbrushes with charcoal-infused bristles, a sleek bamboo travel case, and two rolls of compostable dental floss. Bamboo is a rapidly renewable resource, making this kit the perfect plastic-free alternative for your bathroom. It's effective, aesthetic, and entirely biodegradable, ensuring your smile stays bright while keeping the planet green.",
  "eco-003": "Protect your phone and the planet with our Compostable Wheat Straw Phone Case. Available for iPhone and Samsung models, these stylish cases are made from a blend of natural wheat straw and plant-based bioplastic. They offer excellent drop protection and a unique, speckled aesthetic. When you're ready for an upgrade, simply toss the case in your compost bin — it leaves no toxic residue behind. Sustainable protection has never looked this good.",
  "eco-004": "Ditch the plastic sponges for our Natural Sisal & Bamboo Dish Brush Set. This 4-piece collection includes specialized brushes for dishes, pots, and even vegetables. Featuring ergonomic bamboo handles and durable bristles made from natural sisal and coconut fibers, these brushes tackle tough grime without scratching. Every part of this set is biodegradable and compostable, making it the ultimate tool for a plastic-free, sparkling clean kitchen.",
  "eco-005": "Elevate your lunch game with our Leak-Proof Stainless Steel Bento Box. Made from premium 18/8 stainless steel, this large lunch box features adjustable compartments to keep your food organized and a secure silicone seal to prevent leaks. It's built to last a lifetime, replacing endless plastic containers. Easy to clean and completely recyclable, it's the durable, stylish choice for school, work, or weekend adventures.",
  "eco-006": "Keep your food fresh naturally with our Handmade Beeswax Food Wraps. This pack of five features assorted, beautiful patterns and is made from organic cotton, sustainably harvested beeswax, jojoba oil, and tree resin. These breathable wraps are the perfect alternative to plastic cling wrap — simply use the warmth of your hands to seal them around bowls or produce. They are reusable for up to a year and fully compostable at the end of their life.",
  "eco-007": "Organize your workspace sustainably with our Bamboo Desktop Organizer. Crafted from solid, sustainably sourced bamboo, this elegant piece features dedicated slots for pens, accessories, and your smartphone. The integrated 10W wireless charging pad ensures your devices stay powered up while you work. It's the perfect blend of modern technology and natural materials, bringing a sense of calm and order to your home office.",
  "eco-008": "Experience the power of nature with our Biodegradable Loofah Sponge Pack. Derived directly from the Luffa plant, these six large sponges are a 100% plant-based alternative to synthetic scrubbers. Use them in the shower for gentle exfoliation or in the kitchen for plastic-free dishwashing. They are non-toxic, microplastic-free, and can be tossed in the compost bin when you're done. Simple, effective, and entirely earth-friendly.",
  "eco-009": "Stay hydrated in style with our Double-Walled Glass Water Bottle. This 1000ml bottle is made from high-quality borosilicate glass, featuring a protective silicone sleeve for a secure grip and a sustainable bamboo lid. The double-walled design helps keep your drinks at the perfect temperature. BPA-free and lead-free, it's a beautiful way to reduce your dependence on single-use plastic bottles while enjoying the pure taste of water from glass.",
  "eco-010": "Take the waste out of waste management with our Compostable Kitchen Trash Bags. These extra-strong 13-gallon bags are made from a blend of cornstarch and PBAT, making them fully certified for home and industrial composting. They break down into water, CO2, and biomass within just 90 days, leaving no toxic residue behind. Leak-proof and durable, they provide the performance you need with the environmental peace of mind you want.",
  "eco-011": "Turn your bath into a luxury spa experience with our Bamboo Bathtub Caddy Tray. Made from premium, water-resistant bamboo, this expandable tray fits most tubs and features dedicated holders for your book or tablet, a wine glass, and your phone. It's the ultimate accessory for a relaxing soak. Sustainable, durable, and naturally beautiful, it brings a touch of eco-friendly elegance to your self-care routine.",
  "eco-012": "Switch to a more mindful beauty routine with our Reusable Bamboo Makeup Remover Pads. This set of 16 pads is made from a soft blend of bamboo and organic cotton, gentle enough for even the most sensitive skin. They are designed to replace thousands of single-use cotton rounds. The set comes with a convenient mesh laundry bag, making it easy to wash and reuse them for years. Sustainable beauty has never been so simple.",
  "eco-013": "Find your flow with our Jute & Natural Rubber Yoga Mat. This 5mm professional-grade mat combines the sustainable strength of jute fibers with the superior grip of natural tree rubber. It's PVC-free, non-toxic, and biodegradable, providing excellent cushioning for your joints during any practice. Jute is a low-impact crop, making this mat as kind to the earth as it is to your body. Elevate your practice with the best of nature.",
  "eco-014": "Illuminate your outdoor space with the power of the sun. Our Solar-Powered LED Hanging Lanterns come in a set of two, featuring a beautiful crackled glass design that casts a warm, inviting glow. They charge automatically during the day and light up at night, requiring no electricity or wiring. Weather-resistant and durable, these lanterns are a sustainable way to add atmosphere to your garden, patio, or balcony.",
  "eco-015": "Treat your furry friend to the best with our Organic Hemp Dog Leash and Collar Set. Hemp is one of the most sustainable fibers on earth, requiring minimal water and no pesticides to grow. This heavy-duty set is naturally antimicrobial, hypoallergenic, and incredibly soft on both your hands and your dog's neck. Durable enough for the strongest pullers, it's the conscious choice for every pet parent who cares about quality and the planet.",
  "eco-016": "Enjoy your favorite brew on the go without the waste. Our Reusable Glass Coffee Cup features a splash-proof bamboo lid and a heat-resistant natural cork sleeve for a comfortable grip. Made from premium borosilicate glass, it preserves the flavor of your coffee or tea perfectly. Designed to replace single-use paper cups, this 12oz cup is stylish, practical, and a simple way to make a big impact on your daily commute.",
  "eco-017": "Refresh your home naturally with our Bamboo Charcoal Air Purifying Bags. This set of four contains activated bamboo charcoal, which effectively absorbs odors, moisture, and allergens without the use of harsh chemicals or fragrances. Perfect for closets, cars, and pet areas, these bags are reusable for up to two years — simply place them in the sun once a month to reactivate. It's the non-toxic way to keep your air clean and fresh.",
  "eco-018": "Carry your essentials while helping to clean our oceans. Our Recycled Plastic Beach Bag is made from 100% ocean-bound plastic, repurposing waste into a durable and functional accessory. Large, waterproof, and sand-resistant, it's the perfect companion for a day at the beach or a trip to the market. By choosing this bag, you're directly supporting efforts to reduce plastic pollution in our waterways. Sustainable style with a mission.",
  "eco-019": "Host the perfect eco-friendly outing with our Compostable Bamboo Fiber Picnic Set. This 24-piece set serves six people and is made from a durable blend of bamboo fiber and cornstarch. Lightweight, shatterproof, and stylish, it's the ideal alternative to disposable plastic plates and bowls. When they finally reach the end of their long life, they are fully biodegradable, ensuring your outdoor adventures leave nothing but memories behind.",
  "eco-020": "Reduce drying time and soften your laundry naturally with our New Zealand Wool Dryer Balls. This set of six extra-large balls is handmade from 100% premium wool. They work by gently separating your laundry in the dryer, improving airflow and eliminating the need for chemical-laden dryer sheets. They last for over 1,000 loads and are fully biodegradable, making them a simple, cost-effective, and earth-friendly upgrade for every home."
};

// Researcher's product data (20 products)
const rawProducts = [
  {
    "id": "eco-001",
    "name": "Premium 10-Piece Reusable Silicone Food Storage Bag Set",
    "category": "reusable kitchenware",
    "wholesale_price": 14.50,
    "retail_price": 49.99,
    "supplier": "AliExpress - HomeEase Store",
    "shipping_days": "5-10",
    "description": "A comprehensive set of 10 leak-proof, food-grade silicone bags in various sizes. Perfect for meal prep, snacks, and sous vide.",
    "sustainability": "Replaces hundreds of single-use plastic ziplock bags. Made from non-toxic, long-lasting silicone.",
    "image_url": "https://ae01.alicdn.com/kf/H9d1e4e1a1e4e4e4e8e8e8e8e8e8e8e8eP.jpg",
    "rating": 4.7,
    "reviews": 203,
    "badge": "Bestseller",
    "features": ["10 bags in assorted sizes", "Food-grade silicone, BPA-free", "Leak-proof sealed design", "Dishwasher, microwave, freezer safe", "Replaces hundreds of single-use bags", "Non-toxic and odor-resistant"],
    "specs": { "Sizes": "Sandwich, Snack, Gallon, Quart", "Material": "Food-grade silicone", "Care": "Dishwasher, microwave, freezer safe", "Color": "Clear with colored seal", "Lifespan": "Years of daily use" },
    "weight": 500, "material": "Food-grade Silicone"
  },
  {
    "id": "eco-002",
    "name": "Zero-Waste Dental Care Kit (10 Bamboo Toothbrushes + Travel Case + Floss)",
    "category": "bamboo accessories",
    "wholesale_price": 12.00,
    "retail_price": 45.00,
    "supplier": "AliExpress - EcoLife Official",
    "shipping_days": "7-12",
    "description": "Complete dental kit featuring 10 biodegradable bamboo toothbrushes with charcoal bristles, a bamboo travel case, and 2 rolls of compostable dental floss.",
    "sustainability": "Entirely plastic-free packaging. Bamboo is a rapidly renewable resource. Toothbrushes are fully compostable (except bristles).",
    "image_url": "https://ae01.alicdn.com/kf/H8d1e4e1a1e4e4e4e8e8e8e8e8e8e8e8eP.jpg",
    "rating": 4.5,
    "reviews": 167,
    "badge": "Eco-Approved",
    "features": ["10 bamboo toothbrushes with charcoal bristles", "Bamboo travel case included", "2 rolls of compostable silk floss", "Plastic-free packaging", "Soft bristles for gentle cleaning", "Ergonomic bamboo handles"],
    "specs": { "Count": "10 toothbrushes + 1 case + 2 floss", "Material": "Moso bamboo, charcoal nylon bristles", "Bristle Type": "Soft, charcoal-infused", "Packaging": "Recycled cardboard", "Replace By": "3 months per brush" },
    "weight": 300, "material": "Moso Bamboo, Silk Floss"
  },
  {
    "id": "eco-003",
    "name": "Compostable Wheat Straw Phone Case (iPhone & Samsung)",
    "category": "compostable goods",
    "wholesale_price": 6.50,
    "retail_price": 39.99,
    "supplier": "CJ Dropshipping - GreenTech Case",
    "shipping_days": "4-7",
    "description": "Stylish and protective phone cases made from natural wheat straw and plant-based bioplastic. Available for all recent iPhone and Samsung models.",
    "sustainability": "100% compostable and biodegradable. Leaves no toxic residue. Shipped in plastic-free packaging.",
    "image_url": "https://ae01.alicdn.com/kf/H7d1e4e1a1e4e4e4e8e8e8e8e8e8e8e8eP.jpg",
    "rating": 4.3,
    "reviews": 89,
    "badge": "New",
    "features": ["Made from natural wheat straw + bioplastic", "Compostable at end of life", "Drop protection up to 6 feet", "Precise cutouts for ports and buttons", "Unique speckled natural finish", "Plastic-free packaging"],
    "specs": { "Material": "Wheat straw + PLA bioplastic", "Compatibility": "iPhone 14/15/16, Samsung S23/S24", "Drop Protection": "Up to 6 feet", "Compostable": "Yes (industrial compost)", "Packaging": "Recycled cardboard" },
    "weight": 50, "material": "Wheat Straw, PLA Bioplastic"
  },
  {
    "id": "eco-004",
    "name": "Natural Sisal & Bamboo Dish Brush Set (4 Pieces)",
    "category": "natural cleaning tools",
    "wholesale_price": 8.00,
    "retail_price": 34.99,
    "supplier": "AliExpress - CleanHome Eco",
    "shipping_days": "5-10",
    "description": "Set of 4 specialized brushes for dishes, pots, and vegetables. Features ergonomic bamboo handles and durable sisal/coconut fiber bristles.",
    "sustainability": "Plastic-free alternative to synthetic sponges and brushes. All parts are biodegradable and compostable.",
    "image_url": "https://ae01.alicdn.com/kf/H6d1e4e1a1e4e4e4e8e8e8e8e8e8e8e8eP.jpg",
    "rating": 4.6,
    "reviews": 134,
    "badge": null,
    "features": ["4 specialized brushes for every task", "Ergonomic bamboo handles", "Natural sisal & coconut fiber bristles", "Biodegradable and compostable", "Tough on grime, gentle on surfaces", "Plastic-free packaging"],
    "specs": { "Count": "4 brushes", "Materials": "Bamboo, sisal, coconut fiber", "Uses": "Dishes, pots, vegetables, scrub", "Care": "Rinse and air dry", "End of Life": "Compostable" },
    "weight": 200, "material": "Bamboo, Sisal, Coconut Fiber"
  },
  {
    "id": "eco-005",
    "name": "Leak-Proof Stainless Steel Bento Lunch Box (Large)",
    "category": "reusable kitchenware",
    "wholesale_price": 16.00,
    "retail_price": 54.99,
    "supplier": "CJ Dropshipping - EcoBento Global",
    "shipping_days": "5-8",
    "description": "High-quality 18/8 stainless steel lunch box with adjustable compartments and a leak-proof silicone seal. Durable and easy to clean.",
    "sustainability": "Infinite life span. Replaces plastic containers. 100% recyclable at end of life.",
    "image_url": "https://ae01.alicdn.com/kf/H5d1e4e1a1e4e4e4e8e8e8e8e8e8e8e8eP.jpg",
    "rating": 4.8,
    "reviews": 245,
    "badge": "Bestseller",
    "features": ["Premium 18/8 stainless steel construction", "Adjustable compartments", "Leak-proof silicone seal", "Holds 40oz total volume", "Dishwasher safe", "Lifetime durability"],
    "specs": { "Material": "18/8 Stainless Steel + Silicone", "Capacity": "40 oz (1.2L)", "Compartments": "Adjustable dividers", "Seal": "Leak-proof silicone gasket", "Care": "Dishwasher safe", "Weight": "680g" },
    "weight": 680, "material": "18/8 Stainless Steel"
  },
  {
    "id": "eco-006",
    "name": "Handmade Beeswax Food Wraps (Pack of 5, Assorted Patterns)",
    "category": "reusable kitchenware",
    "wholesale_price": 7.50,
    "retail_price": 29.99,
    "supplier": "AliExpress - ArtisanEco Shop",
    "shipping_days": "7-14",
    "description": "Breathable and reusable food wraps made from organic cotton, sustainably harvested beeswax, jojoba oil, and tree resin.",
    "sustainability": "Natural alternative to plastic cling wrap. Fully compostable at the end of its 1-year lifespan.",
    "image_url": "https://ae01.alicdn.com/kf/H4d1e4e1a1e4e4e4e8e8e8e8e8e8e8e8eP.jpg",
    "rating": 4.4,
    "reviews": 198,
    "badge": null,
    "features": ["5 assorted sizes and patterns", "Organic cotton + beeswax + jojoba oil", "Molds with warmth of your hands", "Reusable up to 1 year", "Compostable at end of life", "Plastic-free packaging"],
    "specs": { "Sizes": "Small (7\"), Medium (10\"), Large (13\"), XL (17\")", "Material": "Organic cotton, beeswax, jojoba oil, tree resin", "Lifespan": "Up to 12 months", "Care": "Hand wash cool, air dry", "End of Life": "Compostable" },
    "weight": 150, "material": "Organic Cotton, Beeswax"
  },
  {
    "id": "eco-007",
    "name": "Bamboo Desktop Organizer with Integrated Wireless Charging",
    "category": "bamboo accessories",
    "wholesale_price": 22.00,
    "retail_price": 64.99,
    "supplier": "CJ Dropshipping - TechBamboo Solutions",
    "shipping_days": "4-7",
    "description": "Elegant desk organizer crafted from solid bamboo. Includes slots for pens, phone, and a 10W wireless charging pad.",
    "sustainability": "Sustainably sourced bamboo. Minimal plastic components in the electronics.",
    "image_url": "https://ae01.alicdn.com/kf/H3d1e4e1a1e4e4e4e8e8e8e8e8e8e8e8eP.jpg",
    "rating": 4.5,
    "reviews": 76,
    "badge": "New",
    "features": ["Solid bamboo construction", "Integrated 10W Qi wireless charger", "Pen, phone, and accessory slots", "Non-slip base", "USB-C powered", "Fits all phone sizes"],
    "specs": { "Material": "Natural bamboo + electronics", "Charging": "10W Qi wireless (USB-C input)", "Dimensions": "10\" x 6\" x 5\"", "Slots": "3 pen slots, 1 phone slot", "Weight": "450g" },
    "weight": 450, "material": "Bamboo, Electronics"
  },
  {
    "id": "eco-008",
    "name": "Biodegradable Loofah Sponge Pack (6 Large Sponges)",
    "category": "natural cleaning tools",
    "wholesale_price": 5.00,
    "retail_price": 24.99,
    "supplier": "AliExpress - NatureClean Store",
    "shipping_days": "10-15",
    "description": "Set of 6 natural loofah sponges derived from the Luffa plant. Perfect for body scrubbing or kitchen cleaning.",
    "sustainability": "100% plant-based and compostable. Non-toxic and microplastic-free.",
    "image_url": "https://ae01.alicdn.com/kf/H2d1e4e1a1e4e4e4e8e8e8e8e8e8e8e8eP.jpg",
    "rating": 4.2,
    "reviews": 112,
    "badge": null,
    "features": ["6 large natural loofah sponges", "100% plant-based (Luffa plant)", "Microplastic-free", "Use for body or kitchen", "Compostable at end of life", "Biodegradable packaging"],
    "specs": { "Count": "6 sponges", "Material": "Natural Luffa (Luffa aegyptiaca)", "Dimensions": "Approx. 5\" long each", "Care": "Rinse, squeeze dry", "End of Life": "Compostable" },
    "weight": 120, "material": "Natural Loofah (Luffa)"
  },
  {
    "id": "eco-009",
    "name": "Double-Walled Glass Water Bottle with Bamboo Lid (1000ml)",
    "category": "reusable kitchenware",
    "wholesale_price": 13.00,
    "retail_price": 44.99,
    "supplier": "CJ Dropshipping - PureGlass Co.",
    "shipping_days": "5-9",
    "description": "Borosilicate glass bottle with a protective silicone sleeve and a sustainable bamboo lid. Keeps drinks cold for hours.",
    "sustainability": "BPA-free, lead-free, and reduces dependence on single-use plastic bottles.",
    "image_url": "https://ae01.alicdn.com/kf/H1d1e4e1a1e4e4e4e8e8e8e8e8e8e8e8eP.jpg",
    "rating": 4.6,
    "reviews": 189,
    "badge": null,
    "features": ["Borosilicate glass — thermal shock resistant", "1000ml (34oz) large capacity", "Bamboo lid with silicone seal", "Protective silicone sleeve", "Double-wall insulation", "BPA-free and lead-free"],
    "specs": { "Capacity": "1000ml (34 oz)", "Material": "Borosilicate glass, bamboo lid, silicone sleeve", "Insulation": "Double-walled", "Lid": "Bamboo with silicone seal", "Care": "Hand wash recommended", "Weight": "400g" },
    "weight": 400, "material": "Borosilicate Glass, Bamboo, Silicone"
  },
  {
    "id": "eco-010",
    "name": "Compostable Kitchen Trash Bags (Roll of 100, 13 Gallon)",
    "category": "compostable goods",
    "wholesale_price": 11.00,
    "retail_price": 34.99,
    "supplier": "AliExpress - GreenHome Essentials",
    "shipping_days": "7-12",
    "description": "Extra strong compostable trash bags made from cornstarch and PBAT. Certified for home and industrial composting.",
    "sustainability": "Breaks down into water, CO2, and biomass within 90 days in compost. Leak-proof and durable.",
    "image_url": "https://ae01.alicdn.com/kf/H0d1e4e1a1e4e4e4e8e8e8e8e8e8e8e8eP.jpg",
    "rating": 4.3,
    "reviews": 312,
    "badge": "Eco-Approved",
    "features": ["100 bags per roll, 13-gallon size", "Made from cornstarch + PBAT", "Certified compostable (ASTM D6400)", "Leak-proof and tear-resistant", "Breaks down in 90 days in compost", "Fragrance-free, non-toxic"],
    "specs": { "Size": "13 gallon / 49 liters", "Thickness": "0.9 mil", "Material": "Cornstarch + PBAT", "Certification": "ASTM D6400, BPI Certified", "Count": "100 bags", "Composting": "Home & industrial" },
    "weight": 900, "material": "Cornstarch, PBAT"
  },
  {
    "id": "eco-011",
    "name": "Bamboo Bathtub Caddy Tray with Book & Wine Glass Holder",
    "category": "bamboo accessories",
    "wholesale_price": 24.00,
    "retail_price": 74.99,
    "supplier": "CJ Dropshipping - SpaLux Eco",
    "shipping_days": "4-7",
    "description": "Expandable bathtub tray made from premium bamboo. Features waterproof coating and designated spots for all your bath essentials.",
    "sustainability": "100% natural bamboo. Long-lasting and biodegradable material.",
    "image_url": "https://ae01.alicdn.com/kf/Ha1e4e1a1e4e4e4e8e8e8e8e8e8e8e8eP.jpg",
    "rating": 4.7,
    "reviews": 58,
    "badge": "New",
    "features": ["Expandable design fits most tubs (26\"-42\")", "Book/tablet holder with stand", "Wine glass holder", "Phone/small items slot", "Waterproof bamboo coating", "Candle holder divot"],
    "specs": { "Material": "Premium bamboo with waterproof coating", "Expandable": "26\" to 42\"", "Holders": "Book, wine glass, phone, candle", "Weight Capacity": "15 lbs", "Care": "Wipe clean, keep dry", "Weight": "900g" },
    "weight": 900, "material": "Bamboo"
  },
  {
    "id": "eco-012",
    "name": "Reusable Bamboo Makeup Remover Pads (Set of 16 with Laundry Bag)",
    "category": "bamboo accessories",
    "wholesale_price": 5.50,
    "retail_price": 24.99,
    "supplier": "AliExpress - BeautyEco Official",
    "shipping_days": "7-14",
    "description": "Soft and gentle pads made from bamboo and organic cotton. Includes a mesh laundry bag for easy washing.",
    "sustainability": "Replaces thousands of disposable cotton rounds. Bamboo is naturally antibacterial and sustainable.",
    "image_url": "https://ae01.alicdn.com/kf/Hb1e4e1a1e4e4e4e8e8e8e8e8e8e8e8eP.jpg",
    "rating": 4.4,
    "reviews": 203,
    "badge": null,
    "features": ["16 reusable pads + mesh laundry bag", "Bamboo + organic cotton blend", "Ultra-soft, gentle on skin", "Machine washable up to 200+ washes", "Replaces thousands of cotton rounds", "Comes in biodegradable packaging"],
    "specs": { "Count": "16 pads + mesh bag", "Material": "65% bamboo, 35% organic cotton", "Diameter": "3.5 inches per pad", "Care": "Machine wash, tumble dry low", "Lifespan": "200+ washes per pad", "Packaging": "Compostable" },
    "weight": 100, "material": "Bamboo Fiber, Organic Cotton"
  },
  {
    "id": "eco-013",
    "name": "Eco-Friendly Jute & Natural Rubber Yoga Mat (5mm)",
    "category": "lifestyle",
    "wholesale_price": 28.00,
    "retail_price": 89.99,
    "supplier": "CJ Dropshipping - ZenEco Yoga",
    "shipping_days": "5-8",
    "description": "Professional-grade yoga mat made from sustainable jute fibers and natural tree rubber. Provides excellent grip and cushioning.",
    "sustainability": "Non-toxic, PVC-free, and biodegradable. Jute is a low-impact crop.",
    "image_url": "https://ae01.alicdn.com/kf/Hc1e4e1a1e4e4e4e8e8e8e8e8e8e8e8eP.jpg",
    "rating": 4.8,
    "reviews": 95,
    "badge": "Bestseller",
    "features": ["5mm thickness — perfect balance of cushion and stability", "Natural jute top layer for superior grip", "Natural tree rubber base for traction", "PVC-free, non-toxic, biodegradable", "Moisture-resistant surface", "Includes cotton carry strap"],
    "specs": { "Dimensions": "72\" x 26\" x 5mm", "Materials": "Jute fiber + natural tree rubber", "Weight": "2.5 kg (5.5 lbs)", "Care": "Wipe with damp cloth", "Certification": "Non-toxic, PVC-free", "Includes": "Cotton carry strap" },
    "weight": 2500, "material": "Jute Fiber, Natural Rubber"
  },
  {
    "id": "eco-014",
    "name": "Solar-Powered Outdoor LED Hanging Lanterns (Set of 2)",
    "category": "home",
    "wholesale_price": 14.00,
    "retail_price": 49.99,
    "supplier": "AliExpress - SolarGlow Home",
    "shipping_days": "7-12",
    "description": "Weather-resistant hanging lanterns that charge during the day and provide warm LED light at night. Beautiful crackled glass design.",
    "sustainability": "Uses 100% renewable solar energy. Reduces electricity consumption.",
    "image_url": "https://ae01.alicdn.com/kf/Hd1e4e1a1e4e4e4e8e8e8e8e8e8e8e8eP.jpg",
    "rating": 4.3,
    "reviews": 67,
    "badge": null,
    "features": ["2 solar-powered lanterns", "Crackled glass for warm ambient glow", "Auto on/off at dusk/dawn", "Weather-resistant design", "No wiring or electricity needed", "Up to 8 hours of light per charge"],
    "specs": { "Count": "2 lanterns", "Material": "Metal frame, crackled glass, solar panel", "Light Source": "Warm white LED", "Battery": "Ni-MH rechargeable (included)", "Weather Rating": "IP44 (weather-resistant)", "Light Time": "Up to 8 hours" },
    "weight": 600, "material": "Metal, Glass, Solar Panel"
  },
  {
    "id": "eco-015",
    "name": "Organic Hemp Dog Leash and Collar Set (Heavy Duty)",
    "category": "lifestyle",
    "wholesale_price": 12.00,
    "retail_price": 45.00,
    "supplier": "CJ Dropshipping - PawsEco Store",
    "shipping_days": "4-7",
    "description": "Extremely durable and naturally antimicrobial leash and collar set made from 100% organic hemp fibers. Soft on the hands and the dog.",
    "sustainability": "Hemp is one of the most sustainable fibers on earth, requiring no pesticides and very little water.",
    "image_url": "https://ae01.alicdn.com/kf/He1e4e1a1e4e4e4e8e8e8e8e8e8e8e8eP.jpg",
    "rating": 4.6,
    "reviews": 82,
    "badge": "Eco-Approved",
    "features": ["100% organic hemp construction", "Naturally antimicrobial and hypoallergenic", "Heavy-duty for strong pullers", "Brass hardware — rust-resistant", "Adjustable collar (12\"-20\")", "Leash: 5ft length, 1\" width"],
    "specs": { "Material": "100% organic hemp + brass hardware", "Collar Size": "12\"-20\" (adjustable)", "Leash Length": "5 ft x 1\" wide", "Strength": "Heavy-duty (up to 100 lbs)", "Care": "Hand wash, air dry", "Packaging": "Plastic-free" },
    "weight": 250, "material": "Organic Hemp, Brass"
  },
  {
    "id": "eco-016",
    "name": "Reusable Glass Coffee Cup with Bamboo Lid and Cork Sleeve (12oz)",
    "category": "reusable kitchenware",
    "wholesale_price": 9.00,
    "retail_price": 34.99,
    "supplier": "AliExpress - BaristaEco Shop",
    "shipping_days": "7-12",
    "description": "Premium glass coffee cup designed for repeated use. Features a splash-proof bamboo lid and a heat-resistant natural cork sleeve.",
    "sustainability": "Replaces single-use paper cups. All components are natural or recyclable.",
    "image_url": "https://ae01.alicdn.com/kf/Hf1e4e1a1e4e4e4e8e8e8e8e8e8e8e8eP.jpg",
    "rating": 4.5,
    "reviews": 156,
    "badge": null,
    "features": ["12 oz (355 ml) capacity — standard coffee size", "Borosilicate glass — no taste transfer", "Splash-proof bamboo lid", "Natural cork sleeve — stays cool to touch", "Fits standard cup holders", "Dishwasher safe"],
    "specs": { "Capacity": "12 oz (355 ml)", "Material": "Borosilicate glass, bamboo lid, cork sleeve", "Lid": "Bamboo with silicone gasket", "Care": "Dishwasher safe", "Cup Holder": "Fits standard car holders", "Weight": "200g" },
    "weight": 200, "material": "Borosilicate Glass, Bamboo, Cork"
  },
  {
    "id": "eco-017",
    "name": "Bamboo Charcoal Air Purifying Bag (Set of 4)",
    "category": "home",
    "wholesale_price": 8.50,
    "retail_price": 39.99,
    "supplier": "CJ Dropshipping - PureAir Bamboo",
    "shipping_days": "5-8",
    "description": "Natural air purifiers containing activated bamboo charcoal. Effectively absorbs odors, allergens, and moisture in closets, cars, and rooms.",
    "sustainability": "100% natural charcoal. Fragrance-free and non-toxic. Reusable for up to 2 years.",
    "image_url": "https://ae01.alicdn.com/kf/Hg1e4e1a1e4e4e4e8e8e8e8e8e8e8e8eP.jpg",
    "rating": 4.4,
    "reviews": 234,
    "badge": "Eco-Approved",
    "features": ["4 bags — covers up to 400 sq ft", "Activated bamboo charcoal", "Absorbs odors, moisture, allergens", "Fragrance-free — no masking", "Reusable for 2 years", "Reactivate monthly in sunlight"],
    "specs": { "Count": "4 bags", "Material": "Activated bamboo charcoal + organic cotton", "Coverage": "Up to 400 sq ft (100 sq ft per bag)", "Lifespan": "Up to 2 years", "Care": "Place in sun 1 hr/month to reactivate", "Packaging": "Organic cotton bag" },
    "weight": 400, "material": "Activated Bamboo Charcoal"
  },
  {
    "id": "eco-018",
    "name": "Recycled Plastic Ocean-Bound Material Beach Bag",
    "category": "lifestyle",
    "wholesale_price": 15.00,
    "retail_price": 54.99,
    "supplier": "AliExpress - OceanSafe Gear",
    "shipping_days": "7-14",
    "description": "Large, durable beach bag made from 100% recycled ocean-bound plastic. Sand-resistant and waterproof.",
    "sustainability": "Helps clean the oceans by repurposing plastic waste into a functional product.",
    "image_url": "https://ae01.alicdn.com/kf/Hh1e4e1a1e4e4e4e8e8e8e8e8e8e8e8eP.jpg",
    "rating": 4.5,
    "reviews": 47,
    "badge": null,
    "features": ["Made from 100% recycled ocean-bound plastic", "Waterproof and sand-resistant", "Large capacity (holds 25+ lbs)", "Reinforced stitching for durability", "Interior zipper pocket", "Machine washable"],
    "specs": { "Material": "100% recycled ocean-bound plastic PET", "Dimensions": "20\" x 15\" x 6\"", "Capacity": "25+ lbs", "Care": "Machine washable", "Weight": "350g" },
    "weight": 350, "material": "Recycled Ocean-Bound Plastic"
  },
  {
    "id": "eco-019",
    "name": "Compostable Bamboo Fiber Picnic Dinnerware Set (24 Pieces)",
    "category": "reusable kitchenware",
    "wholesale_price": 18.00,
    "retail_price": 59.99,
    "supplier": "CJ Dropshipping - PicnicEco Solutions",
    "shipping_days": "5-9",
    "description": "Complete dinnerware set for 6 people, made from durable bamboo fiber and cornstarch. Lightweight and shatterproof.",
    "sustainability": "Fully biodegradable at the end of its life. Replaces plastic picnic sets.",
    "image_url": "https://ae01.alicdn.com/kf/Hi1e4e1a1e4e4e4e8e8e8e8e8e8e8e8eP.jpg",
    "rating": 4.6,
    "reviews": 73,
    "badge": null,
    "features": ["24-piece set — serves 6 people", "Bamboo fiber + cornstarch construction", "Lightweight and shatterproof", "Dishwasher safe", "Microwave safe", "Fully biodegradable at end of life"],
    "specs": { "Count": "24 pieces (6 plates, 6 bowls, 6 cups, 6 utensils)", "Material": "Bamboo fiber + cornstarch", "Dishwasher Safe": "Yes", "Microwave Safe": "Yes", "Biodegradable": "Yes", "Weight": "1200g" },
    "weight": 1200, "material": "Bamboo Fiber, Cornstarch"
  },
  {
    "id": "eco-020",
    "name": "Natural Wool Dryer Balls (Set of 6, XL)",
    "category": "natural cleaning tools",
    "wholesale_price": 6.00,
    "retail_price": 29.99,
    "supplier": "AliExpress - WoollyEco Store",
    "shipping_days": "7-12",
    "description": "Handmade 100% New Zealand wool dryer balls. Reduces drying time, softens laundry naturally, and eliminates the need for dryer sheets.",
    "sustainability": "Natural alternative to chemical-laden dryer sheets. Lasts for 1000+ loads. Fully biodegradable.",
    "image_url": "https://ae01.alicdn.com/kf/Hj1e4e1a1e4e4e4e8e8e8e8e8e8e8e8eP.jpg",
    "rating": 4.7,
    "reviews": 278,
    "badge": "Bestseller",
    "features": ["6 extra-large (XL) New Zealand wool balls", "Reduces drying time by up to 30%", "Naturally softens laundry", "Replaces chemical dryer sheets", "Lasts 1,000+ loads (3-5 years)", "Hypoallergenic — safe for sensitive skin"],
    "specs": { "Count": "6 balls", "Material": "100% New Zealand wool", "Dimensions": "2.5\" diameter each (XL)", "Lifespan": "1,000+ loads", "Scent": "Unscented (add essential oils if desired)", "Packaging": "Cotton drawstring bag" },
    "weight": 200, "material": "New Zealand Wool"
  }
];

// Build the final products array with enriched data
const products = rawProducts.map(p => {
  const cat = categoryMap[p.category] || { slug: "other", display: p.category, emoji: "🌱" };
  // Generate 3-5 features from sustainability + description if not provided
  const features = p.features || [
    p.sustainability,
    `Ethically sourced from ${p.supplier}`,
    `Ships in ${p.shipping_days} days`,
    "Plastic-free packaging"
  ];
  
  return {
    id: p.id,
    name: p.name,
    category: cat.slug,
    categoryDisplay: cat.display,
    price: p.retail_price,
    wholesale_price: p.wholesale_price,
    supplier: p.supplier,
    shipping_days: p.shipping_days,
    rating: p.rating,
    reviewCount: p.reviews,
    image_url: p.image_url,
    badge: p.badge || null,
    description: p.description,
    fullDescription: descriptionContent[p.id] || p.description,
    sustainability: p.sustainability,
    features: features,
    specs: p.specs || {},
    inStock: true,
    weight: p.weight || 200,
    material: p.material || "Various Natural Materials"
  };
});

/**
 * Helper: Get all categories
 */
function getCategories() {
  const cats = new Set();
  products.forEach(p => cats.add(p.category));
  return Array.from(cats);
}

/**
 * Helper: Get category display map
 */
function getCategoryDisplay(category) {
  const names = {
    kitchen: "Reusable Kitchenware",
    bamboo: "Bamboo Accessories",
    compostable: "Compostable Goods",
    cleaning: "Natural Cleaning",
    lifestyle: "Lifestyle",
    home: "Home & Living"
  };
  return names[category] || category;
}

/**
 * Helper: Get category emoji
 */
function getCategoryEmoji(category) {
  const emojis = {
    kitchen: "🍽️",
    bamboo: "🎋",
    compostable: "♻️",
    cleaning: "🧹",
    lifestyle: "🌿",
    home: "🏠"
  };
  return emojis[category] || "🌱";
}

/**
 * Helper: Get products by category
 */
function getProductsByCategory(category) {
  if (!category || category === 'all') return products;
  return products.filter(p => p.category === category);
}

/**
 * Helper: Get product by ID
 */
function getProductById(id) {
  return products.find(p => p.id === id);
}

/**
 * Helper: Search products by query
 */
function searchProducts(query) {
  const q = query.toLowerCase().trim();
  if (!q) return products;
  return products.filter(p => 
    p.name.toLowerCase().includes(q) ||
    p.description.toLowerCase().includes(q) ||
    p.categoryDisplay.toLowerCase().includes(q) ||
    p.material.toLowerCase().includes(q)
  );
}