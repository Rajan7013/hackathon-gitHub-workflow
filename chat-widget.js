// AI Chatbot Widget - ByteQuest Hackathon Guide
// Powered by Groq API

// ============================================
// CONFIGURATION
// ============================================

const CHATBOT_CONFIG = {
    // API key will be stored in browser localStorage
    // User will be prompted to enter it on first use
    GROQ_API_KEY: localStorage.getItem('groq_api_key') || '',
    GROQ_API_URL: 'https://api.groq.com/openai/v1/chat/completions',
    MODEL: 'llama-3.3-70b-versatile',
    MAX_TOKENS: 500,
    TEMPERATURE: 0.7
};

// ============================================
// KNOWLEDGE BASE - All Guide Content
// ============================================

const KNOWLEDGE_BASE = `
You are an AI assistant for the ByteQuest Hackathon 2026 (Jan 3-4, 2026).
You help participants understand Git workflows, team collaboration, and hackathon rules.

CRITICAL HACKATHON INFORMATION:

1. COMMIT POLICY (3-HOUR RULE):
- Teams must make at least one meaningful code commit every 3 hours
- Commits must be in the assigned repository: GFGBQ-Team-<TeamName>
- Rule says "in the Repo" - NOT "on main branch"
- Commits on feature branches COUNT even if NEVER merged to main
- Git tracks ALL commits on ALL branches
- Organizers use "git log --all" to check entire repository
- Recommended: Commit every 30 minutes for safety

2. BRANCH COMMITS QUESTION:
Q: "If I commit to my branch and don't merge to main, does it count?"
A: YES! ABSOLUTELY! Your commits count even if you NEVER merge to main because:
   - Rule says "in the Repo", not "on main branch"
   - Your feature branch IS in the repository
   - Git tracks all commits (merged or not)
   - Organizers check entire repo with "git log --all"
   - Timestamps are preserved whether merged or not

3. REPOSITORY RULES:
- Only use assigned repository
- No external collaborators allowed
- Only registered team members
- Can fork for deployment only
- All source code must stay in assigned repo

4. TIMELINE:
- Jan 3, 1:00 PM: Problem statements released
- Jan 3, 2:00 PM: Coding begins (24 hours)
- Jan 4, 2:00 PM: Final submission deadline
- Commit every 3 hours during this period

5. SUBMISSION REQUIREMENTS:
- Final commit before 2:00 PM Jan 4
- 2-minute demo video (mandatory)
- PPT in PDF format
- README with: Problem statement, team name, deployed link, video link, PPT link

6. GIT WORKFLOW:
- Leader forks repository
- Members clone from leader's fork
- Work on feature branches (not main)
- Commit every 30 minutes
- Create PR when ready
- Leader reviews and merges

7. SAFE PULL PROCESS:
- Always commit or stash before pulling
- git stash save "message" for uncommitted work
- git pull origin main
- git stash pop to restore work
- Resolve conflicts if any

8. TEAM COLLABORATION:
- Leader: Fork repo, add members, review PRs
- Members: Clone, create branch, commit, push, create PR
- Communication via Discord
- All announcements on Discord only

ANSWER GUIDELINES:
- Be concise and helpful
- Handle typos and grammar mistakes gracefully
- Use emojis for readability
- Provide examples when relevant
- Reference specific guide sections
- If unsure, suggest checking the guides
`;

// ============================================
// CHAT WIDGET INITIALIZATION
// ============================================

class ChatWidget {
    constructor() {
        this.messages = [];
        this.isOpen = false;
        this.isTyping = false;
        this.checkApiKey();
        this.init();
    }

    checkApiKey() {
        // Check if API key is already stored
        if (!CHATBOT_CONFIG.GROQ_API_KEY) {
            // Prompt user to enter API key on first use
            setTimeout(() => {
                const key = prompt(
                    '🤖 ByteQuest AI Chatbot Setup\n\n' +
                    'Please enter your Groq API key to enable the chatbot.\n\n' +
                    'Get your free API key from: https://console.groq.com\n\n' +
                    'The key will be saved in your browser and only sent to Groq API.'
                );

                if (key && key.trim()) {
                    localStorage.setItem('groq_api_key', key.trim());
                    CHATBOT_CONFIG.GROQ_API_KEY = key.trim();
                    alert('✅ API key saved! You can now use the chatbot.');
                    location.reload();
                }
            }, 2000);
        }
    }

    init() {
        this.createWidget();
        this.attachEventListeners();
        this.showWelcomeMessage();
    }

