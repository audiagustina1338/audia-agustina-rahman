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

    # Background gradient: Dark Slate / Twitter Black
    $bgRect = New-Object System.Drawing.Rectangle(0, 0, $Width, $Height)
    $colTop = [System.Drawing.Color]::FromArgb(255, 18, 22, 28)
    $colBottom = [System.Drawing.Color]::FromArgb(255, 8, 10, 14)
    $bgBrush = New-Object System.Drawing.Drawing2D.LinearGradientBrush($bgRect, $colTop, $colBottom, 45.0)
    $graphics.FillRectangle($bgBrush, $bgRect)
    $bgBrush.Dispose()

    # Draw subtle grid lines
    $gridPen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(25, 255, 255, 255), 1)
    for ($x = 0; $x -lt $Width; $x += 40) {
        $graphics.DrawLine($gridPen, $x, 0, $x, $Height)
    }
    for ($y = 0; $y -lt $Height; $y += 40) {
        $graphics.DrawLine($gridPen, 0, $y, $Width, $y)
    }
    $gridPen.Dispose()

    # Draw subtle decorative glow circle
    $glowBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(15, 29, 155, 240)) # Twitter blue glow
    $graphics.FillEllipse($glowBrush, [int]($Width * 0.2), [int]($Height * 0.1), [int]($Width * 0.6), [int]($Height * 0.8))
    $glowBrush.Dispose()

    # Draw border
    $borderPen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(45, 255, 255, 255), 2)
    $graphics.DrawRectangle($borderPen, 1, 1, $Width - 2, $Height - 2)
    $borderPen.Dispose()

    # Category Pill Badge (top left)
    if ($Tag) {
        $tagFont = New-Object System.Drawing.Font("Segoe UI", 12, [System.Drawing.FontStyle]::Bold)
        $tagBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 29, 155, 240))
        $pillBg = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(180, 0, 0, 0))
        $pillRect = New-Object System.Drawing.Rectangle(30, 30, 180, 34)
        $graphics.FillRectangle($pillBg, $pillRect)
        $graphics.DrawString($Tag.ToUpper(), $tagFont, $tagBrush, 45, 36)
        $tagFont.Dispose()
        $tagBrush.Dispose()
        $pillBg.Dispose()
    }

    # Center Icon or decorative illustration
    $iconBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(180, 231, 233, 234))
    $centerPen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(100, 29, 155, 240), 3)

    $centerX = $Width / 2
    $centerY = $Height / 2 - 30

    # Draw icon based on category
    if ($Category -eq "home") {
        # Roof & walls
        $points = @(
            (New-Object System.Drawing.PointF($centerX, ($centerY - 50))),
            (New-Object System.Drawing.PointF(($centerX + 60), $centerY)),
            (New-Object System.Drawing.PointF(($centerX - 60), $centerY))
        )
        $graphics.DrawPolygon($centerPen, $points)
        $graphics.DrawRectangle($centerPen, ($centerX - 45), $centerY, 90, 60)
        $graphics.DrawRectangle($centerPen, ($centerX - 15), ($centerY + 20), 30, 40)
    } elseif ($Category -eq "profile") {
        # Profile head & shoulders
        $graphics.DrawEllipse($centerPen, ($centerX - 40), ($centerY - 50), 80, 80)
        $graphics.DrawArc($centerPen, ($centerX - 70), ($centerY + 35), 140, 90, 180, 180)
    } elseif ($Category -eq "video") {
        # Play triangle
        $playPoints = @(
            (New-Object System.Drawing.PointF(($centerX - 30), ($centerY - 40))),
            (New-Object System.Drawing.PointF(($centerX + 40), $centerY)),
            (New-Object System.Drawing.PointF(($centerX - 30), ($centerY + 40)))
        )
        $graphics.FillPolygon($iconBrush, $playPoints)
        $graphics.DrawEllipse($centerPen, ($centerX - 60), ($centerY - 60), 120, 120)
    } else {
        # Star / Diamond
        $graphics.DrawEllipse($centerPen, ($centerX - 40), ($centerY - 40), 80, 80)
    }
    $iconBrush.Dispose()
    $centerPen.Dispose()

    # Title Text
    $titleFont = New-Object System.Drawing.Font("Segoe UI", [Math]::Max(16, [int]($Width * 0.038)), [System.Drawing.FontStyle]::Bold)
    $titleBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 240, 243, 246))
    $stringFormat = New-Object System.Drawing.StringFormat
    $stringFormat.Alignment = [System.Drawing.StringAlignment]::Center
    $stringFormat.LineAlignment = [System.Drawing.StringAlignment]::Center

    $titleRect = New-Object System.Drawing.RectangleF(20, ($Height / 2 + 50), ($Width - 40), 45)
    $graphics.DrawString($Title, $titleFont, $titleBrush, $titleRect, $stringFormat)

    # Subtitle Text
    $subFont = New-Object System.Drawing.Font("Segoe UI", [Math]::Max(11, [int]($Width * 0.022)), [System.Drawing.FontStyle]::Regular)
    $subBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(200, 113, 118, 123))
    $subRect = New-Object System.Drawing.RectangleF(20, ($Height / 2 + 95), ($Width - 40), 40)
    $graphics.DrawString($Subtitle, $subFont, $subBrush, $subRect, $stringFormat)

    # Clean up
    $titleFont.Dispose()
    $titleBrush.Dispose()
    $subFont.Dispose()
    $subBrush.Dispose()
    $stringFormat.Dispose()
    $graphics.Dispose()

    # Save as JPEG
    $bitmap.Save($Path, [System.Drawing.Imaging.ImageFormat]::Jpeg)
    $bitmap.Dispose()
    Write-Host "Generated: $Path"
}

