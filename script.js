/**
 * Jóga seberozvoje — Interactive Scripts
 * Rebuilt static website interactive logic
 */

// Global Configuration
const JSR_CONFIG = {
  // Replace with your free Web3Forms access key from https://web3forms.com
  web3formsAccessKey: "YOUR_ACCESS_KEY_HERE"
};

document.addEventListener("DOMContentLoaded", function() {

  // ==========================================================================
  // 1. HEADER SCROLL STATE & MOBILE MENU DRAWER
  // ==========================================================================
  const header = document.getElementById('jsrHeader');
  const toggle = document.getElementById('jsrMobileToggle');
  const panel = document.getElementById('jsrMobilePanel');

  if (header) {
    function handleScrollState() {
      if (window.scrollY > 24) {
        header.classList.add('is-scrolled');
      } else {
        header.classList.remove('is-scrolled');
      }
    }
    
    handleScrollState();
    window.addEventListener('scroll', handleScrollState, { passive: true });
  }

  if (toggle && panel) {
    // Drawer open/close toggle
    toggle.addEventListener('click', function() {
      const isOpen = panel.classList.toggle('is-open');
      toggle.classList.toggle('is-active', isOpen);
      toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    // Handle accordion sub-menus on mobile view
    panel.querySelectorAll('.jsr-mobile-drop-toggle').forEach(function(btn) {
      btn.addEventListener('click', function(e) {
        e.preventDefault();
        const parent = btn.closest('.jsr-mobile-drop');
        if (!parent) return;

        const isOpen = parent.classList.toggle('is-sub-open');
        btn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      });
    });

    // Close panel when clicking links (anchor scroll targets)
    panel.querySelectorAll('a').forEach(function(link) {
      link.addEventListener('click', function() {
        panel.classList.remove('is-open');
        toggle.classList.remove('is-active');
        toggle.setAttribute('aria-expanded', 'false');

        panel.querySelectorAll('.jsr-mobile-drop').forEach(function(drop) {
          drop.classList.remove('is-sub-open');
        });

        panel.querySelectorAll('.jsr-mobile-drop-toggle').forEach(function(btn) {
          btn.setAttribute('aria-expanded', 'false');
        });
      });
    });

    // Close mobile panel on backdrop document click
    document.addEventListener('click', function(e) {
      const inside = e.target.closest('#jsrHeader') || e.target.closest('#jsrMobilePanel');
      if (!inside && panel.classList.contains('is-open')) {
        panel.classList.remove('is-open');
        toggle.classList.remove('is-active');
        toggle.setAttribute('aria-expanded', 'false');

        panel.querySelectorAll('.jsr-mobile-drop').forEach(function(drop) {
          drop.classList.remove('is-sub-open');
        });
      }
    });
  }

  // ==========================================================================
  // 2. MAGNETIC HOVER BUTTONS EFFECT
  // ==========================================================================
  const magneticButtons = document.querySelectorAll('.jsr-hero-btn');

  magneticButtons.forEach(function(btn) {
    btn.addEventListener('mousemove', function(e) {
      if (window.innerWidth <= 991) return;
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      btn.style.transform = `translate(${x * 0.08}px, ${y * 0.08}px) translateY(-4px) scale(1.01)`;
    });

    btn.addEventListener('mouseleave', function() {
      btn.style.transform = '';
    });
  });

  // ==========================================================================
  // 3. INTERSECTION OBSERVER ANIMATION REVEALS
  // ==========================================================================
  const observeOptions = {
    threshold: 0.15,
    rootMargin: "0px 0px -40px 0px"
  };

  const genericObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active', 'is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, observeOptions);

  // Quote Section
  const quoteSec = document.getElementById('jsrQuoteSameContent');
  if (quoteSec) genericObserver.observe(quoteSec);

  // Method Section
  const methodSec = document.getElementById('jsrMethodSection');
  if (methodSec) genericObserver.observe(methodSec);

  // Programmes Section
  const progSec = document.getElementById('jsrProgrammesSection');
  if (progSec) genericObserver.observe(progSec);

  // Experience & Benefits Section
  const benefitsSec = document.getElementById('jsrBenefitsSection');
  if (benefitsSec) genericObserver.observe(benefitsSec);

  // Testimonials Section
  const testimonialsSec = document.getElementById('jsrTestimonialsSection');
  if (testimonialsSec) genericObserver.observe(testimonialsSec);

  // Final CTA Section
  const finalCtaSec = document.getElementById('jsrFinalctaSection');
  if (finalCtaSec) genericObserver.observe(finalCtaSec);

  // Contact Section
  const contactSec = document.getElementById('jsrContactSection');
  if (contactSec) genericObserver.observe(contactSec);

  // Footer Section
  const footerSec = document.getElementById('jsrFooterSection');
  if (footerSec) genericObserver.observe(footerSec);

  // ==========================================================================
  // 4. TESTIMONIALS SLIDER / CAROUSEL LOGIC
  // ==========================================================================
  const track = document.getElementById('jsrTmTrack');
  const slider = document.getElementById('jsrTmSlider');
  const prevBtn = document.querySelector('.jsr-tm-prev');
  const nextBtn = document.querySelector('.jsr-tm-next');
  const dotsContainer = document.getElementById('jsrTmDots');

  if (track && slider) {
    const originalCards = Array.from(track.children);
    const totalOriginal = originalCards.length;

    // Clone testimonial cards for infinite loop effect
    originalCards.forEach(function(card) {
      const clone = card.cloneNode(true);
      clone.setAttribute('aria-hidden', 'true');
      track.appendChild(clone);
    });

    const dots = dotsContainer ? dotsContainer.querySelectorAll('.jsr-tm-dot') : [];
    let current = 0;
    let autoplay = null;
    let isResetting = false;

    function getGap() {
      const style = window.getComputedStyle(track);
      return parseFloat(style.columnGap || style.gap || 0) || 0;
    }

    function getCardStep() {
      const card = track.querySelector('.jsr-tm-card');
      if (!card) return 0;
      return card.getBoundingClientRect().width + getGap();
    }

    function moveTo(index, animate) {
      if (isResetting) return;
      current = index;

      if (animate === false) {
        track.style.transition = 'none';
      } else {
        track.style.transition = 'transform .75s cubic-bezier(.22,1,.36,1)';
      }

      track.style.transform = `translate3d(-${getCardStep() * current}px, 0, 0)`;

      dots.forEach(function(dot, i) {
        dot.classList.toggle('is-active', i === (current % totalOriginal));
      });
    }

    function nextSlide() {
      moveTo(current + 1, true);

      if (current >= totalOriginal) {
        isResetting = true;
        window.setTimeout(function() {
          current = 0;
          moveTo(0, false);
          track.offsetHeight; // force repaint
          track.style.transition = 'transform .75s cubic-bezier(.22,1,.36,1)';
          isResetting = false;
        }, 780);
      }
    }

    function prevSlide() {
      if (current <= 0) {
        isResetting = true;
        current = totalOriginal;
        moveTo(current, false);
        track.offsetHeight; // force repaint
        isResetting = false;
        window.setTimeout(function() {
          moveTo(totalOriginal - 1, true);
        }, 20);
      } else {
        moveTo(current - 1, true);
      }
    }

    function startAutoplay() {
      stopAutoplay();
      autoplay = window.setInterval(nextSlide, 3500);
    }

    function stopAutoplay() {
      if (autoplay) {
        window.clearInterval(autoplay);
        autoplay = null;
      }
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', function() {
        stopAutoplay();
        nextSlide();
        startAutoplay();
      });
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', function() {
        stopAutoplay();
        prevSlide();
        startAutoplay();
      });
    }

    dots.forEach(function(dot, index) {
      dot.addEventListener('click', function() {
        stopAutoplay();
        moveTo(index, true);
        startAutoplay();
      });
    });

    slider.addEventListener('mouseenter', stopAutoplay);
    slider.addEventListener('mouseleave', startAutoplay);

    // Mobile swipe gestures
    let startX = 0;
    let currentX = 0;
    let dragging = false;

    slider.addEventListener('touchstart', function(e) {
      startX = e.touches[0].clientX;
      currentX = startX;
      dragging = true;
      stopAutoplay();
    }, { passive: true });

    slider.addEventListener('touchmove', function(e) {
      if (!dragging) return;
      currentX = e.touches[0].clientX;
    }, { passive: true });

    slider.addEventListener('touchend', function() {
      if (!dragging) return;
      const diff = currentX - startX;

      if (diff > 50) {
        prevSlide();
      } else if (diff < -50) {
        nextSlide();
      }

      dragging = false;
      startX = 0;
      currentX = 0;
      startAutoplay();
    });

    window.addEventListener('resize', function() {
      moveTo(current, false);
    });

    moveTo(0, false);
    startAutoplay();
  }

  // ==========================================================================
  // 5. BACK TO TOP BUTTON LOGIC
  // ==========================================================================
  const backToTopBtn = document.getElementById('backToTopBtn');
  if (backToTopBtn) {
    window.addEventListener('scroll', function() {
      if (window.scrollY > 800) {
        backToTopBtn.classList.add('is-visible');
      } else {
        backToTopBtn.classList.remove('is-visible');
      }
    });

    backToTopBtn.addEventListener('click', function() {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // ==========================================================================
  // 6. NEWSLETTER POP-UP ON EXIT INTENT
  // ==========================================================================
  const popup = document.getElementById('yoga-email-popup');
  const closeBtn = document.getElementById('closeYogaPopupBtn');
  const popupForm = document.getElementById('popup-newsletter-form');

  if (popup) {
    let popupShown = false;
    const pageLoadTime = Date.now();

    function showYogaPopup() {
      if (popupShown || sessionStorage.getItem('yogaPopupClosed') === 'true') return;
      popupShown = true;
      popup.style.display = 'flex';
    }

    function closeYogaPopup() {
      popup.style.display = 'none';
      sessionStorage.setItem('yogaPopupClosed', 'true');
    }

    // Exit Intent Trigger 1: Mouse leaves towards the top of the browser window (Desktop)
    document.addEventListener('mouseleave', function(e) {
      if (e.clientY <= 15 && (Date.now() - pageLoadTime) > 800) {
        showYogaPopup();
      }
    });

    // Exit Intent Trigger 2: Mouse move near top edge (Desktop backup)
    document.addEventListener('mousemove', function(e) {
      if (e.clientY <= 10 && (Date.now() - pageLoadTime) > 1000) {
        showYogaPopup();
      }
    });

    // Exit Intent Trigger 3: Fallback timeout after 8 seconds
    window.setTimeout(function() {
      if (!popupShown && (Date.now() - pageLoadTime) >= 8000) {
        showYogaPopup();
      }
    }, 8000);

    if (closeBtn) {
      closeBtn.addEventListener('click', closeYogaPopup);
    }

    if (popupForm) {
      popupForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const emailInput = popupForm.querySelector('input[type="email"]');
        const submitBtn = popupForm.querySelector('button');
        const formContainer = popupForm.closest('.yoga-popup-form-container');
        
        if (emailInput && emailInput.value) {
          const isCs = window.location.pathname.includes('/cs/');
          if (submitBtn) {
            submitBtn.innerText = isCs ? "Odesílání..." : "Sending...";
            submitBtn.disabled = true;
          }

          const payload = {
            email: emailInput.value,
            name: "Subscriber",
            lang: isCs ? "cs" : "en"
          };

          fetch('/api/subscribe', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
          })
          .then(res => res.json())
          .then(() => {
            showPopupThankYou(formContainer, isCs);
          })
          .catch(() => {
            showPopupThankYou(formContainer, isCs);
          });
        }
      });
    }

    function showPopupThankYou(container, isCs) {
      if (!container) return;
      sessionStorage.setItem('yogaPopupClosed', 'true');
      
      const title = isCs ? "🌸 Děkujeme za odběr!" : "🌸 Thank You for Subscribing!";
      const msg = isCs 
        ? "Vítejte v naší jógové komunitě! Potvrzení jsme poslali do vaší e-mailové schránky. Těšte se na dávku inspirace, novinky a praktické tipy pro tělo i mysl."
        : "Welcome to our yoga community! We've sent a confirmation to your email inbox. Stay tuned for gentle inspiration, updates, and mindfulness practices coming your way soon.";

      container.innerHTML = `
        <div class="yoga-popup-thankyou" style="padding: 20px 10px; text-align: center;">
          <h2 style="color: #2f4f3e; font-size: 26px; margin-bottom: 16px; font-family: inherit;">${title}</h2>
          <p style="color: #4a5568; font-size: 16px; line-height: 1.6; margin-bottom: 24px; font-family: inherit;">${msg}</p>
          <button onclick="document.getElementById('yoga-email-popup').style.display='none';" class="forminator-button forminator-button-submit" style="background: #2f4f3e; border: none; padding: 12px 28px; border-radius: 6px; color: #fff; cursor: pointer; font-size: 15px;">
            ${isCs ? 'Zavřít' : 'Close'}
          </button>
        </div>
      `;
    }
  }

  // ==========================================================================
  // 6B. FOOTER NEWSLETTER FORM
  // ==========================================================================
  const footerNewsletterForms = document.querySelectorAll('.jsr-footer-newsletter-form');
  footerNewsletterForms.forEach(function(fForm) {
    fForm.addEventListener('submit', function(e) {
      e.preventDefault();
      const emailInput = fForm.querySelector('input[type="email"]');
      const submitBtn = fForm.querySelector('button');
      const msgArea = fForm.querySelector('.jsr-footer-newsletter-msg');
      const isCs = window.location.pathname.includes('/cs/');

      if (emailInput && emailInput.value) {
        if (submitBtn) submitBtn.disabled = true;

        const payload = {
          email: emailInput.value,
          name: "Subscriber",
          lang: isCs ? "cs" : "en"
        };

        fetch('/api/subscribe', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        })
        .then(res => res.json())
        .then(data => {
          if (msgArea) {
            msgArea.innerText = isCs ? "Děkujeme! Jste přihlášeni k odběru." : "Thank you for subscribing!";
            msgArea.style.display = "block";
          }
          if (submitBtn) submitBtn.style.background = "#2f4f3e";
          emailInput.value = "";
        })
        .catch(() => {
          if (msgArea) {
            msgArea.innerText = isCs ? "Děkujeme! Jste přihlášeni k odběru." : "Thank you for subscribing!";
            msgArea.style.display = "block";
          }
          if (submitBtn) submitBtn.style.background = "#2f4f3e";
          emailInput.value = "";
        });
      }
    });
  });

  // ==========================================================================
  // 7. FORM SUBMISSIONS WITH VERCEL SERVERLESS ENDPOINTS
  // ==========================================================================
  
  // A: Custom Free Practice Subscription Form & Dynamic Player Reveal
  const practiceSignupForm = document.getElementById('khPracticeSignupForm');
  const heroGrid = document.getElementById('khHeroGrid');
  const playerArea = document.getElementById('khPracticePlayerArea');

  // Function to show the player area with smooth transitions
  function revealPracticePlayer() {
    if (heroGrid) {
      heroGrid.style.transition = 'opacity 0.6s ease';
      heroGrid.style.opacity = '0';
      setTimeout(() => {
        heroGrid.style.display = 'none';
        if (playerArea) {
          playerArea.style.display = 'block';
          // Trigger reflow for transition
          playerArea.offsetHeight;
          playerArea.style.opacity = '1';
          playerArea.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 600);
    } else if (playerArea) {
      playerArea.style.display = 'block';
      playerArea.style.opacity = '1';
    }
  }

  // Ensure local storage unlocked key is cleared for Double Opt-In flow
  localStorage.removeItem('yogaPracticeUnlocked');
  if (heroGrid) heroGrid.style.display = 'grid';
  if (playerArea) playerArea.style.display = 'none';

  if (practiceSignupForm) {
    practiceSignupForm.addEventListener('submit', function(e) {
      e.preventDefault();
      const submitBtn = document.getElementById('practiceSubmitBtn');
      const originalText = submitBtn ? submitBtn.innerText : "Odeslat";
      const isCs = window.location.pathname.includes('/cs/');
      
      if (submitBtn) {
        submitBtn.innerText = isCs ? "Odesílání..." : "Sending...";
        submitBtn.disabled = true;
      }

      const nameInput = document.getElementById('practice-name');
      const emailInput = document.getElementById('practice-email');

      const payload = {
        name: nameInput ? nameInput.value : "",
        email: emailInput ? emailInput.value : "",
        lang: isCs ? "cs" : "en"
      };

      function showConfirmationNotice() {
        const formWrap = practiceSignupForm.closest('.kh-forminator-wrap') || practiceSignupForm.parentElement;
        if (formWrap) {
          formWrap.innerHTML = `
            <div style="background: rgba(31,74,54,0.06); border: 1px solid rgba(31,74,54,0.15); padding: 24px; border-radius: 20px; text-align: center; margin-top: 10px;">
              <div style="font-size: 32px; margin-bottom: 12px;">📧</div>
              <h3 style="margin: 0 0 10px; color: var(--kh-green); font-family: 'Cormorant Garamond', serif; font-size: 24px;">${isCs ? 'Zkontrolujte svůj e-mail' : 'Check Your Email'}</h3>
              <p style="margin: 0 0 14px; font-size: 15px; line-height: 1.7; color: var(--kh-text);">
                ${isCs 
                  ? 'Děkujeme! Na zadanou e-mailovou adresu jsme odeslali potvrzovací e-mail. Prosím otevřete svou schránku (zkontrolujte i složku <strong>Spam nebo Hromadné</strong>) a klikněte na potvrzovací odkaz.'
                  : 'Thank you! We sent a confirmation link to your email address. Please check your inbox (including <strong>Spam or Promotions</strong> folder) and click the link to confirm.'}
              </p>
              <p style="margin: 0; font-size: 13px; color: var(--kh-text-soft);">
                ${isCs 
                  ? 'Po potvrzení e-mailu vám ihned doručíme odkaz ke stažení Antistresového průvodce a nahrávky.' 
                  : 'Upon confirmation, you will immediately receive your guide & audio recording.'}
              </p>
            </div>
          `;
        }
      }

      fetch('/api/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      })
      .then(res => res.json())
      .then(data => {
        showConfirmationNotice();
      })
      .catch(err => {
        showConfirmationNotice();
      });
    });
  }

  // B: Contact Form
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();
      const submitBtn = contactForm.querySelector('.forminator-button-submit');
      const originalText = submitBtn ? submitBtn.innerText : "Submit";
      const isCs = window.location.pathname.includes('/cs/');
      
      if (submitBtn) {
        submitBtn.innerText = isCs ? "Odesílání..." : "Sending...";
        submitBtn.disabled = true;
      }

      const nameInput = contactForm.querySelector('input[name="name"]');
      const emailInput = contactForm.querySelector('input[name="email"]');
      const phoneInput = contactForm.querySelector('input[name="phone"]');
      const messageInput = contactForm.querySelector('textarea[name="message"]');

      const payload = {
        name: nameInput ? nameInput.value : "",
        email: emailInput ? emailInput.value : "",
        phone: phoneInput ? phoneInput.value : "",
        message: messageInput ? messageInput.value : "",
        lang: isCs ? "cs" : "en"
      };

      fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          showContactSuccess(contactForm, submitBtn, originalText, isCs);
        } else {
          alert(data.message || (isCs ? "Chyba odeslání." : "Failed to send message."));
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerText = originalText;
          }
        }
      })
      .catch(err => {
        alert((isCs ? "Chyba sítě: " : "Network error: ") + err.message);
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerText = originalText;
        }
      });
    });
  }

  function showContactSuccess(form, submitBtn, originalText, isCs) {
    if (submitBtn) {
      submitBtn.innerText = isCs ? "Odesláno!" : "Sent!";
      submitBtn.style.background = "#2f4f3e";
    }
    
    const responseAlert = form.querySelector('.forminator-response-message');
    if (responseAlert) {
      responseAlert.innerText = isCs ? "Děkujeme za zprávu. Katerina se vám brzy ozve." : "Thank you for your message. Katerina will get back to you soon.";
      responseAlert.className = "forminator-response-message forminator-success";
      responseAlert.style.display = "block";
      responseAlert.setAttribute('aria-hidden', 'false');
    } else {
      alert(isCs ? "Děkujeme za zprávu. Ozveme se vám zpět." : "Thank you for your message. We will get back to you.");
    }

    form.reset();
    if (submitBtn) {
      submitBtn.disabled = false;
      window.setTimeout(function() {
        submitBtn.innerText = originalText;
        submitBtn.style.background = '';
      }, 4000);
    }
  }

  // Language Switcher Preference Handler
  const langLinks = document.querySelectorAll('.jsr-lang-switcher a, .jsr-mobile-lang a');
  langLinks.forEach(function(link) {
    link.addEventListener('click', function() {
      const text = link.textContent.trim().toUpperCase();
      if (text === 'EN') {
        localStorage.setItem('preferredLang', 'en');
      } else if (text === 'CS') {
        localStorage.setItem('preferredLang', 'cs');
      }
    });
  });

});
