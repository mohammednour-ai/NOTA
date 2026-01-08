/**
 * Personality Profiles for NOTA
 * 100 distinct profiles based on quiz answers
 */

const personalityProfiles = [
    // FEMALE PROFILES (50)
    {
        id: 1,
        name: "Floral Romantic",
        gender: "female",
        description: "Feminine and delicate, with a love for timeless elegance and soft florals",
        scentFamilies: ["Floral", "Powdery", "Soft Musk"],
        icon: "fa-flower-tulip",
        keywords: ["elegant", "feminine", "soft", "romantic", "floral", "classic"]
    },
    {
        id: 2,
        name: "Sophisticated Elegance",
        gender: "female",
        description: "Refined and polished, appreciating luxury and understated glamour",
        scentFamilies: ["Chypre", "Woody", "Amber"],
        icon: "fa-gem",
        keywords: ["sophisticated", "elegant", "luxury", "professional", "refined"]
    },
    {
        id: 3,
        name: "Fresh Citrus Glow",
        gender: "female",
        description: "Energetic and vibrant, drawn to bright, uplifting scents",
        scentFamilies: ["Citrus", "Fruity", "Green"],
        icon: "fa-lemon",
        keywords: ["fresh", "energetic", "bright", "citrus", "active"]
    },
    {
        id: 4,
        name: "Mysterious Evening",
        gender: "female",
        description: "Alluring and enigmatic, perfect for evening wear and special occasions",
        scentFamilies: ["Oriental", "Amber", "Spicy"],
        icon: "fa-moon",
        keywords: ["mysterious", "seductive", "evening", "bold", "exotic"]
    },
    {
        id: 5,
        name: "Sporty & Fresh",
        gender: "female",
        description: "Active and outdoorsy, preferring clean, aquatic notes",
        scentFamilies: ["Aquatic", "Citrus", "Green"],
        icon: "fa-running",
        keywords: ["sporty", "active", "clean", "fresh", "outdoors"]
    },
    {
        id: 6,
        name: "Bohemian Spirit",
        gender: "female",
        description: "Free-spirited and artistic, loving earthy and unconventional scents",
        scentFamilies: ["Woody", "Earthy", "Herbal"],
        icon: "fa-feather",
        keywords: ["bohemian", "artistic", "natural", "earthy", "unique"]
    },
    {
        id: 7,
        name: "Modern Minimalist",
        gender: "female",
        description: "Clean and contemporary, appreciating simple yet sophisticated scents",
        scentFamilies: ["Clean", "White Floral", "Musk"],
        icon: "fa-spa",
        keywords: ["minimalist", "clean", "modern", "simple", "refined"]
    },
    {
        id: 8,
        name: "Warm Amber Goddess",
        gender: "female",
        description: "Sensual and comforting, drawn to rich, warm, enveloping fragrances",
        scentFamilies: ["Amber", "Vanilla", "Tonka"],
        icon: "fa-fire",
        keywords: ["warm", "sensual", "cozy", "sweet", "comforting"]
    },
    {
        id: 9,
        name: "Fruity Playful",
        gender: "female",
        description: "Fun-loving and youthful, enjoying sweet, fruity compositions",
        scentFamilies: ["Fruity", "Gourmand", "Citrus"],
        icon: "fa-apple-whole",
        keywords: ["playful", "sweet", "fruity", "youthful", "fun"]
    },
    {
        id: 10,
        name: "Powdery Classic",
        gender: "female",
        description: "Traditional and timeless, loving soft, powdery vintage-inspired scents",
        scentFamilies: ["Powdery", "Aldehydic", "Iris"],
        icon: "fa-compact-disc",
        keywords: ["classic", "vintage", "powdery", "traditional", "elegant"]
    },
    {
        id: 11,
        name: "Garden Fresh",
        gender: "female",
        description: "Nature-loving and gentle, preferring green and botanical notes",
        scentFamilies: ["Green", "Herbal", "Floral"],
        icon: "fa-leaf",
        keywords: ["natural", "fresh", "botanical", "garden", "gentle"]
    },
    {
        id: 12,
        name: "Sunset Dreamer",
        gender: "female",
        description: "Romantic and warm, loving soft amber and floral twilight scents",
        scentFamilies: ["Amber", "Floral", "Musk"],
        icon: "fa-cloud-sun",
        keywords: ["dreamy", "romantic", "warm", "sunset", "soft"]
    },
    {
        id: 13,
        name: "Confident Executive",
        gender: "female",
        description: "Professional and assertive, choosing powerful yet refined fragrances",
        scentFamilies: ["Chypre", "Leather", "Woody"],
        icon: "fa-briefcase",
        keywords: ["confident", "professional", "powerful", "executive", "bold"]
    },
    {
        id: 14,
        name: "Sweet Gourmand",
        gender: "female",
        description: "Indulgent and warm, adoring dessert-like and edible scents",
        scentFamilies: ["Gourmand", "Vanilla", "Caramel"],
        icon: "fa-cookie-bite",
        keywords: ["sweet", "gourmand", "dessert", "indulgent", "warm"]
    },
    {
        id: 15,
        name: "Ocean Breeze",
        gender: "female",
        description: "Calm and refreshing, drawn to aquatic and marine notes",
        scentFamilies: ["Aquatic", "Marine", "Ozonic"],
        icon: "fa-water",
        keywords: ["calm", "aquatic", "fresh", "ocean", "serene"]
    },
    {
        id: 16,
        name: "Rose Garden",
        gender: "female",
        description: "Classic rose lover, appreciating all facets of this iconic flower",
        scentFamilies: ["Rose", "Floral", "Green"],
        icon: "fa-rose",
        keywords: ["rose", "floral", "romantic", "classic", "elegant"]
    },
    {
        id: 17,
        name: "Spicy Siren",
        gender: "female",
        description: "Bold and captivating, loving warm spices and exotic notes",
        scentFamilies: ["Spicy", "Oriental", "Amber"],
        icon: "fa-pepper-hot",
        keywords: ["spicy", "bold", "exotic", "captivating", "warm"]
    },
    {
        id: 18,
        name: "Lavender Dreams",
        gender: "female",
        description: "Calming and soothing, preferring aromatic and herbaceous scents",
        scentFamilies: ["Lavender", "Herbal", "Aromatic"],
        icon: "fa-spa",
        keywords: ["calming", "soothing", "lavender", "herbal", "peaceful"]
    },
    {
        id: 19,
        name: "Peach Blossom",
        gender: "female",
        description: "Soft and sweet, loving peachy and fruity-floral combinations",
        scentFamilies: ["Fruity", "Floral", "Musk"],
        icon: "fa-seedling",
        keywords: ["soft", "peachy", "sweet", "delicate", "feminine"]
    },
    {
        id: 20,
        name: "Jasmine Night",
        gender: "female",
        description: "Intoxicating and rich, drawn to heady white floral bouquets",
        scentFamilies: ["White Floral", "Jasmine", "Tuberose"],
        icon: "fa-star",
        keywords: ["intoxicating", "rich", "floral", "night", "sensual"]
    },
    {
        id: 21,
        name: "Vanilla Comfort",
        gender: "female",
        description: "Cozy and nurturing, loving creamy vanilla-based fragrances",
        scentFamilies: ["Vanilla", "Gourmand", "Musk"],
        icon: "fa-mug-hot",
        keywords: ["cozy", "comforting", "vanilla", "soft", "warm"]
    },
    {
        id: 22,
        name: "Leather Luxe",
        gender: "female",
        description: "Edgy and modern, appreciating leather and unconventional notes",
        scentFamilies: ["Leather", "Woody", "Spicy"],
        icon: "fa-vest",
        keywords: ["edgy", "modern", "leather", "bold", "unique"]
    },
    {
        id: 23,
        name: "Tropical Paradise",
        gender: "female",
        description: "Exotic and vibrant, loving tropical fruits and florals",
        scentFamilies: ["Tropical", "Fruity", "Floral"],
        icon: "fa-umbrella-beach",
        keywords: ["tropical", "exotic", "vibrant", "vacation", "sunny"]
    },
    {
        id: 24,
        name: "Sandalwood Serenity",
        gender: "female",
        description: "Grounded and spiritual, preferring woody and meditative scents",
        scentFamilies: ["Sandalwood", "Woody", "Incense"],
        icon: "fa-yin-yang",
        keywords: ["grounded", "spiritual", "woody", "serene", "calm"]
    },
    {
        id: 25,
        name: "Berry Delight",
        gender: "female",
        description: "Sweet and juicy, loving berry-forward fruity fragrances",
        scentFamilies: ["Berry", "Fruity", "Sweet"],
        icon: "fa-wine-bottle",
        keywords: ["berry", "sweet", "juicy", "playful", "fresh"]
    },
    {
        id: 26,
        name: "Magnolia Grace",
        gender: "female",
        description: "Southern charm and elegance, drawn to creamy white florals",
        scentFamilies: ["Magnolia", "White Floral", "Creamy"],
        icon: "fa-hat-cowboy",
        keywords: ["graceful", "elegant", "southern", "floral", "creamy"]
    },
    {
        id: 27,
        name: "Patchouli Soul",
        gender: "female",
        description: "Earthy and deep, loving rich patchouli-based compositions",
        scentFamilies: ["Patchouli", "Earthy", "Woody"],
        icon: "fa-tree",
        keywords: ["earthy", "deep", "bohemian", "rich", "grounding"]
    },
    {
        id: 28,
        name: "Champagne Bubbles",
        gender: "female",
        description: "Effervescent and celebratory, preferring sparkling and aldehydic notes",
        scentFamilies: ["Aldehydic", "Floral", "Citrus"],
        icon: "fa-champagne-glasses",
        keywords: ["bubbly", "celebratory", "sparkling", "sophisticated", "joyful"]
    },
    {
        id: 29,
        name: "Silk & Cashmere",
        gender: "female",
        description: "Luxuriously soft, loving cashmere musk and silky textures",
        scentFamilies: ["Musk", "Powdery", "Soft"],
        icon: "fa-shirt",
        keywords: ["soft", "luxurious", "silky", "refined", "delicate"]
    },
    {
        id: 30,
        name: "Midnight Oud",
        gender: "female",
        description: "Daring and intense, appreciating rich oud and resinous notes",
        scentFamilies: ["Oud", "Resinous", "Spicy"],
        icon: "fa-chess-queen",
        keywords: ["daring", "intense", "oud", "bold", "exotic"]
    },
    {
        id: 31,
        name: "Coconut Escape",
        gender: "female",
        description: "Vacation-minded and carefree, loving coconut and tropical vibes",
        scentFamilies: ["Coconut", "Tropical", "Creamy"],
        icon: "fa-cocktail",
        keywords: ["tropical", "coconut", "vacation", "creamy", "sunny"]
    },
    {
        id: 32,
        name: "Violet Charm",
        gender: "female",
        description: "Nostalgic and whimsical, drawn to violet and iris notes",
        scentFamilies: ["Violet", "Iris", "Powdery"],
        icon: "fa-heart",
        keywords: ["nostalgic", "whimsical", "violet", "charming", "soft"]
    },
    {
        id: 33,
        name: "Honey Nectar",
        gender: "female",
        description: "Golden and sweet, loving honey and beeswax compositions",
        scentFamilies: ["Honey", "Amber", "Floral"],
        icon: "fa-honeycomb",
        keywords: ["sweet", "honey", "golden", "warm", "rich"]
    },
    {
        id: 34,
        name: "Tea Ceremony",
        gender: "female",
        description: "Refined and delicate, preferring tea-based and subtle fragrances",
        scentFamilies: ["Tea", "Green", "Light"],
        icon: "fa-mug-saucer",
        keywords: ["refined", "delicate", "tea", "subtle", "elegant"]
    },
    {
        id: 35,
        name: "Icy Mint",
        gender: "female",
        description: "Cool and invigorating, loving minty and fresh aromatic notes",
        scentFamilies: ["Mint", "Aromatic", "Green"],
        icon: "fa-snowflake",
        keywords: ["cool", "fresh", "minty", "invigorating", "clean"]
    },
    {
        id: 36,
        name: "Amber Empress",
        gender: "female",
        description: "Regal and commanding, preferring rich amber and resinous scents",
        scentFamilies: ["Amber", "Resinous", "Spicy"],
        icon: "fa-crown",
        keywords: ["regal", "powerful", "amber", "rich", "commanding"]
    },
    {
        id: 37,
        name: "Wildflower Meadow",
        gender: "female",
        description: "Natural and free, loving wildflower and grassy notes",
        scentFamilies: ["Green", "Floral", "Earthy"],
        icon: "fa-clover",
        keywords: ["natural", "wildflower", "meadow", "free", "fresh"]
    },
    {
        id: 38,
        name: "Caramel Kiss",
        gender: "female",
        description: "Indulgent and sweet, drawn to caramel and toffee gourmands",
        scentFamilies: ["Gourmand", "Caramel", "Vanilla"],
        icon: "fa-candy-cane",
        keywords: ["sweet", "caramel", "indulgent", "warm", "delicious"]
    },
    {
        id: 39,
        name: "Sage Wisdom",
        gender: "female",
        description: "Earthy and wise, preferring sage and herbal aromatics",
        scentFamilies: ["Sage", "Herbal", "Earthy"],
        icon: "fa-book-open",
        keywords: ["wise", "earthy", "herbal", "sage", "grounding"]
    },
    {
        id: 40,
        name: "Plum Velvet",
        gender: "female",
        description: "Rich and velvety, loving dark fruits and wine-like notes",
        scentFamilies: ["Fruity", "Plum", "Amber"],
        icon: "fa-wine-glass",
        keywords: ["rich", "plum", "velvety", "luxurious", "deep"]
    },
    {
        id: 41,
        name: "Lotus Blossom",
        gender: "female",
        description: "Pure and spiritual, drawn to lotus and aquatic florals",
        scentFamilies: ["Lotus", "Aquatic", "Floral"],
        icon: "fa-spa",
        keywords: ["pure", "spiritual", "lotus", "zen", "peaceful"]
    },
    {
        id: 42,
        name: "Cherry Blossom",
        gender: "female",
        description: "Delicate and fleeting, loving soft cherry blossom scents",
        scentFamilies: ["Cherry Blossom", "Floral", "Fruity"],
        icon: "fa-tree-city",
        keywords: ["delicate", "cherry", "soft", "romantic", "spring"]
    },
    {
        id: 43,
        name: "Tobacco Flower",
        gender: "female",
        description: "Sophisticated and warm, appreciating tobacco and floral blends",
        scentFamilies: ["Tobacco", "Floral", "Warm"],
        icon: "fa-smoking",
        keywords: ["sophisticated", "warm", "tobacco", "unique", "complex"]
    },
    {
        id: 44,
        name: "Neroli Sunshine",
        gender: "female",
        description: "Bright and cheerful, loving neroli and orange blossom",
        scentFamilies: ["Neroli", "Citrus", "Floral"],
        icon: "fa-sun",
        keywords: ["bright", "cheerful", "neroli", "sunny", "uplifting"]
    },
    {
        id: 45,
        name: "Fig Orchard",
        gender: "female",
        description: "Green and milky, preferring fig and Mediterranean scents",
        scentFamilies: ["Fig", "Green", "Woody"],
        icon: "fa-wheat-awn",
        keywords: ["green", "fig", "mediterranean", "fresh", "natural"]
    },
    {
        id: 46,
        name: "Pink Pepper",
        gender: "female",
        description: "Spicy and modern, loving pink pepper and contemporary blends",
        scentFamilies: ["Spicy", "Floral", "Modern"],
        icon: "fa-pepper-hot",
        keywords: ["spicy", "modern", "peppery", "vibrant", "bold"]
    },
    {
        id: 47,
        name: "Almond Blossom",
        gender: "female",
        description: "Nutty and soft, drawn to almond and creamy florals",
        scentFamilies: ["Almond", "Gourmand", "Floral"],
        icon: "fa-cookie",
        keywords: ["nutty", "soft", "almond", "creamy", "comforting"]
    },
    {
        id: 48,
        name: "Incense Mystic",
        gender: "female",
        description: "Spiritual and smoky, loving incense and resinous notes",
        scentFamilies: ["Incense", "Resinous", "Spicy"],
        icon: "fa-fire-flame-curved",
        keywords: ["mystical", "incense", "spiritual", "smoky", "deep"]
    },
    {
        id: 49,
        name: "Ginger Spark",
        gender: "female",
        description: "Warm and zingy, preferring ginger and spicy accords",
        scentFamilies: ["Ginger", "Spicy", "Citrus"],
        icon: "fa-bolt",
        keywords: ["zingy", "warm", "ginger", "spicy", "energetic"]
    },
    {
        id: 50,
        name: "Gardenia Evening",
        gender: "female",
        description: "Creamy and intoxicating, adoring gardenia-forward fragrances",
        scentFamilies: ["Gardenia", "White Floral", "Creamy"],
        icon: "fa-moon",
        keywords: ["creamy", "gardenia", "intoxicating", "evening", "luxurious"]
    },

    // MALE PROFILES (40)
    {
        id: 51,
        name: "Bold Executive",
        gender: "male",
        description: "Confident and commanding, preferring powerful woody and spicy scents",
        scentFamilies: ["Woody", "Spicy", "Leather"],
        icon: "fa-user-tie",
        keywords: ["confident", "executive", "powerful", "woody", "professional"]
    },
    {
        id: 52,
        name: "Sporty Adventure",
        gender: "male",
        description: "Active and energetic, loving fresh aquatic and citrus notes",
        scentFamilies: ["Aquatic", "Citrus", "Aromatic"],
        icon: "fa-person-running",
        keywords: ["sporty", "active", "fresh", "energetic", "outdoors"]
    },
    {
        id: 53,
        name: "Woody Gentleman",
        gender: "male",
        description: "Classic and refined, drawn to cedarwood and sandalwood",
        scentFamilies: ["Woody", "Cedar", "Sandalwood"],
        icon: "fa-tree",
        keywords: ["classic", "refined", "woody", "gentleman", "elegant"]
    },
    {
        id: 54,
        name: "Fresh Aquatic",
        gender: "male",
        description: "Clean and oceanic, preferring marine and watery notes",
        scentFamilies: ["Aquatic", "Marine", "Ozonic"],
        icon: "fa-water",
        keywords: ["clean", "aquatic", "fresh", "ocean", "crisp"]
    },
    {
        id: 55,
        name: "Spicy Confident",
        gender: "male",
        description: "Bold and warm, loving pepper, cardamom, and spice blends",
        scentFamilies: ["Spicy", "Pepper", "Amber"],
        icon: "fa-fire",
        keywords: ["spicy", "confident", "warm", "bold", "magnetic"]
    },
    {
        id: 56,
        name: "Leather & Tobacco",
        gender: "male",
        description: "Rugged and sophisticated, appreciating leather and tobacco",
        scentFamilies: ["Leather", "Tobacco", "Woody"],
        icon: "fa-vest",
        keywords: ["rugged", "sophisticated", "leather", "tobacco", "masculine"]
    },
    {
        id: 57,
        name: "Citrus Professional",
        gender: "male",
        description: "Sharp and clean, preferring citrus and aromatic fougères",
        scentFamilies: ["Citrus", "Aromatic", "Fougère"],
        icon: "fa-lemon",
        keywords: ["sharp", "clean", "citrus", "professional", "fresh"]
    },
    {
        id: 58,
        name: "Aromatic Explorer",
        gender: "male",
        description: "Adventurous and herbaceous, loving lavender and herbs",
        scentFamilies: ["Aromatic", "Lavender", "Herbal"],
        icon: "fa-compass",
        keywords: ["adventurous", "aromatic", "herbal", "explorer", "natural"]
    },
    {
        id: 59,
        name: "Warm Oriental",
        gender: "male",
        description: "Exotic and sensual, drawn to amber and spicy oriental blends",
        scentFamilies: ["Oriental", "Amber", "Spicy"],
        icon: "fa-globe",
        keywords: ["exotic", "warm", "oriental", "sensual", "rich"]
    },
    {
        id: 60,
        name: "Clean Minimalist",
        gender: "male",
        description: "Modern and understated, preferring clean musk and cotton",
        scentFamilies: ["Clean", "Musk", "Cotton"],
        icon: "fa-circle",
        keywords: ["clean", "minimalist", "modern", "simple", "fresh"]
    },
    {
        id: 61,
        name: "Vetiver Earth",
        gender: "male",
        description: "Grounded and earthy, loving vetiver and soil-like notes",
        scentFamilies: ["Vetiver", "Earthy", "Woody"],
        icon: "fa-mountain",
        keywords: ["earthy", "grounded", "vetiver", "natural", "deep"]
    },
    {
        id: 62,
        name: "Bergamot Bright",
        gender: "male",
        description: "Uplifting and sophisticated, drawn to bergamot-forward scents",
        scentFamilies: ["Bergamot", "Citrus", "Green"],
        icon: "fa-lightbulb",
        keywords: ["bright", "uplifting", "bergamot", "sophisticated", "fresh"]
    },
    {
        id: 63,
        name: "Oud Majesty",
        gender: "male",
        description: "Luxurious and intense, appreciating oud and resinous woods",
        scentFamilies: ["Oud", "Woody", "Resinous"],
        icon: "fa-chess-king",
        keywords: ["luxurious", "oud", "intense", "majestic", "rich"]
    },
    {
        id: 64,
        name: "Sage Rugged",
        gender: "male",
        description: "Outdoorsy and herbaceous, preferring sage and green notes",
        scentFamilies: ["Sage", "Herbal", "Green"],
        icon: "fa-hiking",
        keywords: ["rugged", "sage", "outdoors", "herbal", "natural"]
    },
    {
        id: 65,
        name: "Vanilla Warmth",
        gender: "male",
        description: "Comforting and sweet, loving vanilla and tonka bean",
        scentFamilies: ["Vanilla", "Tonka", "Amber"],
        icon: "fa-mug-hot",
        keywords: ["warm", "comforting", "vanilla", "sweet", "cozy"]
    },
    {
        id: 66,
        name: "Patchouli Deep",
        gender: "male",
        description: "Rich and earthy, drawn to patchouli and dark woods",
        scentFamilies: ["Patchouli", "Woody", "Earthy"],
        icon: "fa-tree-city",
        keywords: ["deep", "patchouli", "earthy", "rich", "complex"]
    },
    {
        id: 67,
        name: "Mint Cool",
        gender: "male",
        description: "Refreshing and invigorating, preferring mint and eucalyptus",
        scentFamilies: ["Mint", "Aromatic", "Fresh"],
        icon: "fa-snowflake",
        keywords: ["cool", "mint", "refreshing", "invigorating", "clean"]
    },
    {
        id: 68,
        name: "Amber Classic",
        gender: "male",
        description: "Traditional and warm, loving amber and balsamic notes",
        scentFamilies: ["Amber", "Balsamic", "Resinous"],
        icon: "fa-fire-flame-simple",
        keywords: ["classic", "amber", "warm", "traditional", "rich"]
    },
    {
        id: 69,
        name: "Pine Forest",
        gender: "male",
        description: "Woodland and crisp, appreciating pine and conifer scents",
        scentFamilies: ["Pine", "Woody", "Green"],
        icon: "fa-tree",
        keywords: ["woodland", "pine", "crisp", "forest", "natural"]
    },
    {
        id: 70,
        name: "Smoky Whiskey",
        gender: "male",
        description: "Mature and complex, drawn to smoky and boozy notes",
        scentFamilies: ["Smoky", "Leather", "Woody"],
        icon: "fa-whiskey-glass",
        keywords: ["smoky", "mature", "complex", "boozy", "sophisticated"]
    },
    {
        id: 71,
        name: "Cardamom Spice",
        gender: "male",
        description: "Warm and exotic, loving cardamom and spice blends",
        scentFamilies: ["Cardamom", "Spicy", "Woody"],
        icon: "fa-pepper-hot",
        keywords: ["spicy", "cardamom", "warm", "exotic", "aromatic"]
    },
    {
        id: 72,
        name: "Oakmoss Trail",
        gender: "male",
        description: "Forest floor and damp, preferring oakmoss and chypre",
        scentFamilies: ["Oakmoss", "Chypre", "Earthy"],
        icon: "fa-route",
        keywords: ["forest", "oakmoss", "earthy", "trail", "green"]
    },
    {
        id: 73,
        name: "Black Pepper",
        gender: "male",
        description: "Sharp and dynamic, loving black pepper and spicy notes",
        scentFamilies: ["Pepper", "Spicy", "Woody"],
        icon: "fa-bolt",
        keywords: ["sharp", "pepper", "dynamic", "spicy", "bold"]
    },
    {
        id: 74,
        name: "Cedarwood Strong",
        gender: "male",
        description: "Solid and dependable, drawn to cedarwood and dry woods",
        scentFamilies: ["Cedar", "Woody", "Dry"],
        icon: "fa-chess-rook",
        keywords: ["strong", "cedar", "dependable", "woody", "solid"]
    },
    {
        id: 75,
        name: "Grapefruit Zest",
        gender: "male",
        description: "Tangy and energizing, preferring grapefruit and citrus",
        scentFamilies: ["Grapefruit", "Citrus", "Fresh"],
        icon: "fa-lemon",
        keywords: ["tangy", "energizing", "grapefruit", "zesty", "fresh"]
    },
    {
        id: 76,
        name: "Incense Ritual",
        gender: "male",
        description: "Spiritual and smoky, loving incense and ceremonial scents",
        scentFamilies: ["Incense", "Smoky", "Resinous"],
        icon: "fa-fire-flame-curved",
        keywords: ["spiritual", "incense", "smoky", "ritual", "deep"]
    },
    {
        id: 77,
        name: "Basil Fresh",
        gender: "male",
        description: "Green and herbaceous, appreciating basil and culinary herbs",
        scentFamilies: ["Basil", "Herbal", "Green"],
        icon: "fa-leaf",
        keywords: ["green", "basil", "fresh", "herbal", "crisp"]
    },
    {
        id: 78,
        name: "Rum Bay",
        gender: "male",
        description: "Tropical and boozy, drawn to rum and bay leaf notes",
        scentFamilies: ["Rum", "Spicy", "Woody"],
        icon: "fa-anchor",
        keywords: ["tropical", "rum", "boozy", "bay", "warm"]
    },
    {
        id: 79,
        name: "Rosemary Path",
        gender: "male",
        description: "Aromatic and herbal, preferring rosemary and Mediterranean",
        scentFamilies: ["Rosemary", "Aromatic", "Herbal"],
        icon: "fa-seedling",
        keywords: ["aromatic", "rosemary", "herbal", "mediterranean", "fresh"]
    },
    {
        id: 80,
        name: "Fir Balsam",
        gender: "male",
        description: "Resinous and wintery, loving fir and balsamic notes",
        scentFamilies: ["Fir", "Balsamic", "Resinous"],
        icon: "fa-tree",
        keywords: ["resinous", "fir", "wintery", "balsamic", "fresh"]
    },
    {
        id: 81,
        name: "Saffron Gold",
        gender: "male",
        description: "Luxurious and warm, appreciating saffron and precious spices",
        scentFamilies: ["Saffron", "Spicy", "Amber"],
        icon: "fa-crown",
        keywords: ["luxurious", "saffron", "precious", "warm", "rich"]
    },
    {
        id: 82,
        name: "Clove Warmth",
        gender: "male",
        description: "Spicy and comforting, drawn to clove and warm spices",
        scentFamilies: ["Clove", "Spicy", "Warm"],
        icon: "fa-mug-hot",
        keywords: ["spicy", "clove", "warm", "comforting", "rich"]
    },
    {
        id: 83,
        name: "Juniper Wild",
        gender: "male",
        description: "Crisp and botanical, preferring juniper and gin-like notes",
        scentFamilies: ["Juniper", "Green", "Aromatic"],
        icon: "fa-martini-glass",
        keywords: ["crisp", "juniper", "botanical", "wild", "fresh"]
    },
    {
        id: 84,
        name: "Moss Stone",
        gender: "male",
        description: "Mineral and earthy, loving moss and stone-like accords",
        scentFamilies: ["Moss", "Earthy", "Mineral"],
        icon: "fa-gem",
        keywords: ["mineral", "moss", "earthy", "stone", "grounded"]
    },
    {
        id: 85,
        name: "Nutmeg Spice",
        gender: "male",
        description: "Warm and aromatic, drawn to nutmeg and baking spices",
        scentFamilies: ["Nutmeg", "Spicy", "Warm"],
        icon: "fa-mortar-pestle",
        keywords: ["warm", "nutmeg", "spicy", "aromatic", "comforting"]
    },
    {
        id: 86,
        name: "Cypress Green",
        gender: "male",
        description: "Fresh and woody, preferring cypress and Mediterranean greens",
        scentFamilies: ["Cypress", "Green", "Woody"],
        icon: "fa-tree-city",
        keywords: ["fresh", "cypress", "green", "woody", "mediterranean"]
    },
    {
        id: 87,
        name: "Birch Smoke",
        gender: "male",
        description: "Smoky and leathery, loving birch tar and campfire notes",
        scentFamilies: ["Birch", "Smoky", "Leather"],
        icon: "fa-campground",
        keywords: ["smoky", "birch", "leather", "campfire", "rugged"]
    },
    {
        id: 88,
        name: "Elemi Fresh",
        gender: "male",
        description: "Bright and resinous, drawn to elemi and fresh resins",
        scentFamilies: ["Elemi", "Resinous", "Citrus"],
        icon: "fa-sun",
        keywords: ["bright", "elemi", "resinous", "fresh", "uplifting"]
    },
    {
        id: 89,
        name: "Thyme Herbal",
        gender: "male",
        description: "Culinary and aromatic, preferring thyme and kitchen herbs",
        scentFamilies: ["Thyme", "Herbal", "Aromatic"],
        icon: "fa-utensils",
        keywords: ["herbal", "thyme", "culinary", "aromatic", "fresh"]
    },
    {
        id: 90,
        name: "Musk Modern",
        gender: "male",
        description: "Clean and sensual, loving white musk and contemporary blends",
        scentFamilies: ["Musk", "Clean", "Modern"],
        icon: "fa-circle-notch",
        keywords: ["clean", "musk", "modern", "sensual", "minimalist"]
    },

    // NON-BINARY PROFILES (10)
    {
        id: 91,
        name: "Androgynous Chic",
        gender: "nonbinary",
        description: "Balanced and sophisticated, appreciating gender-neutral woody musks",
        scentFamilies: ["Woody", "Musk", "Aromatic"],
        icon: "fa-circle-half-stroke",
        keywords: ["androgynous", "balanced", "chic", "sophisticated", "neutral"]
    },
    {
        id: 92,
        name: "Free Spirit",
        gender: "nonbinary",
        description: "Unbounded and natural, loving earthy and botanical blends",
        scentFamilies: ["Earthy", "Herbal", "Green"],
        icon: "fa-feather",
        keywords: ["free", "natural", "unbounded", "botanical", "earthy"]
    },
    {
        id: 93,
        name: "Modern Fusion",
        gender: "nonbinary",
        description: "Contemporary and innovative, drawn to unique unexpected combinations",
        scentFamilies: ["Modern", "Woody", "Floral"],
        icon: "fa-atom",
        keywords: ["modern", "fusion", "innovative", "unique", "contemporary"]
    },
    {
        id: 94,
        name: "Balanced Harmony",
        gender: "nonbinary",
        description: "Zen and centered, preferring balanced floral-woody compositions",
        scentFamilies: ["Floral", "Woody", "Musk"],
        icon: "fa-yin-yang",
        keywords: ["balanced", "harmonious", "zen", "centered", "peaceful"]
    },
    {
        id: 95,
        name: "Artistic Soul",
        gender: "nonbinary",
        description: "Creative and expressive, loving unconventional and artistic blends",
        scentFamilies: ["Unique", "Aromatic", "Spicy"],
        icon: "fa-palette",
        keywords: ["artistic", "creative", "expressive", "unconventional", "unique"]
    },
    {
        id: 96,
        name: "Urban Explorer",
        gender: "nonbinary",
        description: "Cosmopolitan and edgy, appreciating leather and modern accords",
        scentFamilies: ["Leather", "Woody", "Fresh"],
        icon: "fa-city",
        keywords: ["urban", "cosmopolitan", "edgy", "explorer", "modern"]
    },
    {
        id: 97,
        name: "Natural Essence",
        gender: "nonbinary",
        description: "Pure and organic, drawn to natural and minimalist scents",
        scentFamilies: ["Green", "Clean", "Herbal"],
        icon: "fa-leaf",
        keywords: ["natural", "pure", "organic", "minimalist", "essence"]
    },
    {
        id: 98,
        name: "Sophisticated Edge",
        gender: "nonbinary",
        description: "Refined yet bold, loving sophisticated spicy-woody blends",
        scentFamilies: ["Spicy", "Woody", "Amber"],
        icon: "fa-gem",
        keywords: ["sophisticated", "edgy", "bold", "refined", "spicy"]
    },
    {
        id: 99,
        name: "Fresh Neutrality",
        gender: "nonbinary",
        description: "Clean and versatile, preferring fresh aquatic and citrus",
        scentFamilies: ["Aquatic", "Citrus", "Clean"],
        icon: "fa-water",
        keywords: ["fresh", "neutral", "clean", "versatile", "crisp"]
    },
    {
        id: 100,
        name: "Bold Individuality",
        gender: "nonbinary",
        description: "Confident and unique, appreciating bold oud and unconventional notes",
        scentFamilies: ["Oud", "Leather", "Spicy"],
        icon: "fa-star",
        keywords: ["bold", "individual", "confident", "unique", "unconventional"]
    }
];

