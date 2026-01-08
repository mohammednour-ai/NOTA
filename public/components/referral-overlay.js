/**
 * ReferralOverlay - Full-screen overlay for sharing NOTA
 * Clean, professional design without rewards
 */

class ReferralOverlay {
    constructor(config = {}) {
        // Use production URL if not localhost
        this.baseUrl = window.location.hostname === 'localhost' 
            ? window.location.origin 
            : 'https://www.nota-life.com';
        this.overlayId = 'referralOverlay';
        this.referralCode = null;
        this.referralLink = null;
    }

    /**
     * Initialize overlay
     */
    async init() {
        await this.generateReferralCode();
        this.createOverlay();
        this.attachEventListeners();
    }

    /**
     * Generate referral code
     */
    async generateReferralCode() {
        let code = localStorage.getItem('referralCode');
        
        if (!code) {
            const userName = localStorage.getItem('userName') || 'User';
            const timestamp = Date.now();
            code = this.createCode(userName, timestamp);
            
            try {
                const response = await fetch('/api/referral/generate', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ code, userName })
                });
                
                if (response.ok) {
                    const data = await response.json();
                    code = data.referralCode || code;
                }
            } catch (error) {
                console.log('Using local referral code:', error.message);
            }
            
            localStorage.setItem('referralCode', code);
        }
        
        this.referralCode = code;
        this.referralLink = `${this.baseUrl}?ref=${code}`;
    }

    /**
     * Create referral code
     */
    createCode(userName, timestamp) {
        const name = userName.slice(0, 4).toUpperCase().replace(/[^A-Z]/g, 'X');
        const random = Math.floor(Math.random() * 10000);
        return `${name}${random}`;
    }

    /**
     * Create overlay HTML - Professional gradient design
     */
    createOverlay() {
        if (document.getElementById(this.overlayId)) {
            return;
        }

        const overlayHTML = `
            <div class="referral-overlay" id="${this.overlayId}">
                <div class="referral-overlay-backdrop"></div>
                <div class="referral-overlay-card">
                    <button class="referral-overlay-close" aria-label="Close">
                        <i class="fas fa-times"></i>
                    </button>
                    
                    <div class="referral-overlay-header">
                        <div class="referral-overlay-icon-wrapper">
                            <i class="fas fa-share-nodes"></i>
                        </div>
                        <h2>Share NOTA with Friends</h2>
                        <p>Help others discover their perfect scent</p>
                    </div>
                    
                    <div class="referral-overlay-body">
                        <div class="referral-platforms">
                            <button class="referral-platform-btn whatsapp" data-platform="whatsapp" title="Share on WhatsApp">
                                <i class="fab fa-whatsapp"></i>
                            </button>
                            
                            <button class="referral-platform-btn facebook" data-platform="facebook" title="Share on Facebook">
                                <i class="fab fa-facebook-f"></i>
                            </button>
                            
                            <button class="referral-platform-btn x" data-platform="x" title="Share on X">
                                <i class="fab fa-x-twitter"></i>
                            </button>
                            
                            <button class="referral-platform-btn pinterest" data-platform="pinterest" title="Share on Pinterest">
                                <i class="fab fa-pinterest"></i>
                            </button>
                            
                            <button class="referral-platform-btn instagram" data-platform="instagram" title="Share on Instagram">
                                <i class="fab fa-instagram"></i>
                            </button>
                            
                            <button class="referral-platform-btn email" data-platform="email" title="Share via Email">
                                <i class="fas fa-envelope"></i>
                            </button>
                        </div>
                        
                        <button class="referral-copy-btn" id="referralCopyBtn">
                            <span>Copy Link to Share</span>
                            <i class="fas fa-copy"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', overlayHTML);
    }

    /**
     * Attach event listeners
     */
    attachEventListeners() {
        const overlay = document.getElementById(this.overlayId);
        if (!overlay) return;

        // Close button
        const closeBtn = overlay.querySelector('.referral-overlay-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.close());
        }

        // Backdrop click
        const backdrop = overlay.querySelector('.referral-overlay-backdrop');
        if (backdrop) {
            backdrop.addEventListener('click', () => this.close());
        }

        // ESC key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && overlay.classList.contains('active')) {
                this.close();
            }
        });

        // Copy button
        const copyBtn = document.getElementById('referralCopyBtn');
        if (copyBtn) {
            copyBtn.addEventListener('click', () => this.copyLink());
        }

        // Platform buttons
        const platformBtns = overlay.querySelectorAll('[data-platform]');
        platformBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const platform = btn.getAttribute('data-platform');
                this.shareToPlatform(platform);
            });
        });
    }

    /**
     * Open overlay
     */
    open() {
        const overlay = document.getElementById(this.overlayId);
        if (overlay) {
            overlay.classList.add('active');
            document.body.style.overflow = 'hidden';
            
            // Track open event
            this.trackEvent('referral_overlay_opened', {
                referralCode: this.referralCode
            });
        }
    }

    /**
     * Close overlay
     */
    close() {
        const overlay = document.getElementById(this.overlayId);
        if (overlay) {
            overlay.classList.remove('active');
            document.body.style.overflow = '';
        }
    }

    /**
     * Copy link to clipboard
     */
    async copyLink() {
        try {
            await navigator.clipboard.writeText(this.referralLink);
            this.showNotification('Link copied to clipboard!', 'success');
            
            this.trackEvent('referral_link_copied', {
                referralCode: this.referralCode
            });
        } catch (error) {
            console.error('Failed to copy link:', error);
            this.showNotification('Failed to copy link', 'error');
        }
    }

    /**
     * Share to specific platform
     */
    shareToPlatform(platform) {
        const message = `Discover your perfect perfume with NOTA! Find yours at ${this.referralLink}`;
        let shareUrl = '';

        switch (platform) {
            case 'whatsapp':
                shareUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
                break;
            case 'facebook':
                shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(this.referralLink)}`;
                break;
            case 'x':
                shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(message)}`;
                break;
            case 'pinterest':
                shareUrl = `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(this.referralLink)}&description=${encodeURIComponent(message)}`;
                break;
            case 'instagram':
                this.copyLink();
                this.showNotification('Link copied! Open Instagram to paste in your story or bio', 'info');
                return;
            case 'email':
                shareUrl = `mailto:?subject=${encodeURIComponent('Check out NOTA!')}&body=${encodeURIComponent(message)}`;
                break;
        }

        if (shareUrl) {
            window.open(shareUrl, '_blank', 'width=600,height=600');
            
            this.trackEvent('referral_platform_shared', {
                platform: platform,
                referralCode: this.referralCode
            });
        }
    }

    /**
     * Show notification
     */
    showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.className = `referral-notification referral-notification-${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => notification.classList.add('active'), 10);
        
        setTimeout(() => {
            notification.classList.remove('active');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    /**
     * Track analytics event
     */
    trackEvent(eventName, data) {
        console.log('📊 Referral Event:', eventName, data);

        if (typeof gtag !== 'undefined') {
            gtag('event', eventName, data);
        }

        if (typeof fbq !== 'undefined') {
            fbq('track', eventName, data);
        }

        if (window.dataLayer) {
            window.dataLayer.push({
                event: eventName,
                ...data
            });
        }
    }
}

// Global instance
let referralOverlay = null;

// Initialize on page load
document.addEventListener('DOMContentLoaded', async () => {
    referralOverlay = new ReferralOverlay();
    await referralOverlay.init();
});

// Helper function for global access
function openReferralOverlay() {
    if (referralOverlay) {
        referralOverlay.open();
    }
}

function closeReferralOverlay() {
    if (referralOverlay) {
        referralOverlay.close();
    }
}

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ReferralOverlay;
}
