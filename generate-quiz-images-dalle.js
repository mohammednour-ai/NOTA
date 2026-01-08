const OpenAI = require('openai');
const axios = require('axios');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// OpenAI API Configuration
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || 'YOUR_OPENAI_API_KEY_HERE'
});

// Image generation settings for DALL-E
const CONFIG = {
  model: 'dall-e-3',  // Latest DALL-E model
  size: '1792x1024',  // Landscape format (closest to 3:2 ratio)
  quality: 'hd',      // High quality
  style: 'natural',   // Natural style for illustrations
  n: 1                // One image per request
};

// Output directory
const OUTPUT_DIR = path.join(__dirname, 'public', 'images', 'quiz-cards');

// Create output directory structure
function createDirectories() {
  const categories = [
    'floral', 'citrus', 'woody', 'sweet', 'spicy', 'fruity',
    'seasons', 'time-of-day', 'moods', 'occasions', 'styles', 'intensity', 'longevity'
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
const MASTER_STYLE = `Create a minimalist luxury icon illustration for an elegant perfume quiz app. 

Style: Soft watercolor and vector hybrid, pastel gradient background (lavender, rose gold, mint, pearl tones), clean lines, subtle drop shadows, rounded pill-shaped card aesthetic inspired by Chanel and Dior branding.

Format: Landscape orientation, professional product photography lighting, high-end cosmetics aesthetic, gentle glow effect, sophisticated color palette.

Subject: `;

// All 80 image prompts organized by category
const IMAGE_PROMPTS = {
  // FLORAL NOTES (7 images) - Question 9
  floral: [
    {
      name: 'rose',
      prompt: `Single elegant red rose with delicate petals on soft rose gold gradient background. Romantic, feminine, timeless elegance. Watercolor style with gold accents.`
    },
    {
      name: 'jasmine',
      prompt: `Three white jasmine flowers with yellow centers on pearl white to lavender gradient. Light, airy, pure, delicate botanical illustration.`
    },
    {
      name: 'lavender',
      prompt: `Two lavender sprigs with purple blooms on soft lavender gradient. Calming, spa-like, French countryside aesthetic. Clean botanical style.`
    },
    {
      name: 'lily',
      prompt: `Single white lily flower with elegant curved petals on cream to pink gradient. Pure, graceful, sophisticated floral illustration.`
    },
    {
      name: 'peony',
      prompt: `Full pink peony bloom with layered petals on blush to champagne gradient. Romantic, luxurious, feminine botanical art.`
    },
    {
      name: 'violet',
      prompt: `Cluster of small purple violet flowers on soft violet to white gradient. Delicate, sweet, vintage charm botanical illustration.`
    },
    {
      name: 'orange-blossom',
      prompt: `White orange blossoms with small orange fruit on peach to cream gradient. Fresh, Mediterranean, citrusy floral illustration.`
    }
  ],

  // CITRUS NOTES (6 images) - Question 10
  citrus: [
    {
      name: 'lemon',
      prompt: `Fresh lemon and lemon slice with water droplets on sunshine yellow gradient. Energizing, zesty, clean, vibrant fruit illustration.`
    },
    {
      name: 'orange',
      prompt: `Orange half showing juicy segments with blossom on peachy gradient. Warm, inviting, cheerful citrus illustration.`
    },
    {
      name: 'bergamot',
      prompt: `Bergamot citrus fruit with cut half on yellow-green gradient. Refined, elegant, sophisticated citrus illustration.`
    },
    {
      name: 'grapefruit',
      prompt: `Pink grapefruit slice with whole fruit on coral pink gradient. Fresh, vibrant, healthy citrus illustration.`
    },
    {
      name: 'mandarin',
      prompt: `Small mandarin oranges with peeled segments on warm orange gradient. Sweet, cheerful, playful citrus illustration.`
    },
    {
      name: 'lime',
      prompt: `Green lime with slice on bright lime to mint gradient. Zesty, tropical, energizing citrus illustration.`
    }
  ],

  // WOODY NOTES (6 images) - Question 11
  woody: [
    {
      name: 'sandalwood',
      prompt: `Sandalwood cross-section showing grain texture on warm beige to brown gradient. Earthy, meditative, grounding wood illustration.`
    },
    {
      name: 'cedar',
      prompt: `Cedar wood planks with needles on soft brown to tan gradient. Strong, forest, masculine woody illustration.`
    },
    {
      name: 'oud',
      prompt: `Mystical oud resin with golden flecks on burgundy to gold gradient. Exotic, opulent, luxurious wood illustration.`
    },
    {
      name: 'vetiver',
      prompt: `Vetiver grass roots on green to brown gradient. Natural, earthy, sophisticated botanical illustration.`
    },
    {
      name: 'patchouli',
      prompt: `Large patchouli leaves on deep green to earth gradient. Bohemian, natural, earthy botanical illustration.`
    },
    {
      name: 'pine',
      prompt: `Pine cone with needles on forest green gradient. Fresh, winter woodland, clean nature illustration.`
    }
  ],

  // SWEET NOTES (6 images) - Question 13
  sweet: [
    {
      name: 'vanilla',
      prompt: `Vanilla bean pods split open showing seeds on cream to beige gradient. Warm, comforting, classic gourmand illustration.`
    },
    {
      name: 'caramel',
      prompt: `Golden caramel swirl dripping elegantly on amber to cream gradient. Sweet, indulgent, rich dessert illustration.`
    },
    {
      name: 'honey',
      prompt: `Honey jar with dripping honey and honeycomb on golden amber gradient. Natural, sweet, warm gourmand illustration.`
    },
    {
      name: 'chocolate',
      prompt: `Dark chocolate pieces on brown to gold gradient. Rich, sophisticated, decadent gourmand illustration.`
    },
    {
      name: 'cotton-candy',
      prompt: `Fluffy pink and blue cotton candy on pastel gradient. Playful, fun, sweet nostalgic illustration.`
    },
    {
      name: 'tonka-bean',
      prompt: `Tonka beans on dark brown to caramel gradient. Exotic, sophisticated, warm gourmand illustration.`
    }
  ],

  // SPICY NOTES (6 images) - Question 14
  spicy: [
    {
      name: 'cinnamon',
      prompt: `Cinnamon sticks bundled with powder on rust to cream gradient. Warm, cozy, festive spice illustration.`
    },
    {
      name: 'pepper',
      prompt: `Black peppercorns scattered on dark gray to silver gradient. Bold, sharp, modern spice illustration.`
    },
    {
      name: 'cardamom',
      prompt: `Green cardamom pods split showing seeds on sage green gradient. Exotic, aromatic spice illustration.`
    },
    {
      name: 'clove',
      prompt: `Clove buds in star pattern on deep brown to rust gradient. Warm, festive, intense spice illustration.`
    },
    {
      name: 'ginger',
      prompt: `Fresh ginger root with slice on pale yellow gradient. Spicy, zingy, energizing root illustration.`
    },
    {
      name: 'nutmeg',
      prompt: `Whole nutmeg nut with grater on warm brown gradient. Cozy, holiday, comforting spice illustration.`
    }
  ],

  // FRUITY NOTES (6 images) - Question 16
  fruity: [
    {
      name: 'strawberry',
      prompt: `Fresh red strawberries with seeds on soft red to pink gradient. Sweet, romantic, fresh fruit illustration.`
    },
    {
      name: 'apple',
      prompt: `Red apple with green leaf and slice on red to cream gradient. Fresh, crisp, healthy fruit illustration.`
    },
    {
      name: 'peach',
      prompt: `Fuzzy peach with slice on soft peach gradient. Sweet, summery, delicate fruit illustration.`
    },
    {
      name: 'pear',
      prompt: `Green pear with slice on soft green to cream gradient. Elegant, sophisticated fruit illustration.`
    },
    {
      name: 'pineapple',
      prompt: `Tropical pineapple with slice on yellow to teal gradient. Fun, exotic, tropical fruit illustration.`
    },
    {
      name: 'plum',
      prompt: `Purple plum cut showing golden flesh on purple to gold gradient. Rich, mysterious fruit illustration.`
    }
  ],

  // SEASONS (4 images) - Question 4
  seasons: [
    {
      name: 'spring',
      prompt: `Cherry blossom branch with floating petals on soft pink to mint gradient. Fresh, renewal, romantic spring scene.`
    },
    {
      name: 'summer',
      prompt: `Stylized sun with rays and waves on aqua to coral gradient. Bright, joyful, beach summer scene.`
    },
    {
      name: 'fall',
      prompt: `Three autumn leaves in gold and burgundy on amber gradient. Cozy, nostalgic autumn scene.`
    },
    {
      name: 'winter',
      prompt: `Elegant snowflake with sparkles on icy blue to silver gradient. Crisp, serene winter scene.`
    }
  ],

  // TIME OF DAY (5 images) - Question 5
  'time-of-day': [
    {
      name: 'morning',
      prompt: `Sunrise with gentle rays and coffee cup on orange to gold gradient. Fresh, energizing morning scene.`
    },
    {
      name: 'afternoon',
      prompt: `Bright sun at zenith with light beams on sky blue gradient. Clear, active daytime scene.`
    },
    {
      name: 'evening',
      prompt: `Sunset with city skyline on purple-orange gradient. Romantic, sophisticated dusk scene.`
    },
    {
      name: 'night',
      prompt: `Crescent moon with stars on deep blue to purple gradient. Mysterious, peaceful night scene.`
    },
    {
      name: 'all-day',
      prompt: `Sun and moon cycle illustration on blue to gold gradient. Versatile, complete day cycle scene.`
    }
  ],

  // MOODS (7 images) - Question 28
  moods: [
    {
      name: 'confident',
      prompt: `Elegant crown with gemstones on royal purple to gold gradient. Powerful, regal, self-assured mood illustration.`
    },
    {
      name: 'romantic',
      prompt: `Two interlocking hearts with rose petals on rose pink gradient. Loving, tender, passionate mood illustration.`
    },
    {
      name: 'energetic',
      prompt: `Lightning bolt with motion lines on electric blue to yellow gradient. Dynamic, vibrant mood illustration.`
    },
    {
      name: 'calm',
      prompt: `Zen stones stacked with water ripples on teal to mint gradient. Peaceful, serene mood illustration.`
    },
    {
      name: 'mysterious',
      prompt: `Masquerade mask with ornate details on deep purple gradient. Enigmatic, seductive mood illustration.`
    },
    {
      name: 'happy',
      prompt: `Bright sunshine with smile and sparkles on yellow gradient. Joyful, cheerful mood illustration.`
    },
    {
      name: 'sophisticated',
      prompt: `Pearl necklace with diamond clasp on cream to silver gradient. Elegant, refined mood illustration.`
    }
  ],

  // OCCASIONS (6 images) - Question 3
  occasions: [
    {
      name: 'daily-wear',
      prompt: `Calendar with checkmarks and coffee cup on beige to blue gradient. Casual, practical daily routine illustration.`
    },
    {
      name: 'work-office',
      prompt: `Sleek briefcase with gold accents on navy to silver gradient. Professional, polished work illustration.`
    },
    {
      name: 'evening-events',
      prompt: `Cocktail dress with champagne glass on black to gold gradient. Glamorous, elegant event illustration.`
    },
    {
      name: 'date-night',
      prompt: `Champagne glasses clinking with bokeh lights on burgundy to rose gold gradient. Romantic, intimate illustration.`
    },
    {
      name: 'casual',
      prompt: `Coffee cup with latte art on warm tan gradient. Relaxed, comfortable casual illustration.`
    },
    {
      name: 'special-occasions',
      prompt: `Gift box with ribbon and confetti on gold to pink gradient. Festive, celebratory illustration.`
    }
  ],

  // PERSONAL STYLES (6 images) - Question 21
  styles: [
    {
      name: 'elegant',
      prompt: `Evening gown silhouette with pearls on champagne to silver gradient. Sophisticated, refined fashion illustration.`
    },
    {
      name: 'casual',
      prompt: `Denim jeans with white sneakers on light blue gradient. Comfortable, relaxed style illustration.`
    },
    {
      name: 'sporty',
      prompt: `Running shoe with water bottle on teal to lime gradient. Active, athletic lifestyle illustration.`
    },
    {
      name: 'romantic',
      prompt: `Floral dress with lace details on pink to lavender gradient. Feminine, dreamy style illustration.`
    },
    {
      name: 'bold',
      prompt: `Leather jacket with studs on black to red gradient. Edgy, confident style illustration.`
    },
    {
      name: 'minimalist',
      prompt: `Geometric shapes in harmony on white to gray gradient. Clean, zen, modern style illustration.`
    }
  ],

  // INTENSITY LEVELS (5 images) - Question 6
  intensity: [
    {
      name: 'very-light',
      prompt: `Single delicate water droplet on transparent white gradient. Subtle, whisper-soft intensity illustration.`
    },
    {
      name: 'light',
      prompt: `Soft cloud with gentle aura on pale blue gradient. Light, airy intensity illustration.`
    },
    {
      name: 'moderate',
      prompt: `Balanced flame and water symbols on neutral gradient. Balanced, moderate intensity illustration.`
    },
    {
      name: 'strong',
      prompt: `Bold flame with radiating energy on orange to red gradient. Powerful, noticeable intensity illustration.`
    },
    {
      name: 'very-strong',
      prompt: `Explosive burst with dramatic rays on deep red to black gradient. Bold, commanding intensity illustration.`
    }
  ],

  // LONGEVITY (5 images) - Question 7
  longevity: [
    {
      name: '2-4-hours',
      prompt: `Small hourglass with minimal sand on soft beige gradient. Brief, fleeting time illustration.`
    },
    {
      name: '4-6-hours',
      prompt: `Half-filled hourglass on warm sand gradient. Short duration, moderate time illustration.`
    },
    {
      name: '6-8-hours',
      prompt: `Three-quarter hourglass on amber gradient. Good duration, reliable time illustration.`
    },
    {
      name: '8-plus-hours',
      prompt: `Full hourglass with abundant sand on rich brown gradient. Long-lasting, extended time illustration.`
    },
    {
      name: 'all-day',
      prompt: `Clock showing full 24-hour cycle on blue to gold gradient. Complete day coverage, maximum duration illustration.`
    }
  ]
};

// Generate image using DALL-E
async function generateImage(prompt, category, name) {
  try {
    console.log(`\n🎨 Generating: ${category}/${name}`);
    
    const fullPrompt = MASTER_STYLE + prompt;
    
    const response = await openai.images.generate({
      model: CONFIG.model,
      prompt: fullPrompt,
      size: CONFIG.size,
      quality: CONFIG.quality,
      style: CONFIG.style,
      n: CONFIG.n,
      response_format: 'url'
    });
    
    const imageUrl = response.data[0].url;
    console.log(`   ✓ Image generated successfully`);
    
    return imageUrl;
  } catch (error) {
    console.error(`   ✗ Error generating ${category}/${name}:`, error.message);
    return null;
  }
}

// Download image from URL
async function downloadImage(url, category, name) {
  try {
    const response = await axios.get(url, { responseType: 'arraybuffer' });
    const filename = `${name}.png`;
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
  console.log('🚀 Starting DALL-E image generation...\n');
  
  const totalImages = Object.values(IMAGE_PROMPTS).reduce((sum, cat) => sum + cat.length, 0);
  console.log(`📊 Total images to generate: ${totalImages}\n`);
  
  createDirectories();
  
  let totalGenerated = 0;
  let totalFailed = 0;
  const failedItems = [];
  
  for (const [category, prompts] of Object.entries(IMAGE_PROMPTS)) {
    console.log(`\n📁 Category: ${category.toUpperCase()} (${prompts.length} images)`);
    console.log('='.repeat(60));
    
    for (const item of prompts) {
      const imageUrl = await generateImage(item.prompt, category, item.name);
      
      if (imageUrl) {
        const success = await downloadImage(imageUrl, category, item.name);
        if (success) {
          totalGenerated++;
        } else {
          totalFailed++;
          failedItems.push(`${category}/${item.name}`);
        }
      } else {
        totalFailed++;
        failedItems.push(`${category}/${item.name}`);
      }
      
      // Small delay between generations to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
  
  console.log('\n' + '='.repeat(60));
  console.log('🎉 IMAGE GENERATION COMPLETE!');
  console.log('='.repeat(60));
  console.log(`✅ Successfully generated: ${totalGenerated}`);
  console.log(`❌ Failed: ${totalFailed}`);
  
  if (failedItems.length > 0) {
    console.log(`\n⚠️  Failed items:`);
    failedItems.forEach(item => console.log(`   - ${item}`));
  }
  
  console.log(`\n📁 Images saved to: ${OUTPUT_DIR}`);
  console.log('='.repeat(60));
}

// Main execution
if (require.main === module) {
  if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'YOUR_OPENAI_API_KEY_HERE') {
    console.error('❌ ERROR: Please set OPENAI_API_KEY in your .env file');
    console.log('\nGet your API key from: https://platform.openai.com/api-keys');
    process.exit(1);
  }
  
  generateAllImages().catch(error => {
    console.error('💥 Fatal error:', error);
    process.exit(1);
  });
}

module.exports = { generateAllImages, IMAGE_PROMPTS };
