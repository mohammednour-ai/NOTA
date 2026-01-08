/**
 * ShareAppModal - Modal for sharing NOTA app with friends
 * Simple sharing functionality without rewards
 */

class ShareAppModal {
    constructor(config = {}) {
        // Use production URL if not localhost
        this.baseUrl = window.location.hostname === 'localhost' 
            ? window.location.origin 
            : 'https://www.nota-life.com';
        this.modalId = 'shareAppModal';
        this.placement = 'unknown';
        this.referralCode = null;
        this.referralLink = null;
    }

    /**
     * Initialize and render modal
     */
    async init() {
        // Generate referral code if not exists
        await this.generateReferralCode();
        
        // Create modal HTML
        this.createModal();
        
        // Attach event listeners
        this.attachEventListeners();
    }

    /**
     * Generate unique referral code
     */
    async generateReferralCode() {
        // Check localStorage first
        let code = localStorage.getItem('referralCode');
        
        if (!code) {
            // Generate new code
            const userName = localStorage.getItem('userName') || 'User';
            const timestamp = Date.now();
            code = this.createCode(userName, timestamp);
            
            // Try to save to backend
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
     * Create modal HTML
     */
    createModal() {
        // Check if modal already exists
        if (document.getElementById(this.modalId)) {
            return;
        }

        const modalHTML = `
            <div class="share-app-modal" id="${this.modalId}">
                <div class="share-app-modal-overlay"></div>
                <div class="share-app-modal-content">
                    <button class="share-app-modal-close" aria-label="Close">
                        <i class="fas fa-times"></i>
                    </button>
                    
                    <div class="share-app-modal-header">
                        <div class="share-app-modal-icon">
                            <i class="fas fa-share-nodes" style="font-size: 2.5rem; color: var(--secondary-color);"></i>
                        </div>
                        <h2 class="share-app-modal-title">Share NOTA with Friends</h2>
                        <p class="share-app-modal-subtitle">Help others discover their perfect scent</p>
                    </div>
                    
                    <div class="share-app-modal-body">
                        <!-- Referral Link Display -->
                        <div class="share-app-link-container">
                            <label class="share-app-link-label">Your Personal Invite Link:</label>
                            <div class="share-app-link-input-group">
                                <input 
                                    type="text" 
                                    class="share-app-link-input" 
                                    id="shareAppLink" 
                                    value="${this.referralLink}"
                                    readonly
                                >
                                <button class="share-app-link-copy" id="copyLinkBtn" title="Copy link">
                                    <i class="fas fa-copy"></i>
                                </button>
                            </div>
                        </div>
                        
                        <!-- Platform Buttons -->
                        <div class="share-app-platforms">
                            <p class="share-app-platforms-title">Share via:</p>
                            
                            <button class="share-app-platform-btn whatsapp" data-platform="whatsapp">
                                <i class="fab fa-whatsapp"></i>
                                <span>WhatsApp</span>
                            </button>
                            
                            <button class="share-app-platform-btn facebook" data-platform="facebook">
                                <i class="fab fa-facebook-f"></i>
                                <span>Facebook</span>
                            </button>
                            
                            <button class="share-app-platform-btn twitter" data-platform="twitter">
                                <i class="fab fa-x-twitter"></i>
                                <span>X</span>
                            </button>
                            
                            <button class="share-app-platform-btn instagram" data-platform="instagram">
                                <i class="fab fa-instagram"></i>
                                <span>Instagram</span>
                            </button>
                            
                            <button class="share-app-platform-btn email" data-platform="email">
                                <i class="fas fa-envelope"></i>
                                <span>Email</span>
                            </button>
                            
                            <button class="share-app-platform-btn messenger" data-platform="messenger">
                                <i class="fab fa-facebook-messenger"></i>
                                <span>Messenger</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', modalHTML);
    }

    /**
     * Attach event listeners
     */
    attachEventListeners() {
        const modal = document.getElementById(this.modalId);
        if (!modal) return;

        // Close button
        const closeBtn = modal.querySelector('.share-app-modal-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.close());
        }

        // Overlay click
        const overlay = modal.querySelector('.share-app-modal-overlay');
        if (overlay) {
            overlay.addEventListener('click', () => this.close());
        }

        // ESC key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal.classList.contains('active')) {
                this.close();
            }
        });

        // Copy button
        const copyBtn = document.getElementById('copyLinkBtn');
        if (copyBtn) {
            copyBtn.addEventListener('click', () => this.copyLink());
        }

        // Platform buttons
        const platformBtns = modal.querySelectorAll('[data-platform]');
        platformBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const platform = btn.getAttribute('data-platform');
                this.shareToPlatform(platform);
            });
        });
    }

    /**
     * Open modal
     */
    open(placement = 'unknown') {
        this.placement = placement;
        const modal = document.getElementById(this.modalId);
        if (modal) {
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
            
            // Track modal open
            this.trackEvent('share_modal_opened', { placement });
        }
    }

    /**
     * Close modal
     */
    close() {
        const modal = document.getElementById(this.modalId);
        if (modal) {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        }
    }

    /**
     * Copy link to clipboard
     */
    async copyLink() {
        const linkInput = document.getElementById('shareAppLink');
        if (!linkInput) return;

        try {
            await navigator.clipboard.writeText(this.referralLink);
            this.showCopySuccess();
            this.trackEvent('referral_link_copied', { 
                placement: this.placement,
                referralCode: this.referralCode 
            });
        } catch (error) {
            // Fallback
            linkInput.select();
            document.execCommand('copy');
            this.showCopySuccess();
        }
    }

    /**
     * Show copy success message
     */
    showCopySuccess() {
        const copyBtn = document.getElementById('copyLinkBtn');
        if (!copyBtn) return;

        const originalHTML = copyBtn.innerHTML;
        copyBtn.innerHTML = '<i class="fas fa-check"></i>';
        copyBtn.style.background = '#4caf50';

        setTimeout(() => {
            copyBtn.innerHTML = originalHTML;
            copyBtn.style.background = '';
        }, 2000);

        // Show toast notification
        this.showNotification('Link copied to clipboard! 📋', 'success');
    }

    /**
     * Share to specific platform
     */
    shareToPlatform(platform) {
        const templates = this.getMessageTemplates();
        const template = templates[platform];

        if (!template) {
            console.error('Unknown platform:', platform);
            return;
        }

        const url = template.url;
        
        // Track share attempt
        this.trackEvent('share_method_selected', {
            platform,
            placement: this.placement,
            referralCode: this.referralCode
        });

        // Open share window/link
        if (platform === 'email') {
            window.location.href = url;
        } else if (platform === 'instagram') {
            this.shareToInstagram();
        } else {
            window.open(url, '_blank', 'width=600,height=600');
        }
    }

    /**
     * Get message templates for each platform
     */
    getMessageTemplates() {
        const message = `Hey! 👋 I just found this amazing AI perfume quiz that matched me with my perfect scent! 🌸\n\nIt analyzes your personality & preferences to recommend perfumes you'll love. You should try it!\n\n${this.referralLink}\n\nLet me know what you get! 💫`;
        
        const shortMessage = `Just discovered my signature scent with NOTA! Find yours: ${this.referralLink}`;

        return {
            whatsapp: {
                url: `https://wa.me/?text=${encodeURIComponent(message)}`
            },
            facebook: {
                url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(this.referralLink)}`
            },
            twitter: {
                url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shortMessage)}&hashtags=PerfumeTok,ScentOfTheDay,SCENTORY`
            },
            messenger: {
                url: `https://www.facebook.com/dialog/send?link=${encodeURIComponent(this.referralLink)}&app_id=YOUR_APP_ID&redirect_uri=${encodeURIComponent(this.baseUrl)}`
            },
            email: {
                url: `mailto:?subject=${encodeURIComponent('You need to try this perfume quiz! ✨')}&body=${encodeURIComponent(message)}`
            }
        };
    }

    /**
     * Share to Instagram (special handling)
     */
    shareToInstagram() {
        this.copyLink();
        this.showNotification('Link copied! Open Instagram and paste it in your story or bio 💫', 'info', 5000);
        
        // Try to open Instagram app (mobile only)
        const isMobile = /Android|webOS|iPhone|iPad|iPod/i.test(navigator.userAgent);
        if (isMobile) {
            setTimeout(() => {
                window.location.href = 'instagram://';
            }, 1000);
        }
    }

    /**
     * Show notification toast
     */
    showNotification(message, type = 'success', duration = 3000) {
        const notification = document.createElement('div');
        notification.className = `share-app-notification ${type}`;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => notification.classList.add('show'), 10);
        
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, duration);
    }

    /**
     * Track event
     */
    trackEvent(eventName, data) {
        if (typeof trackReferralEvent === 'function') {
            trackReferralEvent(eventName, data);
        }
        
        console.log('📊 Referral Event:', eventName, data);
    }
}

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ShareAppModal;
}