# 1. Profile Picture
Create-PlaceholderImage -Path "assets/images/profile.jpg" -Width 600 -Height 600 -Title "FOTO PROFIL" -Subtitle "Ganti dengan foto profil Anda (profile.jpg)" -Tag "Avatar" -Category "profile"

# 2. Banner
Create-PlaceholderImage -Path "assets/images/banner.jpg" -Width 1500 -Height 500 -Title "HEADER PROFILE BANNER" -Subtitle "Ganti dengan banner pilihan Anda (banner.jpg)" -Tag "Header Cover" -Category "banner"

# 3. Empat Kategori Foto Rumah (Wajib Sesuai Prompt)
Create-PlaceholderImage -Path "assets/images/rumah-depan.jpg" -Width 1200 -Height 800 -Title "TAMPAK DEPAN RUMAH" -Subtitle "Dokumentasi Fasad & Halaman Depan Rumah" -Tag "Kategori 1" -Category "home"
Create-PlaceholderImage -Path "assets/images/rumah-belakang.jpg" -Width 1200 -Height 800 -Title "TAMPAK BELAKANG RUMAH" -Subtitle "Dokumentasi Area Belakang & Taman Belakang" -Tag "Kategori 2" -Category "home"
Create-PlaceholderImage -Path "assets/images/rumah-kiri.jpg" -Width 1200 -Height 800 -Title "TAMPAK SAMPING KIRI" -Subtitle "Dokumentasi Sisi Kiri Bangunan Rumah" -Tag "Kategori 3" -Category "home"
Create-PlaceholderImage -Path "assets/images/rumah-kanan.jpg" -Width 1200 -Height 800 -Title "TAMPAK SAMPING KANAN" -Subtitle "Dokumentasi Sisi Kanan Bangunan Rumah" -Tag "Kategori 4" -Category "home"

# 4. Video Thumbnail
Create-PlaceholderImage -Path "assets/images/video-thumbnail.jpg" -Width 1280 -Height 720 -Title "VIDEO PERKENALAN" -Subtitle "Klik untuk memutar video dokumentasi / perkenalan" -Tag "Video Thumbnail" -Category "video"

# 5. Hobi Images
Create-PlaceholderImage -Path "assets/images/hobi-1.jpg" -Width 800 -Height 500 -Title "SOFTWARE ENGINEERING" -Subtitle "Coding, Web Development & Eksplorasi AI" -Tag "Hobi #1" -Category "hobby"
Create-PlaceholderImage -Path "assets/images/hobi-2.jpg" -Width 800 -Height 500 -Title "FOTOGRAFI & DESAIN" -Subtitle "Arsitektur, Street Photography & UI Design" -Tag "Hobi #2" -Category "hobby"
Create-PlaceholderImage -Path "assets/images/hobi-3.jpg" -Width 800 -Height 500 -Title "GAMING & ESPORTS" -Subtitle "Strategy, Tech Setup & Game Modding" -Tag "Hobi #3" -Category "hobby"
