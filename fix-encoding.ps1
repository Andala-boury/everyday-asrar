$content = Get-Content "src\features\ilm-huruf\IlmHurufPanel.tsx" -Raw -Encoding UTF8
$content = $content -replace 'ðŸŒ™','🌙'
$content = $content -replace 'ðŸŒŠ','🌊'
$content = $content -replace 'â­','⭐'
$content = $content -replace 'ðŸ¤','🤝'
$content = $content -replace 'Ã—','×'
$content = $content -replace 'PlanÃ©taire','Planétaire'
$content = $content -replace 'âœ¨','✨'
$content = $content -replace 'â€¢','•'
[System.IO.File]::WriteAllText("src\features\ilm-huruf\IlmHurufPanel.tsx", $content, [System.Text.Encoding]::UTF8)
Write-Host "Fixed encoding issues"
