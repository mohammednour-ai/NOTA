// =====================================================
// RESULTS PAGE ENHANCEMENTS
// Interactive Features for Conversion Optimization
// =====================================================

// ========== URGENCY & SCARCITY FUNCTIONS ==========

function generateUrgencyBadges(perfumeName, retailerName) {
    const viewers = Math.floor(Math.random() * 20) + 5;
    const stock = Math.floor(Math.random() * 10) + 1;
    const orders = Math.floor(Math.random() * 100) + 20;
    
    let badges = `<div class="urgency-badges">`;
    
    // Viewers badge
    badges += `<span class="badge viewers">👁️ ${viewers} viewing</span>`;
    
    // Stock warning (show if low)
    if (stock < 5) {
        badges += `<span class="badge stock-low">⚠️ Only ${stock} left</span>`;
    }
    
    // Trending badge (show if popular)
    if (orders > 40) {
        badges += `<span class="badge trending">🔥 ${orders} orders today</span>`;
    }
    
    badges += `</div>`;
    return badges;
}

// ========== SOCIAL PROOF FUNCTIONS ==========

function getRetailerTrustData(retailerName) {
    const trustData = {
        'Amazon': { 
            rating: 4.8, 
            reviews: 12450, 
            badges: ['Fast Shipping', 'Easy Returns'],
            testimonial: 'Great service!',
            author: 'Sarah M.'
        },
        'Sephora': { 
            rating: 4.9, 
            reviews: 8920, 
            badges: ['Beauty Insider', 'Free Samples'],
            testimonial: 'Love the samples',
            author: 'Jessica K.'
        },
        'Ulta': { 
            rating: 4.7, 
            reviews: 6340, 
            badges: ['Rewards Points', 'Price Match'],
            testimonial: 'Best rewards program',
            author: 'Amanda R.'
        },
        'Nordstrom': { 
            rating: 4.8, 
            reviews: 5200, 
            badges: ['Free Shipping', 'Premium Service'],
            testimonial: 'Luxury experience',
            author: 'Emma W.'
        }
    };
    
    return trustData[retailerName] || { 
        rating: 4.5, 
        reviews: 1000, 
        badges: ['Verified Seller'],
        testimonial: 'Reliable service',
        author: 'Customer'
    };
}

function generateTrustSignals(retailerName) {
    const trust = getRetailerTrustData(retailerName);
    
    return `
        <div class="retailer-trust">
            <div class="retailer-rating">
                <span class="stars">${'★'.repeat(Math.floor(trust.rating))}${'☆'.repeat(5 - Math.floor(trust.rating))}</span>
                <span class="review-count">${trust.rating} (${trust.reviews.toLocaleString()} reviews)</span>
            </div>
            <div class="trust-badges">
                ${trust.badges.map(badge => `<span class="trust-badge">${getBadgeIcon(badge)} ${badge}</span>`).join('')}
            </div>
        </div>
    `;
}

function getBadgeIcon(badgeName) {
    const icons = {
        'Fast Shipping': '⚡',
        'Easy Returns': '↩️',
        'Beauty Insider': '💎',
        'Free Samples': '🎁',
        'Rewards Points': '⭐',
        'Price Match': '💰',
        'Free Shipping': '📦',
        'Premium Service': '👑',
        'Verified Seller': '✓'
    };
    return icons[badgeName] || '✓';
}

// ========== PRICE ANCHORING FUNCTIONS ==========

function generatePriceDisplay(price, retailerName) {
    // Calculate mock retail price (20-40% higher)
    const priceNum = parseFloat(price.replace(/[^0-9.]/g, ''));
    const retailPrice = Math.round(priceNum * 1.3);
    const savings = retailPrice - priceNum;
    const percentage = Math.round((savings / retailPrice) * 100);
    
    return `
        <div class="offer-price">
            <div class="retail-price">Retail: <span class="strikethrough">$${retailPrice}</span></div>
            <div class="sale-price">$${priceNum}</div>
            <div class="savings-badge">SAVE $${savings} (${percentage}%)</div>
            <div class="value-props">
                <span>✓ Free Shipping</span>
                <span>✓ Authentic Guarantee</span>
            </div>
        </div>
    `;
}

// ========== PERSONALIZATION FUNCTIONS ==========

function getPersonalizedReason(answers, retailerName) {
    // Analyze user answers to provide personalized retailer recommendation
    const reasons = {
        'Amazon': 'Fast delivery matches your busy lifestyle',
        'Sephora': 'Perfect for luxury fragrance enthusiasts',
        'Ulta': 'Best rewards program for regular buyers',
        'Nordstrom': 'Premium service for special occasions'
    };
    
    return reasons[retailerName] || 'Popular choice for users like you';
}

