// Global state
let questions = [];
let currentQuestionIndex = 0;
let answers = {};
let userCountry = 'US'; // Default to US, will be detected
let emailCaptureConfig = { mode: 'always' }; // Default: always

// NO THEME SYSTEM - Plain minimalist design throughout
// Removed: userGender, themeProgress, theme transition logic

// Sarah's typing animation
function typewriterEffect() {
    const text = "Trained on 10,000+ fragrances and powered by Claude AI, I analyze your unique preferences to deliver personalized matches that feel like they were chosen by a luxury boutique expert—instantly.";
    const element = document.getElementById('sarahTyping');
    const cursor = document.querySelector('.typing-cursor');
    
    if (!element) return;
    
    let index = 0;
    element.textContent = '';
    
    function type() {
        if (index < text.length) {
            element.textContent += text.charAt(index);
            index++;
            setTimeout(type, 30);
        } else {
            // Remove cursor after typing is complete
            setTimeout(() => {
                if (cursor) cursor.style.display = 'none';
            }, 500);
        }
    }
    
    // Start typing after a brief delay
    setTimeout(type, 500);
}

// =============================================
// LIVE ACTIVITY FEED SYSTEM
// =============================================

const mockActivities = [
    { name: "Emma", perfume: "Tom Ford Black Orchid", time: "2 min ago", notes: ["floral", "oriental"] },
    { name: "James", perfume: "Chanel Bleu de Chanel", time: "5 min ago", notes: ["woody", "citrus"] },
    { name: "Sofia", perfume: "Dior Sauvage", time: "8 min ago", notes: ["fresh", "woody"] },
    { name: "Lucas", perfume: "YSL La Nuit de L'Homme", time: "12 min ago", notes: ["oriental", "woody"] },
    { name: "Olivia", perfume: "Jo Malone Wood Sage", time: "15 min ago", notes: ["fresh", "woody"] },
    { name: "Noah", perfume: "Creed Aventus", time: "18 min ago", notes: ["fresh", "citrus"] },
    { name: "Ava", perfume: "Gucci Bloom", time: "22 min ago", notes: ["floral", "fresh"] },
    { name: "Liam", perfume: "Prada L'Homme", time: "25 min ago", notes: ["fresh", "citrus"] },
    { name: "Mia", perfume: "Lancôme La Vie Est Belle", time: "28 min ago", notes: ["floral", "oriental"] },
    { name: "Ethan", perfume: "Versace Eros", time: "32 min ago", notes: ["fresh", "woody"] }
];

let activityIndex = 0;

function initializeLiveActivityFeed() {
    const feedElement = document.getElementById('activityFeed');
    if (!feedElement) return;
    
    // Add initial activities
    for (let i = 0; i < 4; i++) {
        addActivityItem(mockActivities[activityIndex % mockActivities.length]);
        activityIndex++;
    }
    
    // Add new activity every 8 seconds
    setInterval(() => {
        addActivityItem(mockActivities[activityIndex % mockActivities.length]);
        activityIndex++;
    }, 8000);
}

function addActivityItem(activity) {
    const feedElement = document.getElementById('activityFeed');
    if (!feedElement) return;
    
    // Get initials for avatar
    const initials = activity.name.split(' ').map(n => n[0]).join('');
    
    // Create fragrance dots HTML
    const notesHTML = activity.notes ? activity.notes.map(note => 
        `<span class="fragrance-dot ${note}"></span>`
    ).join('') : '';
    
    // Create activity item
    const activityHTML = `
        <div class="activity-item">
            <div class="activity-avatar">${initials}</div>
            <div class="activity-content">
                <div class="activity-user">${activity.name}</div>
                <div class="activity-perfume">
                    Matched: ${activity.perfume}
                    ${notesHTML}
                </div>
                <div class="activity-time">${activity.time}</div>
            </div>
        </div>
    `;
    
    // Add to top of feed
    feedElement.insertAdjacentHTML('afterbegin', activityHTML);
    
    // Keep only last 5 items
    while (feedElement.children.length > 5) {
        feedElement.removeChild(feedElement.lastChild);
    }
}

// REMOVED: Theme colors object and interpolation functions
// Plain design doesn't need dynamic color transitions

// Detect user's country
async function detectUserCountry() {
    try {
        // Try to detect from timezone
        const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        
        // Common North American timezones
        const canadianTimezones = [
            'America/Toronto', 'America/Vancouver', 'America/Montreal', 
            'America/Edmonton', 'America/Calgary', 'America/Winnipeg',
            'America/Halifax', 'America/St_Johns'
        ];
        
        if (canadianTimezones.some(tz => timezone.includes(tz))) {
            userCountry = 'CA';
            console.log('🇨🇦 Detected country: Canada');
            return 'CA';
        }
        
        // Try IP-based geolocation API (free, no key needed)
        try {
            const response = await fetch('https://ipapi.co/json/', { timeout: 2000 });
            const data = await response.json();
            
            if (data.country_code) {
                const countryCode = data.country_code.toUpperCase();
                if (countryCode === 'CA') {
                    userCountry = 'CA';
                    console.log('🇨🇦 Detected country: Canada (IP)');
                } else if (countryCode === 'US') {
                    userCountry = 'US';
                    console.log('🇺🇸 Detected country: USA (IP)');
                } else {
                    // Default to US for other countries
                    userCountry = 'US';
                    console.log(`🌍 Detected country: ${countryCode}, defaulting to US`);
                }
                return userCountry;
            }
        } catch (geoError) {
            console.log('Geolocation API failed, using timezone detection');
        }
        
        // Default to US
        userCountry = 'US';
        console.log('🇺🇸 Default country: USA');
        return 'US';
        
    } catch (error) {
        console.error('Country detection error:', error);
        userCountry = 'US';
        return 'US';
    }
}

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

