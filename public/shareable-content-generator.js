/**
 * ShareableContentGenerator - Generate shareable images and content for SCENTORY
 * Uses Canvas API to create branded result images
 */

class ShareableContentGenerator {
    constructor(config = {}) {
        this.baseUrl = config.baseUrl || window.location.origin;
        this.brandName = config.brandName || 'NOTA';
        this.logoUrl = config.logoUrl || 'images/logo/gpt-image-1.5_Modern_luxury_perfume_app_logo_design_for_NOTA_minimalist_perfume_bottle_silhoue-0.jpg';
        this.templateUrl = config.templateUrl || null; // Leonardo AI generated template
    }

    /**
     * Generate shareable image using Canvas API
     * @param {Object} userResults - User's quiz results
     * @returns {Promise<string>} Base64 data URL of generated image
     */
    async generateShareableImage(userResults) {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        // Set dimensions for optimal social media sharing
        canvas.width = 600;
        canvas.height = 315;
        
        try {
            // Load template if available, otherwise create gradient background
            if (this.templateUrl) {
                await this.drawTemplateBackground(ctx, canvas);
            } else {
                this.drawGradientBackground(ctx, canvas, userResults.gender);
            }
            
            // Draw content overlay
            await this.drawContentOverlay(ctx, canvas, userResults);
            
            // Convert to data URL
            return canvas.toDataURL('image/png', 0.95);
        } catch (error) {
            console.error('Error generating shareable image:', error);
            // Fallback to simple gradient design
            this.drawGradientBackground(ctx, canvas);
            this.drawContentOverlay(ctx, canvas, userResults);
            return canvas.toDataURL('image/png', 0.95);
        }
    }

