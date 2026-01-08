/**
 * ReferralManager - Handle referral tracking and code generation
 * No rewards or incentives - simple sharing only
 */

class ReferralManager {
    constructor(config = {}) {
        // Use production URL if not localhost
        this.baseUrl = window.location.hostname === 'localhost' 
            ? window.location.origin 
            : 'https://www.nota-life.com';
        this.userId = config.userId || this.generateUserId();
        this.referralCode = null;
        this.stats = {
            clicks: 0,
            signups: 0
        };
    }

    /**
     * Initialize referral manager
     */
    async init() {
        // Check for existing user ID
        const storedUserId = localStorage.getItem('userId');
        if (storedUserId) {
            this.userId = storedUserId;
        } else {
            localStorage.setItem('userId', this.userId);
        }

        // Check for existing referral code
        const storedCode = localStorage.getItem('referralCode');
        if (storedCode) {
            this.referralCode = storedCode;
        }

        // Check if user came from a referral
        await this.checkInboundReferral();

        // Load user's referral stats
        await this.loadReferralStats();
    }

    /**
     * Generate unique user ID
     */
    generateUserId() {
        return 'USER_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    /**
     * Generate unique referral code
     */
    async generateReferralCode(userName = 'User') {
        if (this.referralCode) {
            return this.referralCode;
        }

        // Create code locally
        const name = userName.slice(0, 4).toUpperCase().replace(/[^A-Z]/g, 'X');
        const random = Math.floor(Math.random() * 10000);
        const code = `${name}${random}`;

        try {
            // Save to backend
            const response = await fetch('/api/referral/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: this.userId,
                    referralCode: code,
                    userName: userName
                })
            });

            if (response.ok) {
                const data = await response.json();
                this.referralCode = data.referralCode || code;
            } else {
                this.referralCode = code;
            }
        } catch (error) {
            console.log('Using local referral code:', error.message);
            this.referralCode = code;
        }

        // Store locally
        localStorage.setItem('referralCode', this.referralCode);
        return this.referralCode;
    }

    /**
     * Get referral link
     */
    getReferralLink(utmSource = 'direct') {
        if (!this.referralCode) {
            console.error('No referral code generated');
            return this.baseUrl;
        }

        return `${this.baseUrl}?ref=${this.referralCode}&utm_source=${utmSource}&utm_medium=referral&utm_campaign=share_app`;
    }

    /**
     * Check if user came from a referral link
     */
    async checkInboundReferral() {
        const urlParams = new URLSearchParams(window.location.search);
        const refCode = urlParams.get('ref');

        if (refCode) {
            console.log('📥 Inbound referral detected:', refCode);
            
            // Store the referral source
            localStorage.setItem('referredBy', refCode);
            localStorage.setItem('referralTimestamp', Date.now().toString());

            // Track the click
            await this.trackReferralClick(refCode);
        }
    }

    /**
     * Track referral click
     */
    async trackReferralClick(referralCode) {
        try {
            const response = await fetch('/api/referral/track-click', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    referralCode: referralCode,
                    clickedAt: Date.now(),
                    userAgent: navigator.userAgent
                })
            });

            if (response.ok) {
                console.log('✅ Referral click tracked');
            }
        } catch (error) {
            console.error('Failed to track referral click:', error);
        }
    }

    /**
     * Track referral signup (call when quiz is completed)
     */
    async trackReferralSignup() {
        const referredBy = localStorage.getItem('referredBy');
        const referralTimestamp = localStorage.getItem('referralTimestamp');

        if (!referredBy) {
            return; // Not a referred user
        }

        try {
            const response = await fetch('/api/referral/track-signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    referralCode: referredBy,
                    referredUserId: this.userId,
                    signupAt: Date.now(),
                    conversionTime: Date.now() - parseInt(referralTimestamp || '0')
                })
            });

            if (response.ok) {
                console.log('✅ Referral signup tracked');
                
                // Clear referral data
                localStorage.removeItem('referredBy');
                localStorage.removeItem('referralTimestamp');
            }
        } catch (error) {
            console.error('Failed to track referral signup:', error);
        }
    }

    /**
     * Load user's referral statistics (optional for analytics)
     */
    async loadReferralStats() {
        if (!this.referralCode) {
            return;
        }

        try {
            const response = await fetch(`/api/referral/stats/${this.referralCode}`);
            
            if (response.ok) {
                const data = await response.json();
                this.stats = {
                    clicks: data.clicks || 0,
                    signups: data.signups || 0
                };
                
                console.log('📊 Referral stats loaded:', this.stats);
            }
        } catch (error) {
            console.error('Failed to load referral stats:', error);
        }
    }

    /**
     * Track analytics event
     */
    trackEvent(eventName, data) {
        console.log('📊 Referral Analytics:', eventName, data);

        // Google Analytics
        if (typeof gtag !== 'undefined') {
            gtag('event', eventName, data);
        }

        // Meta Pixel
        if (typeof fbq !== 'undefined') {
            fbq('track', eventName, data);
        }

        // Custom dataLayer
        if (window.dataLayer) {
            window.dataLayer.push({
                event: eventName,
                ...data
            });
        }
    }
}

// Global instance
let referralManager = null;

// Initialize on page load
document.addEventListener('DOMContentLoaded', async () => {
    referralManager = new ReferralManager();
    await referralManager.init();
});

// Helper function for global access
function getReferralManager() {
    return referralManager;
}

// Helper function to track events
function trackReferralEvent(eventName, data) {
    if (referralManager) {
        referralManager.trackEvent(eventName, data);
    }
}

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ReferralManager;
}
