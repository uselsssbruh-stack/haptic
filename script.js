// Volume Knob Controller
class VolumeKnob {
    constructor() {
        this.knob = document.getElementById('knob');
        this.volumeValue = document.querySelector('.volume-value');
        this.progressPath = document.querySelector('.progress-path');
        this.muteBtn = document.getElementById('muteBtn');
        this.hapticBtn = document.getElementById('hapticBtn');
        this.hapticIndicator = document.getElementById('hapticIndicator');
        
        this.volume = 50;
        this.isDragging = false;
        this.startAngle = 0;
        this.currentRotation = 0;
        this.hapticEnabled = true;
        this.isMuted = false;
        this.lastVolume = 50;
        
        // Audio context for sound effects
        this.audioContext = null;
        
        this.init();
    }
    
    init() {
        this.updateKnob(this.volume);
        this.attachEventListeners();
        this.initAudioContext();
    }
    
    initAudioContext() {
        // Initialize Web Audio API on first user interaction
        document.addEventListener('click', () => {
            if (!this.audioContext) {
                this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            }
        }, { once: true });
    }
    
    attachEventListeners() {
        // Mouse events
        this.knob.addEventListener('mousedown', this.onDragStart.bind(this));
        document.addEventListener('mousemove', this.onDragMove.bind(this));
        document.addEventListener('mouseup', this.onDragEnd.bind(this));
        
        // Touch events
        this.knob.addEventListener('touchstart', this.onDragStart.bind(this));
        document.addEventListener('touchmove', this.onDragMove.bind(this));
        document.addEventListener('touchend', this.onDragEnd.bind(this));
        
        // Keyboard events
        document.addEventListener('keydown', this.onKeyPress.bind(this));
        
        // Button events
        this.muteBtn.addEventListener('click', this.toggleMute.bind(this));
        this.hapticBtn.addEventListener('click', this.toggleHaptic.bind(this));
        
        // Prevent context menu
        this.knob.addEventListener('contextmenu', (e) => e.preventDefault());
    }
    
    onDragStart(e) {
        this.isDragging = true;
        this.knob.style.cursor = 'grabbing';
        
        const rect = this.knob.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        const clientX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
        const clientY = e.type.includes('touch') ? e.touches[0].clientY : e.clientY;
        
        this.startAngle = Math.atan2(clientY - centerY, clientX - centerX);
        
        e.preventDefault();
    }
    
    onDragMove(e) {
        if (!this.isDragging) return;
        
        const rect = this.knob.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        const clientX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
        const clientY = e.type.includes('touch') ? e.touches[0].clientY : e.clientY;
        
        const currentAngle = Math.atan2(clientY - centerY, clientX - centerX);
        const deltaAngle = currentAngle - this.startAngle;
        
        // Convert delta angle to volume change
        const deltaVolume = (deltaAngle * 180 / Math.PI) / 2.7; // Sensitivity adjustment
        const newVolume = Math.max(0, Math.min(100, this.volume + deltaVolume));
        
        if (Math.abs(newVolume - this.volume) > 0.5) {
            this.setVolume(newVolume);
            this.startAngle = currentAngle;
        }
        
        e.preventDefault();
    }
    
    onDragEnd(e) {
        if (this.isDragging) {
            this.isDragging = false;
            this.knob.style.cursor = 'grab';
            this.playSound('release');
        }
    }
    
    onKeyPress(e) {
        switch(e.key) {
            case 'ArrowUp':
            case 'ArrowRight':
                e.preventDefault();
                this.setVolume(Math.min(100, this.volume + 5));
                this.playSound('tick');
                break;
            case 'ArrowDown':
            case 'ArrowLeft':
                e.preventDefault();
                this.setVolume(Math.max(0, this.volume - 5));
                this.playSound('tick');
                break;
            case 'm':
            case 'M':
                this.toggleMute();
                break;
        }
    }
    
    setVolume(value) {
        const oldVolume = this.volume;
        this.volume = Math.round(value);
        
        // Trigger haptic feedback on volume steps
        if (Math.floor(oldVolume / 5) !== Math.floor(this.volume / 5)) {
            this.triggerHaptic('light');
            this.playSound('tick');
        }
        
        // Special haptic at 0 and 100
        if ((oldVolume < 100 && this.volume === 100) || (oldVolume > 0 && this.volume === 0)) {
            this.triggerHaptic('medium');
            this.playSound('boundary');
        }
        
        this.updateKnob(this.volume);
        
        if (this.isMuted && this.volume > 0) {
            this.isMuted = false;
            document.body.classList.remove('muted');
        }
    }
    
