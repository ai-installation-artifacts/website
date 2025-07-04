// Click sound functionality using HTML5 Audio
class ClickSound {
    constructor() {
        this.htmlAudio = null;
        this.isEnabled = true;
        this.init();
    }

    async init() {
        try {
            console.log('Initializing ClickSound...');
            
            // Load HTML5 Audio
            this.htmlAudio = new Audio('/assets/sounds/click.wav');
            this.htmlAudio.preload = 'auto';
            this.htmlAudio.volume = 0.5;
            
            // Handle audio events
            this.htmlAudio.addEventListener('canplaythrough', () => {
                console.log('Click sound loaded successfully');
            });
            
            this.htmlAudio.addEventListener('error', (e) => {
                console.log('Error loading click sound:', e);
                this.htmlAudio = null;
            });
            
            // Add event listeners
            this.addClickListeners();
            
            console.log('ClickSound initialization complete!');
        } catch (error) {
            console.log('Audio not supported:', error);
        }
    }

    playClick() {
        console.log('playClick called - isEnabled:', this.isEnabled, 'htmlAudio:', !!this.htmlAudio);
        
        if (!this.isEnabled || !this.htmlAudio) {
            console.log('Conditions not met - isEnabled:', this.isEnabled, 'htmlAudio:', !!this.htmlAudio);
            return;
        }

        try {
            // Reset audio to beginning and play
            this.htmlAudio.currentTime = 0;
            this.htmlAudio.play().then(() => {
                console.log('Sound played successfully!');
            }).catch((error) => {
                console.log('Error playing sound:', error);
            });
        } catch (error) {
            console.log('Error playing click sound:', error);
        }
    }

    addClickListeners() {
        // Add click sound to all interactive elements
        document.addEventListener('click', (event) => {
            const target = event.target;
            
            console.log('Click detected on:', target.tagName, target);
            
            // Check if it's a clickable element
            if (target.matches('a, button, [onclick], .clickable') || 
                target.closest('a, button, [onclick], .clickable')) {
                console.log('Playing click sound...');
                this.playClick();
            } else {
                console.log('Not a clickable element');
            }
        });

        // Also add to keyboard navigation (Enter/Space)
        document.addEventListener('keydown', (event) => {
            if (event.key === 'Enter' || event.key === ' ') {
                const target = event.target;
                if (target.matches('a, button, [onclick], .clickable') || 
                    target.closest('a, button, [onclick], .clickable')) {
                    console.log('Playing click sound from keyboard...');
                    this.playClick();
                }
            }
        });
    }
}

// Initialize click sound when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.clickSound = new ClickSound();
    
    // Add a test button for debugging
    const testButton = document.createElement('button');
    testButton.textContent = 'Test Click Sound';
    testButton.style.position = 'fixed';
    testButton.style.top = '10px';
    testButton.style.right = '10px';
    testButton.style.zIndex = '1000';
    testButton.style.backgroundColor = 'red';
    testButton.style.color = 'white';
    testButton.style.padding = '10px';
    testButton.style.border = 'none';
    testButton.style.borderRadius = '5px';
    testButton.onclick = () => {
        console.log('Test button clicked!');
        if (window.clickSound) {
            window.clickSound.playClick();
        }
    };
    document.body.appendChild(testButton);
});
