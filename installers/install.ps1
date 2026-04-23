param(
  [ValidateSet("codex", "claude")]
  [string]$Target = "codex",

  # Comma-separated skill names. Empty means install all.
  [string]$Skills = ""
)

$ErrorActionPreference = "Stop"

$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$RepoRoot = Resolve-Path (Join-Path $ScriptDir "..")
$SourceDir = Join-Path $RepoRoot "skills"

if ($Target -eq "codex") {
  $DefaultTarget = Join-Path $HOME ".codex/skills"
} else {
  $DefaultTarget = Join-Path $HOME ".claude/skills"
}

$TargetDir = $env:SKILLS_TARGET_DIR
if ([string]::IsNullOrWhiteSpace($TargetDir)) {
  $TargetDir = $DefaultTarget
}

if (-not (Test-Path $TargetDir)) {
  New-Item -ItemType Directory -Path $TargetDir | Out-Null
}

if ([string]::IsNullOrWhiteSpace($Skills)) {
  $SkillList = Get-ChildItem -Path $SourceDir -Directory | Sort-Object Name | Select-Object -ExpandProperty Name
} else {
  $SkillList = $Skills.Split(",") | ForEach-Object { $_.Trim() } | Where-Object { $_ -ne "" }
}

$SourceRoot = [System.IO.Path]::GetFullPath($SourceDir)
$TargetRoot = [System.IO.Path]::GetFullPath($TargetDir)
$SafeSkillPattern = '^[A-Za-z0-9._-]+$'

foreach ($Skill in $SkillList) {
  if ($Skill -notmatch $SafeSkillPattern) {
    Write-Host "[skip] Invalid skill name: $Skill"
    continue
  }

  $Src = Join-Path $SourceDir $Skill
  $Dst = Join-Path $TargetDir $Skill
  $ResolvedSrc = [System.IO.Path]::GetFullPath($Src)
  $ResolvedDst = [System.IO.Path]::GetFullPath($Dst)

  if (-not $ResolvedSrc.StartsWith($SourceRoot + [System.IO.Path]::DirectorySeparatorChar)) {
    Write-Host "[skip] Unsafe source path resolved for: $Skill"
    continue
  }

  if (-not $ResolvedDst.StartsWith($TargetRoot + [System.IO.Path]::DirectorySeparatorChar)) {
    Write-Host "[skip] Unsafe target path resolved for: $Skill"
    continue
  }

  if (-not (Test-Path $Src)) {
    Write-Host "[skip] Skill not found: $Skill"
    continue
  }

  if (Test-Path $Dst) {
    Remove-Item -Recurse -Force $Dst
  }

  Copy-Item -Recurse -Path $Src -Destination $Dst
  Write-Host "[ok] Installed $Skill -> $Dst"
}

Write-Host "Done. Restart the target tool to load updated skills."