// REMOVED: Theme system - no color transitions needed

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
    console.log('🚀 Initializing NOTA app...');
    
    // Initialize Sarah's typing animation
    typewriterEffect();
    
    // Initialize live activity feed
    initializeLiveActivityFeed();
    
    // Initialize splash screen
    initSplashScreen();
    
    // Initialize side ads panel
    initializeSideAds();
    
    // Detect user's country
    await detectUserCountry();
    
    // Initialize 3D Card Carousel
    init3DCarousel();
    
    // Initialize share functionality
    initializeShareFunctionality();
    initializeShareAppSystem();
    
    // Initialize email capture form
    const emailForm = document.getElementById('emailCaptureForm');
    if (emailForm) {
        emailForm.addEventListener('submit', handleEmailSubmit);
        console.log('✅ Email capture form listener attached');
    } else {
        console.error('❌ Email capture form not found!');
    }
    
    // Load quiz questions
    try {
        const response = await fetch('/api/questions');
        questions = await response.json();
        const totalQuestionsEl = document.getElementById('totalQuestions');
        if (totalQuestionsEl) {
            totalQuestionsEl.textContent = questions.length;
        }
        console.log('✅ Loaded', questions.length, 'questions');
    } catch (error) {
        console.error('❌ Error loading questions:', error);
        alert('Failed to load quiz questions. Please refresh the page.');
    }
    
    console.log('✅ NOTA app initialized');
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
    
    // Hide trust badges, partners sections, and side ads during quiz
    const trustBadges = document.querySelector('.trust-badges-section');
    const partnersSection = document.querySelector('.partners-section');
    const sideAdsPanel = document.querySelector('.side-ads-panel');
    if (trustBadges) trustBadges.style.display = 'none';
    if (partnersSection) partnersSection.style.display = 'none';
    if (sideAdsPanel) sideAdsPanel.style.display = 'none';
    
    currentQuestionIndex = 0;
    answers = {};
    // REMOVED: userGender and themeProgress reset - no theme system
    loadQuestion();
}

// REMOVED: Dynamic theme system functions
// applyDynamicTheme() - No longer needed
// interpolateColor() - No longer needed  
// detectGenderSelection() - No longer needed
// Plain design uses consistent colors throughout

