Clear-Host
$m = Read-Host -Prompt 'Commit Message: '
$Tag = Read-Host -Prompt 'Tag Name: '
Clear-Host
Write-Output "Adding Files"
git add .
Write-Output "Commiting"
git commit -m $m
Write-Output "Commited"
Write-Output "Publishing"
git tag -a R$Tag -m "git/publish.ps1"
git push origin R$Tag
git push
Write-Output "Published"