// Sticky header progressive shrink on scroll
(function(){
  const header = document.querySelector('.top-panel');
  const brand = document.querySelector('.brand');
  if(!header) return;

  // Shrink only the panel padding over 100px of scroll
  let SCROLL_RANGE = 100; // üst limit 100px

  function clamp(n, a, b){ return Math.min(b, Math.max(a, n)); }

  function onScroll(){
    const y = window.scrollY || window.pageYOffset || 0;
    const t = clamp(y / SCROLL_RANGE, 0, 1);
  // Keep padding-top constant; interpolate only padding-bottom
  const padTop = 10; // px (initial from CSS)
  const padBottomStart = 10;
  const padBottomEnd = 6;    // target smaller padding
  const padBottom = padBottomStart - (padBottomStart - padBottomEnd) * t;
  header.style.paddingTop = padTop + 'px';
  header.style.paddingBottom = padBottom + 'px';

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
  }
})();
