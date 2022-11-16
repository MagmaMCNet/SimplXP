Clear-Host
$m = Read-Host -Prompt 'Commit Message: '
Write-Output "Adding Files"
git add . >log.log
Write-Output "Commiting"
git commit -m $m >log.log
Write-Output  "Commited"
