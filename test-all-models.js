const Anthropic = require('@anthropic-ai/sdk');
require('dotenv').config();

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

async function testAllModels() {
  const modelsToTest = [
    // Claude 3.5 Sonnet variants
    'claude-3-5-sonnet-20241022',
    'claude-3-5-sonnet-20240620',
    'claude-3-5-sonnet-latest',
    'claude-3-5-sonnet',
    
    // Claude 3 Opus
    'claude-3-opus-20240229',
    'claude-3-opus-latest',
    'claude-3-opus',
    
    // Claude 3 Sonnet
    'claude-3-sonnet-20240229',
    'claude-3-sonnet-latest',
    'claude-3-sonnet',
    
    // Claude 3 Haiku
    'claude-3-haiku-20240307',
    'claude-3-haiku-latest',
    'claude-3-haiku',
    
    // Claude 2 (older)
    'claude-2.1',
    'claude-2.0'
  ];

  console.log('🧪 Testing ALL Claude Model Variations...\n');
  console.log(`API Key: ${process.env.ANTHROPIC_API_KEY.substring(0, 20)}...`);
  console.log('---\n');

  const availableModels = [];

  for (const model of modelsToTest) {
    try {
      console.log(`Testing: ${model}`);
      
      const message = await anthropic.messages.create({
        model: model,
        max_tokens: 50,
        messages: [
          {
            role: 'user',
            content: 'Say OK'
          }
        ]
      });

      console.log(`✅ SUCCESS: ${model}`);
      console.log(`   Response: ${message.content[0].text}\n`);
      availableModels.push(model);
      
    } catch (error) {
      if (error.status === 404) {
        console.log(`❌ NOT AVAILABLE: ${model}\n`);
      } else if (error.status === 400) {
        console.log(`⚠️  BAD REQUEST: ${model}\n`);
      } else {
        console.log(`❌ ERROR: ${model} - ${error.message}\n`);
      }
    }
  }
  
  console.log('===================================');
  console.log('📊 SUMMARY:');
  console.log(`Available models: ${availableModels.length}`);
  availableModels.forEach(m => console.log(`  ✅ ${m}`));
  console.log('===================================');
}

testAllModels().then(() => {
  console.log('\n✅ Test complete!');
  process.exit(0);
}).catch(error => {
  console.error('💥 Fatal error:', error);
  process.exit(1);
});
