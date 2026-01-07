// Demo/Test Configuration
// This file contains sample data for testing the platform without making API calls

const DEMO_MODE = false; // Set to true to test without API keys

// Sample perfume recommendations for demo
const DEMO_RECOMMENDATIONS = [
    {
        brand: "Chanel",
        name: "Coco Mademoiselle Eau de Parfum",
        description: "A modern classic featuring fresh citrus notes that evolve into a sophisticated floral heart, anchored by warm oriental base notes. Perfect for the confident woman who appreciates timeless elegance.",
        why: "Your preference for elegant, sophisticated scents that work for both day and evening occasions makes this a perfect match. The balanced sweetness and floral notes align with your taste profile.",
        notes: ["Orange", "Jasmine", "Rose", "Patchouli", "Vanilla"],
        affiliateLinks: [
            {
                platform: "Amazon",
                url: "https://www.amazon.com/s?k=Chanel+Coco+Mademoiselle&tag=yourtag-20",
                price: "Check Amazon"
            },
            {
                platform: "ShareASale",
                url: "https://www.shareasale.com/search?query=chanel+coco+mademoiselle",
                price: "Compare Prices"
            }
        ]
    },
    {
        brand: "Viktor & Rolf",
        name: "Flowerbomb",
        description: "An explosive bouquet of flowers that creates a profusion of sensations. This floral perfume combines powerful notes of freesia, rose, orchid, and patchouli for an addictive scent.",
        why: "Your love for floral scents and preference for moderate to strong fragrances makes Flowerbomb ideal. It's perfect for evening events and special occasions as you indicated.",
        notes: ["Freesia", "Jasmine", "Rose", "Orchid", "Patchouli"],
        affiliateLinks: [
            {
                platform: "Amazon",
                url: "https://www.amazon.com/s?k=Viktor+Rolf+Flowerbomb&tag=yourtag-20",
                price: "Check Amazon"
            }
        ]
    },
    {
        brand: "Jo Malone",
        name: "English Pear & Freesia",
        description: "The essence of autumn. Ripe pears wrapped in a bouquet of white freesias, complemented by amber, patchouli and woods. Fresh, luxurious and surprisingly addictive.",
        why: "Your interest in fresh, fruity notes combined with a preference for sophisticated scents makes this Jo Malone classic perfect. It's versatile enough for daily wear as you prefer.",
        notes: ["Pear", "Freesia", "Patchouli", "Amber", "Rose"],
        affiliateLinks: [
            {
                platform: "Amazon",
                url: "https://www.amazon.com/s?k=Jo+Malone+English+Pear+Freesia&tag=yourtag-20",
                price: "Check Amazon"
            }
        ]
    },
    {
        brand: "Tom Ford",
        name: "Black Orchid",
        description: "A luxurious and sensual fragrance of rich dark accords and an alluring potion of black orchid and spice. It's modern, elegant, and sophisticated.",
        why: "Your preference for mysterious, sophisticated scents that make a statement aligns perfectly with this bold fragrance. The Oriental-Spicy family matches your taste profile.",
        notes: ["Black Orchid", "Vanilla", "Patchouli", "Bergamot", "Spice"],
        affiliateLinks: [
            {
                platform: "Amazon",
                url: "https://www.amazon.com/s?k=Tom+Ford+Black+Orchid&tag=yourtag-20",
                price: "Check Amazon"
            }
        ]
    },
    {
        brand: "Yves Saint Laurent",
        name: "Mon Paris",
        description: "A dazzling fragrance that intertwines olfactory contrasts with passion. Fresh and floral, with a vibrant expression of white flowers and fruity notes.",
        why: "Your romantic side and preference for sweet, floral scents with fruity notes makes Mon Paris ideal. It's perfect for date nights and special occasions as you mentioned.",
        notes: ["Strawberry", "Raspberry", "Pear", "Datura", "Patchouli"],
        affiliateLinks: [
            {
                platform: "Amazon",
                url: "https://www.amazon.com/s?k=YSL+Mon+Paris&tag=yourtag-20",
                price: "Check Amazon"
            }
        ]
    }
];

// Export for use in testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { DEMO_MODE, DEMO_RECOMMENDATIONS };
}
