const axios = require('axios');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Leonardo AI API Configuration
const LEONARDO_API_KEY = process.env.LEONARDO_API_KEY || 'YOUR_LEONARDO_API_KEY_HERE';
const LEONARDO_API_URL = 'https://cloud.leonardo.ai/api/rest/v1';

// Image generation settings
const CONFIG = {
  modelId: '6bef9f1b-29cb-40c7-b9df-32b51c1f67d3', // Leonardo Phoenix (best for illustrations)
  width: 896,  // Closest to 3:2 ratio for 300x200px cards
  height: 576,
  numImages: 1,
  promptMagic: true,
  photoReal: false,
  alchemy: true,
  presetStyle: 'ILLUSTRATION'
};

// Output directory
const OUTPUT_DIR = path.join(__dirname, 'public', 'images', 'quiz-cards');

// Create output directory structure
function createDirectories() {
  const categories = [
    'floral', 'citrus', 'woody', 'sweet', 'spicy', 'fruity',
    'seasons', 'time-of-day', 'moods', 'occasions', 'styles'
  ];
  
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }
  
  categories.forEach(cat => {
    const catDir = path.join(OUTPUT_DIR, cat);
    if (!fs.existsSync(catDir)) {
      fs.mkdirSync(catDir, { recursive: true });
    }
  });
  
  console.log('✅ Directory structure created');
}

// Master style prompt that will be prepended to all prompts
const MASTER_STYLE = `Create a modern minimalist icon illustration for a luxury perfume quiz app.

STYLE REQUIREMENTS:
- Soft watercolor and vector hybrid style
- Pastel gradient backgrounds (lavender, rose gold, mint, pearl)
- Clean, elegant lines with subtle shadows
- Rounded, pill-shaped card format
- Professional luxury aesthetic similar to Chanel/Dior branding
- Flat design with slight 3D depth
- White/transparent elements on gradient background
- Soft glow effect around main subject

TECHNICAL SPECS:
- Landscape orientation (3:2 ratio)
- Resolution: High quality, web-optimized
- Style: Illustration, not photorealistic
- Color palette: Soft pastels, whites, gold accents
- Shadows: Subtle drop shadows
- Borders: Rounded corners

MOOD: Elegant, sophisticated, calming, luxurious

SUBJECT: `;