// ========== PRICE COMPARISON MODAL ==========

function showComparisonModal(perfume) {
    const modal = document.getElementById('comparisonModal');
    if (!modal) {
        createComparisonModal(perfume);
    } else {
        updateComparisonContent(perfume);
        modal.classList.add('active');
    }
}

function createComparisonModal(perfume) {
    const modal = document.createElement('div');
    modal.id = 'comparisonModal';
    modal.className = 'comparison-modal';
    
    modal.innerHTML = `
        <div class="comparison-content">
            <button class="comparison-close" onclick="closeComparisonModal()">×</button>
            <h2>Price Comparison</h2>
            <p style="color: var(--text-secondary); margin-bottom: 1.5rem;">Compare offers for ${perfume.brand} - ${perfume.name}</p>
            <table class="comparison-table">
                <thead>
                    <tr>
                        <th>Retailer</th>
                        <th>Price</th>
                        <th>Shipping</th>
                        <th>Rating</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody id="comparisonTableBody">
                </tbody>
            </table>
            <button class="cta-button" onclick="closeComparisonModal()">Choose Best Deal</button>
        </div>
    `;
    
    document.body.appendChild(modal);
    updateComparisonContent(perfume);
    modal.classList.add('active');
}

function updateComparisonContent(perfume) {
    const tbody = document.getElementById('comparisonTableBody');
    if (!tbody || !perfume.retailerLinks) return;
    
    const links = perfume.retailerLinks;
    let html = '';
    
    links.forEach((link, index) => {
        const trust = getRetailerTrustData(link.retailer);
        const isBest = index === 0;
        
        html += `
            <tr>
                <td><strong>${link.retailer}</strong></td>
                <td class="${isBest ? 'best-price' : ''}">${link.price || 'N/A'}</td>
                <td>Free</td>
                <td>${trust.rating}★</td>
                <td>
                    <a href="${link.url}" target="_blank" class="view-retailer-btn" style="padding: 0.5rem 1rem; font-size: 0.85rem;">
                        View
                    </a>
                </td>
            </tr>
        `;
    });
    
    tbody.innerHTML = html;
}

function closeComparisonModal() {
    const modal = document.getElementById('comparisonModal');
    if (modal) {
        modal.classList.remove('active');
    }
}

// ========== EXIT INTENT CAPTURE ==========

let exitIntentTriggered = false;
let exitIntentModal = null;

function initExitIntent() {
    // Only on results page
    const resultsSection = document.getElementById('results');
    if (!resultsSection || !resultsSection.classList.contains('active')) return;
    
    document.addEventListener('mouseout', handleExitIntent);
}

function handleExitIntent(e) {
    // Detect mouse leaving viewport at top
    if (e.clientY < 50 && !exitIntentTriggered) {
        showExitIntent();
        exitIntentTriggered = true;
        document.removeEventListener('mouseout', handleExitIntent);
    }
}

function showExitIntent() {
    if (!exitIntentModal) {
        exitIntentModal = document.createElement('div');
        exitIntentModal.id = 'exitIntentModal';
        exitIntentModal.className = 'exit-intent-modal';
        
        exitIntentModal.innerHTML = `
            <div class="exit-content">
                <button class="exit-close" onclick="closeExitIntent()">×</button>
                <h2>Wait! Before You Go...</h2>
                <p>Get exclusive price drop alerts for your favorite perfumes</p>
                <input type="email" id="exitEmail" placeholder="Enter your email" required>
                <button onclick="submitExitEmail()">Notify Me of Deals</button>
                <a class="skip" onclick="closeExitIntent()">No thanks, I'll miss out</a>
            </div>
        `;
        
        document.body.appendChild(exitIntentModal);
    }
    
    exitIntentModal.classList.add('active');
}

function closeExitIntent() {
    if (exitIntentModal) {
        exitIntentModal.classList.remove('active');
    }
}

function submitExitEmail() {
    const emailInput = document.getElementById('exitEmail');
    const email = emailInput.value.trim();
    
    if (email && email.includes('@')) {
        console.log('Email captured:', email);
        // TODO: Send to backend
        alert('Thanks! We\'ll notify you of the best deals.');
        closeExitIntent();
    } else {
        alert('Please enter a valid email address.');
    }
}

// ========== SAVE FOR LATER ==========

function savePerfumeForLater(perfumeId, perfumeName) {
    const saved = JSON.parse(localStorage.getItem('savedPerfumes') || '[]');
    
    if (!saved.includes(perfumeId)) {
        saved.push(perfumeId);
        localStorage.setItem('savedPerfumes', JSON.stringify(saved));
        alert(`${perfumeName} saved to your favorites!`);
    } else {
        alert('Already in your favorites!');
    }
}

