/**
 * ShareAppButton - Flexible referral share button component
 * Simple sharing functionality without rewards
 */

class ShareAppButton {
    constructor(config = {}) {
        this.variant = config.variant || 'button'; // icon, button, card, banner
        this.placement = config.placement || 'header';
        this.text = config.text || 'Share NOTA';
        this.theme = config.theme || 'light';
        this.containerId = config.containerId;
    }

    /**
     * Render the button based on variant
     */
    render() {
        const container = this.containerId 
            ? document.getElementById(this.containerId)
            : document.body;

        if (!container) {
            console.error('Container not found for ShareAppButton');
            return;
        }

        const buttonHTML = this.getVariantHTML();
        
        // Create wrapper
        const wrapper = document.createElement('div');
        wrapper.className = `share-app-button-wrapper share-app-${this.variant} share-app-placement-${this.placement}`;
        wrapper.innerHTML = buttonHTML;
        
        container.appendChild(wrapper);

        // Add event listeners
        this.attachEventListeners(wrapper);
    }

    /**
     * Get HTML for specific variant
     */
    getVariantHTML() {
        switch (this.variant) {
            case 'icon':
                return this.getIconVariant();
            case 'button':
                return this.getButtonVariant();
            case 'card':
                return this.getCardVariant();
            case 'banner':
                return this.getBannerVariant();
            default:
                return this.getButtonVariant();
        }
    }

    /**
     * Icon variant - Floating share icon (header)
     */
    getIconVariant() {
        return `
            <div class="share-app-icon-container">
                <button class="share-app-icon-btn" data-action="open-share-modal" title="Share NOTA">
                    <i class="fas fa-share-nodes"></i>
                </button>
            </div>
        `;
    }

    /**
     * Button variant - CTA button
     */
    getButtonVariant() {
        return `
            <div class="share-app-button-container">
                <button class="share-app-btn" data-action="open-share-modal">
                    <i class="fas fa-envelope"></i>
                    <span>${this.text}</span>
                </button>
            </div>
        `;
    }

    /**
     * Card variant - Large card (post-results)
     */
    getCardVariant() {
        return `
            <div class="share-app-card">
                <div class="share-app-card-icon">
                    <i class="fas fa-users" style="font-size: 2.5rem; color: var(--secondary-color);"></i>
                </div>
                <h3 class="share-app-card-title">Love Your Results?</h3>
                <p class="share-app-card-description">${this.text}</p>
                <button class="share-app-card-btn" data-action="open-share-modal">
                    <i class="fas fa-share-alt"></i>
                    Share with Friends
                </button>
            </div>
        `;
    }

    /**
     * Banner variant - Full-width interruption (mid-quiz)
     */
    getBannerVariant() {
        return `
            <div class="share-app-banner">
                <button class="share-app-banner-close" data-action="close-banner">
                    <i class="fas fa-times"></i>
                </button>
                <div class="share-app-banner-content">
                    <div class="share-app-banner-icon">
                        <i class="fas fa-pause-circle" style="font-size: 2rem;"></i>
                    </div>
                    <h3 class="share-app-banner-title">Quick break!</h3>
                    <p class="share-app-banner-text">${this.text}</p>
                    <div class="share-app-banner-actions">
                        <button class="share-app-banner-btn-primary" data-action="open-share-modal">
                            <i class="fas fa-share-alt"></i>
                            Share NOTA
                        </button>
                        <button class="share-app-banner-btn-secondary" data-action="close-banner">
                            Continue Quiz
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * Attach event listeners
     */
    attachEventListeners(wrapper) {
        // Open share modal
        const openButtons = wrapper.querySelectorAll('[data-action="open-share-modal"]');
        openButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                this.trackButtonClick();
                this.openShareModal();
            });
        });

        // Close banner
        const closeButtons = wrapper.querySelectorAll('[data-action="close-banner"]');
        closeButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                this.closeBanner(wrapper);
            });
        });
    }

    /**
     * Open share modal
     */
    openShareModal() {
        if (typeof openShareAppModal === 'function') {
            openShareAppModal(this.placement);
        } else {
            console.error('openShareAppModal function not found');
        }
    }

    /**
     * Close banner (for mid-quiz variant)
     */
    closeBanner(wrapper) {
        wrapper.style.opacity = '0';
        wrapper.style.transform = 'translateY(-20px)';
        setTimeout(() => {
            wrapper.remove();
        }, 300);
    }

    /**
     * Track button click
     */
    trackButtonClick() {
        if (typeof trackReferralEvent === 'function') {
            trackReferralEvent('share_button_click', {
                placement: this.placement,
                variant: this.variant,
                timestamp: Date.now()
            });
        }
    }
}

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ShareAppButton;
}
