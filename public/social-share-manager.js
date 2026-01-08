/**
 * SocialShareManager - Comprehensive social sharing utility for SCENTORY
 * Handles sharing to multiple platforms with analytics tracking
 */

class SocialShareManager {
    constructor(config = {}) {
        this.baseUrl = config.baseUrl || window.location.origin;
        this.analytics = config.analytics || this.defaultAnalytics;
        this.rateLimit = new RateLimiter(config.rateLimitConfig);
    }

    /**
     * Share to Facebook
     */
    async shareToFacebook({ url, title, description, imageUrl }) {
        if (!this.rateLimit.canShare('facebook')) {
            this.showRateLimitError('facebook');
            return false;
        }

        const shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
        
        try {
            this.openPopup(shareUrl, 600, 400);
            this.trackShare('facebook', { url, title });
            this.rateLimit.recordShare('facebook');
            return true;
        } catch (error) {
            this.handleError(error, 'facebook');
            return false;
        }
    }

    /**
     * Share to Twitter
     */
    async shareToTwitter({ text, url, hashtags }) {
        if (!this.rateLimit.canShare('twitter')) {
            this.showRateLimitError('twitter');
            return false;
        }

        const hashtagStr = Array.isArray(hashtags) ? hashtags.join(',') : hashtags;
        const shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}&hashtags=${encodeURIComponent(hashtagStr)}`;
        
        try {
            this.openPopup(shareUrl, 550, 420);
            this.trackShare('twitter', { text, url, hashtags });
            this.rateLimit.recordShare('twitter');
            return true;
        } catch (error) {
            this.handleError(error, 'twitter');
            return false;
        }
    }

    /**
     * Share to WhatsApp (mobile/desktop aware)
     */
    async shareToWhatsApp({ text, url }) {
        if (!this.rateLimit.canShare('whatsapp')) {
            this.showRateLimitError('whatsapp');
            return false;
        }

        const message = `${text} ${url}`;
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        
        const shareUrl = isMobile 
            ? `whatsapp://send?text=${encodeURIComponent(message)}`
            : `https://web.whatsapp.com/send?text=${encodeURIComponent(message)}`;
        
