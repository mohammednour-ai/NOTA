// SPLASH SCREEN JAVASCRIPT - ADD TO script.js

// Splash Screen Functions
function initSplashScreen() {
    // Check if splash has been shown in this session
    const splashShown = sessionStorage.getItem('splashShown');
    const splashScreen = document.getElementById('splashScreen');
    
    if (!splashShown && splashScreen) {
        // Show splash screen
        splashScreen.classList.remove('hidden');
        document.body.style.overflow = 'hidden'; // Prevent scrolling
        
        // Mark as shown
        sessionStorage.setItem('splashShown', 'true');
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

// Initialize splash screen when page loads
window.addEventListener('DOMContentLoaded', () => {
    initSplashScreen();
    
    // Start auto-close timeout
    const splashScreen = document.getElementById('splashScreen');
    if (splashScreen && !splashScreen.classList.contains('hidden')) {
        startSplashTimeout();
        
        // Clear timeout on any interaction
        splashScreen.addEventListener('click', clearSplashTimeout, { once: true });
    }
});
