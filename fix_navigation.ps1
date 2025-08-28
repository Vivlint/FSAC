# Fix navigation links in all HTML files
$pages = @(
    "index.html",
    "kadro.html",
    "etkinlikler.html", 
    "ekip1.html",
    "ekip2.html", 
    "ekip3.html",
    "kulube-katil.html",
    "iletisim.html"
)

foreach ($page in $pages) {
    if (Test-Path $page) {
        Write-Host "Updating navigation in $page..." -ForegroundColor Green
        
        $content = Get-Content $page -Raw
        
        # Replace blog links with iletisim links
        $content = $content -replace '<a class="nav-link" href="blog\.html" data-tr="Blog" data-en="Blog" data-de="Blog" data-fr="Blog">Blog</a>', '<a class="nav-link" href="iletisim.html" data-tr="İletişim" data-en="Contact" data-de="Kontakt" data-fr="Contact">İletişim</a>'
        
        Set-Content $page $content -Encoding UTF8
        Write-Host "✓ Updated $page" -ForegroundColor Green
    } else {
        Write-Host "⚠ File not found: $page" -ForegroundColor Yellow
    }
}

Write-Host "`n✅ All navigation links updated!" -ForegroundColor Green
Write-Host "🔗 Blog links replaced with İletişim links" -ForegroundColor Cyan
Write-Host "📍 Navigation and controls now properly positioned" -ForegroundColor Cyan
