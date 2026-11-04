Add-Type -AssemblyName System.Drawing

function Create-PlaceholderImage {
    param (
        [string]$Path,
        [int]$Width,
        [int]$Height,
        [string]$Title,
        [string]$Subtitle,
        [string]$Tag,
        [string]$Category
    )

    $bitmap = New-Object System.Drawing.Bitmap($Width, $Height)
    $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
    $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
    $graphics.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::ClearTypeGridFit

    # Background gradient: Netflix Dark Slate & Deep Red Vignette
    $bgRect = New-Object System.Drawing.Rectangle(0, 0, $Width, $Height)
    $colTop = [System.Drawing.Color]::FromArgb(255, 26, 12, 14)
    $colBottom = [System.Drawing.Color]::FromArgb(255, 14, 14, 16)
    $bgBrush = New-Object System.Drawing.Drawing2D.LinearGradientBrush($bgRect, $colTop, $colBottom, 45.0)
    $graphics.FillRectangle($bgBrush, $bgRect)
    $bgBrush.Dispose()

    # Draw subtle grid lines
    $gridPen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(20, 255, 255, 255), 1)
    for ($x = 0; $x -lt $Width; $x += 40) {
        $graphics.DrawLine($gridPen, $x, 0, $x, $Height)
    }
    for ($y = 0; $y -lt $Height; $y += 40) {
        $graphics.DrawLine($gridPen, 0, $y, $Width, $y)
    }
    $gridPen.Dispose()

    # Draw decorative glow
    $glowBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(25, 229, 9, 20)) # Netflix red glow
    $graphics.FillEllipse($glowBrush, [int]($Width * 0.2), [int]($Height * 0.1), [int]($Width * 0.6), [int]($Height * 0.8))
    $glowBrush.Dispose()

    # Draw border
    $borderPen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(45, 255, 255, 255), 2)
    $graphics.DrawRectangle($borderPen, 1, 1, $Width - 2, $Height - 2)
    $borderPen.Dispose()

    # Category Pill Badge (top left)
    if ($Tag) {
        $tagFont = New-Object System.Drawing.Font("Segoe UI", 12, [System.Drawing.FontStyle]::Bold)
        $tagBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 229, 9, 20))
        $pillBg = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(200, 0, 0, 0))
        $pillRect = New-Object System.Drawing.Rectangle(30, 30, 200, 36)
        $graphics.FillRectangle($pillBg, $pillRect)
        $graphics.DrawString($Tag.ToUpper(), $tagFont, $tagBrush, 45, 37)
        $tagFont.Dispose()
        $tagBrush.Dispose()
        $pillBg.Dispose()
    }

    # Center Icon Pen
    $iconBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(220, 255, 255, 255))
    $centerPen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(180, 229, 9, 20), 3)

    $centerX = $Width / 2
    $centerY = $Height / 2 - 25

    if ($Category -eq "music") {
        # Musical Note icon
        $graphics.FillEllipse($iconBrush, ($centerX - 40), ($centerY + 15), 30, 25)
        $graphics.FillEllipse($iconBrush, ($centerX + 15), ($centerY + 5), 30, 25)
        $graphics.DrawLine($centerPen, ($centerX - 13), ($centerY + 25), ($centerX - 13), ($centerY - 35))
        $graphics.DrawLine($centerPen, ($centerX + 42), ($centerY + 15), ($centerX + 42), ($centerY - 45))
        $graphics.DrawLine($centerPen, ($centerX - 13), ($centerY - 35), ($centerX + 42), ($centerY - 45))
    } elseif ($Category -eq "singing") {
        # Microphone icon
        $graphics.FillEllipse($iconBrush, ($centerX - 20), ($centerY - 40), 40, 50)
        $graphics.DrawArc($centerPen, ($centerX - 35), ($centerY - 25), 70, 60, 0, 180)
        $graphics.DrawLine($centerPen, $centerX, ($centerY + 35), $centerX, ($centerY + 60))
        $graphics.DrawLine($centerPen, ($centerX - 25), ($centerY + 60), ($centerX + 25), ($centerY + 60))
    } elseif ($Category -eq "profile") {
        # Profile initials / silhouette
        $graphics.DrawEllipse($centerPen, ($centerX - 50), ($centerY - 50), 100, 100)
        $graphics.DrawArc($centerPen, ($centerX - 80), ($centerY + 45), 160, 100, 180, 180)
    }

    $iconBrush.Dispose()
    $centerPen.Dispose()

    # Title Text
    $titleFont = New-Object System.Drawing.Font("Segoe UI", [Math]::Max(16, [int]($Width * 0.038)), [System.Drawing.FontStyle]::Bold)
    $titleBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 255, 255, 255))
    $stringFormat = New-Object System.Drawing.StringFormat
    $stringFormat.Alignment = [System.Drawing.StringAlignment]::Center
    $stringFormat.LineAlignment = [System.Drawing.StringAlignment]::Center

    $titleRect = New-Object System.Drawing.RectangleF(20, ($Height / 2 + 55), ($Width - 40), 45)
    $graphics.DrawString($Title, $titleFont, $titleBrush, $titleRect, $stringFormat)

    # Subtitle Text
    if ($Subtitle) {
        $subFont = New-Object System.Drawing.Font("Segoe UI", [Math]::Max(11, [int]($Width * 0.022)), [System.Drawing.FontStyle]::Regular)
        $subBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(200, 179, 179, 179))
        $subRect = New-Object System.Drawing.RectangleF(20, ($Height / 2 + 100), ($Width - 40), 40)
        $graphics.DrawString($Subtitle, $subFont, $subBrush, $subRect, $stringFormat)
        $subFont.Dispose()
        $subBrush.Dispose()
    }

    $titleFont.Dispose()
    $titleBrush.Dispose()
    $stringFormat.Dispose()
    $graphics.Dispose()

    $bitmap.Save($Path, [System.Drawing.Imaging.ImageFormat]::Jpeg)
    $bitmap.Dispose()
    Write-Host "Generated: $Path"
}

# Generate music & singing hobby images
Create-PlaceholderImage -Path "assets/images/hobi-1.jpg" -Width 800 -Height 500 -Title "BERNYANYI" -Subtitle "Hobi Vokal & Melodi Lagu Favorit" -Tag "Hobi #1" -Category "singing"
Create-PlaceholderImage -Path "assets/images/hobi-2.jpg" -Width 800 -Height 500 -Title "BERMAIN MUSIK" -Subtitle "Eksplorasi Instrumen & Alunan Musik" -Tag "Hobi #2" -Category "music"
Create-PlaceholderImage -Path "assets/images/profile.jpg" -Width 600 -Height 600 -Title "AUDIA AGUSTINA RAHMAN" -Subtitle "Foto Profil (profile.jpg)" -Tag "Profil" -Category "profile"