/**
 * Match user to best personality profile based on quiz answers
 */
function matchPersonalityProfile(answers) {
    // Extract key data from answers
    const gender = answers.gender || 'nonbinary';
    const age = parseInt(answers.age) || 25;
    const lifestyle = (answers.lifestyle || '').toLowerCase();
    const scentPreferences = (answers.scentPreferences || []).map(s => s.toLowerCase());
    const occasionPreferences = (answers.occasionPreferences || []).map(o => o.toLowerCase());
    
    // Filter profiles by gender
    let candidateProfiles = personalityProfiles.filter(p => {
        if (gender === 'male') return p.gender === 'male';
        if (gender === 'female') return p.gender === 'female';
        return p.gender === 'nonbinary';
    });
    
    // Score each profile
    const scoredProfiles = candidateProfiles.map(profile => {
        let score = 0;
        
        // Match scent families
        if (scentPreferences && profile.scentFamilies) {
            profile.scentFamilies.forEach(family => {
                if (scentPreferences.some(pref => family.toLowerCase().includes(pref) || pref.includes(family.toLowerCase()))) {
                    score += 10;
                }
            });
        }
        
        // Match keywords with lifestyle and preferences
        if (lifestyle && profile.keywords) {
            profile.keywords.forEach(keyword => {
                if (lifestyle.includes(keyword) || keyword.includes(lifestyle)) {
                    score += 5;
                }
            });
        }
        
        // Match keywords with occasion preferences
        if (occasionPreferences && profile.keywords) {
            occasionPreferences.forEach(occasion => {
                profile.keywords.forEach(keyword => {
                    if (occasion.includes(keyword) || keyword.includes(occasion)) {
                        score += 3;
                    }
                });
            });
        }
        
        // Age considerations (subtle adjustments)
        if (age < 25 && ['playful', 'fresh', 'sporty', 'fruity'].some(k => profile.keywords.includes(k))) {
            score += 2;
        } else if (age >= 40 && ['sophisticated', 'classic', 'elegant', 'refined'].some(k => profile.keywords.includes(k))) {
            score += 2;
        }
        
        return { profile, score };
    });
    
    // Sort by score and return top match
    scoredProfiles.sort((a, b) => b.score - a.score);
    
    // Return best match or first profile if no good matches
    return scoredProfiles[0]?.profile || candidateProfiles[0] || personalityProfiles[0];
}

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { personalityProfiles, matchPersonalityProfile };
}
