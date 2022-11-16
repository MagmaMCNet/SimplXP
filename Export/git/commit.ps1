Clear-Host
$m = Read-Host -Prompt 'Commit Message: '
Write-Output "Adding Files"
Remove-Item -Path "log.log"
git add . >log.log
Write-Output "Commiting"
git commit -m $m >log.log
Write-Output  "-Commited-"
Remove-Item -Path "log.log"