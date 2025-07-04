class ClickSound {
    constructor() {
        this.audioContext = null;
        this.isEnabled = true;
        this.init();
    }

    async init() {
        try {
            // Create audio context
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            
            // Add event listeners
            this.addClickListeners();
        } catch (error) {
            console.log('Audio not supported:', error);
        }
    }

    generateMechanicalClick() {
        if (!this.audioContext) return null;

        const sampleRate = this.audioContext.sampleRate;
        const duration = 0.05;
        const buffer = this.audioContext.createBuffer(1, sampleRate * duration, sampleRate);
        const data = buffer.getChannelData(0);

        for (let i = 0; i < buffer.length; i++) {
            const t = i / sampleRate;
            const envelope = Math.exp(-t * 100);
            const pop = Math.sin(2 * Math.PI * 2000 * t) * envelope * 0.6;
            const noise = (Math.random() * 2 - 1) * envelope * 0.2;
            const transient = i < 100 ? (Math.random() * 2 - 1) * 0.4 : 0;
            const signal = (pop + noise + transient) * envelope * 0.4;
            
            data[i] = signal;
        }

        return buffer;
    }

    playClick() {
        if (!this.audioContext || !this.isEnabled) return;

        try {
            // Resume audio context if suspended (required for modern browsers)
            if (this.audioContext.state === 'suspended') {
                this.audioContext.resume();
            }

            const clickBuffer = this.generateMechanicalClick();
            if (!clickBuffer) return;

            const source = this.audioContext.createBufferSource();
            const gainNode = this.audioContext.createGain();
            
            source.buffer = clickBuffer;
            gainNode.gain.value = 0.15;
            
            source.connect(gainNode);
            gainNode.connect(this.audioContext.destination);
            source.start();
        } catch (error) {
            console.log('Error playing click sound:', error);
        }
    }

    addClickListeners() {
        // Add click sound to all interactive elements
        document.addEventListener('click', (event) => {
            const target = event.target;
            
            // Check if it's a clickable element
            if (target.matches('a, button, [onclick], .clickable') || 
                target.closest('a, button, [onclick], .clickable')) {
                this.playClick();
            }
        });

        // Also add to keyboard navigation (Enter/Space)
        document.addEventListener('keydown', (event) => {
            if (event.key === 'Enter' || event.key === ' ') {
                const target = event.target;
                if (target.matches('a, button, [onclick], .clickable') || 
                    target.closest('a, button, [onclick], .clickable')) {
                    this.playClick();
                }
            }
        });
    }

    toggle() {
        this.isEnabled = !this.isEnabled;
        console.log('Click sound:', this.isEnabled ? 'enabled' : 'disabled');
        return this.isEnabled;
    }
}

// Initialize click sound when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.clickSound = new ClickSound();
});

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ClickSound;
}
