# PowerShell script to update all HTML headers with mobile navigation

$pages = @(
    "kadro.html",
    "etkinlikler.html",
    "iletisim.html", 
    "kulube-katil.html",
    "ekipler.html",
    "ekip1.html",
    "ekip2.html", 
    "ekip3.html",
    "ekip4.html",
    "ekip5.html"
)

foreach ($page in $pages) {
    if (Test-Path $page) {
        $content = Get-Content $page -Raw
        
        # Update the header structure to include mobile menu
        $oldHeader = '<nav class="nav-actions" aria-label="Birincil menü">
      <div class="nav-controls">'
        
        $newHeader = '<div class="nav-controls">
      <button class="control-btn theme-toggle" id="themeToggle" aria-label="Temayı değiştir">
        <i class="fa-solid fa-sun theme-icon"></i>
      </button>
      <div class="lang-selector">
        <button class="control-btn lang-toggle" id="langToggle" aria-haspopup="true" aria-expanded="false">
          <i class="fa-solid fa-globe"></i>
          <span class="lang-text">TR</span>
          <i class="fa-solid fa-chevron-down lang-caret"></i>
        </button>
        <div class="lang-menu" id="langMenu">
          <a href="#" class="lang-option" data-lang="tr">🇹🇷 Türkçe</a>
          <a href="#" class="lang-option" data-lang="en">🇺🇸 English</a>
          <a href="#" class="lang-option" data-lang="de">🇩🇪 Deutsch</a>
          <a href="#" class="lang-option" data-lang="fr">🇫🇷 Français</a>
        </div>
      </div>
    </div>
    <button class="mobile-menu-toggle" id="mobileMenuToggle" aria-label="Menüyü aç/kapat">
      <i class="fa-solid fa-bars"></i>
    </button>
    <nav class="nav-actions" aria-label="Birincil menü">'
        
        if ($content -match [regex]::Escape($oldHeader)) {
            $content = $content -replace [regex]::Escape($oldHeader), $newHeader
            Set-Content -Path $page -Value $content -Encoding UTF8
            Write-Host "Updated header structure in $page"
        } else {
            Write-Host "Header pattern not found in $page - may need manual update"
        }
    }
}

Write-Host "Mobile header updates completed!"
