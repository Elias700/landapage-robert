Add-Type -AssemblyName System.Drawing

$sourcePath = Join-Path $PSScriptRoot '..\public\img-placa-solar1.jpeg'
$outputPath = Join-Path $PSScriptRoot '..\public\og-image.jpg'
$source = [System.Drawing.Image]::FromFile((Resolve-Path $sourcePath))
$canvas = [System.Drawing.Bitmap]::new(1200, 630)
$graphics = [System.Drawing.Graphics]::FromImage($canvas)
$graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
$graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$graphics.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality

$cropHeight = [int]($source.Width / (1200 / 630))
$cropY = [Math]::Max(0, [Math]::Min($source.Height - $cropHeight, [int]($source.Height * 0.5 - $cropHeight * 0.5)))
$graphics.DrawImage($source, [System.Drawing.Rectangle]::new(0, 0, 1200, 630), [System.Drawing.Rectangle]::new(0, $cropY, $source.Width, $cropHeight), [System.Drawing.GraphicsUnit]::Pixel)

$shade = [System.Drawing.Drawing2D.LinearGradientBrush]::new(
  [System.Drawing.Rectangle]::new(0, 0, 1200, 630),
  [System.Drawing.Color]::FromArgb(220, 11, 45, 47),
  [System.Drawing.Color]::FromArgb(15, 11, 45, 47),
  [System.Drawing.Drawing2D.LinearGradientMode]::Horizontal
)
$graphics.FillRectangle($shade, 0, 0, 1200, 630)
$font = [System.Drawing.Font]::new('Arial', 64, [System.Drawing.FontStyle]::Bold, [System.Drawing.GraphicsUnit]::Pixel)
$subFont = [System.Drawing.Font]::new('Arial', 30, [System.Drawing.FontStyle]::Regular, [System.Drawing.GraphicsUnit]::Pixel)
$white = [System.Drawing.SolidBrush]::new([System.Drawing.Color]::White)
$gold = [System.Drawing.SolidBrush]::new([System.Drawing.Color]::FromArgb(246, 185, 59))
$graphics.DrawString('Robert Solar', $font, $white, 70, 330)
$regionText = 'Energia solar em Salvador e regi' + [char]0x00e3 + 'o'
$graphics.DrawString($regionText, $subFont, $gold, 74, 420)

$quality = [System.Drawing.Imaging.Encoder]::Quality
$encoder = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.MimeType -eq 'image/jpeg' } | Select-Object -First 1
$parameters = [System.Drawing.Imaging.EncoderParameters]::new(1)
$parameters.Param[0] = [System.Drawing.Imaging.EncoderParameter]::new($quality, [long]88)
$canvas.Save((Join-Path $PSScriptRoot '..\public\og-image.jpg'), $encoder, $parameters)

$parameters.Dispose()
$white.Dispose()
$gold.Dispose()
$font.Dispose()
$subFont.Dispose()
$shade.Dispose()
$graphics.Dispose()
$canvas.Dispose()
$source.Dispose()
