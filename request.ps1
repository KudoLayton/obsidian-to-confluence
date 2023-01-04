Set-PSDebug -Trace 0
$prev = [Console]::OutputEncoding
[Console]::OutputEncoding = [System.Text.UTF8Encoding]::new()

$method = $Args[0]
$uri = $Args[1]
$token = "Bearer " + $Args[2]

if ($method = "GET"){
  $headers = @{
    "Authorization" = $token
  }
  Invoke-WebRequest -Method $method -Uri $uri -Headers $headers -UseBasicParsing -OutFile respond.txt
  cat respond.txt
  rm respond.txt
}else{
  $body = $Args[3]
  $headers = @{
      "Authorization" = $token
      "Content-Type" = "application/json"
  }
  Invoke-WebRequest -Uri $uri -Headers $headers -Method $method -Body $body -UseBasicParsing -OutFile respond.txt
  cat respond.txt
  rm respond.txt
}

[Console]::OutputEncoding = $prev
