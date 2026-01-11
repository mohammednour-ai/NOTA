// DEBUG SCRIPT - Add this temporarily to script.js to see what data we're getting

// Add this at the very start of displayResults function (around line 1175)
function displayResults(perfumes) {
    // ===== DEBUG START =====
    console.log('🔍 DEBUG: Total perfumes received:', perfumes.length);
    perfumes.forEach((perfume, index) => {
        console.log(`\n📦 Perfume ${index + 1}: ${perfume.brand} - ${perfume.name}`);
        console.log('   Has retailerLinks?', perfume.hasOwnProperty('retailerLinks'));
        console.log('   retailerLinks value:', perfume.retailerLinks);
        console.log('   retailerLinks length:', perfume.retailerLinks?.length || 0);
        console.log('   Has affiliateLinks?', perfume.hasOwnProperty('affiliateLinks'));
        console.log('   All properties:', Object.keys(perfume));
    });
    // ===== DEBUG END =====

    // ... rest of the function
}