    /**
     * Draw Leonardo AI template background
     */
    async drawTemplateBackground(ctx, canvas) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.crossOrigin = 'anonymous';
            img.onload = () => {
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                resolve();
            };
            img.onerror = reject;
            img.src = this.templateUrl;
        });
    }

    /**
     * Draw gradient background (fallback or default)
     */
    drawGradientBackground(ctx, canvas, gender = null) {
        // Gender-aware gradient colors
        let startColor, endColor;
        
        if (gender && gender.toLowerCase() === 'male') {
            startColor = '#2196F3'; // Blue
            endColor = '#90caf9'; // Light blue
        } else if (gender && gender.toLowerCase() === 'female') {
            startColor = '#ff6b9d'; // Pink
            endColor = '#ffd6e0'; // Light pink
        } else if (gender && gender.toLowerCase() === 'non-binary') {
            startColor = '#9c27b0'; // Purple
            endColor = '#ce93d8'; // Light purple
        } else {
            startColor = '#c77dff'; // Default purple
            endColor = '#ff6b9d'; // Default pink
        }
        
        // Create diagonal gradient
        const gradient = ctx.createLinearGradient(0, canvas.height, canvas.width, 0);
        gradient.addColorStop(0, startColor);
        gradient.addColorStop(1, endColor);
        
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Add subtle geometric pattern
        this.drawGeometricPattern(ctx, canvas);
    }

    /**
     * Draw subtle geometric pattern overlay
     */
    drawGeometricPattern(ctx, canvas) {
        ctx.save();
        ctx.globalAlpha = 0.1;
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        
        // Draw diagonal lines
        for (let i = -canvas.height; i < canvas.width; i += 60) {
            ctx.beginPath();
            ctx.moveTo(i, 0);
            ctx.lineTo(i + canvas.height, canvas.height);
            ctx.stroke();
        }
        
        ctx.restore();
    }

    /**
     * Draw content overlay with user results
     */
    async drawContentOverlay(ctx, canvas, userResults) {
        const { topMatch, matchPercentage, personality, userName } = userResults;
        
        // Semi-transparent overlay for better text readability
        ctx.fillStyle = 'rgba(0, 0, 0, 0.15)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Draw logo
        await this.drawLogo(ctx, 20, 20, 40);
        
        // Set text properties
        ctx.textAlign = 'center';
        ctx.fillStyle = '#ffffff';
        ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
        ctx.shadowBlur = 10;
        ctx.shadowOffsetX = 2;
        ctx.shadowOffsetY = 2;
        
        const centerX = canvas.width / 2;
        let y = 90;
        
        // Draw personality type (if available)
        if (personality) {
            ctx.font = 'bold 28px "Segoe UI", Arial, sans-serif';
            ctx.fillText(personality, centerX, y);
            y += 50;
        }
        
        // Draw perfume name
        if (topMatch) {
            ctx.font = 'bold 32px "Segoe UI", Arial, sans-serif';
            const perfumeName = `${topMatch.brand} ${topMatch.name}`;
            
            // Word wrap if too long
            const maxWidth = canvas.width - 80;
            const words = perfumeName.split(' ');
            let line = '';
            
            for (let word of words) {
                const testLine = line + word + ' ';
                const metrics = ctx.measureText(testLine);
                
                if (metrics.width > maxWidth && line !== '') {
                    ctx.fillText(line.trim(), centerX, y);
                    line = word + ' ';
                    y += 40;
                } else {
                    line = testLine;
                }
            }
            ctx.fillText(line.trim(), centerX, y);
            y += 50;
        }
        
        // Draw match percentage
        if (matchPercentage) {
            ctx.font = 'bold 36px "Segoe UI", Arial, sans-serif';
            ctx.fillText(`${matchPercentage}% Match ⭐`, centerX, y);
            y += 50;
        }
        
        // Draw call-to-action
        ctx.font = '20px "Segoe UI", Arial, sans-serif';
        ctx.fillStyle = '#ffffff';
        ctx.fillText(`Find your perfect scent at ${this.brandName}`, centerX, canvas.height - 30);
        
        ctx.shadowColor = 'transparent';
    }

    /**
     * Draw logo on canvas
     */
    async drawLogo(ctx, x, y, height) {
        return new Promise((resolve) => {
            const img = new Image();
            img.crossOrigin = 'anonymous';
            img.onload = () => {
                const aspectRatio = img.width / img.height;
                const width = height * aspectRatio;
                ctx.drawImage(img, x, y, width, height);
                resolve();
            };
            img.onerror = () => {
                // Fallback: Draw text logo
                ctx.font = 'bold 24px "Segoe UI", Arial, sans-serif';
                ctx.fillStyle = '#ffffff';
                ctx.textAlign = 'left';
                ctx.fillText(this.brandName, x, y + 30);
                resolve();
            };
            img.src = this.logoUrl;
        });
    }

    /**
     * Generate share text for social media
     */
    generateShareText(userName, topMatch, personality) {
        const templates = [
            `I just found my signature scent! 🌸 ${topMatch ? `${topMatch.brand} ${topMatch.name} is my perfect match!` : 'What\'s yours?'} #PerfumeTok #FragranceFinds #${this.brandName}`,
            `✨ ${personality || 'My personality'} matches perfectly with ${topMatch ? `${topMatch.brand} ${topMatch.name}` : 'an amazing perfume'}! Discover yours at ${this.brandName} 💐 #ScentOfTheDay #PerfumeLove`,
            `Found my scent soulmate! 💕 ${topMatch ? `${topMatch.brand} ${topMatch.name}` : 'An incredible fragrance'} - thanks ${this.brandName}! #PerfumeRecommendation #FragranceCommunity`,
            `AI just matched me with my dream perfume! 🎯 ${topMatch ? `${topMatch.brand} ${topMatch.name}` : ''} #PerfumeQuiz #${this.brandName} #FragranceAddict`,
            `This is so accurate! 😍 ${personality || 'My profile'} = ${topMatch ? `${topMatch.brand} ${topMatch.name}` : 'perfect scent match'}! #PerfumeDiscovery #ScentJourney`
        ];
        
        // Return random template
        return templates[Math.floor(Math.random() * templates.length)];
    }

    /**
     * Generate hashtags for social media
     */
    generateHashtags() {
        return [
            'PerfumeTok',
            'ScentOfTheDay',
            'FragranceCommunity',
            'PerfumeLove',
            'FragranceFinds',
            'PerfumeAddict',
            'ScentJourney',
            'FragranceAddict',
            this.brandName
        ];
    }

    /**
     * Generate UTM parameters for tracking
     */
    generateUTMParameters(source, medium = 'social', campaign = 'quiz_results') {
        return {
            utm_source: source,
            utm_medium: medium,
            utm_campaign: campaign,
            utm_content: 'share_button'
        };
    }

    /**
     * Build URL with UTM parameters
     */
    buildURLWithUTM(baseUrl, utmParams) {
        const url = new URL(baseUrl);
        Object.entries(utmParams).forEach(([key, value]) => {
            url.searchParams.append(key, value);
        });
        return url.toString();
    }

    /**
     * Generate complete share package
     */
    async generateSharePackage(userResults, platform) {
        const { topMatch, matchPercentage, personality, userName, personalityProfile } = userResults;

        // Generate image
        const imageDataUrl = await this.generateShareableImage(userResults);

        // Generate text with personality profile
        const shareText = this.generateShareText(userName, topMatch, personality, personalityProfile);

        // Generate hashtags
        const hashtags = this.generateHashtags();

        // Build URL with UTM
        const utmParams = this.generateUTMParameters(platform);
        const shareUrl = this.buildURLWithUTM(this.baseUrl, utmParams);

        return {
            imageDataUrl,
            shareText,
            hashtags,
            shareUrl,
            title: `${personality || 'My'} Perfect Perfume Match`,
            description: `I'm ${matchPercentage || ''}% matched with ${topMatch ? `${topMatch.brand} ${topMatch.name}` : 'an amazing perfume'}!`
        };
    }

    /**
     * Upload image to backend (for persistent sharing)
     */
    async uploadShareImage(imageDataUrl) {
        try {
            const response = await fetch('/api/share-image', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ imageData: imageDataUrl })
            });
            
            if (!response.ok) {
                throw new Error('Failed to upload image');
            }
            
            const data = await response.json();
            return data.imageUrl;
        } catch (error) {
            console.error('Error uploading share image:', error);
            // Return data URL as fallback
            return imageDataUrl;
        }
    }

    /**
     * Shorten URL for sharing
     */
    async shortenURL(longUrl) {
        try {
            const response = await fetch('/api/shorten-url', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ url: longUrl })
            });
            
            if (!response.ok) {
                throw new Error('Failed to shorten URL');
            }
            
            const data = await response.json();
            return data.shortUrl || longUrl;
        } catch (error) {
            console.error('Error shortening URL:', error);
            return longUrl; // Return original URL as fallback
        }
    }
}

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ShareableContentGenerator;
}