    createWidget() {
        const widgetHTML = `
            <div class="chat-widget">
                <button class="chat-button" id="chatButton">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                        <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z"/>
                        <path d="M7 9h2v2H7zm4 0h2v2h-2zm4 0h2v2h-2z"/>
                    </svg>
                    <span class="chat-badge" id="chatBadge" style="display: none;">1</span>
                </button>

                <div class="chat-window" id="chatWindow">
                    <div class="chat-header">
                        <div>
                            <h3>🤖 ByteQuest AI Helper</h3>
                            <p>Ask me anything about the hackathon!</p>
                        </div>
                        <button class="chat-close" id="chatClose">✕</button>
                    </div>

                    <div class="chat-messages" id="chatMessages">
                        <!-- Messages will be added here -->
                    </div>

                    <div class="chat-suggestions" id="chatSuggestions">
                        <div class="suggestion-chip" data-question="Do branch commits count?">Do branch commits count?</div>
                        <div class="suggestion-chip" data-question="How to commit every 30 minutes?">How to commit?</div>
                        <div class="suggestion-chip" data-question="What is the 3-hour rule?">3-hour rule?</div>
                    </div>

                    <div class="chat-input-container">
                        <input 
                            type="text" 
                            class="chat-input" 
                            id="chatInput" 
                            placeholder="Ask a question..."
                            autocomplete="off"
                        />
                        <button class="chat-send" id="chatSend">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', widgetHTML);
    }

    attachEventListeners() {
        const chatButton = document.getElementById('chatButton');
        const chatClose = document.getElementById('chatClose');
        const chatSend = document.getElementById('chatSend');
        const chatInput = document.getElementById('chatInput');
        const suggestions = document.querySelectorAll('.suggestion-chip');

        chatButton.addEventListener('click', () => this.toggleChat());
        chatClose.addEventListener('click', () => this.toggleChat());
        chatSend.addEventListener('click', () => this.sendMessage());
        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.sendMessage();
        });

        suggestions.forEach(chip => {
            chip.addEventListener('click', () => {
                const question = chip.getAttribute('data-question');
                chatInput.value = question;
                this.sendMessage();
            });
        });
    }

    toggleChat() {
        this.isOpen = !this.isOpen;
        const chatWindow = document.getElementById('chatWindow');
        const chatBadge = document.getElementById('chatBadge');

        if (this.isOpen) {
            chatWindow.classList.add('open');
            chatBadge.style.display = 'none';
        } else {
            chatWindow.classList.remove('open');
        }
    }

    showWelcomeMessage() {
        setTimeout(() => {
            this.addMessage('bot', 'Hi! 👋 I\'m your ByteQuest AI assistant. Ask me anything about the hackathon rules, Git workflow, or team collaboration!');
            const chatBadge = document.getElementById('chatBadge');
            if (!this.isOpen) {
                chatBadge.style.display = 'flex';
            }
        }, 2000);
    }

    async sendMessage() {
        const input = document.getElementById('chatInput');
        const message = input.value.trim();

        if (!message) return;

        // Add user message
        this.addMessage('user', message);
        input.value = '';

        // Show typing indicator
        this.showTyping();

        // Get AI response
        try {
            const response = await this.getAIResponse(message);
            this.hideTyping();
            this.addMessage('bot', response);
        } catch (error) {
            this.hideTyping();
            this.addMessage('bot', '❌ Sorry, I encountered an error. Please make sure the Groq API key is configured correctly.');
            console.error('Chat error:', error);
        }
    }

    async getAIResponse(userMessage) {
        // Check if API key is configured
        if (!CHATBOT_CONFIG.GROQ_API_KEY) {
            return '⚠️ API key not configured!\n\nPlease refresh the page and enter your Groq API key when prompted.\n\nGet your free key from: https://console.groq.com';
        }

        const response = await fetch(CHATBOT_CONFIG.GROQ_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${CHATBOT_CONFIG.GROQ_API_KEY}`
            },
            body: JSON.stringify({
                model: CHATBOT_CONFIG.MODEL,
                messages: [
                    {
                        role: 'system',
                        content: KNOWLEDGE_BASE
                    },
                    {
                        role: 'user',
                        content: userMessage
                    }
                ],
                max_tokens: CHATBOT_CONFIG.MAX_TOKENS,
                temperature: CHATBOT_CONFIG.TEMPERATURE
            })
        });

        if (!response.ok) {
            throw new Error(`API error: ${response.status}`);
        }

        const data = await response.json();
        return data.choices[0].message.content;
    }

    addMessage(type, text) {
        const messagesContainer = document.getElementById('chatMessages');
        const time = new Date().toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit'
        });

        const messageId = 'msg-' + Date.now();
        const speakerBtn = type === 'bot' ?
            `<button class="message-speaker-btn" onclick="chatWidget.speakMessage('${messageId}')" title="Read aloud">🔊</button>` : '';

        const messageHTML = `
            <div class="chat-message ${type}">
                <div class="message-bubble" id="${messageId}" data-text="${this.escapeHtml(text)}">
                    ${speakerBtn}
                    ${this.formatMessage(text)}
                </div>
                <div class="message-time">${time}</div>
            </div>
        `;

        messagesContainer.insertAdjacentHTML('beforeend', messageHTML);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    escapeHtml(text) {
        return text.replace(/"/g, '&quot;').replace(/'/g, '&#39;');
    }

    speakMessage(messageId) {
        const messageElement = document.getElementById(messageId);
        if (!messageElement) return;

        const text = messageElement.getAttribute('data-text');
        const speakerBtn = messageElement.querySelector('.message-speaker-btn');

        // Stop any ongoing speech
        if (window.speechSynthesis.speaking) {
            window.speechSynthesis.cancel();
            document.querySelectorAll('.message-speaker-btn').forEach(btn => {
                btn.classList.remove('speaking');
            });

            // If clicking the same button, just stop
            if (speakerBtn && speakerBtn.classList.contains('speaking')) {
                return;
            }
        }

        // Start new speech
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'en-US';
        utterance.rate = 1.0;
        utterance.pitch = 1.0;
        utterance.volume = 1.0;

        // Try to find a good voice
        const voices = speechSynthesis.getVoices();
        const preferredVoice = voices.find(voice =>
            voice.lang.includes('en') && voice.name.toLowerCase().includes('female')
        ) || voices.find(voice => voice.lang.includes('en'));

        if (preferredVoice) {
            utterance.voice = preferredVoice;
        }

        utterance.onstart = () => {
            if (speakerBtn) {
                speakerBtn.classList.add('speaking');
            }
        };

        utterance.onend = () => {
            if (speakerBtn) {
                speakerBtn.classList.remove('speaking');
            }
        };

        utterance.onerror = () => {
            if (speakerBtn) {
                speakerBtn.classList.remove('speaking');
            }
        };

        speechSynthesis.speak(utterance);
    }

    formatMessage(text) {
        // Convert markdown-style formatting to HTML
        let formatted = text;

        // Convert headings
        formatted = formatted.replace(/^### (.*$)/gim, '<h4>$1</h4>');
        formatted = formatted.replace(/^## (.*$)/gim, '<h3>$1</h3>');
        formatted = formatted.replace(/^# (.*$)/gim, '<h2>$1</h2>');

        // Convert bold text
        formatted = formatted.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

        // Convert italic text
        formatted = formatted.replace(/\*(.*?)\*/g, '<em>$1</em>');

        // Convert inline code
        formatted = formatted.replace(/`(.*?)`/g, '<code>$1</code>');

        // Convert line breaks
        formatted = formatted.replace(/\n\n/g, '<br><br>');
        formatted = formatted.replace(/\n/g, '<br>');

        // Convert unordered lists (bullets)
        formatted = formatted.replace(/^- (.*$)/gim, '<li>$1</li>');
        formatted = formatted.replace(/^• (.*$)/gim, '<li>$1</li>');
        formatted = formatted.replace(/^✅ (.*$)/gim, '<li>✅ $1</li>');
        formatted = formatted.replace(/^❌ (.*$)/gim, '<li>❌ $1</li>');

        // Wrap consecutive <li> tags in <ul>
        formatted = formatted.replace(/(<li>.*?<\/li>(?:<br>)?)+/gs, function (match) {
            return '<ul>' + match.replace(/<br>/g, '') + '</ul>';
        });

        // Convert numbered lists
        formatted = formatted.replace(/^\d+\.\s+(.*$)/gim, '<li>$1</li>');

        // Wrap numbered lists in <ol>
        formatted = formatted.replace(/(<li>\d+\..*?<\/li>(?:<br>)?)+/gs, function (match) {
            return '<ol>' + match.replace(/<br>/g, '') + '</ol>';
        });

        return formatted;
    }

    showTyping() {
        const messagesContainer = document.getElementById('chatMessages');
        const typingHTML = `
            <div class="chat-message bot typing-indicator active" id="typingIndicator">
                <div class="typing-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </div>
        `;
        messagesContainer.insertAdjacentHTML('beforeend', typingHTML);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    hideTyping() {
        const typingIndicator = document.getElementById('typingIndicator');
        if (typingIndicator) {
            typingIndicator.remove();
        }
    }
}

// Initialize chatbot when page loads
let chatWidget;
document.addEventListener('DOMContentLoaded', () => {
    chatWidget = new ChatWidget();
});
