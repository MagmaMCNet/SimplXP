Clear-Host
$m = Read-Host -Prompt 'Commit Message: '
$Tag = Read-Host -Prompt 'Tag Name: '
Clear-Host
Write-Output "Adding Files"
git add . >log.log
Write-Output "Commiting"
git commit -m $m >log.log
Write-Output "Commited"
Write-Output "Publishing"
git tag -a R$Tag -m "git/publish.ps1" >log.log
git push origin R$Tag >log.log
git push >log.log
Write-Output "Published"