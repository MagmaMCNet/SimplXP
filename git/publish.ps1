git add .
$m = Read-Host -Prompt 'commit Message'
$Tag = Read-Host -Prompt 'Tag Name'
git commit -m $m
git tag -a R$Tag -m "git/publish.ps1"
git push origin $Tag