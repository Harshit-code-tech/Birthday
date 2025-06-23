document.addEventListener('DOMContentLoaded', function() {

    function getCookie(name) {

      let cookieValue = null;
      if (document.cookie && document.cookie !== '') {
          const cookies = document.cookie.split(';');
          for (let i = 0; i < cookies.length; i++) {
              const cookie = cookies[i].trim();
              if (cookie.substring(0, name.length + 1) === (name + '=')) {
                  cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                  break;
              }
          }
      }
      return cookieValue;
    }

    try {
        const activePage = document.querySelector('.page.active');
        if (activePage) {
            activePage.style.display = 'block';
            console.log('Active page set to visible:', activePage.id);
        } else {
            console.warn('No active page found');
        }
    } catch (e) {
        console.error('Error initializing greeting card:', e);
    }


  // Enhanced Configuration with more themes and quotes
  const themes = {
    'birthday': {
      password: function(name) { return name.trim().toLowerCase(); },
      quotes: [
        "May your day be as bright as your smile!",
        "Another year of awesome you!",
        "Age is merely the number of years the world has been enjoying you.",
        "Shine bright today and always!",
        "You're not getting older, you're getting better!",
        "May your birthday be filled with laughter and joy!"
      ],
      confettiColors: ['#fde68a', '#fbbf24', '#f59e0b', '#d97706']
    },
    'anniversary': {
      password: function(date) { return date; },
      quotes: [
        "Love grows stronger every year!",
        "The best is yet to come.",
        "Forever isn't long enough with you.",
        "Through all the seasons, my love for you grows.",
        "Every moment with you is a blessing.",
        "Here's to many more years of happiness together."
      ],
      confettiColors: ['#fbcfe8', '#f472b6', '#db2777', '#be185d']
    },
    'other': {
      password: function(label) { return label.trim().toLowerCase(); },
      quotes: [
        "Cherish every moment of your journey!",
        "Keep shining your light on the world!",
        "The adventure continues!",
        "You're making a difference every day.",
        "The best journeys are shared with friends like you.",
        "Celebrating this special occasion with you!"
      ],
      confettiColors: ['#a5f3fc', '#22d3ee', '#0891b2', '#0e7490']
    }
  };

  // Card Elements
  const cardContainer = document.querySelector('.card-container');
  const eventType = cardContainer?.dataset.theme || 'birthday';
  const culturalTheme = cardContainer?.dataset.culturalTheme === 'true';
  const customLabel = cardContainer?.dataset.customLabel || '';
  const cardPages = document.querySelectorAll('.card-page');
  const pageIndicators = document.querySelectorAll('.page-indicator .indicator');
  const recipientNameElements = document.querySelectorAll('.recipient-name');

  // Cache DOM elements and add error handling
  const elements = {
    passwordInput: document.querySelector('.password-input'),
    unlockButton: document.querySelector('.unlock-button'),
    passwordHint: document.querySelector('.password-hint'),
    nextButtons: document.querySelectorAll('.nav-button.next'),
    prevButtons: document.querySelectorAll('.nav-button.prev'),
    saveButton: document.querySelector('.save-button'),
    saveCardButton: document.querySelector('.save-card'),
    shareButton: document.querySelector('.share-card'),
    voiceNote: document.querySelector('.voice-note-text'),
    playVoiceNote: document.querySelector('.play-voice-note')
  };

  // Current state with improved persistence
  let currentPage = 1;
  let unlocked = false;
  const storageKey = `cardState_${window.location.pathname}`;
  let savedData = getSavedData();

  function getSavedData() {
    try {
      return JSON.parse(localStorage.getItem(storageKey)) || {
        leaves: [],
        unlocked: false,
        lastVisited: Date.now()
      };
    } catch (e) {
      console.error('Error parsing saved card data:', e);
      return { leaves: [], unlocked: false, lastVisited: Date.now() };
    }
  }

  function saveData(data = {}) {
    try {
      savedData = {...savedData, ...data, lastVisited: Date.now()};
      localStorage.setItem(storageKey, JSON.stringify(savedData));
      return true;
    } catch (e) {
      console.error('Error saving card data:', e);
      return false;
    }
  }

  // Load saved state
  if (savedData.unlocked || document.querySelector('.card-page.active')?.id !== 'page-1') {
      unlocked = true;
      goToPage(savedData.lastPage || 2); // Prefer lastPage or page 2
  }

  // Create UI elements based on theme
  if (culturalTheme) {
    createDiyas();
  }

  // Initialize all interactive components
  initializeQuotes();

  // Set random motivational quote with error handling
  function initializeQuotes() {
    try {
      const quoteElements = document.querySelectorAll('.inspiration-quote');
      const themeQuotes = themes[eventType]?.quotes || themes.birthday.quotes;

      quoteElements.forEach(quoteEl => {
        const randomQuote = themeQuotes[Math.floor(Math.random() * themeQuotes.length)];
        quoteEl.textContent = randomQuote;
      });
    } catch (e) {
      console.error('Error initializing quotes:', e);
    }
  }

  // Create floating diyas with performance optimization
  function createDiyas() {
    try {
      const diyaContainers = document.querySelectorAll('.diya-container');
      const fragment = document.createDocumentFragment();

      diyaContainers.forEach(container => {
        // Use fragment for better performance
        const containerFragment = document.createDocumentFragment();

        for (let i = 0; i < 5; i++) {
          const diya = document.createElement('div');
          diya.className = 'diya';
          diya.style.left = `${Math.random() * 80 + 10}%`;
          diya.style.top = `${Math.random() * 80 + 10}%`;
          diya.style.animationDelay = `${Math.random() * 2}s`;

          const flame = document.createElement('div');
          flame.className = 'flame';
          diya.appendChild(flame);

          containerFragment.appendChild(diya);
        }

        container.appendChild(containerFragment);
      });
    } catch (e) {
      console.error('Error creating diyas:', e);
    }
  }



  // Enhanced media display with lazy loading support
  function setupMediaDisplays() {
      try {
            console.log('Initializing media display');
            const mediaDisplays = document.querySelectorAll('.media-display');
            if (!mediaDisplays.length) {
                console.warn('No media-display elements found');
                return;
            }
            mediaDisplays.forEach(display => {
                console.log('data-media-urls:', display.dataset.mediaUrls);
                if (!display.dataset.mediaUrls && !display.dataset.fallbackUrl) {
                    console.warn('No media URLs or fallback URL');
                    return;
                }
                // Clean trailing '?' from URLs
                let mediaUrls = display.dataset.mediaUrls
                    ? display.dataset.mediaUrls.split(',').map(url => url.trim().replace(/\?$/, '')).filter(url => url)
                    : [];
                const fallbackUrl = display.dataset.fallbackUrl || 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e';
                if (!mediaUrls.length) {
                    console.log('Using fallback URL:', fallbackUrl);
                    mediaUrls = [fallbackUrl];
                }
                display.innerHTML = '';
                const fragment = document.createDocumentFragment();
                const caption = display.parentElement.querySelector('.media-caption')?.textContent || 'Event media';
                const eventName = document.querySelector('.recipient-name')?.textContent || 'event';
                mediaUrls.forEach((url, i) => {
                    try {
                        const img = document.createElement('img');
                        img.src = decodeURIComponent(url);
                        img.alt = `${caption} for ${eventName}`;
                        img.className = 'media-image';
                        img.loading = 'lazy';
                        img.style.display = i > 0 ? 'none' : 'block';
                        img.onerror = () => console.error(`Failed to load image: ${url}`);
                        img.onload = () => console.log(`Loaded image: ${url}`);
                        fragment.appendChild(img);
                    } catch (e) {
                        console.error(`Error creating image for URL ${url}:`, e);
                    }
                });
                display.appendChild(fragment);
                const images = display.querySelectorAll('.media-image');
                if (images.length > 1) {
                    setupSlideshow(display, images);
                }
            });
      } catch (e) {
            console.error('Error setting up media display:', e);
      }




  }


  function setupSlideshow(display, images) {
      try {
            console.log('Initializing slideshow with', images.length, 'images');
            let currentIndex = 0;
            const mediaContainer = display.parentElement; // Place controls in .media-container
            const controls = document.createElement('div');
            controls.className = 'slideshow-controls';

            const prevBtn = document.createElement('button');
            prevBtn.className = 'slideshow-btn prev';
            prevBtn.innerHTML = '←';
            prevBtn.setAttribute('aria-label', 'Previous image');

            const nextBtn = document.createElement('button');
            nextBtn.className = 'slideshow-btn next';
            nextBtn.innerHTML = '→';
            nextBtn.setAttribute('aria-label', 'Next image');

            const indicators = document.createElement('div');
            indicators.className = 'slideshow-indicators';

            // Create indicator dots
            for (let i = 0; i < images.length; i++) {
                const dot = document.createElement('span');
                dot.className = i === 0 ? 'indicator active' : 'indicator';
                dot.setAttribute('data-index', i);
                indicators.appendChild(dot);
            }

            function showSlide(index) {
                try {
                    currentIndex = (index + images.length) % images.length;
                    images.forEach((img, i) => {
                        img.style.display = i === currentIndex ? 'block' : 'none';
                    });
                    const dots = indicators.querySelectorAll('.indicator');
                    dots.forEach((dot, i) => {
                        dot.classList.toggle('active', i === currentIndex);
                    });
                    console.log('Showing slide:', currentIndex);
                } catch (e) {
                    console.error('Error in showSlide:', e);
                }
            }

            prevBtn.addEventListener('click', () => showSlide(currentIndex - 1));
            nextBtn.addEventListener('click', () => showSlide(currentIndex + 1));
            indicators.addEventListener('click', (e) => {
                if (e.target.classList.contains('indicator')) {
                    const index = parseInt(e.target.dataset.index);
                    showSlide(index);
                }
            });

            // Touch swipe support
            let touchStartX = 0;
            display.addEventListener('touchstart', (e) => {
                touchStartX = e.changedTouches[0].screenX;
            }, { passive: true });
            display.addEventListener('touchend', (e) => {
                const touchEndX = e.changedTouches[0].screenX;
                const diff = touchEndX - touchStartX;
                if (diff > 50) {
                    showSlide(currentIndex - 1);
                } else if (diff < -50) {
                    showSlide(currentIndex + 1);
                }
            }, { passive: true });

            // Keyboard support
            display.setAttribute('tabindex', '0');
            display.addEventListener('keydown', (e) => {
                if (e.key === 'ArrowLeft') {
                    showSlide(currentIndex - 1);
                } else if (e.key === 'ArrowRight') {
                    showSlide(currentIndex + 1);
                }
            });

            // Assemble controls
            controls.appendChild(prevBtn);
            controls.appendChild(indicators);
            controls.appendChild(nextBtn);
            mediaContainer.appendChild(controls); // Append to .media-container

            // Auto-rotation
            if (images.length > 1) {
                let slideshowInterval = setInterval(() => {
                    showSlide(currentIndex + 1);
                }, 5000);
                display.addEventListener('mouseenter', () => clearInterval(slideshowInterval));
                display.addEventListener('focus', () => clearInterval(slideshowInterval));
                display.addEventListener('mouseleave', () => {
                    slideshowInterval = setInterval(() => {
                        showSlide(currentIndex + 1);
                    }, 5000);
                });
                display.addEventListener('blur', () => {
                    slideshowInterval = setInterval(() => {
                        showSlide(currentIndex + 1);
                    }, 5000);
                });
            }
      } catch (e) {
            console.error('Error in setupSlideshow:', e);
      }

  }




  // Audio player setup
  function setupAudioPlayer(audioUrls) {
    const audioPlayer = document.querySelector('.audio-player');
    if (!audioPlayer) return;

    audioPlayer.innerHTML = '';
    const audio = document.createElement('audio');
    audio.controls = true;

    // Add sources
    audioUrls.forEach(url => {
      const source = document.createElement('source');
      source.src = url;
      audio.appendChild(source);
    });

    // Add custom controls if needed
    audioPlayer.appendChild(audio);
  }

  // Improved page navigation with accessibility
  function goToPage(pageNum) {
    if (!pageNum || pageNum < 1 || pageNum > cardPages.length) return;
    if (pageNum > 1 && !unlocked) {
      shakePasswordInput();
      return;
    }

    currentPage = pageNum;
    saveData({ lastPage: currentPage });

    // Update DOM
    cardPages.forEach((page, index) => {
      const isActive = index + 1 === currentPage;
      page.classList.toggle('active', isActive);
      page.setAttribute('aria-hidden', !isActive);
    });

    pageIndicators.forEach((indicator, index) => {
      const isActive = index + 1 === currentPage;
      indicator.textContent = isActive ? '●' : '○';
      indicator.classList.toggle('active', isActive);
      indicator.setAttribute('aria-selected', isActive);
    });

    // Initialize features for the current page
    initPage(pageNum);
  }

  // Enhanced password validation with custom label support
  function validatePassword() {
      try {
          const recipientName = recipientNameElements[0]?.textContent || '';
          const inputValue = elements.passwordInput?.value?.trim().toLowerCase() || '';
          const eventId = cardContainer.dataset.eventId || ''; // Add data-event-id to card-container in HTML
          const csrftoken = getCookie('csrftoken');

          if (!inputValue) {
              shakePasswordInput('Please enter a password');
              return false;
          }

          fetch(`/validate-password/${eventId}/`, {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
                  'X-CSRFToken': csrftoken
              },
              body: JSON.stringify({ card_password: inputValue })
          })
          .then(response => response.json())
          .then(data => {
              if (data.success) {
                  unlocked = true;
                  saveData({ unlocked: true });
                  showConfetti();
                  elements.passwordInput.classList.add('success');
                  setTimeout(() => goToPage(2), 1000);
              } else {
                  shakePasswordInput(data.error || 'Incorrect password, please try again');
              }
          })
          .catch(err => {
              console.error('Error validating password:', err);
              shakePasswordInput('An error occurred, please try again');
          });

          return true;
      } catch (e) {
          console.error('Error validating password:', e);
          return false;
      }
  }

  // Update event listener for unlock button
  if (elements.unlockButton && elements.passwordInput) {
      elements.unlockButton.addEventListener('click', (e) => {
          e.preventDefault(); // Prevent form submission
          validatePassword();
      });
      elements.passwordInput.addEventListener('keypress', function(e) {
          if (e.key === 'Enter') {
              e.preventDefault(); // Prevent form submission
              validatePassword();
          }
      });
  }


  // Improved feedback for password errors
  function shakePasswordInput(message = null) {
    if (!elements.passwordInput) return;

    elements.passwordInput.classList.add('error');
    elements.passwordInput.style.animation = 'shake 0.5s ease';

    // Show error message if provided
    if (message && elements.passwordHint) {
      const originalHint = elements.passwordHint.innerHTML;
      elements.passwordHint.innerHTML = `<span class="error-message">${message}</span>`;

      // Restore original hint after delay
      setTimeout(() => {
        elements.passwordHint.innerHTML = originalHint;
      }, 3000);
    }

    setTimeout(() => {
      elements.passwordInput.style.animation = '';
      elements.passwordInput.classList.remove('error');
    }, 500);
  }

  // Page-specific setup functions
  function setupBirthdayCountdown() {
    if (eventType !== 'birthday') return;

    const countdownElement = document.querySelector('.countdown');
    const giftReveal = document.querySelector('.gift-reveal');
    const actionButton = document.querySelector('.action-button');

    if (!countdownElement || !actionButton) return;

    actionButton.addEventListener('click', function() {
      let count = 5;
      actionButton.style.display = 'none';
      countdownElement.textContent = count;
      countdownElement.setAttribute('aria-live', 'assertive');

      const interval = setInterval(() => {
        count--;
        countdownElement.textContent = count;

        if (count < 0) {
          clearInterval(interval);
          countdownElement.style.display = 'none';
          if (giftReveal) {
            giftReveal.classList.remove('hidden');
            giftReveal.setAttribute('aria-hidden', 'false');
          }
        }
      }, 1000);
    });
  }

  // Enhanced memory tree with persistence
  function setupMemoryTree() {
    const tree = document.querySelector('.memory-tree');
    const treeInstruction = document.querySelector('.tree-instruction');
    if (!tree) return;

    // Load saved leaves
    if (savedData.leaves && Array.isArray(savedData.leaves)) {
      const fragment = document.createDocumentFragment();
      savedData.leaves.forEach(leaf => {
        const leafEl = document.createElement('div');
        leafEl.className = 'memory-leaf';
        leafEl.style.left = `${leaf.x}px`;
        leafEl.style.top = `${leaf.y}px`;
        fragment.appendChild(leafEl);
      });
      tree.appendChild(fragment);
    }

    tree.addEventListener('click', function(e) {
      const rect = tree.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const leaf = document.createElement('div');
      leaf.className = 'memory-leaf';
      leaf.style.left = `${x}px`;
      leaf.style.top = `${y}px`;
      tree.appendChild(leaf);

      // Add leaf animation
      leaf.animate([
        { transform: 'scale(0)', opacity: 0 },
        { transform: 'scale(1.2)', opacity: 0.8 },
        { transform: 'scale(1)', opacity: 1 }
      ], {
        duration: 500,
        easing: 'ease-out'
      });

      // Save the leaf position
      if (!savedData.leaves) savedData.leaves = [];
      savedData.leaves.push({ x, y });
      saveData(); // Save updated leaves

      // Update instruction if many leaves
      if (tree.querySelectorAll('.memory-leaf').length > 5 && treeInstruction) {
        treeInstruction.textContent = 'Your tree is flourishing!';
      }
    });
  }

  // Confetti animation with requestAnimationFrame for performance
  function showConfetti() {
    const colors = themes[eventType]?.confettiColors || themes.birthday.confettiColors;
    const container = document.getElementById('page-1');
    if (!container) return;

    const confettiPieces = [];
    const confettiDensity = Math.min(100, window.innerWidth / 10); // Responsive density

    // Create confetti pieces
    for (let i = 0; i < confettiDensity; i++) {
      const confetti = document.createElement('div');
      confetti.className = 'confetti-piece';
      confetti.style.left = `${Math.random() * 100}%`;
      confetti.style.top = `-20px`;
      confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
      confetti.style.width = `${Math.random() * 10 + 5}px`;
      confetti.style.height = `${Math.random() * 10 + 5}px`;
      confetti.style.transform = `rotate(${Math.random() * 360}deg)`;

      // Store animation properties
      confetti.speedY = Math.random() * 3 + 2;
      confetti.speedX = Math.random() * 2 - 1;
      confetti.rotateSpeed = Math.random() * 6 - 3;

      container.appendChild(confetti);
      confettiPieces.push({
        element: confetti,
        x: parseFloat(confetti.style.left),
        y: -20,
        speedY: confetti.speedY,
        speedX: confetti.speedX,
        rotate: Math.random() * 360,
        rotateSpeed: confetti.rotateSpeed
      });
    }

    // Animate with requestAnimationFrame
    let animationId;
    const animate = () => {
      confettiPieces.forEach((piece, i) => {
        piece.y += piece.speedY;
        piece.x += piece.speedX;
        piece.rotate += piece.rotateSpeed;

        piece.element.style.top = `${piece.y}px`;
        piece.element.style.left = `${piece.x}%`;
        piece.element.style.transform = `rotate(${piece.rotate}deg)`;

        // Remove pieces that are out of view
        if (piece.y > container.offsetHeight + 100) {
          piece.element.remove();
          confettiPieces.splice(i, 1);
        }
      });

      // Continue animation if pieces remain
      if (confettiPieces.length > 0) {
        animationId = requestAnimationFrame(animate);
      }
    };

    animationId = requestAnimationFrame(animate);

    // Cleanup after max duration
    setTimeout(() => {
      cancelAnimationFrame(animationId);
      confettiPieces.forEach(piece => piece.element.remove());
      confettiPieces.length = 0;
    }, 5000);
  }

  // Anniversary clock implementation
  function setupAnniversaryClock() {
    if (eventType !== 'anniversary') return;

    const clockContainer = document.querySelector('.anniversary-clock');
    if (!clockContainer) return;

    // Create clock face
    const clockFace = document.createElement('div');
    clockFace.className = 'clock-face';

    // Create clock hands
    const hourHand = document.createElement('div');
    hourHand.className = 'clock-hand hour';

    const minuteHand = document.createElement('div');
    minuteHand.className = 'clock-hand minute';

    const secondHand = document.createElement('div');
    secondHand.className = 'clock-hand second';

    // Add clock center
    const clockCenter = document.createElement('div');
    clockCenter.className = 'clock-center';

    // Add clock markers
    for (let i = 1; i <= 12; i++) {
      const marker = document.createElement('div');
      marker.className = 'clock-marker';
      marker.textContent = i;
      marker.style.transform = `rotate(${i * 30}deg) translateY(-40px) rotate(${-i * 30}deg)`;
      clockFace.appendChild(marker);
    }

    // Assemble clock
    clockFace.appendChild(hourHand);
    clockFace.appendChild(minuteHand);
    clockFace.appendChild(secondHand);
    clockFace.appendChild(clockCenter);
    clockContainer.appendChild(clockFace);

    // Special dates markers
    const milestoneText = document.querySelector('.milestone-text');

    // Start the clock animation
    let animationStartTime = null;
    let animationSpeed = 50; // 50x normal speed

    function animateClock(timestamp) {
      if (!animationStartTime) animationStartTime = timestamp;
      const progress = (timestamp - animationStartTime) * animationSpeed;

      // Convert progress to time (milliseconds to date)
      const date = new Date(progress);
      const seconds = date.getSeconds();
      const minutes = date.getMinutes();
      const hours = date.getHours() % 12;

      // Update clock hands
      secondHand.style.transform = `rotate(${(seconds * 6)}deg)`;
      minuteHand.style.transform = `rotate(${(minutes * 6)}deg)`;
      hourHand.style.transform = `rotate(${(hours * 30) + (minutes * 0.5)}deg)`;

      // Complete one full day
      if (progress < 86400000) { // milliseconds in a day
        requestAnimationFrame(animateClock);
      } else {
        // Show final message
        if (milestoneText) {
          milestoneText.classList.add('highlight');
          milestoneText.textContent = "Here's to many more years together! 💕";
        }
      }
    }

    // Start the animation
    requestAnimationFrame(animateClock);
  }

  // Setup anniversary dance animation
  function setupAnniversaryDance() {
    if (eventType !== 'anniversary') return;

    const danceButton = document.querySelector('.dance-button');
    const danceAnimation = document.querySelector('.dance-animation');

    if (!danceButton || !danceAnimation) return;

    danceButton.addEventListener('click', function() {
      // Add dancing couple emoji with animation
      danceAnimation.innerHTML = '';
      danceAnimation.classList.add('active');

      const dancers = document.createElement('div');
      dancers.className = 'dancers';
      dancers.textContent = '💃 🕺';

      const hearts = document.createElement('div');
      hearts.className = 'hearts';

      // Create floating hearts
      for (let i = 0; i < 15; i++) {
        const heart = document.createElement('span');
        heart.textContent = '❤️';
        heart.className = 'heart';
        heart.style.left = `${Math.random() * 80 + 10}%`;
        heart.style.animationDuration = `${Math.random() * 2 + 2}s`;
        heart.style.animationDelay = `${Math.random() * 3}s`;
        hearts.appendChild(heart);
      }

      // Add music notes
      const notes = ['🎵', '🎶', '♪', '♫', '🎼'];
      for (let i = 0; i < 10; i++) {
        const note = document.createElement('span');
        note.textContent = notes[Math.floor(Math.random() * notes.length)];
        note.className = 'music-note';
        note.style.left = `${Math.random() * 80 + 10}%`;
        note.style.animationDuration = `${Math.random() * 2 + 1}s`;
        note.style.animationDelay = `${Math.random() * 2}s`;
        hearts.appendChild(note);
      }

      danceAnimation.appendChild(dancers);
      danceAnimation.appendChild(hearts);

      // Change button text
      danceButton.textContent = 'Keep Dancing!';

      // Play dance music if Web Audio API is supported
      try {
        if (window.AudioContext || window.webkitAudioContext) {
          const AudioContext = window.AudioContext || window.webkitAudioContext;
          const audioCtx = new AudioContext();

          // Simple oscillator-based melody
          const playNote = (frequency, startTime, duration) => {
            const oscillator = audioCtx.createOscillator();
            const gainNode = audioCtx.createGain();

            oscillator.type = 'sine';
            oscillator.frequency.value = frequency;

            gainNode.gain.setValueAtTime(0.3, startTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + duration);

            oscillator.connect(gainNode);
            gainNode.connect(audioCtx.destination);

            oscillator.start(startTime);
            oscillator.stop(startTime + duration);
          };

          // Simple waltz pattern
          const now = audioCtx.currentTime;
          const waltzNotes = [
            { note: 440, time: 0, duration: 0.5 },    // A4
            { note: 493.88, time: 0.5, duration: 0.5 },  // B4
            { note: 523.25, time: 1, duration: 0.5 },  // C5
            { note: 440, time: 1.5, duration: 0.5 },  // A4
            { note: 493.88, time: 2, duration: 0.5 },  // B4
            { note: 523.25, time: 2.5, duration: 0.5 },  // C5
          ];

          waltzNotes.forEach(noteObj => {
            playNote(noteObj.note, now + noteObj.time, noteObj.duration);
          });
        }
      } catch (e) {
        console.error('Error playing music:', e);
      }
    });
  }

  // Birthday cake interaction function
  function setupBirthdayCake() {
    if (eventType !== 'birthday') return;

    const cake = document.querySelector('.birthday-cake');
    const instruction = document.querySelector('.cake-instruction');

    if (!cake) return;

    // Add candles to cake
    const candles = document.createElement('div');
    candles.className = 'candles';

    for (let i = 0; i < 5; i++) {
      const candle = document.createElement('div');
      candle.className = 'candle';

      const flame = document.createElement('div');
      flame.className = 'flame';
      candle.appendChild(flame);

      candles.appendChild(candle);
    }

    cake.appendChild(candles);

    // Add candle blowing interaction
    let isBurning = true;

    cake.addEventListener('click', function() {
      if (!isBurning) return;

      // Add blowing animation
      const blowAnimation = document.createElement('div');
      blowAnimation.className = 'blow-animation';
      cake.appendChild(blowAnimation);

      // Extinguish flames
      const flames = cake.querySelectorAll('.flame');
      flames.forEach(flame => {
        flame.classList.add('extinguished');
      });

      // Update instruction
      if (instruction) {
        instruction.textContent = 'Your wish has been made! 🌟';
      }

      isBurning = false;

      // Show confetti for the wish
      setTimeout(() => {
        showConfetti();

        // Add wish granted text
        const wishGranted = document.createElement('div');
        wishGranted.className = 'wish-granted';
        wishGranted.textContent = 'Wish Granted!';
        wishGranted.style.opacity = '0';
        cake.appendChild(wishGranted);

        // Fade in wish granted text
        setTimeout(() => {
          wishGranted.style.opacity = '1';
        }, 100);
      }, 1000);
    });
  }

  // Final animation on the last page
  function playFinalAnimation() {
    const finalAnimation = document.querySelector('.final-animation');
    if (!finalAnimation) return;

    const fragment = document.createDocumentFragment();
    let animationElements = [];

    // Different animations based on event type
    if (eventType === 'birthday') {
      // Balloons and gifts animation
      for (let i = 0; i < 10; i++) {
        const balloon = document.createElement('div');
        balloon.className = 'balloon';
        balloon.innerHTML = '🎈';
        balloon.style.left = `${Math.random() * 80 + 10}%`;
        balloon.style.animationDuration = `${Math.random() * 5 + 5}s`;
        balloon.style.animationDelay = `${Math.random() * 2}s`;
        fragment.appendChild(balloon);
        animationElements.push(balloon);
      }

      for (let i = 0; i < 5; i++) {
        const gift = document.createElement('div');
        gift.className = 'gift';
        gift.innerHTML = '🎁';
        gift.style.left = `${Math.random() * 80 + 10}%`;
        gift.style.animationDuration = `${Math.random() * 3 + 3}s`;
        gift.style.animationDelay = `${Math.random() * 2}s`;
        fragment.appendChild(gift);
        animationElements.push(gift);
      }
    } else if (eventType === 'anniversary') {
      // Rings and hearts animation
      const rings = document.createElement('div');
      rings.className = 'rings';
      rings.innerHTML = '💍 💍';
      fragment.appendChild(rings);
      animationElements.push(rings);

      for (let i = 0; i < 15; i++) {
        const heart = document.createElement('div');
        heart.className = 'heart';
        heart.innerHTML = ['❤️', '💖', '💘', '💕', '💗'][Math.floor(Math.random() * 5)];
        heart.style.left = `${Math.random() * 80 + 10}%`;
        heart.style.animationDuration = `${Math.random() * 4 + 4}s`;
        heart.style.animationDelay = `${Math.random() * 3}s`;
        fragment.appendChild(heart);
        animationElements.push(heart);
      }
    } else {
      // Stars and sparkles animation
      for (let i = 0; i < 20; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        star.innerHTML = ['✨', '🌟', '⭐', '💫', '🌠'][Math.floor(Math.random() * 5)];
        star.style.left = `${Math.random() * 80 + 10}%`;
        star.style.animationDuration = `${Math.random() * 4 + 3}s`;
        star.style.animationDelay = `${Math.random() * 2}s`;
        fragment.appendChild(star);
        animationElements.push(star);
      }
    }

    finalAnimation.appendChild(fragment);

    // Add remove logic to avoid memory leaks
    setTimeout(() => {
      animationElements.forEach(el => {
        if (el && el.parentNode) {
          el.parentNode.removeChild(el);
        }
      });
      animationElements = [];
    }, 10000);
  }

  // Add sharing functionality
  function setupSharing() {
    const shareButton = document.querySelector('.share-card');
    const shareModal = document.querySelector('#share-modal');
    const generateLinkButton = document.querySelector('#generate-share-link');
    const closeModalButton = document.querySelector('#close-share-modal');
    const sharePasswordInput = document.querySelector('#share-password');
    const shareUrlContainer = document.querySelector('#share-url-container');
    const shareUrlElement = document.querySelector('#share-url');
    const whatsappLink = document.querySelector('#whatsapp-share');
    const twitterLink = document.querySelector('#twitter-share');
    const emailLink = document.querySelector('#email-share');

    if (shareButton) {
      shareButton.addEventListener('click', () => {
        shareModal.style.display = 'flex';
        sharePasswordInput.focus();
      });
    }

    if (closeModalButton) {
      closeModalButton.addEventListener('click', () => {
        shareModal.style.display = 'none';
        sharePasswordInput.value = '';
        shareUrlContainer.style.display = 'none';
      });
    }

    if (generateLinkButton) {
      generateLinkButton.addEventListener('click', () => {
        const password = sharePasswordInput.value.trim();
        if (!password) {
          alert('Please enter a password for sharing.');
          return;
        }

        const eventId = shareButton.dataset.eventId;
        if (!eventId) {
                alert('Error: Event ID not found.');
                return;
        }

        const csrftoken = getCookie('csrftoken');
        console.log("CSRF token from cookie:", csrftoken);

        fetch(`/share/generate/${eventId}/`, {
          method: 'POST',
          headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": csrftoken
          },
          body: JSON.stringify({ password: password }),
        })
            .then(response => response.json())
            .then(data => {
              if (data.error) {
                alert(`Error: ${data.error}`);
                return;
              }
              const shareUrl = data.share_url;
              shareUrlElement.textContent = shareUrl;
              shareUrlContainer.style.display = 'block';
              if (data.warning) {
                alert(data.warning); // Show expiry warning
              }
              whatsappLink.href = `https://api.whatsapp.com/send?text=View%20my%20card:%20${encodeURIComponent(shareUrl)}`;
              twitterLink.href = `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=Check%20out%20my%20greeting%20card!`;
              emailLink.href = `mailto:?subject=Greeting%20Card&body=View%20my%20card:%20${encodeURIComponent(shareUrl)}`;

              if (navigator.share) {
                navigator.share({
                  title: 'Greeting Card',
                  text: 'Check out my greeting card!',
                  url: shareUrl
                }).catch(err => console.error('Share failed:', err));
              }
            })
            .catch(err => {
              console.error('Error generating share link:', err);
              alert('Failed to generate share link.');
            });
      });
    }
  }

  // Page initialization
   function initPage(pageNum) {
      try {
          const calmingSound = document.getElementById('calming-sound');
          const audioControl = document.querySelector('.audio-control');

          // Stop audio when leaving page 3
          if (currentPage === 3 && pageNum !== 3 && calmingSound) {
              calmingSound.pause();
              calmingSound.currentTime = 0;
              if (audioControl) audioControl.textContent = 'Play Sound';
              audioControl.classList.remove('paused');
          }

          switch (pageNum) {
              case 1:
                  if (elements.unlockButton && elements.passwordInput) {
                      elements.unlockButton.addEventListener('click', validatePassword);
                      elements.passwordInput.addEventListener('keypress', function(e) {
                          if (e.key === 'Enter') validatePassword();
                      });
                  }
                  break;
              case 2:
                  setupBirthdayCountdown();
                  setupAnniversaryClock();
                  break;
              case 3:
                  setupMediaDisplays();
                  if (calmingSound && audioControl) {
                      calmingSound.volume = 0.5; // Lower volume for subtlety
                      calmingSound.play().catch(e => console.error('Audio playback failed:', e));
                      audioControl.textContent = 'Pause Sound';
                      audioControl.classList.add('paused');
                      audioControl.addEventListener('click', () => {
                          if (calmingSound.paused) {
                              calmingSound.play();
                              audioControl.textContent = 'Pause Sound';
                              audioControl.classList.add('paused');
                          } else {
                              calmingSound.pause();
                              audioControl.textContent = 'Play Sound';
                              audioControl.classList.remove('paused');
                          }
                      });
                  }
                  break;
              case 4:
                  setupBirthdayCake();
                  setupAnniversaryDance();
                  setupMemoryTree();
                  break;
              case 5:
                  playFinalAnimation();
                  setupVoiceNotePlayer();
                  break;
          }
      } catch (e) {
          console.error(`Error initializing page ${pageNum}:`, e);
      }
  }

  // Setup voice note player
  function setupVoiceNotePlayer() {
    if (!elements.playVoiceNote || !elements.voiceNote) return;

    elements.playVoiceNote.addEventListener('click', function() {
      elements.voiceNote.hidden = !elements.voiceNote.hidden;

      if (!elements.voiceNote.hidden) {
        this.textContent = 'Hide Reflection';
        // Use SpeechSynthesis if available
        if (window.speechSynthesis) {
          const utterance = new SpeechSynthesisUtterance(elements.voiceNote.textContent);
          speechSynthesis.speak(utterance);
        }
      } else {
        this.textContent = 'Play Reflection';
        // Stop any ongoing speech
        if (window.speechSynthesis) {
          speechSynthesis.cancel();
        }
      }
    });
  }

  // Add event listeners for navigation
  if (elements.nextButtons) {
    elements.nextButtons.forEach(button => {
      button.addEventListener('click', () => goToPage(currentPage + 1));
    });
  }

  if (elements.prevButtons) {
    elements.prevButtons.forEach(button => {
      button.addEventListener('click', () => goToPage(currentPage - 1));
    });
  }

  // Page indicator navigation
  pageIndicators.forEach((indicator, index) => {
    indicator.addEventListener('click', () => {
      if (index + 1 <= currentPage + 1) {
        goToPage(index + 1);
      }
    });

    // Keyboard accessibility
    indicator.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        if (index + 1 <= currentPage + 1) {
          goToPage(index + 1);
        }
      }
    });
  });

  // Setup save functionality
  if (elements.saveButton) {
    elements.saveButton.addEventListener('click', function() {
      saveData();
      showFeedback('Memory saved successfully!');
    });
  }

  if (elements.saveCardButton) {
    elements.saveCardButton.addEventListener('click', function() {
      saveData();
      showFeedback('Card saved successfully!');
    });
  }

  // Setup sharing
  setupSharing();

  // Show feedback toast message
  function showFeedback(message) {
    const toast = document.createElement('div');
    toast.className = 'feedback-toast';
    toast.textContent = message;
    toast.setAttribute('aria-live', 'assertive');

    document.body.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '1';
      toast.style.transform = 'translateY(0)';
    }, 10);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(-20px)';
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  }

  // Initialize the first page
  if (!savedData.unlocked && !document.querySelector('.card-page.active')?.id.includes('page-2')) {
      goToPage(1);
  }
});