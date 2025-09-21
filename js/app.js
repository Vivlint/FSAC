// Smooth page navigation system
function initSmoothNavigation() {
  // Handle all navigation links
  document.querySelectorAll('.nav-link, .nav-link-bottom, .brand').forEach(link => {
    // Skip external links and anchors
    if (link.getAttribute('href')?.startsWith('#') || link.getAttribute('href')?.startsWith('http')) {
      return;
    }
    
    link.addEventListener('click', function(e) {
      e.preventDefault();
      const targetUrl = this.getAttribute('href');
      
      if (!targetUrl || targetUrl === window.location.pathname.split('/').pop()) {
        return; // Don't navigate to same page
      }
      
      // Add loading state
      document.body.classList.add('page-loading');
      link.classList.add('loading');
      
      // Create invisible iframe to preload the page
      const iframe = document.createElement('iframe');
      iframe.style.display = 'none';
      iframe.onload = function() {
        // Wait a bit for smooth transition
        setTimeout(() => {
          window.location.href = targetUrl;
        }, 600);
      };
      iframe.onerror = function() {
        // Fallback: navigate immediately if preload fails
        window.location.href = targetUrl;
      };
      
      document.body.appendChild(iframe);
      iframe.src = targetUrl;
      
      // Fallback timeout
      setTimeout(() => {
        window.location.href = targetUrl;
      }, 2000);
    });
  });
}