    updateKnob(value) {
        // Update display
        this.volumeValue.textContent = value;
        
        // Calculate rotation (-135deg to 135deg for 0 to 100)
        const rotation = -135 + (value / 100) * 270;
        this.currentRotation = rotation;
        
        // Rotate knob
        this.knob.style.transform = `translate(-50%, -50%) rotate(${rotation}deg)`;
        
        // Update progress arc
        this.updateProgressArc(value);
    }
    
    updateProgressArc(value) {
        const startAngle = -135;
        const endAngle = -135 + (value / 100) * 270;
        const radius = 125;
        const centerX = 150;
        const centerY = 150;
        
        // Convert angles to radians
        const startRad = (startAngle - 90) * Math.PI / 180;
        const endRad = (endAngle - 90) * Math.PI / 180;
        
        // Calculate arc path
        const startX = centerX + radius * Math.cos(startRad);
        const startY = centerY + radius * Math.sin(startRad);
        const endX = centerX + radius * Math.cos(endRad);
        const endY = centerY + radius * Math.sin(endRad);
        
        const largeArcFlag = (endAngle - startAngle) > 180 ? 1 : 0;
        
        const pathData = `M ${startX} ${startY} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${endX} ${endY}`;
        this.progressPath.setAttribute('d', pathData);
    }
    
    toggleMute() {
        this.isMuted = !this.isMuted;
        
        if (this.isMuted) {
            this.lastVolume = this.volume;
            this.setVolume(0);
            this.muteBtn.classList.add('active');
            document.body.classList.add('muted');
            this.playSound('mute');
        } else {
            this.setVolume(this.lastVolume || 50);
            this.muteBtn.classList.remove('active');
            document.body.classList.remove('muted');
            this.playSound('unmute');
        }
        
        this.triggerHaptic('medium');
    }
    
    toggleHaptic() {
        this.hapticEnabled = !this.hapticEnabled;
        
        if (this.hapticEnabled) {
            this.hapticBtn.classList.add('active');
            this.hapticBtn.querySelector('.haptic-status').textContent = 'ON';
            this.hapticIndicator.innerHTML = 'Haptic Feedback: <span class="status-active">ACTIVE</span>';
            this.triggerHaptic('medium');
        } else {
            this.hapticBtn.classList.remove('active');
            this.hapticBtn.querySelector('.haptic-status').textContent = 'OFF';
            this.hapticIndicator.innerHTML = 'Haptic Feedback: <span class="status-inactive">INACTIVE</span>';
        }
        
        this.playSound('click');
    }
    
    triggerHaptic(intensity = 'light') {
        if (!this.hapticEnabled) return;
        
        // Vibration API
        if ('vibrate' in navigator) {
            const patterns = {
                light: 10,
                medium: 20,
                heavy: 30
            };
            navigator.vibrate(patterns[intensity] || 10);
        }
        
        // Visual feedback
        this.knob.classList.add('animating');
        setTimeout(() => this.knob.classList.remove('animating'), 100);
    }
    
    playSound(type) {
        if (!this.audioContext) return;
        
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        const now = this.audioContext.currentTime;
        
        switch(type) {
            case 'tick':
                oscillator.frequency.setValueAtTime(800, now);
                oscillator.frequency.exponentialRampToValueAtTime(400, now + 0.02);
                gainNode.gain.setValueAtTime(0.1, now);
                gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.02);
                oscillator.start(now);
                oscillator.stop(now + 0.02);
                break;
                
            case 'boundary':
                oscillator.frequency.setValueAtTime(1000, now);
                oscillator.frequency.exponentialRampToValueAtTime(500, now + 0.05);
                gainNode.gain.setValueAtTime(0.15, now);
                gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.05);
                oscillator.start(now);
                oscillator.stop(now + 0.05);
                break;
                
            case 'click':
                oscillator.frequency.setValueAtTime(600, now);
                gainNode.gain.setValueAtTime(0.2, now);
                gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.03);
                oscillator.start(now);
                oscillator.stop(now + 0.03);
                break;
                
            case 'mute':
                oscillator.frequency.setValueAtTime(600, now);
                oscillator.frequency.exponentialRampToValueAtTime(200, now + 0.1);
                gainNode.gain.setValueAtTime(0.15, now);
                gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
                oscillator.start(now);
                oscillator.stop(now + 0.1);
                break;
                
            case 'unmute':
                oscillator.frequency.setValueAtTime(200, now);
                oscillator.frequency.exponentialRampToValueAtTime(600, now + 0.1);
                gainNode.gain.setValueAtTime(0.15, now);
                gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
                oscillator.start(now);
                oscillator.stop(now + 0.1);
                break;
                
            case 'release':
                oscillator.frequency.setValueAtTime(400, now);
                gainNode.gain.setValueAtTime(0.08, now);
                gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.05);
                oscillator.start(now);
                oscillator.stop(now + 0.05);
                break;
        }
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new VolumeKnob();
});
