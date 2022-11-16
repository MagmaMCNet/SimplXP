Clear-Host
$m = Read-Host -Prompt 'Commit Message: '
Write-Output "Adding Files"
git add .
Write-Output "Commiting"
git commit -m $m
Write-Output  "Commited"
