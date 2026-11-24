Add-Type -AssemblyName System.Drawing

$publicPath = Join-Path $PSScriptRoot '..\public'
$sources = @(
  'img-placa-solar1.jpeg',
  'img-placa-solar2.jpeg',
  'img-placa-solar4.jpeg',
  'img-placa-solar5.jpeg',
  'img-placa-solar6.jpeg',
  'img-placa-solar7.jpeg'
)
$encoder = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.MimeType -eq 'image/jpeg' } | Select-Object -First 1
$qualityEncoder = [System.Drawing.Imaging.Encoder]::Quality

foreach ($fileName in $sources) {
  $source = [System.Drawing.Image]::FromFile((Resolve-Path (Join-Path $publicPath $fileName)))
  foreach ($targetWidth in @(600, 1100)) {
    $scale = [Math]::Min([double]1, $targetWidth / [double]$source.Width)
    $width = [int][Math]::Round($source.Width * $scale)
    $height = [int][Math]::Round($source.Height * $scale)
    $bitmap = [System.Drawing.Bitmap]::new($width, $height)
    $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
    $graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $graphics.DrawImage($source, 0, 0, $width, $height)

    $parameters = [System.Drawing.Imaging.EncoderParameters]::new(1)
    $parameters.Param[0] = [System.Drawing.Imaging.EncoderParameter]::new($qualityEncoder, [long]82)
    $outputName = $fileName.Replace('.jpeg', "-$targetWidth.jpeg")
    $bitmap.Save((Join-Path $publicPath $outputName), $encoder, $parameters)

    $parameters.Dispose()
    $graphics.Dispose()
    $bitmap.Dispose()
  }
  $source.Dispose()
}
