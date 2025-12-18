// Defensive simple toggle for "View More" visibility
// Added: autoplay carousel that rotates through visible testimonials automatically.
// - Pauses when user hovers over or focuses inside the wrapper (accessible).
// - When "View More" expands the list, newly visible cards are included in rotation.
// - Keeps all original functionality (View More toggle, defensive hiding).
// - Non-intrusive: only adds classes `carousel-active` and `carousel-hidden` to influence visuals.
// - Default interval: 4000ms (configurable below)

document.addEventListener('DOMContentLoaded', function () {
  console.info('Testimonials script loaded');
  const wrapper = document.getElementById('testimonials-wrapper');
  const toggleBtn = document.getElementById('testimonials-toggle');

  if (!wrapper) {
    console.error('Testimonials: wrapper with id "testimonials-wrapper" NOT found');
    return;
  }
  if (!toggleBtn) {
    console.error('Testimonials: toggle button with id "testimonials-toggle" NOT found');
    return;
  }

  const grid = wrapper.querySelector('.testimonials-grid');
  if (!grid) {
    console.error('Testimonials: .testimonials-grid not found inside wrapper');
    return;
  }

  const cards = Array.from(grid.querySelectorAll('.testimonial-card'));
  console.info(`Testimonials: found ${cards.length} cards`);

  const INITIAL_VISIBLE = 3;

  // Ensure initial state: hide extras (defensive)
  cards.forEach((card, i) => {
    card.dataset.index = i;
    if (i >= INITIAL_VISIBLE) {
      card.classList.add('testimonial-hidden');
      // Force hide inline so high-specificity CSS won't block us
      card.style.display = 'none';
      card.style.opacity = ''; // clear any opacity changes
    } else {
      card.style.display = ''; // ensure visible
    }
    // Remove any carousel classes from previous loads
    card.classList.remove('carousel-active', 'carousel-hidden');
  });

  toggleBtn.setAttribute('aria-expanded', 'false');
  toggleBtn.textContent = 'View More';

  // ---------- View More toggle (original behavior preserved) ----------
  toggleBtn.addEventListener('click', function (e) {
    e.preventDefault();
    const isExpanded = wrapper.classList.toggle('expanded');
    if (isExpanded) {
      console.info('Testimonials: expanding — showing extra cards');
      // reveal cards defensively
      cards.forEach((card, i) => {
        if (i >= INITIAL_VISIBLE) {
          card.classList.remove('testimonial-hidden');
          card.style.display = ''; // let CSS show it (or default)
          // small visual reveal
          card.style.opacity = '0';
          // animate opacity to 1
          requestAnimationFrame(() => {
            card.style.transition = 'opacity 320ms ease';
            card.style.opacity = '1';
            // cleanup transition after it's done
            setTimeout(() => {
              card.style.transition = '';
              card.style.opacity = '';
            }, 380);
          });
        }
      });
      toggleBtn.setAttribute('aria-expanded', 'true');
      toggleBtn.textContent = 'View Less';

      // When expanding, refresh carousel participants
      carouselRefreshParticipants();
    } else {
      console.info('Testimonials: collapsing — hiding extra cards');
      // hide extras defensively
      cards.forEach((card, i) => {
        if (i >= INITIAL_VISIBLE) {
          card.classList.add('testimonial-hidden');
          // immediate hide (to avoid layout flash), set display none
          card.style.display = 'none';
          card.style.opacity = '';
        }
      });
      toggleBtn.setAttribute('aria-expanded', 'false');
      toggleBtn.textContent = 'View More';
      // ensure wrapper.expanded removed
      wrapper.classList.remove('expanded');

      // When collapsing, refresh carousel participants (exclude hidden)
      carouselRefreshParticipants();
    }
  });

  // ---------- Carousel implementation ----------
  const CAROUSEL_INTERVAL = 4000; // ms, change if needed
  let carouselTimer = null;
  let isPaused = false;
  let activeIndex = 0; // index in the participants array (not absolute card index)
  let participants = []; // array of card elements currently visible (included in rotation)

  // Build participants from currently visible cards (not .testimonial-hidden)
  function carouselRefreshParticipants() {
    participants = cards.filter((c) => {
      // Consider visible if not marked hidden and computed display isn't 'none'
      const isHiddenClass = c.classList.contains('testimonial-hidden');
      const computed = window.getComputedStyle(c);
      const isDisplayed = computed.display !== 'none' && computed.visibility !== 'hidden';
      return !isHiddenClass && isDisplayed;
    });

    // reset activeIndex if out of bounds
    if (participants.length === 0) {
      activeIndex = 0;
    } else {
      activeIndex = Math.min(activeIndex, participants.length - 1);
    }

    // Apply carousel classes so styles reflect state
    updateCarouselClasses();
  }

  function updateCarouselClasses() {
    // Clear classes for all cards first
    cards.forEach((card) => {
      card.classList.remove('carousel-active', 'carousel-hidden');
    });

    if (participants.length === 0) return;

    // Mark active participant
    participants.forEach((card, idx) => {
      if (idx === activeIndex) {
        card.classList.add('carousel-active');
        card.setAttribute('aria-current', 'true');
      } else {
        card.classList.add('carousel-hidden');
        card.removeAttribute('aria-current');
      }
    });
  }

  function carouselNext() {
    if (participants.length <= 1) return;
    activeIndex = (activeIndex + 1) % participants.length;
    updateCarouselClasses();
  }

  function carouselStart() {
    if (carouselTimer) return;
    carouselTimer = setInterval(() => {
      if (!isPaused) {
        carouselNext();
      }
    }, CAROUSEL_INTERVAL);
    console.info('Testimonials: carousel started, interval', CAROUSEL_INTERVAL);
  }

  function carouselStop() {
    if (carouselTimer) {
      clearInterval(carouselTimer);
      carouselTimer = null;
      console.info('Testimonials: carousel stopped');
    }
  }

  // Pause on hover and on focus within wrapper — accessible and expected behavior
  wrapper.addEventListener('mouseenter', () => {
    isPaused = true;
  });
  wrapper.addEventListener('mouseleave', () => {
    isPaused = false;
  });
  // Pause while any child receives focus (keyboard users)
  wrapper.addEventListener('focusin', () => {
    isPaused = true;
  });
  wrapper.addEventListener('focusout', (e) => {
    // If focus moves outside wrapper, resume
    if (!wrapper.contains(e.relatedTarget)) {
      isPaused = false;
    }
  });

  // Allow clicking a card to make it active immediately (UX improvement)
  cards.forEach((card, i) => {
    card.style.cursor = 'pointer';
    card.addEventListener('click', () => {
      // Only allow activation if card is visible
      const computed = window.getComputedStyle(card);
      if (computed.display === 'none' || card.classList.contains('testimonial-hidden')) return;
      // Find index in participants
      const pIndex = participants.indexOf(card);
      if (pIndex >= 0) {
        activeIndex = pIndex;
        updateCarouselClasses();
        // when user interacts, pause briefly to avoid immediate auto-advance
        isPaused = true;
        setTimeout(() => { isPaused = false; }, 2500);
      }
    });

    // Make card focusable for keyboard users
    if (!card.hasAttribute('tabindex')) {
      card.setAttribute('tabindex', '0');
    }
  });

  // Initialize participants and start carousel
  carouselRefreshParticipants();
  carouselStart();

  // When page is hidden (tab not active), stop interval to save resources; restart on visible
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      carouselStop();
    } else {
      // refresh participants (in case layout changed) and restart
      carouselRefreshParticipants();
      carouselStart();
    }
  });

  // Optional: expose a simple debug function in window for manual testing
  window.__testimonials_debug = {
    showAll() {
      cards.forEach(c => { c.classList.remove('testimonial-hidden'); c.style.display = ''; });
      wrapper.classList.add('expanded');
      carouselRefreshParticipants();
    },
    hideExtra() {
      cards.forEach((c,i) => { if (i>=INITIAL_VISIBLE) { c.classList.add('testimonial-hidden'); c.style.display='none'; }});
      wrapper.classList.remove('expanded');
      carouselRefreshParticipants();
    },
    log() {
      console.log('cards', cards.map(c => ({ idx: c.dataset.index, hiddenClass: c.classList.contains('testimonial-hidden'), display: c.style.display || getComputedStyle(c).display, carouselActive: c.classList.contains('carousel-active') })));
      console.log('participants length', participants.length, 'activeIndex', activeIndex);
    },
    next() { carouselNext(); },
    pause() { isPaused = true; },
    resume() { isPaused = false; }
  };

  console.info('Testimonials: initialization complete. Use View More button or run __testimonials_debug.log() in console.');
});