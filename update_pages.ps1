# PowerShell script to update all HTML pages with anti-flash CSS

$pages = @(
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

$newHead = @'
<!doctype html>
<html lang="tr">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <style>
    /* Critical CSS - Ultra anti-flash */
    html:not(.ready) * { opacity: 0 !important; transition: none !important; }
    html.ready * { opacity: 1; transition: background-color 0.3s ease, color 0.3s ease, opacity 0.2s ease; }
    html:not(.ready) body { background: #1a1a1a !important; }
    :root {
      --panel-bg: #5d0d0e;
      --accent: #caa354;
      --bone: #f5f3e8;
      --muted: #d9cdb1;
      --bg-primary: #fff;
      --bg-secondary: #f8f9fa;
      --text-primary: #222;
      --text-secondary: #444;
      --border-color: #ececec;
    }
    [data-theme="dark"] {
      --bg-primary: #1a1a1a;
      --bg-secondary: #2d2d2d;
      --text-primary: #e0e0e0;
      --text-secondary: #b0b0b0;
      --border-color: #404040;
    }
    * { box-sizing: border-box; }
    html, body { margin: 0; padding: 0; }
    body {
      font-family: system-ui, -apple-system, Segoe UI, Roboto, sans-serif;
      color: var(--text-primary);
      background: var(--bg-primary);
      min-height: 100vh;
    }
  </style>
  <script>
    // Ultra-fast theme application
    (function() {
      const savedTheme = localStorage.getItem('foundry-theme') || 'light';
      const savedLang = localStorage.getItem('foundry-language') || 'tr';
      document.documentElement.setAttribute('data-theme', savedTheme);
      document.documentElement.setAttribute('lang', savedLang);
      
      // Make ready after theme applied
      setTimeout(() => {
        document.documentElement.classList.add('ready');
      }, 10);
    })();
  </script>
  <link rel="stylesheet" href="css/styles.css" />
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Merriweather:wght@400;700;800&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css" integrity="sha512-SnH5WK+bZxgPHs44uWIX+LLJAJ9/2PkPKZ5QiAj6Ta86w+fsb2TkcmfRyVX3pBnMFcV7oQPJkl9QevSCWr3W6A==" crossorigin="anonymous" referrerpolicy="no-referrer" />
'@

foreach ($page in $pages) {
    if (Test-Path $page) {
        $content = Get-Content $page -Raw
        $title = ""
        
        # Extract title
        if ($content -match '<title>(.*?)</title>') {
            $title = $matches[1]
        }
        
        # Find where body starts
        $bodyStart = $content.IndexOf('<body>')
        
        if ($bodyStart -gt 0) {
            $bodyAndRest = $content.Substring($bodyStart)
            $newContent = $newHead + "`n  <title>$title</title>`n</head>`n" + $bodyAndRest
            Set-Content -Path $page -Value $newContent -Encoding UTF8
            Write-Host "Updated $page"
        }
    }
}

Write-Host "All pages updated!"