// All image prompts organized by category
const IMAGE_PROMPTS = {
  floral: [
    {
      name: 'rose',
      prompt: `Single elegant red rose with 2-3 petals, floating on a soft rose gold gradient background (from light pink to rose gold). The rose should be semi-transparent with delicate shadows, drawn in a soft watercolor style with gold outline accents. Romantic, timeless, feminine, sophisticated.`
    },
    {
      name: 'jasmine',
      prompt: `Three white jasmine flowers with small yellow centers, arranged delicately on a pearl white to soft lavender gradient background. Flowers should appear light and airy with subtle transparency. Fresh, pure, elegant, delicate.`
    },
    {
      name: 'lavender',
      prompt: `Two elegant lavender sprigs with purple blooms on a soft lavender to periwinkle gradient background. Botanical illustration style with clean lines and gentle shadowing. Calming, peaceful, spa-like, elegant.`
    },
    {
      name: 'lily',
      prompt: `Single elegant white lily flower with soft petals and visible stamens, on a cream to soft pink gradient background. Graceful curves, minimalist botanical style. Pure, elegant, feminine, timeless.`
    },
    {
      name: 'peony',
      prompt: `Full blooming peony flower with layered petals in soft pink, on a blush to champagne gradient background. Romantic, lush, full appearance. Luxurious, feminine, romantic, sophisticated.`
    },
    {
      name: 'violet',
      prompt: `Small delicate violet flowers in cluster, deep purple petals on a soft violet to white gradient background. Dainty, charming, minimalist style. Sweet, delicate, gentle, vintage.`
    },
    {
      name: 'orange-blossom',
      prompt: `Orange tree flowers (white petals) with small orange fruit in background, on a soft peach to cream gradient. Fresh, citrusy, clean illustration. Fresh, bright, Mediterranean, elegant.`
    }
  ],
  
  citrus: [
    {
      name: 'lemon',
      prompt: `One whole fresh lemon and one lemon slice, floating on a bright sunshine gradient (pale yellow to soft gold). Droplets of water on the lemon surface, clean vector style with soft shadows. Energizing, fresh, clean, vibrant.`
    },
    {
      name: 'orange',
      prompt: `Half an orange with visible segments and one orange blossom flower, on a warm peachy gradient (light peach to soft orange). Bright, appetizing, with subtle juice droplets. Warm, inviting, cheerful, refreshing.`
    },
    {
      name: 'bergamot',
      prompt: `Whole bergamot fruit (yellowish-green citrus) with one cut half showing segments, on a soft yellow-green gradient background. Elegant, sophisticated citrus illustration. Refined, elegant, fresh, uplifting.`
    },
    {
      name: 'grapefruit',
      prompt: `Pink grapefruit slice showing beautiful pink segments and one whole grapefruit, on a coral pink to peach gradient. Fresh, juicy appearance with water droplets. Vibrant, fresh, energizing, healthy.`
    },
    {
      name: 'mandarin',
      prompt: `Small mandarin oranges (2-3) with one peeled showing segments, on a warm orange to soft yellow gradient. Cute, sweet, cheerful illustration. Sweet, cheerful, bright, playful.`
    },
    {
      name: 'lime',
      prompt: `Fresh green lime with one slice cut, on a bright lime green to mint gradient background. Zesty, vibrant appearance with water droplets. Zesty, energizing, tropical, fresh.`
    }
  ],
  
  woody: [
    {
      name: 'sandalwood',
      prompt: `Cross-section of elegant sandalwood piece showing wood grain texture, on a warm beige to soft brown gradient. Natural, organic appearance with subtle wood texture lines. Warm, grounding, earthy, meditative.`
    },
    {
      name: 'cedar',
      prompt: `Cedar wood planks with visible grain pattern and small cedar branch with needles, on a soft brown to tan gradient. Natural woodsy aesthetic. Strong, grounding, forest, masculine.`
    },
    {
      name: 'oud',
      prompt: `Mystical oud wood resin piece with intricate patterns and golden flecks, on a deep burgundy to gold gradient. Luxurious, exotic appearance with shimmer. Mysterious, opulent, exotic, powerful.`
    },
    {
      name: 'vetiver',
      prompt: `Vetiver grass roots (long thin roots) with earthy soil texture, on a soft green to brown gradient background. Natural, organic, minimalist style. Earthy, natural, grounding, sophisticated.`
    },
    {
      name: 'patchouli',
      prompt: `Patchouli leaves (large green leaves) with subtle texture, on a deep green to earth brown gradient. Botanical illustration with organic feel. Earthy, hippie-chic, bohemian, natural.`
    },
    {
      name: 'pine',
      prompt: `Pine cone with pine needles branch, on a forest green to soft teal gradient background. Winter woodland aesthetic with snow accent. Fresh, winter, clean, forest.`
    }
  ],
  
  sweet: [
    {
      name: 'vanilla',
      prompt: `Vanilla bean pods (brown) with one split open showing tiny seeds, on a cream to soft beige gradient. Warm, inviting, gourmand aesthetic. Warm, comforting, sweet, classic.`
    },
    {
      name: 'caramel',
      prompt: `Caramel swirl dripping elegantly with golden shimmer, on a golden amber to cream gradient background. Delicious, smooth appearance. Sweet, indulgent, rich, comforting.`
    },
    {
      name: 'honey',
      prompt: `Honey jar with honey dripping and honeycomb pattern, on a golden yellow to amber gradient. Natural, sweet, organic aesthetic with bees motif. Sweet, natural, golden, warm.`
    },
    {
      name: 'chocolate',
      prompt: `Elegant chocolate pieces (dark) with one broken showing texture, on a brown to gold gradient background. Luxurious, indulgent appearance. Rich, indulgent, sophisticated, decadent.`
    },
    {
      name: 'cotton-candy',
      prompt: `Fluffy cotton candy cloud in soft pink and blue swirls, on a pastel pink to baby blue gradient. Whimsical, playful, sweet aesthetic. Playful, sweet, fun, nostalgic.`
    },
    {
      name: 'tonka-bean',
      prompt: `Tonka beans (dark wrinkled beans) with vanilla-like appearance, on a dark brown to caramel gradient. Sophisticated, gourmet aesthetic. Warm, exotic, sophisticated, comforting.`
    }
  ],
  
  spicy: [
    {
      name: 'cinnamon',
      prompt: `Cinnamon sticks bundled together with cinnamon powder dust, on a warm rust to cream gradient background. Warm, aromatic appearance. Warm, cozy, spicy, festive.`
    },
    {
      name: 'pepper',
      prompt: `Black peppercorns scattered with one broken open, on a dark gray to silver gradient. Bold, elegant, minimal style. Bold, sharp, modern, sophisticated.`
    },
    {
      name: 'cardamom',
      prompt: `Green cardamom pods (whole and split) showing black seeds inside, on a sage green to cream gradient. Exotic, aromatic aesthetic. Exotic, warm, sophisticated, aromatic.`
    },
    {
      name: 'clove',
      prompt: `Clove buds in star pattern arrangement, on a deep brown to rust gradient background. Warm, festive, aromatic appearance. Warm, spicy, festive, intense.`
    },
    {
      name: 'ginger',
      prompt: `Fresh ginger root with one slice showing fiber texture, on a pale yellow to soft orange gradient. Natural, zesty appearance. Spicy, energizing, warm, zingy.`
    },
    {
      name: 'nutmeg',
      prompt: `Whole nutmeg nut with grater and nutmeg powder, on a warm brown to cream gradient. Cozy, festive aesthetic. Warm, cozy, holiday, comforting.`
    }
  ],
  
  fruity: [
    {
      name: 'strawberry',
      prompt: `Fresh red strawberries with green leaves and one cut showing seeds, on a soft red to pink gradient. Juicy, sweet appearance. Sweet, fresh, romantic, playful.`
    },
    {
      name: 'apple',
      prompt: `Red apple with green leaf and one apple slice, on a soft red to cream gradient. Clean, fresh, healthy aesthetic. Fresh, clean, crisp, healthy.`
    },
    {
      name: 'peach',
      prompt: `Fuzzy peach with soft pink-orange skin and one slice, on a soft peach to cream gradient. Delicate, summer fruit aesthetic. Sweet, summery, soft, romantic.`
    },
    {
      name: 'pear',
      prompt: `Elegant green pear with one slice, on a soft green to cream gradient background. Sophisticated fruit illustration. Elegant, fresh, subtle, sophisticated.`
    },
    {
      name: 'pineapple',
      prompt: `Tropical pineapple with geometric pattern skin and one slice, on a bright yellow to tropical teal gradient. Fun, tropical aesthetic. Tropical, fun, exotic, sweet.`
    },
    {
      name: 'plum',
      prompt: `Deep purple plum with one cut showing golden flesh, on a purple to gold gradient background. Rich, luxurious fruit aesthetic. Rich, mysterious, deep, sophisticated.`
    }
  ],
  
  seasons: [
    {
      name: 'spring',
      prompt: `Cherry blossom branch with soft pink blooms and few petals floating, on a soft pink to mint green gradient. Light, airy, delicate Japanese-inspired illustration. Fresh, renewal, romantic, gentle.`
    },
    {
      name: 'summer',
      prompt: `Stylized sun with gentle rays and small wave elements at bottom, on a bright aqua to coral gradient. Playful yet sophisticated beach aesthetic. Bright, carefree, energetic, joyful.`
    },
    {
      name: 'fall',
      prompt: `Three elegant autumn leaves (maple, oak) in gold, burgundy, and amber tones, floating on a warm amber to rust gradient. Cozy autumn aesthetic. Warm, cozy, nostalgic, sophisticated.`
    },
    {
      name: 'winter',
      prompt: `Elegant snowflake with intricate geometric patterns and small sparkles, on an icy blue to silver gradient. Crystal-inspired luxury winter aesthetic. Cool, crisp, elegant, serene.`
    }
  ],
  
  'time-of-day': [
    {
      name: 'morning',
      prompt: `Sunrise with gentle rays over horizon and coffee cup silhouette, on a soft orange to golden yellow gradient. Fresh start aesthetic. Fresh, energizing, new, bright.`
    },
    {
      name: 'afternoon',
      prompt: `Bright sun at zenith with light beams, on a bright sky blue to white gradient. Clear, vibrant daytime aesthetic. Bright, active, vibrant, clear.`
    },
    {
      name: 'evening',
      prompt: `Sunset with warm colors and city skyline silhouette, on a purple-orange to pink gradient. Romantic dusk aesthetic. Romantic, sophisticated, warm, transitional.`
    },
    {
      name: 'night',
      prompt: `Crescent moon with stars and subtle galaxy background, on a deep blue to purple gradient. Elegant night sky aesthetic. Mysterious, romantic, peaceful, dreamy.`
    }
  ],
  
  moods: [
    {
      name: 'confident',
      prompt: `Elegant crown with simple clean lines and subtle gemstones, floating with radiant glow on a royal purple to gold gradient. Empowerment aesthetic. Powerful, bold, regal, self-assured.`
    },
    {
      name: 'romantic',
      prompt: `Two interlocking hearts with soft glow, surrounded by small rose petals, on a rose pink to champagne gradient. Valentine's luxury aesthetic. Loving, tender, passionate, dreamy.`
    },
    {
      name: 'energetic',
      prompt: `Lightning bolt with dynamic motion lines and energy sparkles, on a bright electric blue to yellow gradient. Dynamic, powerful aesthetic. Active, vibrant, dynamic, powerful.`
    },
    {
      name: 'calm',
      prompt: `Zen stones stacked perfectly with water ripples, on a soft teal to mint gradient. Spa, meditation aesthetic. Peaceful, serene, relaxing, balanced.`
    },
    {
      name: 'mysterious',
      prompt: `Elegant masquerade mask with subtle ornate details and shadows, on a deep purple to black gradient. Enigmatic, luxurious aesthetic. Intriguing, enigmatic, seductive, sophisticated.`
    },
    {
      name: 'happy',
      prompt: `Bright sunshine with smile and small sparkles, on a bright yellow to orange gradient. Joyful, cheerful aesthetic. Joyful, bright, cheerful, optimistic.`
    },
    {
      name: 'sophisticated',
      prompt: `String of elegant pearls with diamond clasp, on a cream to silver gradient. High-end jewelry aesthetic. Elegant, luxurious, refined, classy.`
    }
  ],
  
  occasions: [
    {
      name: 'daily-wear',
      prompt: `Calendar with checkmarks and coffee cup, on a soft beige to blue gradient. Everyday routine aesthetic. Casual, practical, reliable, versatile.`
    },
    {
      name: 'work-office',
      prompt: `Sleek modern briefcase with clean lines and gold accents, on a professional navy to silver gradient. Corporate luxury aesthetic. Professional, confident, polished, capable.`
    },
    {
      name: 'evening-events',
      prompt: `Elegant cocktail dress silhouette with champagne glass, on a black to gold gradient. Upscale event aesthetic. Elegant, sophisticated, glamorous, festive.`
    },
    {
      name: 'date-night',
      prompt: `Champagne glasses clinking with bubbles and bokeh lights, on a romantic burgundy to rose gold gradient. Fine dining luxury aesthetic. Romantic, sophisticated, intimate, celebratory.`
    },
    {
      name: 'casual',
      prompt: `Coffee cup with latte art and casual sneaker, on a warm tan to cream gradient. Relaxed lifestyle aesthetic. Relaxed, comfortable, friendly, easy-going.`
    },
    {
      name: 'special-occasions',
      prompt: `Gift box with elegant ribbon and confetti, on a festive gold to pink gradient. Celebration aesthetic. Festive, joyful, memorable, celebratory.`
    }
  ],
  
  styles: [
    {
      name: 'elegant',
      prompt: `Elegant evening gown silhouette with pearl necklace, on a champagne to silver gradient. High fashion aesthetic. Sophisticated, refined, graceful, timeless.`
    },
    {
      name: 'casual',
      prompt: `Denim jeans with white sneakers, on a light blue to white gradient. Comfortable casual style. Comfortable, relaxed, easy, approachable.`
    },
    {
      name: 'sporty',
      prompt: `Running shoe with motion lines and water bottle, on a energetic teal to lime gradient. Athletic lifestyle aesthetic. Active, healthy, dynamic, energetic.`
    },
    {
      name: 'romantic',
      prompt: `Flowing floral dress with rose and lace details, on a soft pink to lavender gradient. Feminine romantic aesthetic. Feminine, delicate, dreamy, soft.`
    },
    {
      name: 'bold',
      prompt: `Leather jacket with studded details and sunglasses, on a black to red gradient. Edgy rock style aesthetic. Edgy, daring, confident, rebellious.`
    },
    {
      name: 'minimalist',
      prompt: `Simple clean geometric shapes (circle, line, triangle) in perfect harmony, on a white to gray gradient. Japanese minimalism aesthetic. Clean, simple, modern, zen.`
    }
  ]
};

