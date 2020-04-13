pkg -t win -o "pkgTest.exe" bin.js
.\pkgTest.exe
Remove-Item pkgTest.exe
echo 'If you saw "[{"firstName":"Gaël","lastName":"Monfils"},{"firstName":"Alix","lastName":"Haméon"}]" on the line above, the packaging test succeeded'