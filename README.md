# Haptic Volume Knob

An interactive volume control knob with haptic feedback effects. A smooth, responsive UI component that simulates a physical volume knob with visual feedback and haptic vibrations for enhanced user experience.

## Overview

Haptic Volume Knob is a web-based volume control component that provides an intuitive and tactile user experience. It features smooth animations, visual feedback, and optional haptic vibrations (on supported devices) to create an immersive volume adjustment experience.

## Features

- **Interactive Knob Control**: Smooth rotation and interaction
- **Real-Time Volume Display**: Shows current volume percentage
- **Visual Feedback**: Progress arc and animated indicators
- **Haptic Feedback**: Vibration feedback on supported devices
- **Responsive Design**: Works on desktop and mobile devices
- **Touch-Enabled**: Full touch support for mobile and tablet
- **Animated Interactions**: Smooth transitions and visual effects
- **Accessibility**: Keyboard and mouse support

## Tech Stack

- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **APIs**: Vibration API (Haptics)
- **Animations**: CSS Transforms and SVG
- **Styling**: Modern CSS with flexbox

## Installation

Simply clone the repository or download the files:

```bash
git clone git@github.com:uselsssbruh-stack/haptic.git
cd haptic
```

## Usage

### Running the Application

1. Open `index.html` in a web browser
2. Interact with the volume knob by:
   - **Mouse**: Click and drag to rotate the knob
   - **Touch**: Swipe around the knob to adjust volume
   - **Keyboard**: Use arrow keys (on supported browsers)

### File Structure

```
haptic/
├── index.html       # HTML structure
├── styles.css       # Styling and animations
├── script.js        # JavaScript interactions
└── README.md        # This file
```

## How It Works

### Knob Interaction

1. **Mouse/Touch Detection**: Tracks user input around the knob area
2. **Angle Calculation**: Calculates the angle of the knob rotation
3. **Volume Update**: Maps angle to volume percentage (0-100%)
4. **Visual Feedback**: Updates the progress arc and volume display
5. **Haptic Feedback**: Triggers vibration at key volume levels

### Haptic Feedback

The component uses the [Vibration API](https://developer.mozilla.org/en-US/docs/Web/API/Vibration_API) to provide haptic feedback:

- Device vibrates when volume reaches certain thresholds
- Vibration intensity varies based on volume level
- Gracefully degrades on devices without haptic support

## Browser Support

- **Chrome**: Full support (70+)
- **Firefox**: Full support (68+)
- **Safari**: Partial support (14+)
- **Edge**: Full support (79+)
- **Mobile Browsers**: Full touch support

### Haptic Support

Haptic feedback requires:
- Mobile device with vibration motor
- Browser supporting Vibration API
- User permission for device vibration

## Customization

### Adjust Volume Range

Edit in `script.js`:
```javascript
const MIN_VOLUME = 0;
const MAX_VOLUME = 100;
```

### Modify Haptic Feedback

```javascript
// Change vibration duration (in milliseconds)
const hapticDuration = 10;

// Change vibration pattern
navigator.vibrate([100, 50, 100]); // Array of durations
```

### Style Changes

Edit `styles.css` to customize:
- Knob size and color
- Animation speed
- Progress arc appearance
- Typography and layout

## APIs Used

### Vibration API

```javascript
// Single vibration
navigator.vibrate(100); // 100ms vibration

// Vibration pattern
navigator.vibrate([100, 50, 100, 50, 100]); // Pulse pattern

// Stop vibration
navigator.vibrate(0);
```

### Touch Events

- `touchstart`: Detect touch initiation
- `touchmove`: Track touch movement
- `touchend`: Handle touch release

### Mouse Events

- `mousedown`: Detect mouse press
- `mousemove`: Track mouse movement
- `mouseup`: Handle mouse release

## Performance

- Smooth 60 FPS animations
- Optimized event listeners
- Minimal DOM manipulation
- Efficient SVG rendering

## Accessibility

- Semantic HTML structure
- Keyboard navigation support
- ARIA labels for screen readers
- Clear visual feedback
- High contrast design options

## Known Limitations

- Haptic feedback not available on all devices
- Desktop haptic feedback limited
- Some older browsers may not support features
- Touch precision depends on device

## Future Enhancements

- Multiple knob profiles (music, volume, brightness)
- Gesture recognition (swipe, pinch)
- Custom haptic patterns
- Audio visualization
- Animation presets
- Accessibility improvements
- Mobile app wrapper

## Browser Testing

Tested and working on:
- Chrome 90+ (Desktop & Mobile)
- Firefox 88+ (Desktop & Mobile)
- Safari 14+ (Desktop & Mobile)
- Edge 90+ (Desktop & Mobile)

## Contributing

Contributions are welcome! Please feel free to submit issues and pull requests.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Resources

- [MDN Vibration API](https://developer.mozilla.org/en-US/docs/Web/API/Vibration_API)
- [Touch Events Specification](https://www.w3.org/TR/touch-events/)
- [SVG Animation Guide](https://developer.mozilla.org/en-US/docs/Web/SVG/SVG_animation_with_CSS)
- [Web APIs Documentation](https://developer.mozilla.org/en-US/docs/Web/API)

## Support

For issues and questions, please open an issue on the GitHub repository.
