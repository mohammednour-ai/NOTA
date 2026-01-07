// Global state
let questions = [];
let currentQuestionIndex = 0;
let answers = {};
let userGender = null; // Track user's gender choice
let themeProgress = 0; // 0 = neutral, 1 = fully gendered

// Header scroll effect for glassmorphism
window.addEventListener('scroll', () => {
    const header = document.querySelector('.header');
    if (header) {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }
});


// Splash Screen Images Array
const splashImages = [
    'images/Splash/Default_blue_syle_for_men_0.jpg',
    'images/Splash/Default_similar_but_a_man_0.jpg',
    'images/Splash/Default_summer_happy_mode_0.jpg',
    'images/Splash/Default_summer_happy_mood_0.jpg',
    'images/Splash/lucid-origin_IMAGE_Cinematic_Splash_Screen_Background_Prompt_Cinematic_luxury_perfume_adverti-0 (1).jpg',
    'images/Splash/lucid-origin_IMAGE_Cinematic_Splash_Screen_Background_Prompt_Cinematic_luxury_perfume_adverti-0.jpg'
];

// Theme colors for gradual transition
const themes = {
    neutral: {
        secondary: { r: 199, g: 125, b: 255 }, // Purple #c77dff
        accent: { r: 224, g: 195, b: 252 }     // Light purple #e0c3fc
    },
    male: {
        secondary: { r: 33, g: 150, b: 243 },  // Blue #2196F3
        accent: { r: 144, g: 202, b: 249 }     // Light blue #90caf9
    },
    female: {
        secondary: { r: 255, g: 107, b: 157 }, // Pink #ff6b9d
        accent: { r: 255, g: 214, b: 224 }     // Light pink #ffd6e0
    },
    nonbinary: {
        secondary: { r: 156, g: 39, b: 176 },  // Purple #9c27b0
        accent: { r: 206, g: 147, b: 216 }     // Light purple #ce93d8
    }
};

// Splash Screen Functions
function initSplashScreen() {
    // Check if splash has been shown in this session
    const splashShown = sessionStorage.getItem('splashShown');
    const splashScreen = document.getElementById('splashScreen');
    
    if (!splashShown && splashScreen) {
        // Select random image
        const randomImage = splashImages[Math.floor(Math.random() * splashImages.length)];
        
        // Set background with subtle dark overlay to make photo more visible
        splashScreen.style.backgroundImage = `
            linear-gradient(
                135deg,
                rgba(0, 0, 0, 0.3) 0%,
                rgba(0, 0, 0, 0.4) 100%
            ),
            url('${randomImage}')
        `;
        
        // Show splash screen
        splashScreen.classList.remove('hidden');
        document.body.style.overflow = 'hidden'; // Prevent scrolling
        
        // Mark as shown
        sessionStorage.setItem('splashShown', 'true');
        
        // Start auto-close timeout
        startSplashTimeout();
    } else if (splashScreen) {
        // Hide splash if already shown
        splashScreen.classList.add('hidden');
    }
}

function closeSplash() {
    const splashScreen = document.getElementById('splashScreen');
    if (splashScreen) {
        splashScreen.classList.add('hidden');
        document.body.style.overflow = ''; // Restore scrolling
    }
    clearSplashTimeout();
}

function startFromSplash() {
    closeSplash();
    // Small delay for smooth transition
    setTimeout(() => {
        startQuiz();
    }, 300);
}

// Auto-close splash after 15 seconds if user doesn't interact
let splashTimeout;
function startSplashTimeout() {
    splashTimeout = setTimeout(() => {
        const splashScreen = document.getElementById('splashScreen');
        if (splashScreen && !splashScreen.classList.contains('hidden')) {
            closeSplash();
        }
    }, 15000); // 15 seconds
}

// Clear timeout if user interacts
function clearSplashTimeout() {
    if (splashTimeout) {
        clearTimeout(splashTimeout);
    }
}

// ESC key to close splash
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        const splashScreen = document.getElementById('splashScreen');
        if (splashScreen && !splashScreen.classList.contains('hidden')) {
            closeSplash();
        }
    }
});

