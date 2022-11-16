Clear-Host
$m = Read-Host -Prompt 'Commit Message: '
$Tag = Read-Host -Prompt 'Tag Name: '
Clear-Host
Write-Output "Adding Files"
git add . >log.log
Write-Output "Commiting"
git commit -m $m >log.log
Write-Output "-Commited-"
Remove-Item -Path "log.log"
Write-Output "Publishing"
git tag -a R$Tag -m "Auto Publish" >log.log
git push origin R$Tag >log.log
git push >log.log
Write-Output "-Published-"
Remove-Item -Path "log.log"