// Sticky header progressive shrink on scroll
(function(){
  const header = document.querySelector('.top-panel');
  const brand = document.querySelector('.brand');
  if(!header) return;

  // Ensure nav-controls are outside the sliding nav on mobile
  try {
    const navActions = header.querySelector('.nav-actions');
    const topLevelControls = Array.from(header.children).find(el => el.classList && el.classList.contains('nav-controls'));
    const nestedControls = navActions ? navActions.querySelector('.nav-controls') : null;

    // If controls exist only inside nav-actions, move them before the mobile toggle
    if (!topLevelControls && nestedControls) {
      const mobileToggle = document.getElementById('mobileMenuToggle');
      if (mobileToggle) {
        header.insertBefore(nestedControls, mobileToggle);
      } else {
        header.insertBefore(nestedControls, navActions);
      }
    }

    // If both exist (duplicate), remove the nested one so it doesn't show in open menu
    const nowTopLevel = Array.from(header.children).find(el => el.classList && el.classList.contains('nav-controls'));
    const stillNested = navActions ? navActions.querySelector('.nav-controls') : null;
    if (nowTopLevel && stillNested) {
      stillNested.remove();
    }
    
    // Add mobile menu close button if it doesn't exist
    if (navActions && !navActions.querySelector('.mobile-menu-close')) {
      const closeBtn = document.createElement('button');
      closeBtn.className = 'mobile-menu-close';
      closeBtn.id = 'mobileMenuClose';
      closeBtn.setAttribute('aria-label', 'Menüyü kapat');
      closeBtn.innerHTML = '<i class="fa-solid fa-xmark"></i>';
      navActions.insertBefore(closeBtn, navActions.firstChild);
    }
  } catch (e) {
    // Fail gracefully if structure differs
    console.warn('Nav controls normalization skipped:', e);
  }

  // Shrink only the panel padding over 100px of scroll
  let SCROLL_RANGE = 100; // üst limit 100px

  function clamp(n, a, b){ return Math.min(b, Math.max(a, n)); }

  function onScroll(){
    const y = window.scrollY || window.pageYOffset || 0;
    const t = clamp(y / SCROLL_RANGE, 0, 1);
    
    // Responsive padding values
    const vw = window.innerWidth;
    const baseLeftPadding = Math.max(16, Math.min(32, vw * 0.03)); // 3vw clamped
    const baseTopPadding = Math.max(8, Math.min(12, vw * 0.015)); // 1.5vh equivalent
    const baseRightPadding = Math.max(12, Math.min(16, vw * 0.02)); // 2vw clamped
    
    // Interpolate padding values
    const padTop = baseTopPadding - (baseTopPadding * 0.3 * t); // Reduce by 30% on scroll
    const padBottom = baseTopPadding - (baseTopPadding * 0.3 * t);
    const padLeft = baseLeftPadding - (baseLeftPadding * 0.2 * t); // Reduce by 20% on scroll
    const padRight = baseRightPadding - (baseRightPadding * 0.2 * t);
    
    header.style.padding = `${padTop}px ${padRight}px ${padBottom}px ${padLeft}px`;

    // Optional subtle shadow as you scroll
    const shadowAlpha = 0.35 * t;
    header.style.boxShadow = `0 6px 16px -8px rgba(0,0,0,${shadowAlpha.toFixed(3)})`;
  }

  if(brand){ brand.style.flex = '0 0 auto'; }

  window.addEventListener('scroll', onScroll, {passive:true});
  // no resize listener needed; range is constant
  onScroll();

  // Active link highlight based on current pathname
  const path = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-actions .nav-link').forEach(a => {
    const href = a.getAttribute('href');
    if(href && href === path){
      a.classList.add('active');
    }
  });

  // Theme toggle functionality using global settings
  const themeToggle = document.getElementById('themeToggle');
  
  if(themeToggle) {
    themeToggle.addEventListener('click', () => {
      const newTheme = FoundrySettings.theme === 'dark' ? 'light' : 'dark';
      
      // Add rotation animation
      themeToggle.classList.add('rotating');
      setTimeout(() => themeToggle.classList.remove('rotating'), 500);
      
      // Change theme globally
      FoundrySettings.setTheme(newTheme);
      
      // Update icon after animation
      setTimeout(() => {
        FoundrySettings.updateUI();
      }, 250);
    });
  }

  // Language selector functionality using global settings
  const langToggle = document.getElementById('langToggle');
  const langMenu = document.getElementById('langMenu');
  const langSelector = langToggle?.parentElement;
  
  if(langToggle && langMenu && langSelector) {
    langToggle.addEventListener('click', (e) => {
      e.preventDefault();
      langSelector.classList.toggle('open');
      langToggle.setAttribute('aria-expanded', 
        langSelector.classList.contains('open') ? 'true' : 'false'
      );
    });
    
    // Language option selection
    langMenu.addEventListener('click', (e) => {
      if(e.target.classList.contains('lang-option')) {
        e.preventDefault();
        const selectedLang = e.target.getAttribute('data-lang');
        if(selectedLang) {
          langSelector.classList.remove('open');
          langToggle.setAttribute('aria-expanded', 'false');
          
          // Set language globally
          FoundrySettings.setLanguage(selectedLang);
          FoundrySettings.updateUI();
        }
      }
    });
    
    // Close on outside click
    document.addEventListener('click', (e) => {
      if(!langSelector.contains(e.target)) {
        langSelector.classList.remove('open');
        langToggle.setAttribute('aria-expanded', 'false');
      }
    });
    
    // Close on Escape
    document.addEventListener('keydown', (e) => {
      if(e.key === 'Escape' && langSelector.classList.contains('open')) {
        langSelector.classList.remove('open');
        langToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // Navigation now uses standard anchors with target _blank; no JS needed

  // Dropdown toggle for Teams
  const dropdown = document.querySelector('.dropdown');
  const toggle = dropdown?.querySelector('.dropdown-toggle');
  const menu = dropdown?.querySelector('.dropdown-menu');
  if(toggle && menu){
    function close(){
      dropdown.classList.remove('open');
      toggle.setAttribute('aria-expanded','false');
      toggle.querySelector('i')?.classList.replace('fa-chevron-up','fa-chevron-down');
    }
    function open(){
      dropdown.classList.add('open');
      toggle.setAttribute('aria-expanded','true');
      toggle.querySelector('i')?.classList.replace('fa-chevron-down','fa-chevron-up');
    }
    toggle.addEventListener('click', (e)=>{
      e.preventDefault();
      dropdown.classList.contains('open') ? close() : open();
    });
    document.addEventListener('click', (e)=>{
      if(!dropdown.contains(e.target)) close();
    });
    document.addEventListener('keydown', (e)=>{
      if(e.key === 'Escape') close();
    });

    // Add smooth navigation to dropdown items
    menu.querySelectorAll('.dropdown-item').forEach(item => {
      item.addEventListener('click', function(e) {
        e.preventDefault();
        const targetUrl = this.getAttribute('href');
        
        if (!targetUrl || targetUrl === window.location.pathname.split('/').pop()) {
          return;
        }
        
        // Close dropdown first
        close();
        
        // Add loading state
        document.body.classList.add('page-loading');
        item.classList.add('loading');
        
        // Navigate after smooth transition
        setTimeout(() => {
          window.location.href = targetUrl;
        }, 600);
      });
    });
  }

  // Ensure Teams dropdown has 5 items (ekip1..ekip5) consistently on all pages
  try {
    const teamsMenu = document.getElementById('teams-menu');
    if (teamsMenu) {
      const existing = new Set(Array.from(teamsMenu.querySelectorAll('.dropdown-item')).map(a => a.getAttribute('href')));
      for (let i = 1; i <= 5; i++) {
        const href = `ekip${i}.html`;
        if (!existing.has(href)) {
          const a = document.createElement('a');
          a.className = 'dropdown-item';
          a.setAttribute('role', 'menuitem');
          a.setAttribute('tabindex', '-1');
          a.href = href;
          a.textContent = `Lorem ipsum ${i}`;
          teamsMenu.appendChild(a);
        }
      }
    }
  } catch (e) {
    console.warn('Teams dropdown normalization skipped:', e);
  }

  // Initialize smooth navigation
  initSmoothNavigation();

  // Mobile menu toggle with inline header animation
  const mobileMenuToggle = document.getElementById('mobileMenuToggle');
  let mobileMenuClose = document.getElementById('mobileMenuClose');
  const navActions = document.querySelector('.nav-actions');
  const body = document.body;
  
  // Create close button if it doesn't exist
  if (navActions && !mobileMenuClose) {
    mobileMenuClose = document.createElement('button');
    mobileMenuClose.className = 'mobile-menu-close';
    mobileMenuClose.id = 'mobileMenuClose';
    mobileMenuClose.setAttribute('aria-label', 'Menüyü kapat');
    mobileMenuClose.innerHTML = '<i class="fa-solid fa-xmark"></i>';
    navActions.insertBefore(mobileMenuClose, navActions.firstChild);
  }
  
  // Dynamic scaling function for mobile nav
  function updateMobileNavScale() {
    if (!navActions) return;
    
    const viewportWidth = window.innerWidth;
    // Calculate scale factor: 1.0 at 900px, down to 0.6 at 280px for better mobile fit
    let scaleFactor = 1;
    
    if (viewportWidth < 900) {
      const minWidth = 280;  // Lower minimum for very small screens
      const maxWidth = 900;  // Breakpoint width
      const minScale = 0.6;  // More aggressive minimum scale (40% reduction)
      const maxScale = 1.0;  // Maximum scale
      
      scaleFactor = maxScale - ((maxWidth - viewportWidth) / (maxWidth - minWidth)) * (maxScale - minScale);
      scaleFactor = Math.max(minScale, Math.min(maxScale, scaleFactor)); // Clamp between min and max
    }
    
    navActions.style.setProperty('--scale-factor', scaleFactor);
  }
  
  // Throttle function for performance
  let scaleUpdateTimeout;
  function throttledScaleUpdate() {
    if (scaleUpdateTimeout) clearTimeout(scaleUpdateTimeout);
    scaleUpdateTimeout = setTimeout(updateMobileNavScale, 16); // ~60fps
  }
  
  // Initialize scale on load
  updateMobileNavScale();
  
  if (mobileMenuToggle && mobileMenuClose && navActions) {
    function openMobileMenu() {
      navActions.classList.add('mobile-open');
      body.classList.add('mobile-menu-open');
      mobileMenuToggle.setAttribute('aria-expanded', 'true');
    }
    
    function closeMobileMenu() {
      navActions.classList.remove('mobile-open');
      body.classList.remove('mobile-menu-open');
      mobileMenuToggle.setAttribute('aria-expanded', 'false');
    }
    
    // Open menu with hamburger button
    mobileMenuToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      openMobileMenu();
    });
    
    // Close menu with X button
    mobileMenuClose.addEventListener('click', (e) => {
      e.stopPropagation();
      closeMobileMenu();
    });
    
    // Close menu when clicking outside header
    document.addEventListener('click', (e) => {
      if (!document.querySelector('.top-panel').contains(e.target) && 
          navActions.classList.contains('mobile-open')) {
        closeMobileMenu();
      }
    });
    
    // Close mobile menu when clicking nav links
    navActions.addEventListener('click', (e) => {
      if (e.target.classList.contains('nav-link') && !e.target.classList.contains('dropdown-toggle')) {
        setTimeout(closeMobileMenu, 300); // Delay for smooth animation
      }
    });
    
    // Close mobile menu on window resize if desktop
    window.addEventListener('resize', () => {
      throttledScaleUpdate(); // Update scale on resize with throttling
      if (window.innerWidth > 900) { // Updated breakpoint
        closeMobileMenu();
      }
    });
    
    // Close menu on escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navActions.classList.contains('mobile-open')) {
        closeMobileMenu();
      }
    });
  }
 const SUPABASE_URL = 'https://gmlggmxtovwevwjbhwmo.supabase.co'; // Supabase projenizin URL'si
 const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdtbGdnbXh0b3Z3ZXZ3amJod21vIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc2ODg3NjEsImV4cCI6MjA3MzI2NDc2MX0.jDAwFcv1Q06Vtm_CeS4EJvWImLaItPr12THxqmKC_OY';   // Supabase anon public anahtarınız

 const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

 // 2. Form Elemanlarını Seçme
 const eventForm = document.getElementById('eventForm');
 const msgDiv = document.getElementById('msg');

 // 3. Form Gönderme Olayını Dinleme
 if (eventForm) {
  eventForm.addEventListener('submit', async (event) => {
    event.preventDefault(); // Sayfanın yeniden yüklenmesini engelle

    // Butonu devre dışı bırak ve "Gönderiliyor..." yaz
    const submitButton = eventForm.querySelector('button[type="submit"]');
    const originalButtonText = submitButton.textContent;
    submitButton.disabled = true;
    submitButton.textContent = 'Gönderiliyor...';
    msgDiv.textContent = ''; // Eski mesajları temizle

    // Form verilerini al
    const formData = new FormData(eventForm);
    const email = formData.get('email');

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      msgDiv.textContent = 'Lütfen geçerli bir e-posta adresi girin.';
      const panelColor = getComputedStyle(document.documentElement).getPropertyValue('--panel-bg').trim();
      msgDiv.style.color = panelColor;

      // Butonu tekrar aktif et ve işlemi durdur
      submitButton.disabled = false;
      submitButton.textContent = originalButtonText;
      return; 
    }

    // 4. Veriyi Supabase'e Gönderme
    const { data, error } = await supabase
      .from('newsletter_emails') // Supabase'de oluşturduğunuz tablonun adını yazın
      .insert([
        {  
          email: email, 
          // Not: Buradaki 'name', 'email', 'event' isimleri Supabase tablonuzdaki sütun adlarıyla eşleşmelidir.
        }
      ]);

    if (error) {
      // Hata varsa göster
      console.error('Supabase Hatası:', error);

      // E-posta zaten mevcutsa özel bir mesaj göster (unique constraint violation)
      if (error.code === '23505') {
        msgDiv.textContent = 'Bu e-posta adresi zaten kayıtlı.';
      } else {
        msgDiv.textContent = 'Bir hata oluştu. Lütfen tekrar deneyin.';
      }
      
      const panelColor = getComputedStyle(document.documentElement).getPropertyValue('--panel-bg').trim();
      msgDiv.style.color = panelColor;
    } else {
      // Başarılıysa mesaj göster ve formu temizle
      msgDiv.textContent = 'Kaydınız başarıyla alındı!';
      const accentColor = getComputedStyle(document.documentElement).getPropertyValue('--tree').trim();
      msgDiv.style.color = accentColor;
      eventForm.reset();
    }

    // Butonu tekrar aktif et
    submitButton.disabled = false;
    submitButton.textContent = originalButtonText;
  });
}
  
})();


