Clear-Host
$m = Read-Host -Prompt 'Commit Message: '
$Tag = Read-Host -Prompt 'Tag Name: '
Clear-Host
Write-Debug "Adding Files"
git add .
Write-Debug "Commiting"
git commit -m $m
Write-Debug "Commited"
Write-Debug "Publishing"
git tag -a R$Tag -m "git/publish.ps1"
git push origin R$Tag
git push
Write-Debug "Published"