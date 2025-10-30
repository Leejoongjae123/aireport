# Rename all types.ts files to Types.ts in Git

$files = @(
    "app/(client)/report/components/types.ts",
    "app/(client)/review/components/types.ts",
    "app/(client)/review/types.ts",
    "app/(client)/mypage/types.ts",
    "app/(client)/report/editor/components/types.ts",
    "app/(client)/report/procedure/types.ts",
    "app/(client)/preview/[uuid]/components/types.ts",
    "app/(admin)/admin/(main)/embeddings/reports/types.ts",
    "app/(admin)/admin/(main)/members/[id]/types.ts",
    "app/(admin)/admin/(main)/members/types.ts",
    "app/(admin)/admin/(main)/reports/types.ts",
    "app/(admin)/admin/(main)/requests/expert-consulting/[id]/types.ts",
    "app/(admin)/admin/(main)/requests/expert-consulting/types.ts",
    "app/(admin)/admin/(main)/requests/expert-evaluation/[id]/types.ts",
    "app/(admin)/admin/(main)/requests/expert-evaluation/types.ts",
    "app/api/download-word/types.ts"
)

foreach ($file in $files) {
    $newFile = $file -replace "types\.ts$", "Types.ts"
    Write-Host "Renaming: $file -> $newFile"
    git mv $file $newFile
}

Write-Host "`nDone! Please commit the changes."