function loadQuestion() {
    const question = questions[currentQuestionIndex];
    const quizContent = document.getElementById('quizContent');
    
    // IMPROVED: Mid-quiz share banner - only show once at Q15, less intrusive
    if (currentQuestionIndex === 14 && !sessionStorage.getItem('midQuizShareShown')) {
        showMidQuizShareBanner();
    }
    
    // Update progress
    const progress = ((currentQuestionIndex + 1) / questions.length) * 100;
    document.getElementById('progressBar').style.width = progress + '%';
    document.getElementById('currentQuestion').textContent = currentQuestionIndex + 1;
    
    // REMOVED: applyDynamicTheme() - no theme transitions
    
    // Determine if question is optional
    const isOptional = question.type === 'text' || 
                      question.id === 'past_favorites' || 
                      question.id === 'notes_love' || 
                      question.id === 'notes_dislike';
    
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
                     onclick="selectSingleOptionByIndex('${question.id}', ${index}, true)"
                     onkeypress="handleOptionKeyPress(event, '${question.id}', ${index}, true)">
                    <span class="option-text">${option}</span>
                </div>
            `;
        });
        html += '</div>';
    } else if (question.type === 'multiple') {
        const isMiniCards = question.id === 'notes_love' || 
                           question.id === 'notes_dislike' || 
                           question.id === 'sensitivity';
        html += `<div class="options-container multiple-choice ${isMiniCards ? 'mini-cards' : ''}">`;
        html += '<div class="multiple-choice-hint"><i class="fas fa-check-double"></i> <strong>Select all that apply</strong></div>';
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
                     onclick="selectMultipleOptionByIndex('${question.id}', ${index})">
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
    
    // REMOVED: Immediate theme change for Q1 - no theme system
    
    // Update UI
    const options = document.querySelectorAll('.option');
    options.forEach(opt => {
        opt.classList.remove('selected', 'confirming');
        const optDataIndex = parseInt(opt.getAttribute('data-option-index'));
        const optDataQuestionId = opt.getAttribute('data-question-id');
        
        if (optDataQuestionId == questionId && optDataIndex === optionIndex) {
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
    const isOptional = question.type === 'text' || 
                      question.id === 'past_favorites' || 
                      question.id === 'notes_love' || 
                      question.id === 'notes_dislike';
    
    if (!isOptional && (!answers[question.id] || (Array.isArray(answers[question.id]) && answers[question.id].length === 0))) {
        showErrorMessage('Please answer the question before continuing.');
        return;
    }
    
    if (currentQuestionIndex < questions.length - 1) {
        currentQuestionIndex++;
        loadQuestion();
        
        // AUTO-SCROLL TO TOP OF QUESTION AFTER ANSWERING
        scrollToQuestionTop();
    } else {
        submitQuiz();
    }
}

// Function to scroll to question top
function scrollToQuestionTop() {
    const quizSection = document.querySelector('.quiz-section');
    if (quizSection) {
        // Scroll to top of quiz section (accounting for fixed header)
        const headerHeight = 280; // Logo + header height
        const yOffset = -headerHeight - 20; // Extra 20px padding
        const y = quizSection.getBoundingClientRect().top + window.pageYOffset + yOffset;
        
        window.scrollTo({
            top: y,
            behavior: 'smooth'
        });
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
    console.log('🎯 submitQuiz() called');
    console.log('📋 Current answers:', answers);
    
    // Check if we should show email capture
    try {
        const shouldShowEmail = await shouldShowEmailCapture();
        console.log('📧 Should show email capture:', shouldShowEmail);
        
        if (shouldShowEmail) {
            console.log('📧 Showing email capture modal');
            showEmailCaptureModal();
            return; // Wait for user to submit email or skip
        }
    } catch (error) {
        console.error('⚠️ Email capture check failed, proceeding anyway:', error);
    }
    
    console.log('✅ Skipping email capture - proceeding with quiz submission');
    // Continue with quiz submission
    proceedWithQuizSubmission();
}

// Check if email capture should be shown based on configuration
async function shouldShowEmailCapture() {
    // Fetch configuration from backend
    try {
        const response = await fetch('/api/config/email-capture');
        const config = await response.json();
        emailCaptureConfig = config;
        console.log('📧 Email capture config:', config);
    } catch (error) {
        console.log('⚠️ Could not fetch email config, using default');
    }
    
    const mode = emailCaptureConfig.mode.toLowerCase();
    
    // Never show email capture
    if (mode === 'never') {
        console.log('📧 Mode: NEVER - Email capture disabled');
        return false;
    }
    
    // Always show email capture
    if (mode === 'always') {
        console.log('📧 Mode: ALWAYS - Showing email capture');
        return true;
    }
    
    // Days-based logic
    const days = parseInt(mode);
    if (isNaN(days)) {
        console.log('📧 Invalid mode, defaulting to always');
        return true; // Default to always showing email capture
    }
    
    console.log(`📧 Mode: ${days} days - Checking last capture date`);
    return checkEmailCaptureByDays(days);
}

// Check if email should be captured based on days
function checkEmailCaptureByDays(days) {
    const userEmail = localStorage.getItem('userEmail');
    const lastCaptureDate = localStorage.getItem('emailCaptureDate');
    
    // No email captured yet
    if (!userEmail) {
        console.log('📧 No email found - should show capture');
        return true;
    }
    
    // No date stored (old data) - treat as expired
    if (!lastCaptureDate) {
        console.log('📧 No capture date found - should show capture');
        return true;
    }
    
    // Check if enough days have passed
    const daysSinceCapture = (Date.now() - parseInt(lastCaptureDate)) / (1000 * 60 * 60 * 24);
    console.log(`📧 Days since last capture: ${daysSinceCapture.toFixed(1)}`);
    
    if (daysSinceCapture >= days) {
        console.log(`📧 ${days} days passed - should show capture`);
        return true;
    }
    
    console.log(`📧 Only ${daysSinceCapture.toFixed(1)} days passed - skip capture`);
    return false;
}

// Show email capture modal - IMPROVED: No timeouts or debug buttons
function showEmailCaptureModal() {
    console.log('📧 showEmailCaptureModal() called');
    const modal = document.getElementById('emailCaptureModal');
    console.log('📧 Modal element:', modal);
    
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        console.log('✅ Email modal visible');
        
        // REMOVED: Debug button and auto-proceed timeout
        // Users must make a conscious choice to submit or skip
    } else {
        console.error('❌ Email capture modal not found in DOM!');
        // Proceed without email if modal not found
        console.log('⚠️ Proceeding without email capture');
        proceedWithQuizSubmission();
    }
}

// Hide email capture modal
function hideEmailCaptureModal() {
    const modal = document.getElementById('emailCaptureModal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
    // REMOVED: Debug button code - not needed in production
}

// Skip email capture and proceed to results
function skipEmailCapture() {
    console.log('📧 User skipped email capture');
    hideEmailCaptureModal();
    proceedWithQuizSubmission();
}

// Handle email form submission
function handleEmailSubmit(event) {
    if (event) {
        event.preventDefault();
        event.stopPropagation();
    }
    console.log('📧 Email form submitted');
    
    const emailInput = document.getElementById('userEmail');
    if (!emailInput) {
        console.error('❌ Email input not found!');
        skipEmailCapture();
        return;
    }
    
    const email = emailInput.value.trim();
    console.log('📧 Email value:', email);
    
    // Allow empty email (skip)
    if (!email) {
        console.log('📧 Empty email - treating as skip');
        skipEmailCapture();
        return;
    }
    
    // Validate email format
    const emailRegex = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i;
    if (!emailRegex.test(email)) {
        alert('Please enter a valid email address');
        return;
    }
    
    console.log('✅ Email validated:', email);
    
    // Store email locally with timestamp
    localStorage.setItem('userEmail', email);
    localStorage.setItem('emailCaptureDate', Date.now().toString());
    
    // Send email to backend (optional - for your records)
    fetch('/api/capture-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
            email,
            timestamp: Date.now(),
            answers: answers
        })
    }).then(() => {
        console.log('✅ Email sent to backend');
    }).catch(error => {
        console.log('⚠️ Email capture failed:', error);
    });
    
    // Hide modal and proceed immediately (don't wait for backend)
    console.log('🚀 Proceeding to results...');
    hideEmailCaptureModal();
    proceedWithQuizSubmission();
}

// Proceed with quiz submission (original logic)
async function proceedWithQuizSubmission() {
    console.log('🚀 proceedWithQuizSubmission() called');
    
    // Show loading screen
    const quizSection = document.getElementById('quiz');
    const loadingSection = document.getElementById('loading');
    
    console.log('Quiz section:', quizSection);
    console.log('Loading section:', loadingSection);
    
    if (quizSection) {
        quizSection.classList.remove('active');
        console.log('✅ Quiz section hidden');
    }
    
    if (loadingSection) {
        loadingSection.classList.add('active');
        console.log('✅ Loading section shown');
    }
    
    // Animate loading steps
    animateLoadingSteps();
    
    try {
        console.log('📤 Sending answers to API:', answers);
        
        // Get recommendations from Claude
        const analyzeResponse = await fetch('/api/analyze', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ answers })
        });
        
        console.log('📥 Analyze response status:', analyzeResponse.status);
        
        if (!analyzeResponse.ok) {
            const errorText = await analyzeResponse.text();
            console.error('API Error:', errorText);
            throw new Error('Failed to analyze preferences');
        }
        
        const analyzeData = await analyzeResponse.json();
        console.log('✅ Analyze data received:', analyzeData);
        
        // Validate recommendations
        if (!analyzeData.recommendations || !Array.isArray(analyzeData.recommendations)) {
            console.error('Invalid recommendations format:', analyzeData);
            throw new Error('Invalid response format from AI');
        }
        
        console.log('📤 Searching for affiliate links...');
        
        // Search for affiliate links with user's country
        const affiliateResponse = await fetch('/api/search-affiliates', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
                perfumes: analyzeData.recommendations,
                country: userCountry  // Send detected country
            })
        });
        
        console.log('📥 Affiliate response status:', affiliateResponse.status);
        
        const affiliateData = await affiliateResponse.json();
        console.log('✅ Affiliate data received:', affiliateData);
        
        // IMPORTANT: Merge affiliate data WITH original recommendations to preserve retailerLinks
        const results = analyzeData.recommendations.map((perfume, index) => {
            const affiliateResult = affiliateData.results?.[index];
            return {
                ...perfume,  // Keep original data including retailerLinks
                affiliateLinks: affiliateResult?.affiliateLinks || []  // Add affiliateLinks if available
            };
        });
        
        console.log('🎯 Final merged results:', results);
        console.log('🔍 First perfume has retailerLinks?', results[0]?.retailerLinks?.length || 0);
        
        // Display results
        displayResults(results);
        console.log('✅ displayResults() called');
        
    } catch (error) {
        console.error('❌ Error submitting quiz:', error);
        showErrorMessage('Something went wrong. Please try again. ' + error.message);
        
        const loadingSection = document.getElementById('loading');
        const quizSection = document.getElementById('quiz');
        
        if (loadingSection) {
            loadingSection.classList.remove('active');
        }
        if (quizSection) {
            quizSection.classList.add('active');
        }
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
    
    // Countdown timer
    const timerElement = document.getElementById('loadingTimer');
    if (timerElement) {
        let timeLeft = 10;
        const timerInterval = setInterval(() => {
            timeLeft--;
            if (timeLeft > 0 && timerElement) {
                timerElement.textContent = timeLeft;
            } else {
                clearInterval(timerInterval);
            }
        }, 1000);
    }
}

// Parse price from string to numeric value for sorting
function parsePrice(priceString) {
    if (!priceString || typeof priceString !== 'string') return null;
    
    // Remove currency symbols and extra text
    const cleaned = priceString.replace(/[^0-9.,]/g, '');
    
    // Handle different decimal separators
    const normalized = cleaned.replace(',', '.');
    
    // Extract first number
    const match = normalized.match(/\d+\.?\d*/);
    if (!match) return null;
    
    return parseFloat(match[0]);
}

// Render aggregated offers list with sorting and best deal highlighting
function renderAggregatedOffers(retailerLinks, perfumeBrand, perfumeName, perfumeImage) {
    if (!retailerLinks || !Array.isArray(retailerLinks) || retailerLinks.length === 0) {
        return '<div class="no-retailer-links">No retailer links available</div>';
    }
    
    // Parse prices and sort offers
    const offersWithPrices = retailerLinks.map(link => ({
        ...link,
        numericPrice: parsePrice(link.price)
    }));
    
    // Sort by price (ascending) - offers without prices go to the end
    offersWithPrices.sort((a, b) => {
        if (a.numericPrice === null && b.numericPrice === null) return 0;
        if (a.numericPrice === null) return 1;
        if (b.numericPrice === null) return -1;
        return a.numericPrice - b.numericPrice;
    });
    
    // Determine best deal (lowest price) and runner-up
    const bestDealIndex = offersWithPrices.findIndex(offer => offer.numericPrice !== null);
    const runnerUpIndex = bestDealIndex !== -1 ? bestDealIndex + 1 : -1;
    
    // Render offer rows
    return offersWithPrices.map((link, index) => {
        const isBestDeal = (index === bestDealIndex && link.numericPrice !== null);
        const isRunnerUp = (index === runnerUpIndex && link.numericPrice !== null);
        const retailerEmoji = getRetailerEmoji(link.retailer);
        
        // Generate urgency badges
        const urgencyBadges = window.resultsEnhancements ? 
            window.resultsEnhancements.generateUrgencyBadges(perfumeName, link.retailer) : '';
        
        // Generate trust signals
        const trustSignals = window.resultsEnhancements ? 
            window.resultsEnhancements.generateTrustSignals(link.retailer) : '';
        
        // Generate price display with anchoring
        let priceDisplay = '';
        if (link.price && window.resultsEnhancements) {
            priceDisplay = window.resultsEnhancements.generatePriceDisplay(link.price, link.retailer);
        } else {
            priceDisplay = `<div class="offer-price">${link.price || '<span class="price-unavailable">See site</span>'}</div>`;
        }
        
        return `
            <div class="offer-row ${isBestDeal ? 'best-deal' : ''} ${isRunnerUp ? 'runner-up' : ''}"
                 data-retailer="${link.retailer}"
                 data-price="${link.numericPrice || 0}">
                
                ${perfumeImage ? `<img src="${perfumeImage}" class="offer-product-thumb" alt="${perfumeBrand} ${perfumeName}">` : ''}
                
                ${urgencyBadges}
                
                <div class="offer-retailer">
                    <div class="retailer-logo-placeholder">${retailerEmoji}</div>
                    <span class="retailer-name">${link.retailer}</span>
                </div>
                
                ${priceDisplay}
                
                ${trustSignals}
                
                <a href="${link.url}" 
                   target="_blank" 
                   rel="noopener noreferrer"
                   class="view-retailer-btn"
                   data-event="affiliate-click"
                   data-retailer="${link.retailer}"
                   data-perfume-brand="${perfumeBrand || 'N/A'}"
                   data-perfume-name="${perfumeName || 'N/A'}"
                   data-price="${link.numericPrice || 0}"
                   onclick="trackClick('${link.retailer}', '${perfumeBrand || 'N/A'}', '${perfumeName || 'N/A'}')"
                   aria-label="View ${perfumeBrand} ${perfumeName} on ${link.retailer}">
                    ${isBestDeal ? 'Get Best Deal' : isRunnerUp ? 'View Offer' : 'See Price'}
                </a>
            </div>
        `;
    }).join('');
}>
                    View in ${link.retailer}
                </a>
            </div>
        `;
    }).join('');
}

