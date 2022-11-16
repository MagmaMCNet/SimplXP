Clear-Host
$m = Read-Host -Prompt 'Commit Message: '
Write-Debug "Adding Files"
git add .
Write-Debug "Commiting"
git commit -m $m >null
Write-Debug "Commited"
