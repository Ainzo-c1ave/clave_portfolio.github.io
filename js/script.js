document.addEventListener('DOMContentLoaded', () => {

  /* -------------------------------------------------------
     1. THEME TOGGLE (Dark / Light Mode)
     ------------------------------------------------------- */
  const allThemeBtns = document.querySelectorAll('#themeToggleMobile, #themeToggleDesktop');

  function applyTheme(dark) {
    document.body.classList.toggle('dark-mode', dark);

    sessionStorage.setItem('lc-theme', dark ? 'dark' : 'light');

    allThemeBtns.forEach(btn => {
      const moon = btn.querySelector('.icon-moon');
      const sun  = btn.querySelector('.icon-sun');
      if (moon) moon.style.display = dark ? 'none'  : 'inline';
      if (sun)  sun.style.display  = dark ? 'inline' : 'none';
    });
  }

  const savedTheme = sessionStorage.getItem('lc-theme');
  applyTheme(savedTheme === 'dark');
  console.log('[THEME] ✓ Session initialized with:', savedTheme || 'light (default)');

  allThemeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const newDarkState = !document.body.classList.contains('dark-mode');
      applyTheme(newDarkState);
    });
  });


  /* -------------------------------------------------------
     2. CLOSE MOBILE MENU WHEN A LINK IS CLICKED
     ------------------------------------------------------- */
  const navLinks = document.querySelectorAll('.lc-nav-link');
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
    
      const navbarCollapse = document.getElementById('navbarNav');
      if (navbarCollapse && navbarCollapse.classList.contains('show')) {
        const bsCollapse = bootstrap.Collapse.getInstance(navbarCollapse);
        if (bsCollapse) bsCollapse.hide();
      }
    });
  });


  /* -------------------------------------------------------
     3. SCROLL REVEAL + SKILL BAR ANIMATION
     ------------------------------------------------------- */
  function revealOnScroll() {
    const elements = document.querySelectorAll('.reveal-on-scroll');
    const windowH  = window.innerHeight;

    elements.forEach(el => {
      const top = el.getBoundingClientRect().top;
      if (top < windowH - 130) {
        el.classList.add('active');

        // If this is the skills section, animate all progress bars inside it
        if (el.id === 'skills') {
          el.querySelectorAll('.lc-skill-card').forEach(card => {
            const pct      = card.getAttribute('data-skill-width') || '0';
            const fillBar  = card.querySelector('.lc-skill-fill');
            if (fillBar && fillBar.style.width === '') {
              // Subtle transition delay for visual fluid entry
              setTimeout(() => { fillBar.style.width = pct + '%'; }, 150);
            }
          });
        }
      }
    });
  }

  window.addEventListener('scroll', revealOnScroll, { passive: true });
  revealOnScroll(); // Run once immediately on load


  /* -------------------------------------------------------
     4. CONTACT FORM — Full-Stack Node.js Integration
     ------------------------------------------------------- */
  const form       = document.getElementById('contactForm');
  const formStatus = document.getElementById('formStatus');

  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault(); // Prevent standard page reload

      formStatus.style.display = 'block';
      formStatus.style.color   = '#2E8B57'; // Earth-toned green
      formStatus.textContent   = '⏳ Sending message... Please wait.';

      // Gather form inputs matching your specific HTML IDs
      const formData = {
        name: document.getElementById('nameInput').value,
        email: document.getElementById('emailInput').value,
        message: document.getElementById('msgInput').value
      };

      try {
        // Pointing to your active local Node.js server port
        const res = await fetch('http://localhost:5000/api/contact', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(formData)
        });

        const data = await res.json();

        if (data.success) {
          formStatus.style.color = '#2E8B57';
          formStatus.textContent = '✅ Message sent successfully! I\'ll get back to you soon.';
          form.reset(); 
        } else {
          formStatus.style.color = '#c0392b';
          formStatus.textContent = `❌ ${data.error || 'Something went wrong. Try again.'}`;
        }
      } catch (error) {
        formStatus.style.color = '#c0392b';
        formStatus.textContent = '❌ Could not connect to the mail server. Make sure your backend is running!';
      }
    });
  }


  /* -------------------------------------------------------
     5. NAVBAR EFFECTS & BACK TO TOP BUTTON
     ------------------------------------------------------- */
  const navbar = document.getElementById('navbar');
  const backTopBtn = document.querySelector('.back-top');

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;

    if (navbar) {
      navbar.style.boxShadow = scrollY > 10 ? '0 4px 20px rgba(0,0,0,0.15)' : 'none';
    }

    // Trigger Back-To-Top button after 70% depth
    if (backTopBtn) {
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const scrollDepth = maxScroll > 0 ? (scrollY / maxScroll) * 100 : 0;
      
      backTopBtn.classList.toggle('visible', scrollDepth > 70);
    }
  }, { passive: true });

  if (backTopBtn) {
    backTopBtn.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* -------------------------------------------------------
     6. SMOOTH SCROLL WITH NAVBAR OFFSET
     ------------------------------------------------------- */
  const NAV_H = 70; 
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const top = target.getBoundingClientRect().top + window.scrollY - NAV_H;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

}); // end of DOMContentLoaded