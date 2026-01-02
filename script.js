// ByteQuest Hackathon Guide - JavaScript

let isSpeaking = false;
let currentUtterance = null;

// Text-to-Speech Functions
function startSpeech() {
    if (!('speechSynthesis' in window)) {
        alert('Sorry, your browser does not support text-to-speech!');
        return;
    }

    // Get page content
    const content = document.querySelector('.content');
    if (!content) return;

    const textContent = content.innerText;

    // Create speech utterance
    currentUtterance = new SpeechSynthesisUtterance(textContent);

    // Configure for Indian English female voice
    currentUtterance.lang = 'en-IN';
    currentUtterance.rate = 0.9;
    currentUtterance.pitch = 1.2;
    currentUtterance.volume = 1.0;

    // Try to find Indian English voice
    const voices = speechSynthesis.getVoices();
    const indianVoice = voices.find(voice =>
        voice.lang.includes('en-IN')
    ) || voices.find(voice =>
        voice.lang.includes('en')
    );

    if (indianVoice) {
        currentUtterance.voice = indianVoice;
    }

    // Event handlers
    currentUtterance.onstart = function () {
        isSpeaking = true;
        const btn = document.getElementById('speakBtn');
        if (btn) {
            btn.textContent = '⏸️ Pause';
            btn.classList.add('playing');
        }
    };

    currentUtterance.onend = function () {
        isSpeaking = false;
        const btn = document.getElementById('speakBtn');
        if (btn) {
            btn.textContent = '▶️ Start Reading';
            btn.classList.remove('playing');
        }
    };

    currentUtterance.onerror = function (event) {
        console.error('Speech error:', event);
        stopSpeech();
    };

    // Start speaking
    speechSynthesis.speak(currentUtterance);
}

function stopSpeech() {
    if (speechSynthesis.speaking) {
        speechSynthesis.cancel();
    }
    isSpeaking = false;
    const btn = document.getElementById('speakBtn');
    if (btn) {
        btn.textContent = '▶️ Start Reading';
        btn.classList.remove('playing');
    }
}

function toggleSpeech() {
    if (isSpeaking) {
        stopSpeech();
    } else {
        startSpeech();
    }
}

// Load voices when available
if ('speechSynthesis' in window) {
    speechSynthesis.onvoiceschanged = function () {
        // Voices loaded
    };
}

// Stop speech when page is closed
window.addEventListener('beforeunload', function () {
    stopSpeech();
});

// Set active navigation link
document.addEventListener('DOMContentLoaded', function () {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav a');

    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPage || (currentPage === '' && href === 'index.html')) {
            link.classList.add('active');
        }
    });
});
