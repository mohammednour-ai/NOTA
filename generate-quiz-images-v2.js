const axios = require('axios');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Leonardo AI API Configuration
const LEONARDO_API_KEY = process.env.LEONARDO_API_KEY || 'YOUR_LEONARDO_API_KEY_HERE';
const LEONARDO_API_URL = 'https://cloud.leonardo.ai/api/rest/v1';

// Image generation settings
const CONFIG = {
  modelId: '6bef9f1b-29cb-40c7-b9df-32b51c1f67d3', // Leonardo Phoenix
  width: 896,
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

// IMPROVED Master style - NO PERFUME BOTTLES, NO TEXT, NO BRANDS
const MASTER_STYLE = `Modern minimalist icon illustration for luxury cosmetics interface.

CRITICAL - DO NOT INCLUDE:
❌ NO perfume bottles
❌ NO brand names or text
❌ NO product packaging
❌ NO logos or labels

STYLE REQUIREMENTS:
✅ Soft watercolor + clean vector hybrid
✅ Pill-shaped landscape card (896x576px)
✅ Elegant pastel gradient background (rose gold, lavender, mint, pearl, champagne tones)
✅ Subject: ONLY the natural ingredient/element itself
✅ Minimalist, sophisticated, luxury aesthetic (Chanel/Dior inspired)
✅ Soft drop shadows, gentle glow, professional lighting
✅ Clean composition, centered subject, breathing room
✅ High-end cosmetics photography style

Subject to illustrate: `;

// All 80 image prompts - SIMPLIFIED to focus on the ingredient only
const IMAGE_PROMPTS = {
  // FLORAL NOTES (7 images)
  floral: [
    {
      name: 'rose',
      prompt: `Single elegant red rose bloom with delicate petals, soft focus, on gradient background of rose gold to blush pink. Romantic, timeless, classic floral beauty.`
    },
    {
      name: 'jasmine',
      prompt: `Cluster of white jasmine flowers with yellow centers, botanical illustration style, on pearl white to soft lavender gradient. Pure, delicate, fresh floral.`
    },
    {
      name: 'lavender',
      prompt: `Two sprigs of purple lavender in bloom, soft botanical style, on lavender to pale blue gradient. Calming, spa-like, French countryside aesthetic.`
    },
    {
      name: 'lily',
      prompt: `Single white lily flower with curved elegant petals, on cream to soft pink gradient. Graceful, pure, sophisticated floral.`
    },
    {
      name: 'peony',
      prompt: `Full pink peony flower with layered ruffled petals, on blush to champagne gradient. Romantic, luxurious, feminine floral.`
    },
    {
      name: 'violet',
      prompt: `Small purple violet flowers in natural cluster, botanical art style, on violet to white gradient. Sweet, delicate, vintage charm.`
    },
    {
      name: 'orange-blossom',
      prompt: `White orange blossoms with small orange in background, on peach to cream gradient. Fresh, Mediterranean, citrusy floral.`
    }
  ],

  // CITRUS NOTES (6 images)
  citrus: [
    {
      name: 'lemon',
      prompt: `Fresh whole lemon and lemon slice with water droplets, on bright yellow gradient. Zesty, energizing, clean citrus fruit.`
    },
    {
      name: 'orange',
      prompt: `Juicy orange cut in half showing segments, on peachy orange gradient. Warm, cheerful, inviting citrus.`
    },
    {
      name: 'bergamot',
      prompt: `Bergamot citrus fruit whole and sliced, on yellow-green gradient. Refined, elegant, sophisticated citrus.`
    },
    {
      name: 'grapefruit',
      prompt: `Pink grapefruit slice showing vibrant segments, on coral pink gradient. Fresh, vibrant, healthy citrus.`
    },
    {
      name: 'mandarin',
      prompt: `Small mandarins with peeled segments, on warm orange gradient. Sweet, cheerful, playful citrus.`
    },
    {
      name: 'lime',
      prompt: `Green lime with fresh slice, on bright lime to mint gradient. Zesty, tropical, energizing citrus.`
    }
  ],

  // WOODY NOTES (6 images)
  woody: [
    {
      name: 'sandalwood',
      prompt: `Sandalwood pieces showing natural grain texture, on warm beige to brown gradient. Earthy, meditative, grounding wood.`
    },
    {
      name: 'cedar',
      prompt: `Cedar wood pieces with fresh needles, on soft brown to tan gradient. Forest, strong, masculine woody scent.`
    },
    {
      name: 'oud',
      prompt: `Dark oud wood resin with golden amber highlights, on burgundy to gold gradient. Exotic, opulent, mysterious wood.`
    },
    {
      name: 'vetiver',
      prompt: `Vetiver grass roots and stems, on green to brown earth gradient. Natural, earthy, sophisticated botanical.`
    },
    {
      name: 'patchouli',
      prompt: `Large patchouli leaves in natural arrangement, on deep green to earth gradient. Bohemian, natural, earthy botanical.`
    },
    {
      name: 'pine',
      prompt: `Pine cone with fresh green needles, on forest green gradient. Fresh, winter woodland, clean nature.`
    }
  ],

  // SWEET NOTES (6 images)
  sweet: [
    {
      name: 'vanilla',
      prompt: `Vanilla bean pods split open showing black seeds, on cream to beige gradient. Warm, comforting, classic gourmand.`
    },
    {
      name: 'caramel',
      prompt: `Golden caramel swirl dripping elegantly, on amber to cream gradient. Sweet, indulgent, rich dessert aesthetic.`
    },
    {
      name: 'honey',
      prompt: `Honey dipper with golden honey dripping, honeycomb in background, on golden amber gradient. Natural, sweet, warm.`
    },
    {
      name: 'chocolate',
      prompt: `Dark chocolate pieces broken to show texture, on rich brown to gold gradient. Decadent, sophisticated, indulgent.`
    },
    {
      name: 'cotton-candy',
      prompt: `Fluffy pink and blue cotton candy cloud, on pastel pink to blue gradient. Playful, fun, sweet nostalgia.`
    },
    {
      name: 'tonka-bean',
      prompt: `Tonka beans scattered naturally, on dark brown to caramel gradient. Exotic, sophisticated, warm gourmand.`
    }
  ],

  // SPICY NOTES (6 images)
  spicy: [
    {
      name: 'cinnamon',
      prompt: `Cinnamon sticks bundled with scattered powder, on rust to cream gradient. Warm, cozy, festive spice.`
    },
    {
      name: 'pepper',
      prompt: `Black peppercorns scattered artistically, on dark gray to silver gradient. Bold, sharp, modern spice.`
    },
    {
      name: 'cardamom',
      prompt: `Green cardamom pods with scattered seeds, on sage green gradient. Exotic, aromatic, elegant spice.`
    },
    {
      name: 'clove',
      prompt: `Clove buds arranged in pattern, on deep brown to rust gradient. Warm, festive, intense spice.`
    },
    {
      name: 'ginger',
      prompt: `Fresh ginger root with sliced piece showing interior, on pale yellow gradient. Spicy, zingy, energizing.`
    },
    {
      name: 'nutmeg',
      prompt: `Whole nutmeg with half grated, on warm brown gradient. Cozy, holiday, comforting spice.`
    }
  ],

  // FRUITY NOTES (6 images)
  fruity: [
    {
      name: 'strawberry',
      prompt: `Fresh red strawberries showing seeds and leaves, on soft red to pink gradient. Sweet, romantic, fresh berry.`
    },
    {
      name: 'apple',
      prompt: `Red apple with green leaf and fresh slice, on red to cream gradient. Fresh, crisp, healthy fruit.`
    },
    {
      name: 'peach',
      prompt: `Fuzzy peach with slice showing juicy interior, on soft peach gradient. Sweet, summery, delicate fruit.`
    },
    {
      name: 'pear',
      prompt: `Green pear with slice showing texture, on soft green to cream gradient. Elegant, sophisticated, fresh fruit.`
    },
    {
      name: 'pineapple',
      prompt: `Tropical pineapple with fresh slice showing pattern, on yellow to teal gradient. Fun, exotic, tropical fruit.`
    },
    {
      name: 'plum',
      prompt: `Purple plum cut to show golden interior, on purple to gold gradient. Rich, mysterious, deep fruit.`
    }
  ],

  // SEASONS (4 images)
  seasons: [
    {
      name: 'spring',
      prompt: `Cherry blossom branch with floating petals, on soft pink to mint gradient. Fresh, renewal, blooming season.`
    },
    {
      name: 'summer',
      prompt: `Stylized sun rays with ocean wave element, on aqua to coral gradient. Bright, joyful, beach vibes.`
    },
    {
      name: 'fall',
      prompt: `Autumn leaves in gold and burgundy tones, on amber to rust gradient. Cozy, nostalgic, harvest season.`
    },
    {
      name: 'winter',
      prompt: `Elegant snowflake crystal with sparkles, on icy blue to silver gradient. Crisp, serene, cold beauty.`
    }
  ],

  // TIME OF DAY (5 images)
  'time-of-day': [
    {
      name: 'morning',
      prompt: `Sunrise with gentle sun rays and coffee cup silhouette, on orange to gold gradient. Fresh, awakening, energizing.`
    },
    {
      name: 'afternoon',
      prompt: `Bright sun at peak with light rays, on sky blue to white gradient. Clear, active, midday energy.`
    },
    {
      name: 'evening',
      prompt: `Sunset with city skyline silhouette, on purple-orange gradient. Romantic, sophisticated, dusk elegance.`
    },
    {
      name: 'night',
      prompt: `Crescent moon with scattered stars, on deep blue to purple gradient. Mysterious, peaceful, nocturnal.`
    },
    {
      name: 'all-day',
      prompt: `Sun and moon cycle in harmony, on blue to gold gradient. Versatile, complete, 24-hour coverage.`
    }
  ],

  // MOODS (7 images)
  moods: [
    {
      name: 'confident',
      prompt: `Elegant crown with jewel accents, on royal purple to gold gradient. Powerful, regal, self-assured.`
    },
    {
      name: 'romantic',
      prompt: `Two hearts intertwined with rose petals, on rose pink gradient. Loving, tender, passionate emotion.`
    },
    {
      name: 'energetic',
      prompt: `Lightning bolt with dynamic motion lines, on electric blue to yellow gradient. Vibrant, dynamic, powerful.`
    },
    {
      name: 'calm',
      prompt: `Zen stones stacked with water ripples, on teal to mint gradient. Peaceful, serene, meditative.`
    },
    {
      name: 'mysterious',
      prompt: `Ornate masquerade mask, on deep purple to black gradient. Enigmatic, seductive, intriguing.`
    },
    {
      name: 'happy',
      prompt: `Bright sunshine with smile and sparkles, on cheerful yellow gradient. Joyful, cheerful, uplifting.`
    },
    {
      name: 'sophisticated',
      prompt: `Pearl necklace with diamond clasp, on cream to silver gradient. Elegant, refined, luxurious.`
    }
  ],

  // OCCASIONS (6 images)
  occasions: [
    {
      name: 'daily-wear',
      prompt: `Calendar page with coffee cup, on beige to blue gradient. Casual, everyday, practical lifestyle.`
    },
    {
      name: 'work-office',
      prompt: `Sleek briefcase with gold accents, on navy to silver gradient. Professional, polished, business.`
    },
    {
      name: 'evening-events',
      prompt: `Elegant cocktail dress with champagne glass, on black to gold gradient. Glamorous, formal, sophisticated.`
    },
    {
      name: 'date-night',
      prompt: `Two champagne glasses clinking with bokeh lights, on burgundy to rose gold gradient. Romantic, intimate, special.`
    },
    {
      name: 'casual',
      prompt: `Coffee cup with latte art, on warm tan to cream gradient. Relaxed, comfortable, easygoing.`
    },
    {
      name: 'special-occasions',
      prompt: `Gift box with ribbon and confetti, on gold to pink gradient. Festive, celebratory, memorable.`
    }
  ],

  // STYLES (6 images)
  styles: [
    {
      name: 'elegant',
      prompt: `Evening gown silhouette with pearls, on champagne to silver gradient. Sophisticated, refined, classy.`
    },
    {
      name: 'casual',
      prompt: `Denim jeans with white sneakers, on light blue gradient. Comfortable, relaxed, everyday style.`
    },
    {
      name: 'sporty',
      prompt: `Running shoe with water bottle, on teal to lime gradient. Active, athletic, fitness lifestyle.`
    },
    {
      name: 'romantic',
      prompt: `Floral dress with lace details, on pink to lavender gradient. Feminine, dreamy, soft style.`
    },
    {
      name: 'bold',
      prompt: `Leather jacket with metal studs, on black to red gradient. Edgy, confident, statement style.`
    },
    {
      name: 'minimalist',
      prompt: `Geometric shapes in perfect balance, on white to gray gradient. Clean, zen, modern simplicity.`
    }
  ],

  // INTENSITY (5 images)
  intensity: [
    {
      name: 'very-light',
      prompt: `Single delicate water droplet, on transparent white gradient. Subtle, whisper-soft, barely-there.`
    },
    {
      name: 'light',
      prompt: `Soft cloud with gentle aura, on pale blue gradient. Light, airy, delicate presence.`
    },
    {
      name: 'moderate',
      prompt: `Balanced flame and water yin-yang, on neutral beige gradient. Balanced, noticeable, moderate strength.`
    },
    {
      name: 'strong',
      prompt: `Bold flame with radiating energy, on orange to red gradient. Powerful, noticeable, commanding.`
    },
    {
      name: 'very-strong',
      prompt: `Explosive starburst with dramatic rays, on deep red to black gradient. Intense, bold, maximum impact.`
    }
  ],

  // LONGEVITY (5 images)
  longevity: [
    {
      name: '2-4-hours',
      prompt: `Small hourglass with minimal sand, on soft beige gradient. Brief, fleeting, short duration.`
    },
    {
      name: '4-6-hours',
      prompt: `Half-filled hourglass, on warm sand gradient. Moderate, several hours, mid-length wear.`
    },
    {
      name: '6-8-hours',
      prompt: `Three-quarter filled hourglass, on amber gradient. Good duration, workday length, reliable.`
    },
    {
      name: '8-plus-hours',
      prompt: `Full hourglass with abundant sand, on rich brown gradient. Long-lasting, extended wear, persistent.`
    },
    {
      name: 'all-day',
      prompt: `24-hour clock face showing full cycle, on blue to gold gradient. Complete coverage, dawn to dusk, maximum longevity.`
    }
  ]
};

// Generate image using Leonardo AI
async function generateImage(prompt, category, name) {
  try {
    console.log(`\n🎨 Generating: ${category}/${name}`);
    console.log(`   Prompt preview: ${prompt.substring(0, 100)}...`);
    
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

// Check generation status and get image URL
async function checkAndDownload(generationId, category, name, maxAttempts = 60) {
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
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
      const status = generation.status;
      
      if (status === 'COMPLETE') {
        if (generation.generated_images && generation.generated_images.length > 0) {
          const imageUrl = generation.generated_images[0].url;
          console.log(`   ✓ Generation complete!`);
          await downloadImage(imageUrl, category, name);
          return true;
        } else {
          console.error(`   ✗ No images in completed generation`);
          return false;
        }
      } else if (status === 'FAILED') {
        console.error(`   ✗ Generation failed`);
        return false;
      } else {
        process.stdout.write(`\r   ⏳ Status: ${status} - Waiting... (${attempt}/${maxAttempts})`);
        await new Promise(resolve => setTimeout(resolve, 5000)); // Wait 5 seconds
      }
    } catch (error) {
      console.error(`\n   ✗ Error checking status:`, error.response?.data || error.message);
      return false;
    }
  }
  
  console.error(`\n   ✗ Timeout waiting for generation`);
  return false;
}

// Download image from URL
async function downloadImage(url, category, name) {
  try {
    const response = await axios.get(url, { responseType: 'arraybuffer' });
    const filename = `${name}.jpg`;
    const filepath = path.join(OUTPUT_DIR, category, filename);
    
    fs.writeFileSync(filepath, response.data);
    console.log(`   ✓ Saved: ${category}/${filename}`);
    
    // Display file size for verification
    const stats = fs.statSync(filepath);
    console.log(`   📊 Size: ${(stats.size / 1024).toFixed(1)} KB`);
    
    return true;
  } catch (error) {
    console.error(`   ✗ Error downloading:`, error.message);
    return false;
  }
}

// Main generation process
async function generateAllImages() {
  console.log('🚀 Starting Leonardo AI image generation...\n');
  console.log('⚠️  IMPORTANT: Each image will be reviewed after generation.');
  console.log('⚠️  Make sure images show ONLY the ingredient/element, NO perfume bottles!\n');
  
  const totalImages = Object.values(IMAGE_PROMPTS).reduce((sum, cat) => sum + cat.length, 0);
  console.log(`📊 Total images to generate: ${totalImages}\n`);
  
  createDirectories();
  
  let totalGenerated = 0;
  let totalFailed = 0;
  const failedItems = [];
  
  for (const [category, prompts] of Object.entries(IMAGE_PROMPTS)) {
    console.log(`\n${'='.repeat(60)}`);
    console.log(`📁 Category: ${category.toUpperCase()} (${prompts.length} images)`);
    console.log('='.repeat(60));
    
    for (const item of prompts) {
      const generationId = await generateImage(item.prompt, category, item.name);
      
      if (generationId) {
        const success = await checkAndDownload(generationId, category, item.name);
        if (success) {
          totalGenerated++;
          console.log(`   ✅ SUCCESS: ${category}/${item.name} (${totalGenerated}/${totalImages})\n`);
        } else {
          totalFailed++;
          failedItems.push(`${category}/${item.name}`);
          console.log(`   ❌ FAILED: ${category}/${item.name}\n`);
        }
      } else {
        totalFailed++;
        failedItems.push(`${category}/${item.name}`);
        console.log(`   ❌ FAILED: ${category}/${item.name}\n`);
      }
      
      // Delay between generations to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }
  
  console.log('\n' + '='.repeat(60));
  console.log('🎉 IMAGE GENERATION COMPLETE!');
  console.log('='.repeat(60));
  console.log(`✅ Successfully generated: ${totalGenerated}/${totalImages}`);
  console.log(`❌ Failed: ${totalFailed}/${totalImages}`);
  
  if (failedItems.length > 0) {
    console.log(`\n⚠️  Failed items (can retry these manually):`);
    failedItems.forEach(item => console.log(`   - ${item}`));
  }
  
  console.log(`\n📁 Images saved to: ${OUTPUT_DIR}`);
  console.log(`\n🔍 NEXT STEP: Review images in "${OUTPUT_DIR}" folder`);
  console.log(`   - Check that images show ONLY ingredients/elements`);
  console.log(`   - NO perfume bottles, NO brand names, NO text`);
  console.log('='.repeat(60));
}

// Run if called directly
if (require.main === module) {
  if (!process.env.LEONARDO_API_KEY || process.env.LEONARDO_API_KEY === 'YOUR_LEONARDO_API_KEY_HERE') {
    console.error('❌ ERROR: Please set LEONARDO_API_KEY in your .env file');
    console.log('\nYour API key: 135c0fb5-8d7b-4a4a-b53e-f620cc8a3a30');
    process.exit(1);
  }
  
  generateAllImages().catch(error => {
    console.error('💥 Fatal error:', error);
    process.exit(1);
  });
}

module.exports = { generateAllImages, IMAGE_PROMPTS };
