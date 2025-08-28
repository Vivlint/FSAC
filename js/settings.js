// Global Settings Manager - MUST be loaded before any other scripts
(function() {
  'use strict';
  
  // Settings keys
  const THEME_KEY = 'foundry-theme';
  const LANGUAGE_KEY = 'foundry-language';
  
  // Default values
  const DEFAULT_THEME = 'light';
  const DEFAULT_LANGUAGE = 'tr';
  
  // Settings object
  window.FoundrySettings = {
    theme: localStorage.getItem(THEME_KEY) || DEFAULT_THEME,
    language: localStorage.getItem(LANGUAGE_KEY) || DEFAULT_LANGUAGE,
    
    // Set theme immediately
    setTheme: function(theme) {
      this.theme = theme;
      localStorage.setItem(THEME_KEY, theme);
      document.documentElement.setAttribute('data-theme', theme);
      
      // Broadcast to other tabs
      window.dispatchEvent(new StorageEvent('storage', {
        key: THEME_KEY,
        newValue: theme
      }));
    },
    
    // Set language immediately
    setLanguage: function(language) {
      this.language = language;
      localStorage.setItem(LANGUAGE_KEY, language);
      document.documentElement.setAttribute('lang', language);
      
      // Broadcast to other tabs
      window.dispatchEvent(new StorageEvent('storage', {
        key: LANGUAGE_KEY,
        newValue: language
      }));
    },
    
    // Initialize on page load
    init: function() {
      // Apply theme immediately
      document.documentElement.setAttribute('data-theme', this.theme);
      document.documentElement.setAttribute('lang', this.language);
      
      // Listen for changes from other tabs
      window.addEventListener('storage', (e) => {
        if (e.key === THEME_KEY && e.newValue) {
          this.theme = e.newValue;
          document.documentElement.setAttribute('data-theme', e.newValue);
          this.updateUI();
        } else if (e.key === LANGUAGE_KEY && e.newValue) {
          this.language = e.newValue;
          document.documentElement.setAttribute('lang', e.newValue);
          this.updateUI();
        }
      });
      
      // Update UI when DOM is ready
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
          this.updateUI();
        });
      } else {
        this.updateUI();
      }
      
      // Show page immediately after applying initial settings
      if (document.documentElement) {
        document.documentElement.classList.add('ready');
      }
      if (document.body) {
        document.body.classList.add('initialized');
      } else {
        document.addEventListener('DOMContentLoaded', () => {
          document.documentElement.classList.add('ready');
          document.body.classList.add('initialized');
        });
      }
    },
    
    // Update UI elements
    updateUI: function() {
      const themeIcon = document.querySelector('.theme-icon');
      const langText = document.querySelector('.lang-text');
      
      if (themeIcon) {
        themeIcon.className = this.theme === 'dark' ? 'fa-solid fa-moon theme-icon' : 'fa-solid fa-sun theme-icon';
      }
      
      if (langText) {
        langText.textContent = this.language.toUpperCase();
      }
      
      // Apply translations
      this.applyTranslations();
      
      // Show page after initialization
      document.documentElement.classList.add('ready');
      document.body.classList.add('initialized');
    },
    
    // Apply translations to current page
    applyTranslations: function() {
      document.querySelectorAll('[data-tr]').forEach(element => {
        const text = element.getAttribute(`data-${this.language}`);
        if (text) {
          element.textContent = text;
        }
      });
      
      // Update theme toggle aria-label
      const themeToggle = document.getElementById('themeToggle');
      if (themeToggle) {
        const labels = {
          tr: 'Temayı değiştir',
          en: 'Toggle theme', 
          de: 'Design wechseln',
          fr: 'Changer le thème'
        };
        themeToggle.setAttribute('aria-label', labels[this.language] || labels.tr);
      }
    }
  };
  
  // Initialize immediately
  FoundrySettings.init();
})();
