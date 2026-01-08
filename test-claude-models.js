const Anthropic = require('@anthropic-ai/sdk');
require('dotenv').config();

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

async function testModels() {
  const modelsToTest = [
    'claude-3-5-sonnet-20241022',
    'claude-3-5-sonnet-20240620',
    'claude-3-opus-20240229',
    'claude-3-sonnet-20240229',
    'claude-3-haiku-20240307'
  ];

  console.log('🧪 Testing Claude Models...\n');

  for (const model of modelsToTest) {
    try {
      console.log(`Testing: ${model}`);
      
      const message = await anthropic.messages.create({
        model: model,
        max_tokens: 100,
        messages: [
          {
            role: 'user',
            content: 'Say "Hello" in one word.'
          }
        ]
      });

      console.log(`✅ SUCCESS: ${model}`);
      console.log(`   Response: ${message.content[0].text}\n`);
      
    } catch (error) {
      if (error.status === 404) {
        console.log(`❌ NOT AVAILABLE: ${model}`);
        console.log(`   Error: ${error.error.error.message}\n`);
      } else {
        console.log(`❌ ERROR: ${model}`);
        console.log(`   Error: ${error.message}\n`);
      }
    }
  }
}

testModels().then(() => {
  console.log('✅ Test complete!');
  process.exit(0);
}).catch(error => {
  console.error('💥 Fatal error:', error);
  process.exit(1);
});
