param(
  [string]$BaseUrl = 'http://localhost:5000/api'
)

$ErrorActionPreference = 'Stop'

$rand = Get-Random -Maximum 1000000
$password = 'Password123!'
$email = "adminrole$rand@example.com"

Write-Output "EMAIL=$email"

$registerBody = @{ firstName = 'Admin'; lastName = "User$rand"; email = $email; password = $password } | ConvertTo-Json
$register = Invoke-RestMethod -Method Post -Uri "$BaseUrl/auth/register" -TimeoutSec 10 -ContentType 'application/json' -Body $registerBody
$token = $register.token
Write-Output "TOKEN_PREFIX=$($token.Substring(0, 20))"

$backendRoot = Split-Path -Parent $PSScriptRoot
Set-Location $backendRoot

node .\scripts\promote-admin.js "$email" admin


$headers = @{ Authorization = "Bearer $token" }

foreach ($path in @('overview', 'popular-cities', 'engagement', 'system-health')) {
  try {
    $admin = Invoke-RestMethod -Method Get -Uri "$BaseUrl/admin/$path" -Headers $headers -TimeoutSec 10
    Write-Output "ADMIN_$path.OK=$($admin.success)"
    ($admin | ConvertTo-Json -Depth 10)
  } catch {
    Write-Output "ADMIN_$path.ERR=$($_.Exception.Message)"
    if ($_.ErrorDetails -and $_.ErrorDetails.Message) {
      Write-Output $_.ErrorDetails.Message
    }
  }
}