// Generate image using Leonardo AI
async function generateImage(prompt, category, name) {
  try {
    console.log(`\n🎨 Generating: ${category}/${name}`);
    
    const fullPrompt = MASTER_STYLE + prompt;
    
    const response = await axios.post(
      `${LEONARDO_API_URL}/generations`,
      {
        prompt: fullPrompt,
        modelId: CONFIG.modelId,
        width: CONFIG.width,
        height: CONFIG.height,
        num_images: CONFIG.numImages,
        promptMagic: CONFIG.promptMagic,
        photoReal: CONFIG.photoReal,
        alchemy: CONFIG.alchemy,
        presetStyle: CONFIG.presetStyle
      },
      {
        headers: {
          'Authorization': `Bearer ${LEONARDO_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    const generationId = response.data.sdGenerationJob.generationId;
    console.log(`   ✓ Generation started: ${generationId}`);
    
    return generationId;
  } catch (error) {
    console.error(`   ✗ Error generating ${category}/${name}:`, error.response?.data || error.message);
    return null;
  }
}

// Check generation status and download when ready
async function checkAndDownload(generationId, category, name, retries = 0) {
  const MAX_RETRIES = 30; // 30 retries = 5 minutes max wait
  const RETRY_DELAY = 10000; // 10 seconds
  
  try {
    const response = await axios.get(
      `${LEONARDO_API_URL}/generations/${generationId}`,
      {
        headers: {
          'Authorization': `Bearer ${LEONARDO_API_KEY}`
        }
      }
    );
    
    const generation = response.data.generations_by_pk;
    
    if (generation.status === 'COMPLETE') {
      console.log(`   ✓ Generation complete!`);
      
      if (generation.generated_images && generation.generated_images.length > 0) {
        const imageUrl = generation.generated_images[0].url;
        await downloadImage(imageUrl, category, name);
        return true;
      }
    } else if (generation.status === 'FAILED') {
      console.error(`   ✗ Generation failed for ${category}/${name}`);
      return false;
    } else {
      // Still pending
      if (retries < MAX_RETRIES) {
        console.log(`   ⏳ Status: ${generation.status} - Waiting... (${retries + 1}/${MAX_RETRIES})`);
        await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
        return checkAndDownload(generationId, category, name, retries + 1);
      } else {
        console.error(`   ✗ Timeout waiting for ${category}/${name}`);
        return false;
      }
    }
  } catch (error) {
    console.error(`   ✗ Error checking status:`, error.response?.data || error.message);
    return false;
  }
}

// Download image from URL
async function downloadImage(url, category, name) {
  try {
    const response = await axios.get(url, { responseType: 'arraybuffer' });
    const filename = `${name}.jpg`;
    const filepath = path.join(OUTPUT_DIR, category, filename);
    
    fs.writeFileSync(filepath, response.data);
    console.log(`   ✓ Saved: ${category}/${filename}`);
    
    return true;
  } catch (error) {
    console.error(`   ✗ Error downloading:`, error.message);
    return false;
  }
}

// Process all images
async function generateAllImages() {
  console.log('🚀 Starting image generation...\n');
  console.log(`📊 Total images to generate: ${Object.values(IMAGE_PROMPTS).flat().length}\n`);
  
  createDirectories();
  
  let totalGenerated = 0;
  let totalFailed = 0;
  
  for (const [category, prompts] of Object.entries(IMAGE_PROMPTS)) {
    console.log(`\n📁 Category: ${category.toUpperCase()} (${prompts.length} images)`);
    console.log('='.repeat(60));
    
    for (const item of prompts) {
      const generationId = await generateImage(item.prompt, category, item.name);
      
      if (generationId) {
        const success = await checkAndDownload(generationId, category, item.name);
        if (success) {
          totalGenerated++;
        } else {
          totalFailed++;
        }
      } else {
        totalFailed++;
      }
      
      // Small delay between generations to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }
  
  console.log('\n' + '='.repeat(60));
  console.log('🎉 IMAGE GENERATION COMPLETE!');
  console.log('='.repeat(60));
  console.log(`✅ Successfully generated: ${totalGenerated}`);
  console.log(`❌ Failed: ${totalFailed}`);
  console.log(`📁 Images saved to: ${OUTPUT_DIR}`);
  console.log('='.repeat(60));
}

// Main execution
if (require.main === module) {
  if (!LEONARDO_API_KEY || LEONARDO_API_KEY === 'YOUR_LEONARDO_API_KEY_HERE') {
    console.error('❌ ERROR: Please set LEONARDO_API_KEY in your .env file');
    console.log('\nGet your API key from: https://app.leonardo.ai/settings');
    process.exit(1);
  }
  
  generateAllImages().catch(error => {
    console.error('💥 Fatal error:', error);
    process.exit(1);
  });
}

module.exports = { generateAllImages, IMAGE_PROMPTS };