// Initialize app
document.addEventListener('DOMContentLoaded', async () => {
    // Initialize splash screen
    initSplashScreen();
    
    // Initialize 3D Card Carousel
    init3DCarousel();
    
    try {
        const response = await fetch('/api/questions');
        questions = await response.json();
        document.getElementById('totalQuestions').textContent = questions.length;
    } catch (error) {
        console.error('Error loading questions:', error);
        alert('Failed to load quiz questions. Please refresh the page.');
    }
});

// 3D Floating Cards Carousel
function init3DCarousel() {
    const cardStack = document.querySelector('.card-stack');
    const cards = document.querySelectorAll('.card');
    
    if (!cardStack || cards.length === 0) return;
    
    let currentIndex = 0;
    let isAnimating = false;
    
    // Auto-rotate cards every 4 seconds
    setInterval(() => {
        if (!isAnimating) {
            cycleCards();
        }
    }, 4000);
    
    // Click on any card to cycle
    cards.forEach(card => {
        card.addEventListener('click', () => {
            if (!isAnimating) {
                cycleCards();
            }
        });
    });
    
    function cycleCards() {
        if (isAnimating) return;
        
        isAnimating = true;
        cardStack.classList.add('cycling');
        
        // Move first card to back
        const firstCard = cardStack.firstElementChild;
        
        setTimeout(() => {
            cardStack.appendChild(firstCard);
            
            // Reassign classes for proper stacking
            const allCards = cardStack.querySelectorAll('.card');
            allCards.forEach((card, index) => {
                card.className = `card card-${index + 1}`;
            });
            
            cardStack.classList.remove('cycling');
            isAnimating = false;
        }, 800); // Match CSS transition duration
    }
    
    // Parallax effect on mouse move
    cardStack.addEventListener('mousemove', (e) => {
        if (isAnimating) return;
        
        const rect = cardStack.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = (y - centerY) / 20;
        const rotateY = (centerX - x) / 20;
        
        cards.forEach((card, index) => {
            if (index === 0) { // Only apply to front card
                card.style.transform = `translateZ(0px) translateY(0px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
            }
        });
    });
    
    // Reset on mouse leave
    cardStack.addEventListener('mouseleave', () => {
        const frontCard = cardStack.querySelector('.card-1');
        if (frontCard && !isAnimating) {
            frontCard.style.transform = '';
        }
    });
}

function startQuiz() {
    document.getElementById('hero').classList.remove('active');
    document.getElementById('quiz').classList.add('active');
    currentQuestionIndex = 0;
    answers = {};
    userGender = null;
    themeProgress = 0;
    loadQuestion();
}

// Dynamic Theme System
function applyDynamicTheme() {
    if (!userGender) {
        console.log('🎨 No gender selected yet, keeping neutral theme');
        return; // No theme change before gender is selected
    }
    
    console.log('🎨 Applying theme for:', userGender, 'Progress:', themeProgress);
    
    // Calculate progress (0 to 1) - starts after Q1
    if (currentQuestionIndex > 0) {
        themeProgress = Math.min(currentQuestionIndex / questions.length, 1);
    }
    
    // Get target theme based on gender
    let targetTheme;
    const genderLower = userGender.toLowerCase();
    
    if (genderLower === 'male') {
        targetTheme = themes.male;
        console.log('🎨 Target: BLUE');
    } else if (genderLower === 'female') {
        targetTheme = themes.female;
        console.log('🎨 Target: PINK');
    } else if (genderLower === 'non-binary') {
        targetTheme = themes.nonbinary;
        console.log('🎨 Target: PURPLE');
    } else {
        targetTheme = themes.neutral;
        console.log('🎨 Target: NEUTRAL');
    }
    
    // Interpolate between neutral and target theme
    const currentSecondary = interpolateColor(themes.neutral.secondary, targetTheme.secondary, themeProgress);
    const currentAccent = interpolateColor(themes.neutral.accent, targetTheme.accent, themeProgress);
    
    const secondaryRGB = `rgb(${currentSecondary.r}, ${currentSecondary.g}, ${currentSecondary.b})`;
    const accentRGB = `rgb(${currentAccent.r}, ${currentAccent.g}, ${currentAccent.b})`;
    
    console.log('🎨 Setting secondary color to:', secondaryRGB);
    console.log('🎨 Setting accent color to:', accentRGB);
    
    // Apply CSS variables
    document.documentElement.style.setProperty('--secondary-color', secondaryRGB);
    document.documentElement.style.setProperty('--accent-color', accentRGB);
}

// Color interpolation helper
function interpolateColor(color1, color2, progress) {
    return {
        r: Math.round(color1.r + (color2.r - color1.r) * progress),
        g: Math.round(color1.g + (color2.g - color1.g) * progress),
        b: Math.round(color1.b + (color2.b - color1.b) * progress)
    };
}

// Detect gender selection from Q1
function detectGenderSelection(questionId, selectedValue) {
    if (questionId === 1) { // Question 1 is gender
        userGender = selectedValue;
        console.log('🎨 Gender detected:', userGender);
        console.log('🎨 Selected value:', selectedValue);
        
        // Force immediate theme update with a small progress to show change
        themeProgress = 0.05; // 5% to show initial shift
        
        // Apply initial theme immediately
        applyDynamicTheme();
        
        // Visual confirmation
        console.log('🎨 Theme applied! Current secondary color:', 
            getComputedStyle(document.documentElement).getPropertyValue('--secondary-color'));
    }
}

function loadQuestion() {
    const question = questions[currentQuestionIndex];
    const quizContent = document.getElementById('quizContent');
    
    // Update progress
    const progress = ((currentQuestionIndex + 1) / questions.length) * 100;
    document.getElementById('progressBar').style.width = progress + '%';
    document.getElementById('currentQuestion').textContent = currentQuestionIndex + 1;
    
    // Apply dynamic theme as quiz progresses
    applyDynamicTheme();
    
    // Determine if question is optional
    const isOptional = question.type === 'text' || question.id === 30;
    
    // Build question HTML
    let html = `<h2 class="question-title">
        ${question.question}
        ${isOptional ? '<span class="optional-label">Optional</span>' : ''}
    </h2>`;
    
    if (question.type === 'text') {
        html += `
            <input 
                type="text" 
                class="text-input" 
                id="answer-${question.id}"
                placeholder="${question.placeholder || 'Type your answer...'}"
                value="${answers[question.id] || ''}"
            >
        `;
    } else if (question.type === 'single') {
        html += '<div class="options-container">';
        question.options.forEach((option, index) => {
            const isSelected = answers[question.id] === option;
            const optionId = `option-${question.id}-${index}`;
            html += `
                <div class="option ${isSelected ? 'selected' : ''}" 
                     id="${optionId}"
                     tabindex="0"
                     role="button"
                     aria-pressed="${isSelected}"
                     data-question-id="${question.id}"
                     data-option-index="${index}"
                     onclick="selectSingleOptionByIndex(${question.id}, ${index}, true)"
                     onkeypress="handleOptionKeyPress(event, ${question.id}, ${index}, true)">
                    <span class="option-text">${option}</span>
                </div>
            `;
        });
        html += '</div>';
    } else if (question.type === 'multiple') {
        html += '<div class="options-container">';
        html += '<p class="hint-text">Select all that apply</p>';
        question.options.forEach((option, index) => {
            const isSelected = answers[question.id] && answers[question.id].includes(option);
            const optionId = `option-${question.id}-${index}`;
            html += `
                <div class="option ${isSelected ? 'selected' : ''}" 
                     id="${optionId}"
                     tabindex="0"
                     role="button"
                     aria-pressed="${isSelected}"
                     data-question-id="${question.id}"
                     data-option-index="${index}"
                     onclick="selectMultipleOptionByIndex(${question.id}, ${index})">
                    <input 
                        type="checkbox" 
                        ${isSelected ? 'checked' : ''}
                        readonly
                    >
                    <span class="option-text">${option}</span>
                </div>
            `;
        });
        html += '</div>';
    }
    
    quizContent.innerHTML = html;
    
    // Show/hide navigation buttons based on question type
    const nextBtn = document.getElementById('nextBtn');
    const prevBtn = document.getElementById('prevBtn');
    const navContainer = document.querySelector('.quiz-navigation');
    
    prevBtn.disabled = currentQuestionIndex === 0;
    
    // Only show Next button for multiple choice and text input
    if (question.type === 'single') {
        navContainer.style.display = 'none';
    } else {
        navContainer.style.display = 'flex';
        nextBtn.textContent = currentQuestionIndex === questions.length - 1 ? 'Get Results' : 'Next';
    }
}

function selectSingleOptionByIndex(questionId, optionIndex, autoAdvance = false) {
    const question = questions.find(q => q.id === questionId);
    if (!question) return;
    
    const option = question.options[optionIndex];
    answers[questionId] = option;
    
    // 🎨 IMMEDIATE THEME CHANGE FOR Q1 (GENDER)
    if (questionId === 1) {
        const gender = option.toLowerCase();
        console.log('🎨 GENDER SELECTED:', option);
        
        if (gender === 'female') {
            document.documentElement.style.setProperty('--secondary-color', '#ff6b9d');
            document.documentElement.style.setProperty('--accent-color', '#ffd6e0');
            console.log('🎨 ✅ PINK APPLIED!');
        } else if (gender === 'male') {
            document.documentElement.style.setProperty('--secondary-color', '#2196F3');
            document.documentElement.style.setProperty('--accent-color', '#90caf9');
            console.log('🎨 ✅ BLUE APPLIED!');
        } else if (gender === 'non-binary') {
            document.documentElement.style.setProperty('--secondary-color', '#9c27b0');
            document.documentElement.style.setProperty('--accent-color', '#ce93d8');
            console.log('🎨 ✅ PURPLE APPLIED!');
        }
    }
    
    // Update UI
    const options = document.querySelectorAll('.option');
    options.forEach(opt => {
        opt.classList.remove('selected', 'confirming');
        const optDataIndex = parseInt(opt.getAttribute('data-option-index'));
        const optDataQuestionId = parseInt(opt.getAttribute('data-question-id'));
        
        if (optDataQuestionId === questionId && optDataIndex === optionIndex) {
            opt.classList.add('selected');
            
            // Add visual confirmation with checkmark
            if (autoAdvance) {
                opt.classList.add('confirming');
                const checkmark = document.createElement('span');
                checkmark.className = 'success-checkmark';
                checkmark.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"></polyline></svg>';
                opt.style.position = 'relative';
                opt.appendChild(checkmark);
            }
        }
    });
    
    // Auto-advance to next question after a short delay
    if (autoAdvance) {
        setTimeout(() => {
            if (currentQuestionIndex < questions.length - 1) {
                currentQuestionIndex++;
                loadQuestion();
            } else {
                submitQuiz();
            }
        }, 500);
    }
}

function selectSingleOption(questionId, option, autoAdvance = false) {
    answers[questionId] = option;
    
    // Update UI
    const options = document.querySelectorAll('.option');
    options.forEach(opt => {
        opt.classList.remove('selected', 'confirming');
        if (opt.textContent.trim() === option || opt.querySelector('.option-text')?.textContent === option) {
            opt.classList.add('selected');
            
            // Add visual confirmation with checkmark
            if (autoAdvance) {
                opt.classList.add('confirming');
                const checkmark = document.createElement('span');
                checkmark.className = 'success-checkmark';
                checkmark.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"></polyline></svg>';
                opt.style.position = 'relative';
                opt.appendChild(checkmark);
            }
        }
    });
    
    // Auto-advance to next question after a short delay
    if (autoAdvance) {
        setTimeout(() => {
            if (currentQuestionIndex < questions.length - 1) {
                currentQuestionIndex++;
                loadQuestion();
            } else {
                submitQuiz();
            }
        }, 500); // Increased from 300ms to show confirmation
    }
}

function selectMultipleOptionByIndex(questionId, optionIndex) {
    const question = questions.find(q => q.id === questionId);
    if (!question) return;
    
    const option = question.options[optionIndex];
    
    if (!answers[questionId]) {
        answers[questionId] = [];
    }
    
    const index = answers[questionId].indexOf(option);
    if (index > -1) {
        answers[questionId].splice(index, 1);
    } else {
        answers[questionId].push(option);
    }
    
    // Update UI
    const optionElement = document.getElementById(`option-${questionId}-${optionIndex}`);
    if (optionElement) {
        const checkbox = optionElement.querySelector('input[type="checkbox"]');
        const isSelected = answers[questionId].includes(option);
        
        if (checkbox) {
            checkbox.checked = isSelected;
        }
        optionElement.classList.toggle('selected', isSelected);
    }
}

function selectMultipleOption(questionId, option) {
    if (!answers[questionId]) {
        answers[questionId] = [];
    }
    
    const index = answers[questionId].indexOf(option);
    if (index > -1) {
        answers[questionId].splice(index, 1);
    } else {
        answers[questionId].push(option);
    }
    
    // Update UI
    const checkbox = document.querySelector(`input[name="question-${questionId}"][value="${option}"]`);
    if (checkbox) {
        checkbox.checked = answers[questionId].includes(option);
        checkbox.parentElement.classList.toggle('selected', checkbox.checked);
    }
}

function previousQuestion() {
    if (currentQuestionIndex > 0) {
        // Save current answer if text input
        saveTextInput();
        currentQuestionIndex--;
        loadQuestion();
    }
}

function nextQuestion() {
    // Save current answer if text input
    saveTextInput();
    
    // Clear any existing error messages
    const existingError = document.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }
    
    // Validate answer
    const question = questions[currentQuestionIndex];
    const isOptional = question.type === 'text' || question.id === 30;
    
    if (!isOptional && (!answers[question.id] || (Array.isArray(answers[question.id]) && answers[question.id].length === 0))) {
        showErrorMessage('Please answer the question before continuing.');
        return;
    }
    
    if (currentQuestionIndex < questions.length - 1) {
        currentQuestionIndex++;
        loadQuestion();
    } else {
        submitQuiz();
    }
}

function showErrorMessage(message) {
    // Remove existing error if any
    const existingError = document.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }
    
    // Create new error message
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    
    // Insert after quiz content
    const quizContent = document.getElementById('quizContent');
    quizContent.parentNode.insertBefore(errorDiv, quizContent.nextSibling);
    
    // Scroll to error
    errorDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function saveTextInput() {
    const question = questions[currentQuestionIndex];
    if (question.type === 'text') {
        const input = document.getElementById(`answer-${question.id}`);
        if (input) {
            answers[question.id] = input.value;
        }
    }
}

async function submitQuiz() {
    // Show loading screen
    document.getElementById('quiz').classList.remove('active');
    document.getElementById('loading').classList.add('active');
    
    // Animate loading steps
    animateLoadingSteps();
    
    try {
        // Get recommendations from Claude
        const analyzeResponse = await fetch('/api/analyze', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ answers })
        });
        
        if (!analyzeResponse.ok) {
            throw new Error('Failed to analyze preferences');
        }
        
        const analyzeData = await analyzeResponse.json();
        
        // Validate recommendations
        if (!analyzeData.recommendations || !Array.isArray(analyzeData.recommendations)) {
            console.error('Invalid recommendations format:', analyzeData);
            throw new Error('Invalid response format from AI');
        }
        
        // Search for affiliate links
        const affiliateResponse = await fetch('/api/search-affiliates', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ perfumes: analyzeData.recommendations })
        });
        
        const affiliateData = await affiliateResponse.json();
        
        // Use recommendations even if affiliate search fails
        const results = affiliateData.results || analyzeData.recommendations.map(p => ({
            ...p,
            affiliateLinks: []
        }));
        
        // Display results
        displayResults(results);
    } catch (error) {
        console.error('Error submitting quiz:', error);
        showErrorMessage('Something went wrong. Please try again. ' + error.message);
        document.getElementById('loading').classList.remove('active');
        document.getElementById('quiz').classList.add('active');
    }
}

function animateLoadingSteps() {
    const steps = document.querySelectorAll('.step');
    let currentStep = 0;
    
    const interval = setInterval(() => {
        if (currentStep < steps.length) {
            steps[currentStep].classList.add('active');
            currentStep++;
        } else {
            clearInterval(interval);
        }
    }, 1500);
}

function displayResults(perfumes) {
    document.getElementById('loading').classList.remove('active');
    document.getElementById('results').classList.add('active');
    
    const resultsContent = document.getElementById('resultsContent');
    
    // Validate perfumes array
    if (!perfumes || !Array.isArray(perfumes) || perfumes.length === 0) {
        resultsContent.innerHTML = `
            <div style="text-align: center; padding: 3rem;">
                <h2>No recommendations available</h2>
                <p>Please try again or contact support.</p>
                <button class="btn btn-primary" onclick="restartQuiz()">Take Quiz Again</button>
            </div>
        `;
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
    }
    
    let html = '<div class="perfume-list">';
    
    perfumes.forEach((perfume, index) => {
        // Find Amazon link
        const amazonLink = perfume.affiliateLinks?.find(link => 
            link.platform.toLowerCase().includes('amazon')
        );
        
        html += `
            <div class="perfume-item">
                <div class="perfume-rank">${index + 1}</div>
                <div class="perfume-content">
                    <h3>${perfume.brand} - ${perfume.name}</h3>
                    <p class="perfume-description">${perfume.description}</p>
                    
                    ${perfume.why ? `
                        <div class="why-match">
                            <strong>Why it matches:</strong> ${perfume.why}
                        </div>
                    ` : ''}
                    
                    ${perfume.notes && perfume.notes.length > 0 ? `
                        <div class="perfume-notes">
                            <strong>Key Notes:</strong> ${perfume.notes.join(', ')}
                        </div>
                    ` : ''}
                    
                    ${amazonLink ? `
                        <a href="${amazonLink.url}" 
                           target="_blank" 
                           rel="noopener noreferrer" 
                           class="amazon-btn">
                            View on Amazon
                        </a>
                    ` : ''}
                </div>
            </div>
        `;
    });
    
    html += '</div>';
    resultsContent.innerHTML = html;
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Track affiliate click analytics
function trackClick(platform, brand, name) {
    console.log(`Affiliate Click: ${platform} - ${brand} ${name}`);
    // You can send this to Google Analytics, Meta Pixel, etc.
    if (typeof gtag !== 'undefined') {
        gtag('event', 'affiliate_click', {
            platform: platform,
            product: `${brand} ${name}`
        });
    }
}

function restartQuiz() {
    document.getElementById('results').classList.remove('active');
    document.getElementById('hero').classList.add('active');
    currentQuestionIndex = 0;
    answers = {};
    
    // Reset loading steps
    const steps = document.querySelectorAll('.step');
    steps.forEach((step, index) => {
        if (index === 0) {
            step.classList.add('active');
        } else {
            step.classList.remove('active');
        }
    });
}

// Handle text input updates
document.addEventListener('input', (e) => {
    if (e.target.classList.contains('text-input')) {
        const questionId = parseInt(e.target.id.replace('answer-', ''));
        answers[questionId] = e.target.value;
    }
});

// Keyboard navigation
document.addEventListener('keydown', (e) => {
    if (document.getElementById('quiz').classList.contains('active')) {
        if (e.key === 'Enter' && !e.target.classList.contains('text-input')) {
            nextQuestion();
        } else if (e.key === 'ArrowLeft') {
            previousQuestion();
        } else if (e.key === 'ArrowRight') {
            nextQuestion();
        }
    }
});

// Handle keyboard accessibility for options
function handleOptionKeyPress(event, questionId, optionIndex, autoAdvance) {
    if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        selectSingleOptionByIndex(questionId, optionIndex, autoAdvance);
    }
}

// Show section navigation
function showSection(sectionId) {
    // Hide all sections
    const sections = ['hero', 'about', 'how-it-works', 'contact', 'quiz', 'loading', 'results'];
    sections.forEach(id => {
        const section = document.getElementById(id);
        if (section) {
            section.classList.remove('active');
        }
    });
    
    // Show requested section
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.classList.add('active');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

// Handle contact form submission
function handleContactForm(event) {
    event.preventDefault();
    
    const form = event.target;
    const formData = {
        name: form.name.value,
        email: form.email.value,
        subject: form.subject.value,
        message: form.message.value
    };
    
    // Log for now (you can integrate with email service later)
    console.log('Contact form submitted:', formData);
    
    // Show success message
    alert('Thank you for your message! We\'ll get back to you within 24 hours.');
    
    // Reset form
    form.reset();
    
    // You can integrate with email services like:
    // - EmailJS: https://www.emailjs.com/
    // - Formspree: https://formspree.io/
    // - SendGrid API
    // - Your own backend endpoint
}

// Update nav active state on scroll
document.addEventListener('DOMContentLoaded', () => {
    const navLinks = document.querySelectorAll('.nav a');
    
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
        });
    });
});