        try {
            if (isMobile) {
                window.location.href = shareUrl;
            } else {
                this.openPopup(shareUrl, 600, 600);
            }
            this.trackShare('whatsapp', { text, url });
            this.rateLimit.recordShare('whatsapp');
            return true;
        } catch (error) {
            this.handleError(error, 'whatsapp');
            return false;
        }
    }

    /**
     * Share to Messenger
     */
    async shareToMessenger({ url }) {
        if (!this.rateLimit.canShare('messenger')) {
            this.showRateLimitError('messenger');
            return false;
        }

        const shareUrl = `https://www.facebook.com/dialog/send?link=${encodeURIComponent(url)}&app_id=YOUR_APP_ID&redirect_uri=${encodeURIComponent(this.baseUrl)}`;
        
        try {
            this.openPopup(shareUrl, 600, 400);
            this.trackShare('messenger', { url });
            this.rateLimit.recordShare('messenger');
            return true;
        } catch (error) {
            this.handleError(error, 'messenger');
            return false;
        }
    }

    /**
     * Share to Instagram (clipboard + app open)
     */
    async shareToInstagram({ imageUrl, caption }) {
        if (!this.rateLimit.canShare('instagram')) {
            this.showRateLimitError('instagram');
            return false;
        }

        try {
            // Copy caption to clipboard
            await this.copyToClipboard({ text: caption });
            
            // Show modal with instructions
            this.showInstagramModal(caption);
            
            // Try to open Instagram app (mobile only)
            const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
            if (isMobile) {
                setTimeout(() => {
                    window.location.href = 'instagram://camera';
                }, 1000);
            }
            
            this.trackShare('instagram', { caption });
            this.rateLimit.recordShare('instagram');
            return true;
        } catch (error) {
            this.handleError(error, 'instagram');
            return false;
        }
    }

    /**
     * Share to TikTok (deep link if possible)
     */
    async shareToTikTok({ videoUrl }) {
        if (!this.rateLimit.canShare('tiktok')) {
            this.showRateLimitError('tiktok');
            return false;
        }

        try {
            const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
            
            if (isMobile) {
                // Try TikTok deep link
                window.location.href = 'tiktok://';
            } else {
                // Open TikTok web
                window.open('https://www.tiktok.com/upload', '_blank');
            }
            
            this.trackShare('tiktok', { videoUrl });
            this.rateLimit.recordShare('tiktok');
            return true;
        } catch (error) {
            this.handleError(error, 'tiktok');
            return false;
        }
    }

    /**
     * Share to Pinterest
     */
    async shareToPinterest({ imageUrl, description, url }) {
        if (!this.rateLimit.canShare('pinterest')) {
            this.showRateLimitError('pinterest');
            return false;
        }

        const shareUrl = `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(url)}&media=${encodeURIComponent(imageUrl)}&description=${encodeURIComponent(description)}`;
        
        try {
            this.openPopup(shareUrl, 750, 550);
            this.trackShare('pinterest', { imageUrl, description, url });
            this.rateLimit.recordShare('pinterest');
            return true;
        } catch (error) {
            this.handleError(error, 'pinterest');
            return false;
        }
    }

    /**
     * Share via Email
     */
    async shareViaEmail({ to = '', subject, body, htmlBody }) {
        try {
            const mailtoUrl = `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
            window.location.href = mailtoUrl;
            
            this.trackShare('email', { subject });
            return true;
        } catch (error) {
            this.handleError(error, 'email');
            return false;
        }
    }

    /**
     * Copy to Clipboard
     */
    async copyToClipboard({ text, url }) {
        const content = url || text;
        
        try {
            if (navigator.clipboard && navigator.clipboard.writeText) {
                await navigator.clipboard.writeText(content);
            } else {
                // Fallback for older browsers
                const textarea = document.createElement('textarea');
                textarea.value = content;
                textarea.style.position = 'fixed';
                textarea.style.opacity = '0';
                document.body.appendChild(textarea);
                textarea.select();
                document.execCommand('copy');
                document.body.removeChild(textarea);
            }
            
            this.showCopySuccess();
            this.trackShare('copy_clipboard', { content });
            return true;
        } catch (error) {
            this.handleError(error, 'clipboard');
            return false;
        }
    }

    /**
     * Native Share API (mobile-first)
     */
    async shareNative({ title, text, url }) {
        if (!navigator.share) {
            console.log('Native share not supported, falling back to manual share');
            return false;
        }

        try {
            await navigator.share({
                title: title,
                text: text,
                url: url
            });
            
            this.trackShare('native_share', { title, text, url });
            return true;
        } catch (error) {
            if (error.name !== 'AbortError') {
                this.handleError(error, 'native_share');
            }
            return false;
        }
    }

    /**
     * Open popup window with center positioning
     */
    openPopup(url, width, height) {
        const left = (window.innerWidth - width) / 2;
        const top = (window.innerHeight - height) / 2;
        const features = `width=${width},height=${height},left=${left},top=${top},toolbar=0,menubar=0,location=0,status=0`;
        
        const popup = window.open(url, 'share', features);
        
        if (!popup || popup.closed || typeof popup.closed === 'undefined') {
            throw new Error('Popup blocked');
        }
        
        return popup;
    }

    /**
     * Track share events (ready for Google Analytics, Meta Pixel, etc.)
     */
    trackShare(platform, data) {
        const event = {
            event: 'social_share',
            platform: platform,
            timestamp: Date.now(),
            ...data
        };
        
        console.log('📊 Share Event:', event);
        
        // Google Analytics 4
        if (typeof gtag !== 'undefined') {
            gtag('event', 'share', {
                method: platform,
                content_type: 'perfume_results'
            });
        }
        
        // Meta Pixel
        if (typeof fbq !== 'undefined') {
            fbq('track', 'Share', { platform: platform });
        }
        
        // Custom analytics callback
        if (this.analytics && typeof this.analytics === 'function') {
            this.analytics(event);
        }
    }

    /**
     * Default analytics function
     */
    defaultAnalytics(event) {
        console.log('📈 Analytics:', event);
    }

    /**
     * Handle errors gracefully
     */
    handleError(error, platform) {
        console.error(`Share error (${platform}):`, error);
        
        if (error.message === 'Popup blocked') {
            this.showPopupBlockedError();
        } else {
            this.showGenericError(platform);
        }
    }

    /**
     * Show popup blocked error
     */
    showPopupBlockedError() {
        this.showNotification('Please allow popups to share', 'error');
    }

    /**
     * Show rate limit error
     */
    showRateLimitError(platform) {
        const timeLeft = this.rateLimit.getTimeUntilReset(platform);
        this.showNotification(`Please wait ${Math.ceil(timeLeft / 1000)} seconds before sharing to ${platform} again`, 'warning');
    }

    /**
     * Show generic error
     */
    showGenericError(platform) {
        this.showNotification(`Failed to share to ${platform}. Please try again.`, 'error');
    }

    /**
     * Show copy success message
     */
    showCopySuccess() {
        this.showNotification('Link copied to clipboard! 📋', 'success');
    }

    /**
     * Show Instagram modal with instructions
     */
    showInstagramModal(caption) {
        const modal = document.createElement('div');
        modal.className = 'share-notification instagram-modal';
        modal.innerHTML = `
            <div class="notification-content">
                <h3>📸 Share to Instagram</h3>
                <p>Caption copied to clipboard!</p>
                <p>Now paste it in Instagram.</p>
                <button onclick="this.parentElement.parentElement.remove()">Got it!</button>
            </div>
        `;
        document.body.appendChild(modal);
        
        setTimeout(() => {
            if (modal.parentElement) {
                modal.remove();
            }
        }, 5000);
    }

    /**
     * Show notification toast
     */
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `share-notification ${type}`;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => notification.classList.add('show'), 10);
        
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
}

/**
 * RateLimiter - Prevent spam sharing
 */
class RateLimiter {
    constructor(config = {}) {
        this.maxSharesPerMinute = config.maxSharesPerMinute || 5;
        this.cooldownMs = config.cooldownMs || 60000; // 1 minute
        this.shares = {};
    }

    canShare(platform) {
        const now = Date.now();
        const platformShares = this.shares[platform] || [];
        
        // Remove old shares outside cooldown window
        const recentShares = platformShares.filter(timestamp => 
            now - timestamp < this.cooldownMs
        );
        
        this.shares[platform] = recentShares;
        
        return recentShares.length < this.maxSharesPerMinute;
    }

    recordShare(platform) {
        if (!this.shares[platform]) {
            this.shares[platform] = [];
        }
        this.shares[platform].push(Date.now());
    }

    getTimeUntilReset(platform) {
        const platformShares = this.shares[platform] || [];
        if (platformShares.length === 0) return 0;
        
        const oldestShare = Math.min(...platformShares);
        const timeLeft = this.cooldownMs - (Date.now() - oldestShare);
        
        return Math.max(0, timeLeft);
    }
}

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { SocialShareManager, RateLimiter };
}
