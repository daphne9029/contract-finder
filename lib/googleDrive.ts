import { google } from 'googleapis'

// 合約編號 -> PDF 檢視連結，快取避免每次請求都重新掃描 Drive
let cachedMap: Map<string, string> | null = null
let cachedAt = 0
const CACHE_TTL_MS = 5 * 60 * 1000

function getDriveClient() {
  const keyString = process.env.GOOGLE_SERVICE_ACCOUNT_KEY

  if (!keyString) {
    throw new Error('GOOGLE_SERVICE_ACCOUNT_KEY environment variable is not set')
  }

  const credentials = JSON.parse(keyString)
  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ['https://www.googleapis.com/auth/drive.readonly'],
  })

  return google.drive({ version: 'v3', auth })
}

// 檔名/資料夾名開頭的合約編號，例如「A2026002-三友-...pdf」-> A2026002
const CODE_PREFIX_RE = /^([A-Za-z]+\d+)[-_]/

type DriveFile = { id: string; name: string; webViewLink?: string | null }

async function listAllFiles(
  drive: ReturnType<typeof getDriveClient>,
  query: string
): Promise<DriveFile[]> {
  const files: DriveFile[] = []
  let pageToken: string | undefined

  do {
    const res = await drive.files.list({
      q: query,
      fields: 'nextPageToken, files(id, name, webViewLink)',
      pageSize: 1000,
      pageToken,
    })
    for (const f of res.data.files || []) {
      if (f.id && f.name) files.push({ id: f.id, name: f.name, webViewLink: f.webViewLink })
    }
    pageToken = res.data.nextPageToken || undefined
  } while (pageToken)

  return files
}

export async function getContractPdfMap(): Promise<Map<string, string>> {
  if (cachedMap && Date.now() - cachedAt < CACHE_TTL_MS) {
    return cachedMap
  }

  const drive = getDriveClient()
  const map = new Map<string, string>()

  // 直接以「編號-...」命名的 PDF 檔案
  const pdfFiles = await listAllFiles(
    drive,
    "mimeType='application/pdf' and trashed=false"
  )
  console.log(`Drive: found ${pdfFiles.length} PDF file(s) visible to service account`)
  for (const file of pdfFiles) {
    const match = file.name.match(CODE_PREFIX_RE)
    if (match && file.webViewLink) {
      map.set(match[1], file.webViewLink)
    } else if (!match) {
      console.log(`Drive: PDF name did not match code pattern: "${file.name}"`)
    }
  }

  // 以編號命名的資料夾（一份合約多個檔案），取夾內第一個 PDF
  const folders = await listAllFiles(
    drive,
    "mimeType='application/vnd.google-apps.folder' and trashed=false"
  )
  console.log(`Drive: found ${folders.length} folder(s) visible to service account`)
  for (const folder of folders) {
    const match = folder.name.match(CODE_PREFIX_RE)
    if (!match || map.has(match[1])) continue

    const inner = await listAllFiles(
      drive,
      `'${folder.id}' in parents and mimeType='application/pdf' and trashed=false`
    )
    if (inner[0]?.webViewLink) {
      map.set(match[1], inner[0].webViewLink)
    }
  }

  console.log(`Drive: built PDF map with ${map.size} contract code(s)`)
  cachedMap = map
  cachedAt = Date.now()
  return map
}
