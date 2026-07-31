param(
  [Parameter(Mandatory=$true)][string]$CsvPath,
  [string]$OutputPath = ''
)

if ([string]::IsNullOrWhiteSpace($OutputPath)) {
  $OutputPath = Join-Path (Split-Path -Parent $MyInvocation.MyCommand.Path) 'products.js'
}

$includeGroups = @('LIQUOR','WINE','BEER')
$rows = Import-Csv -LiteralPath $CsvPath | Where-Object {
  [double]($_.'Total Qty On Hand') -gt 0 -and
  $_.'Do Not Show To Webstore' -ne '1' -and
  $_.'Hide Inventory' -ne '1' -and
  $_.'Category Group Name' -in $includeGroups
}
$items = foreach ($row in $rows) {
  $price = 0; [double]::TryParse(($row.'Unit Price' -replace '[$,]',''), [ref]$price) | Out-Null
  [pscustomobject]@{
    name = ($row.Name -replace '\s+',' ').Trim()
    category = ($row.'Category Group Name' -replace '\s+',' ').Trim()
    subCategory = ($row.'Category Name' -replace '\s+',' ').Trim()
    size = ($row.Size -replace '\s+',' ').Trim()
    proof = 0
    price = [Math]::Round($price,2)
    upc = ([string]$row.'UPC Full').Trim()
    featured = [int]$row.ID
  }
}
$json = $items | ConvertTo-Json -Depth 3 -Compress
$header = "/* Generated from inventory CSV on $(Get-Date -Format 'yyyy-MM-dd HH:mm'). Do not edit directly; rerun build-catalog.ps1 after a new export. */`nconst PRODUCTS = $json;`n"
Set-Content -LiteralPath $OutputPath -Value $header -Encoding utf8
Write-Host "Created $OutputPath with $($items.Count) in-stock beverage items."