// Get retailer emoji/icon
function getRetailerEmoji(retailerName) {
    const name = retailerName.toLowerCase();
    
    if (name.includes('amazon')) return '🛒';
    if (name.includes('sephora')) return '💎';
    if (name.includes('ulta')) return '🌟';
    if (name.includes('nordstrom')) return '🏬';
    if (name.includes('macy')) return '🏢';
    if (name.includes('bloomingdale')) return '🎀';
    if (name.includes('neiman')) return '👑';
    if (name.includes('target')) return '🎯';
    if (name.includes('walgreens') || name.includes('cvs')) return '💊';
    if (name.includes('fragrance') || name.includes('perfume')) return '🧴';
    
    return '🛍️'; // Default
}

function displayResults(perfumes) {
    document.getElementById('loading').classList.remove('active');
    document.getElementById('results').classList.add('active');
    
    const resultsContent = document.getElementById('resultsContent');
    
    // Match personality profile based on answers
    let matchedProfile = null;
    if (typeof matchPersonalityProfile === 'function') {
        matchedProfile = matchPersonalityProfile(answers);
        console.log('Matched Personality Profile:', matchedProfile);
    }
    
    // Store results for sharing (include profile)
    storeUserResultsForSharing(perfumes, matchedProfile);
    
    // Track quiz completion for referral system
    trackQuizCompletion();
    
    // Update share app progress
    setTimeout(() => updateShareAppProgress(), 1000);
    
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
    
    // ===== DEBUG: Check what data we're receiving =====
    console.log('🔍 DEBUG: Total perfumes received:', perfumes.length);
    perfumes.forEach((perfume, index) => {
        console.log(`\n📦 Perfume ${index + 1}: ${perfume.brand} - ${perfume.name}`);
        console.log('   Has retailerLinks?', perfume.hasOwnProperty('retailerLinks'));
        console.log('   retailerLinks value:', perfume.retailerLinks);
        console.log('   retailerLinks length:', perfume.retailerLinks?.length || 0);
        console.log('   Has affiliateLinks?', perfume.hasOwnProperty('affiliateLinks'));
        console.log('   All keys:', Object.keys(perfume));
    });
    // ===== END DEBUG =====
    
    let html = '';
    
    // Add Results Hero Section (NEW)
    if (window.resultsEnhancements) {
        html += window.resultsEnhancements.generateResultsHero(perfumes.length, matchedProfile);
    }
    
    // Display personality profile if matched
    if (matchedProfile) {
        html += `
            <div class="personality-profile-card">
                <div class="profile-header">
                    <div class="profile-icon">
                        <i class="fas ${matchedProfile.icon || 'fa-star'}"></i>
                    </div>
                    <div class="profile-header-text">
                        <h3 class="profile-name">${matchedProfile.name}</h3>
                        <p class="profile-description">${matchedProfile.description}</p>
                    </div>
                </div>
                <div class="profile-scent-section">
                    <div class="scent-label">
                        <i class="fas fa-flask"></i>
                        <strong>Your Scent Families:</strong>
                    </div>
                    <div class="scent-tags">
                        ${matchedProfile.scentFamilies.map(family => 
                            `<span class="scent-tag"><i class="fas fa-tag"></i>${family}</span>`
                        ).join('')}
                    </div>
                </div>
            </div>
        `;
    }
    
    html += `
        <div class="pricing-explainer">
            <div class="explainer-icon">
                <i class="fas fa-balance-scale"></i>
            </div>
            <div class="explainer-text">
                <strong>Fair Price Comparison:</strong> All prices normalized to 50ml for easy comparison.
            </div>
        </div>
        <div class="perfume-list">
    `;
    
    perfumes.forEach((perfume, index) => {
        // Find Amazon link
        const amazonLink = perfume.affiliateLinks?.find(link =>
            link.platform.toLowerCase().includes('amazon')
        );
        
        // Get match percentage (default to calculated value if not provided)
        const matchPercentage = perfume.matchPercentage || (98 - (index * 3));

        // Get product image from retailer links if not directly available
        const productImage = perfume.image || 
                             (perfume.retailerLinks && perfume.retailerLinks.length > 0 ? perfume.retailerLinks[0].image : null);

        html += `
            <div class="perfume-item">
                <div class="perfume-rank">${index + 1}</div>
                
                ${productImage ? `
                    <div class="perfume-image-container">
                        <img src="${productImage}" alt="${perfume.brand} ${perfume.name}" class="perfume-main-image">
                    </div>
                ` : `
                    <div class="perfume-image-container placeholder">
                        <i class="fas fa-bottle-vaial"></i>
                    </div>
                `}

                <div class="perfume-content">
                    <div class="perfume-header">
                        <h3>${perfume.brand} - ${perfume.name}</h3>
                        <div class="match-badge">
                            <div class="match-percentage">${matchPercentage}%</div>
                            <div class="match-label">Match</div>
                        </div>
                    </div>
                    
                    <div class="match-bar-container">
                        <div class="match-bar" style="width: ${matchPercentage}%"></div>
                    </div>
                    
                    ${perfume.personalityNarrative ? `
                        <div class="personality-narrative">
                            <em>${perfume.personalityNarrative}</em>
                        </div>
                    ` : ''}
                    
                    ${perfume.description && !perfume.personalityNarrative ? `
                        <p class="perfume-description">${perfume.description}</p>
                    ` : ''}
                    
                    ${perfume.whyPerfect && Array.isArray(perfume.whyPerfect) ? `
                        <div class="why-perfect">
                            <strong>Why it's perfect for you:</strong>
                            ${perfume.whyPerfect.map(reason => 
                                `<div class="reason-item">${reason}</div>`
                            ).join('')}
                        </div>
                    ` : perfume.why ? `
                        <div class="why-match">
                            <strong>Why it matches:</strong> ${perfume.why}
                        </div>
                    ` : ''}
                    
                    ${perfume.notesBreakdown ? `
                        <div class="notes-breakdown">
                            <strong>Fragrance Journey:</strong>
                            <div class="notes-layers">
                                ${perfume.notesBreakdown.top ? `
                                    <div class="note-layer">
                                        <i class="fas fa-leaf note-icon" title="Top Notes"></i>
                                        <span class="note-type">Top:</span> 
                                        ${perfume.notesBreakdown.top.join(', ')}
                                    </div>
                                ` : ''}
                                ${perfume.notesBreakdown.heart ? `
                                    <div class="note-layer">
                                        <i class="fas fa-heart note-icon" title="Heart Notes"></i>
                                        <span class="note-type">Heart:</span> 
                                        ${perfume.notesBreakdown.heart.join(', ')}
                                    </div>
                                ` : ''}
                                ${perfume.notesBreakdown.base ? `
                                    <div class="note-layer">
                                        <i class="fas fa-mountain note-icon" title="Base Notes"></i>
                                        <span class="note-type">Base:</span> 
                                        ${perfume.notesBreakdown.base.join(', ')}
                                    </div>
                                ` : ''}
                            </div>
                        </div>
                    ` : perfume.notes && perfume.notes.length > 0 ? `
                        <div class="perfume-notes">
                            <i class="fas fa-flask note-icon"></i>
                            <strong>Key Notes:</strong> ${perfume.notes.join(', ')}
                        </div>
                    ` : ''}
                    
                    ${perfume.commercialDetails ? `
                        <div class="commercial-info">
                            ${perfume.commercialDetails.price ? `
                                <span class="info-badge price-badge">
                                    💰 ${perfume.commercialDetails.price}${perfume.commercialDetails.size ? ` (${perfume.commercialDetails.size})` : ''}
                                </span>
                            ` : ''}
                            ${perfume.commercialDetails.normalizedPrice50ml ? `
                                <span class="info-badge normalized-price">
                                    📊 ${perfume.commercialDetails.normalizedPrice50ml}/50ml
                                </span>
                            ` : ''}
                            ${perfume.commercialDetails.longevity ? `<span class="info-badge">⏱️ ${perfume.commercialDetails.longevity}</span>` : ''}
                            ${perfume.commercialDetails.sillage ? `<span class="info-badge">🌟 ${perfume.commercialDetails.sillage}</span>` : ''}
                            ${perfume.commercialDetails.bestFor ? `<span class="info-badge">✨ ${perfume.commercialDetails.bestFor}</span>` : ''}
                        </div>
                    ` : ''}
                    
                    ${perfume.socialProof ? `
                        <div class="social-proof">
                            ${perfume.socialProof.rating ? `⭐ ${perfume.socialProof.rating}` : ''}
                            ${perfume.socialProof.reviewCount ? ` (${perfume.socialProof.reviewCount} reviews)` : ''}
                            ${perfume.socialProof.popularityRank ? ` • ${perfume.socialProof.popularityRank}` : ''}
                        </div>
                    ` : ''}

                    ${perfume.sampleOption && perfume.sampleOption.available ? `
                        <div class="sample-option">
                            🧪 <strong>Sample available:</strong> ${perfume.sampleOption.price} - ${perfume.sampleOption.message}
                        </div>
                    ` : ''}

                    ${perfume.urgencyTrigger ? `
                        <div class="urgency-trigger">
                            ⚡ ${perfume.urgencyTrigger}
                        </div>
                    ` : ''}

                    ${perfume.trustSignals && perfume.trustSignals.length > 0 ? `
                        <div class="trust-signals">
                            ${perfume.trustSignals.map(signal => `<span class="trust-badge">✓ ${signal}</span>`).join(' ')}
                        </div>
                    ` : ''}
                    
                    ${perfume.similarTo ? `
                        <div class="similar-to">
                            <strong>Similar vibes:</strong> ${perfume.similarTo}
                        </div>
                    ` : ''}
                    
                    <button class="save-favorite" onclick="window.resultsEnhancements && window.resultsEnhancements.savePerfumeForLater('${perfume.brand}-${perfume.name}', '${perfume.brand} ${perfume.name}')">
                        <i class="far fa-heart"></i> Save for Later
                    </button>

                    ${perfume.retailerLinks && perfume.retailerLinks.length > 0 ? `
                        <div class="offers-card">
                            <div class="offers-header">
                                <h3>Where to Buy</h3>
                                <p>Compare prices and choose your preferred retailer</p>
                            </div>
                            
                            <div class="offer-list">
                                ${renderAggregatedOffers(perfume.retailerLinks, perfume.brand, perfume.name, productImage)}
                            </div>
                            
                            <div class="affiliate-disclosure">
                                We may earn a commission when you purchase through our links. Your price remains the same.
                            </div>
                            
                            ${index === 0 ? `
                                <button class="compare-prices-btn" onclick="window.resultsEnhancements && window.resultsEnhancements.showComparisonModal({brand: '${perfume.brand}', name: '${perfume.name}', retailerLinks: ${JSON.stringify(perfume.retailerLinks).replace(/'/g, "\\'")}})">
                                    📊 Compare All Prices
                                </button>
                            ` : ''}
                        </div>
                    ` : amazonLink ? `
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
    
    // Add prominent Share Results CTA
    html += `
        <div class="share-results-cta">
            <div class="share-cta-content">
                <div class="share-cta-icon">
                    <i class="fas fa-share-nodes"></i>
                </div>
                <div class="share-cta-text">
                    <h3>Love Your Matches?</h3>
                    <p>Share your personalized perfume recommendations with friends!</p>
                </div>
                <button class="share-cta-button" onclick="openReferralOverlay()">
                    <span>Share My Results</span>
                    <i class="fas fa-arrow-right"></i>
                </button>
            </div>
        </div>
    `;
    
    // Add Cross-Sell Section (after first perfume only)
    if (window.resultsEnhancements && perfumes.length > 0) {
        html += window.resultsEnhancements.generateCrossSellSection(perfumes[0]);
    }
    
    // Add Testimonials Section
    if (window.resultsEnhancements) {
        html += window.resultsEnhancements.generateTestimonialsSection();
    }
    
    resultsContent.innerHTML = html;
    
    // Initialize exit intent and other enhancements
    if (window.resultsEnhancements) {
        window.resultsEnhancements.initResultsEnhancements();
    }
    
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
    
    // Show trust badges, partners sections, and side ads when returning to hero
    const trustBadges = document.querySelector('.trust-badges-section');
    const partnersSection = document.querySelector('.partners-section');
    const sideAdsPanel = document.querySelector('.side-ads-panel');
    if (trustBadges) trustBadges.style.display = 'grid';
    if (partnersSection) partnersSection.style.display = 'block';
    if (sideAdsPanel) sideAdsPanel.style.display = 'flex';
    
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
        const questionId = e.target.id.replace('answer-', '');
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
    
    // Show/hide trust badges, partners, and side ads based on section
    const trustBadges = document.querySelector('.trust-badges-section');
    const partnersSection = document.querySelector('.partners-section');
    const sideAdsPanel = document.querySelector('.side-ads-panel');
    
    if (sectionId === 'hero') {
        // Show on hero page only
        if (trustBadges) trustBadges.style.display = 'grid';
        if (partnersSection) partnersSection.style.display = 'block';
        if (sideAdsPanel) sideAdsPanel.style.display = 'flex';
    } else {
        // Hide on all other pages
        if (trustBadges) trustBadges.style.display = 'none';
        if (partnersSection) partnersSection.style.display = 'none';
        if (sideAdsPanel) sideAdsPanel.style.display = 'none';
    }
    
    // Update share button visibility
    updateShareButtonVisibility();
}

// Update share button visibility based on section
function updateShareButtonVisibility() {
    const headerShare = document.getElementById('headerShareIcon');
    if (!headerShare) return;
    
    const quizSection = document.getElementById('quiz');
    const resultsSection = document.getElementById('results');
    
    // Show in quiz and results, hide on hero/other pages
    if ((quizSection && quizSection.classList.contains('active')) || 
        (resultsSection && resultsSection.classList.contains('active'))) {
        headerShare.style.display = 'block';
    } else {
        headerShare.style.display = 'none';
    }
}

// =============================================
// SIDE ADS PANEL MANAGEMENT
// =============================================

function closeSideAd(adId) {
    const ad = document.getElementById(adId);
    if (!ad) return;
    
    // Add closing animation
    ad.classList.add('closing');
    
    // Remove from DOM after animation
    setTimeout(() => {
        ad.style.display = 'none';
        // Store in session to not show again
        sessionStorage.setItem(`ad_${adId}_closed`, 'true');
    }, 300);
}

// Check if ads should be shown based on session storage
function initializeSideAds() {
    const baccaratAd = document.getElementById('baccaratAd');
    const mensAd = document.getElementById('mensAd');
    
    // Hide ads that were previously closed
    if (sessionStorage.getItem('ad_baccaratAd_closed') === 'true' && baccaratAd) {
        baccaratAd.style.display = 'none';
    }
    if (sessionStorage.getItem('ad_mensAd_closed') === 'true' && mensAd) {
        mensAd.style.display = 'none';
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

// ============================================
// SOCIAL SHARING INTEGRATION
// ============================================

// Global share manager and content generator
let shareManager = null;
let contentGenerator = null;
let currentSharePackage = null;
let currentUserResults = null;

// Initialize share functionality
function initializeShareFunctionality() {
    shareManager = new SocialShareManager({
        baseUrl: window.location.origin,
        analytics: trackShareAnalytics
    });
    
    contentGenerator = new ShareableContentGenerator({
        baseUrl: window.location.origin,
        brandName: 'NOTA',
        logoUrl: 'images/logo/gpt-image-1.5_Modern_luxury_perfume_app_logo_design_for_NOTA_minimalist_perfume_bottle_silhoue-0.jpg'
    });
    
    // Show native share button if supported
    if (navigator.share) {
        const nativeBtn = document.getElementById('nativeShareBtn');
        if (nativeBtn) {
            nativeBtn.style.display = 'flex';
        }
    }
}

// Open share modal
async function openShareModal() {
    if (!shareManager || !contentGenerator) {
        initializeShareFunctionality();
    }
    
    if (!currentUserResults) {
        console.error('No results to share');
        return;
    }
    
    try {
        // Generate share package
        currentSharePackage = await contentGenerator.generateSharePackage(
            currentUserResults,
            'direct'
        );
        
        // Show modal
        const modal = document.getElementById('shareModal');
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // Display preview image
        const previewImg = document.getElementById('sharePreviewImage');
        if (previewImg && currentSharePackage.imageDataUrl) {
            previewImg.src = currentSharePackage.imageDataUrl;
        }
        
        // Set share text
        const shareTextInput = document.getElementById('shareText');
        if (shareTextInput) {
            shareTextInput.value = `${currentSharePackage.shareText}\n\n${currentSharePackage.shareUrl}`;
        }
        
        // Update meta tags
        updateMetaTags(currentSharePackage);
        
    } catch (error) {
        console.error('Error opening share modal:', error);
        alert('Failed to generate share content. Please try again.');
    }
}

// Close share modal
function closeShareModal() {
    const modal = document.getElementById('shareModal');
    modal.classList.remove('active');
    document.body.style.overflow = '';
}

// Share to specific platform
async function shareToSocial(platform) {
    if (!shareManager || !currentSharePackage) {
        console.error('Share manager or package not initialized');
        return;
    }
    
    try {
        let success = false;
        
        switch (platform) {
            case 'facebook':
                success = await shareManager.shareToFacebook({
                    url: currentSharePackage.shareUrl,
                    title: currentSharePackage.title,
                    description: currentSharePackage.description,
                    imageUrl: currentSharePackage.imageDataUrl
                });
                break;
                
            case 'twitter':
                // Shorten URL for Twitter character limit
                const shortUrl = await contentGenerator.shortenURL(currentSharePackage.shareUrl);
                success = await shareManager.shareToTwitter({
                    text: currentSharePackage.shareText,
                    url: shortUrl,
                    hashtags: currentSharePackage.hashtags.slice(0, 3) // Twitter limits hashtags
                });
                break;
                
            case 'whatsapp':
                success = await shareManager.shareToWhatsApp({
                    text: currentSharePackage.shareText,
                    url: currentSharePackage.shareUrl
                });
                break;
                
            case 'pinterest':
                success = await shareManager.shareToPinterest({
                    imageUrl: currentSharePackage.imageDataUrl,
                    description: currentSharePackage.description,
                    url: currentSharePackage.shareUrl
                });
                break;
                
            case 'instagram':
                success = await shareManager.shareToInstagram({
                    imageUrl: currentSharePackage.imageDataUrl,
                    caption: `${currentSharePackage.shareText}\n\n${currentSharePackage.hashtags.map(h => '#' + h).join(' ')}`
                });
                break;
                
            case 'email':
                success = await shareManager.shareViaEmail({
                    subject: currentSharePackage.title,
                    body: `${currentSharePackage.description}\n\n${currentSharePackage.shareUrl}\n\nDiscover your perfect perfume at NOTA!`
                });
                break;
                
            case 'copy':
                success = await shareManager.copyToClipboard({
                    url: currentSharePackage.shareUrl
                });
                break;
                
            case 'native':
                success = await shareManager.shareNative({
                    title: currentSharePackage.title,
                    text: currentSharePackage.shareText,
                    url: currentSharePackage.shareUrl
                });
                break;
                
            default:
                console.error('Unknown platform:', platform);
        }
        
        if (success) {
            trackShareAnalytics({
                platform: platform,
                shareType: 'quiz_results',
                timestamp: Date.now()
            });
        }
        
    } catch (error) {
        console.error('Share error:', error);
    }
}

// Copy share text
async function copyShareText() {
    const shareTextInput = document.getElementById('shareText');
    if (shareTextInput) {
        await shareManager.copyToClipboard({ text: shareTextInput.value });
    }
}

// Update meta tags dynamically for social sharing
function updateMetaTags(sharePackage) {
    // Update Open Graph tags
    updateMetaTag('og-title', 'property', 'og:title', sharePackage.title);
    updateMetaTag('og-description', 'property', 'og:description', sharePackage.description);
    updateMetaTag('og-image', 'property', 'og:image', sharePackage.imageDataUrl);
    updateMetaTag('og-url', 'property', 'og:url', sharePackage.shareUrl);
    
    // Update Twitter Card tags
    updateMetaTag('twitter-title', 'name', 'twitter:title', sharePackage.title);
    updateMetaTag('twitter-description', 'name', 'twitter:description', sharePackage.description);
    updateMetaTag('twitter-image', 'name', 'twitter:image', sharePackage.imageDataUrl);
}

function updateMetaTag(id, attributeName, attributeValue, content) {
    let tag = document.getElementById(id);
    if (!tag) {
        tag = document.querySelector(`meta[${attributeName}="${attributeValue}"]`);
    }
    if (tag) {
        tag.setAttribute('content', content);
    }
}

// Analytics tracking for share events
function trackShareAnalytics(eventData) {
    console.log('📊 Share Analytics:', eventData);
    
    // Google Analytics 4
    if (typeof gtag !== 'undefined') {
        gtag('event', 'share', {
            method: eventData.platform,
            content_type: 'perfume_quiz_results',
            item_id: currentUserResults?.topMatch?.name || 'unknown'
        });
    }
    
    // Meta Pixel
    if (typeof fbq !== 'undefined') {
        fbq('track', 'Share', {
            platform: eventData.platform,
            content_name: 'Quiz Results'
        });
    }
    
    // Custom analytics (can be replaced with your analytics service)
    if (window.dataLayer) {
        window.dataLayer.push({
            event: 'social_share',
            platform: eventData.platform,
            share_type: eventData.shareType,
            timestamp: eventData.timestamp
        });
    }
}

// Store user results for sharing (called from displayResults)
function storeUserResultsForSharing(perfumes, matchedProfile = null) {
    if (!perfumes || perfumes.length === 0) return;
    
    const topMatch = perfumes[0];
    const matchPercentage = topMatch.matchPercentage || 98;
    
    // Use matched personality profile if available
    let personality = matchedProfile ? matchedProfile.name : (topMatch.personalityType || 'Fragrance Enthusiast');
    let personalityDescription = matchedProfile ? matchedProfile.description : '';
    
    currentUserResults = {
        topMatch: {
            brand: topMatch.brand,
            name: topMatch.name
        },
        matchPercentage: matchPercentage,
        personality: personality,
        personalityDescription: personalityDescription,
        personalityProfile: matchedProfile,
        userName: answers['past_favorites'] || '', // Used to be question 30
        gender: answers['identity_gender'] // Used to be question 1
    };
    
    console.log('✅ Results stored for sharing:', currentUserResults);
}

// Close modal with Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        // Check email capture modal first
        const emailModal = document.getElementById('emailCaptureModal');
        if (emailModal && emailModal.classList.contains('active')) {
            skipEmailCapture();
            return;
        }
        
        // Check share modal
        const shareModal = document.getElementById('shareModal');
        if (shareModal && shareModal.classList.contains('active')) {
            closeShareModal();
            return;
        }
    }
});

// Share functionality will be initialized in main DOMContentLoaded

// ============================================
// SHARE APP REFERRAL SYSTEM INTEGRATION
// ============================================

let shareAppModal = null;

/**
 * Initialize Share App System
 */
async function initializeShareAppSystem() {
    // Wait for referral manager to initialize
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Initialize modal
    shareAppModal = new ShareAppModal({
        baseUrl: window.location.origin
    });
    await shareAppModal.init();
    
    // Render share buttons at all placement points
    renderShareAppButtons();
    
    console.log('✅ Share App System initialized');
}

/**
 * Render share buttons at all strategic placements
 */
function renderShareAppButtons() {
    // 1. Header Placement (Always Visible)
    const headerIcon = new ShareAppButton({
        variant: 'icon',
        placement: 'header',
        incentive: 'Share & Earn Rewards',
        containerId: 'headerShareIcon'
    });
    headerIcon.render();
    
    // 2. Welcome Screen Placement
    const welcomeButton = new ShareAppButton({
        variant: 'button',
        placement: 'welcome',
        incentive: 'Send to a friend who needs this 💌',
        containerId: 'welcomeShareButton'
    });
    welcomeButton.render();
    
    // 3. Post-Results Placement
    const resultsCard = new ShareAppButton({
        variant: 'card',
        placement: 'post-results',
        incentive: 'Share NOTA with friends and both get 15% off your first perfume!',
        containerId: 'postResultsShareCard'
    });
    resultsCard.render();
    
    // Update progress if we have referral stats
    updateShareAppProgress();
}

/**
 * Show mid-quiz share banner at question 15
 * IMPROVED: Only shows once per session, less intrusive
 */
function showMidQuizShareBanner() {
    // Check if already shown in this session
    if (sessionStorage.getItem('midQuizShareShown')) {
        return;
    }
    
    // Create banner container
    const quizContent = document.getElementById('quizContent');
    if (!quizContent) return;
    
    const bannerContainer = document.createElement('div');
    bannerContainer.id = 'midQuizShareBanner';
    
    // Insert before quiz content
    quizContent.parentNode.insertBefore(bannerContainer, quizContent);
    
    // Render banner
    const banner = new ShareAppButton({
        variant: 'banner',
        placement: 'mid-quiz',
        incentive: 'Your friend would love this too! Share NOTA →',
        containerId: 'midQuizShareBanner'
    });
    banner.render();
    
    // Mark as shown
    sessionStorage.setItem('midQuizShareShown', 'true');
    
    // IMPROVED: Auto-hide after 20 seconds (increased from 15)
    setTimeout(() => {
        const bannerEl = document.getElementById('midQuizShareBanner');
        if (bannerEl) {
            bannerEl.style.opacity = '0';
            setTimeout(() => bannerEl.remove(), 300);
        }
    }, 20000);
}

/**
 * Open share app modal
 */
function openShareAppModal(placement) {
    if (shareAppModal) {
        shareAppModal.open(placement);
    }
}

/**
 * Update share app progress
 */
async function updateShareAppProgress() {
    const manager = getReferralManager();
    if (!manager || !manager.referralCode) return;
    
    await manager.loadReferralStats();
    
    const progress = manager.getIncentiveProgress();
    
    // Find all card variants and update their progress
    const progressElements = document.querySelectorAll('.share-app-card');
    progressElements.forEach(card => {
        const progressBar = card.querySelector('.share-app-progress-fill');
        const progressText = card.querySelector('.share-app-progress-text');
        
        if (progressBar && progressText) {
            progressBar.style.width = progress.progress + '%';
            
            if (progress.remaining === 0) {
                progressText.innerHTML = `🎉 Reward unlocked! Check your email!`;
            } else {
                progressText.innerHTML = `${progress.total}/${progress.nextTier} friends shared • ${progress.remaining} more for ${progress.nextReward}!`;
            }
        }
    });
}

/**
 * Track referral signup when quiz is completed
 */
async function trackQuizCompletion() {
    const manager = getReferralManager();
    if (manager) {
        await manager.trackReferralSignup();
        console.log('✅ Quiz completion tracked for referral');
    }
}

// ============================================
// EMAIL CAPTURE INITIALIZATION
// ============================================

// Email form will be initialized in main DOMContentLoaded