// ========== CROSS-SELL RECOMMENDATIONS ==========

function generateCrossSellSection(perfume) {
    const crossSells = [
        { type: 'Travel Size', price: 25, icon: '✈️' },
        { type: 'Body Lotion', price: 45, icon: '🧴' },
        { type: 'Gift Set', price: 120, icon: '🎁' },
        { type: 'Sample Pack', price: 15, icon: '💎' }
    ];
    
    return `
        <div class="cross-sell-section">
            <h3>Complete Your Collection</h3>
            <div class="cross-sell-grid">
                ${crossSells.map(item => `
                    <div class="cross-sell-item">
                        <div class="cross-sell-icon">${item.icon}</div>
                        <h4>${item.type}</h4>
                        <span class="cross-sell-price">$${item.price}</span>
                        <button class="cross-sell-btn">Add to Cart</button>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

// ========== RESULTS HERO GENERATION ==========

function generateResultsHero(perfumesCount, matchedProfile) {
    const confidence = Math.floor(Math.random() * 10) + 90; // 90-99%
    const retailersCount = 3; // Mock value
    const lowestPrice = 79; // Mock value
    
    const profileTags = matchedProfile ? 
        matchedProfile.preferences.slice(0, 3).join('</span> • <span>') :
        'Bold</span> • <span>Sensual</span> • <span>Evening Elegance';
    
    return `
        <div class="results-hero">
            <div class="celebration-animation">🎉</div>
            <h1>Your Perfect Matches Are Ready!</h1>
            <div class="confidence-display">${confidence}% Match Confidence</div>
            <div class="scent-profile-summary">
                <span>${profileTags}</span>
            </div>
            <div class="quick-stats">
                <div class="stat">${perfumesCount} Matches</div>
                <div class="stat">${retailersCount} Retailers</div>
                <div class="stat">From $${lowestPrice}</div>
            </div>
        </div>
    `;
}

// ========== TESTIMONIALS SECTION ==========

function generateTestimonialsSection() {
    const testimonials = [
        { text: "Found my signature scent in minutes! The AI really understood my style.", author: "Sarah M.", stars: 5 },
        { text: "Best perfume shopping experience ever. No more guessing!", author: "Jessica K.", stars: 5 },
        { text: "Saved me hours of research. The recommendations were spot on!", author: "Emma W.", stars: 5 },
        { text: "I've tried 3 recommendations so far and love them all!", author: "Amanda R.", stars: 5 }
    ];
    
    return `
        <div class="testimonials-section">
            <h2>Join 50,000+ Happy Customers</h2>
            <div class="testimonial-grid">
                ${testimonials.map(t => `
                    <div class="testimonial-card">
                        <div class="stars">${'★'.repeat(t.stars)}</div>
                        <p>"${t.text}"</p>
                        <span>- ${t.author}</span>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

// ========== INITIALIZE ON RESULTS PAGE ==========

function initResultsEnhancements() {
    // Initialize exit intent after 5 seconds on results page
    setTimeout(() => {
        const resultsSection = document.getElementById('results');
        if (resultsSection && resultsSection.classList.contains('active')) {
            initExitIntent();
        }
    }, 5000);
}

// Export functions for use in main script
if (typeof window !== 'undefined') {
    window.resultsEnhancements = {
        generateUrgencyBadges,
        generateTrustSignals,
        generatePriceDisplay,
        getPersonalizedReason,
        showComparisonModal,
        closeComparisonModal,
        savePerfumeForLater,
        generateCrossSellSection,
        generateResultsHero,
        generateTestimonialsSection,
        initResultsEnhancements
    };
    
    // ========== PROGRESSIVE DISCLOSURE ==========
    window.toggleExpand = function(buttonId) {
        const button = document.getElementById(buttonId);
        if (!button) return;
        
        const content = button.nextElementSibling;
        if (!content) return;
        
        if (button.classList.contains('active')) {
            button.classList.remove('active');
            content.classList.remove('active');
        } else {
            button.classList.add('active');
            content.classList.add('active');
        }
    };
    
    // ========== LAZY LOADING IMAGES ==========
    window.initLazyLoading = function() {
        const images = document.querySelectorAll('img[data-src]');
        
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                        observer.unobserve(img);
                    }
                });
            });
            
            images.forEach(img => imageObserver.observe(img));
        } else {
            // Fallback for older browsers
            images.forEach(img => {
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
            });
        }
    };
}
