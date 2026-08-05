import { Contract } from './types'
import { google } from 'googleapis'
import { getContractPdfMap } from './googleDrive'

const SHEET_ID = process.env.GOOGLE_SHEET_ID || '1itd22cfFXkzydebKDMK3WT_ZeQWMU9eQyDc5tmAtnUY'

// 初始化 Google Sheets API
function getSheetsClient() {
  const keyString = process.env.GOOGLE_SERVICE_ACCOUNT_KEY

  if (!keyString) {
    console.error('Error: GOOGLE_SERVICE_ACCOUNT_KEY is not set')
    throw new Error('GOOGLE_SERVICE_ACCOUNT_KEY environment variable is not set')
  }

  try {
    const credentials = JSON.parse(keyString)
    console.log('Successfully parsed credentials for project:', credentials.project_id)

    const auth = new google.auth.GoogleAuth({
      credentials,
      scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
    })

    return google.sheets({ version: 'v4', auth })
  } catch (error) {
    console.error('Failed to parse GOOGLE_SERVICE_ACCOUNT_KEY:', error)
    throw error
  }
}

export async function fetchContractsFromSheet(sheetName: string = '合約1'): Promise<Contract[]> {
  try {
    console.log('Fetching sheet:', sheetName)
    const sheets = getSheetsClient()
    console.log('Sheets client created')

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SHEET_ID,
      range: `'${sheetName}'!A:K`,
    })
    console.log('API response:', response.data)

    const rows = response.data.values || []
    if (rows.length === 0) return []

    let pdfMap: Map<string, string>
    try {
      pdfMap = await getContractPdfMap()
    } catch (error) {
      console.error('Error fetching PDF map from Drive:', error)
      pdfMap = new Map()
    }

    // 第一行是 header
    const headers = rows[0]
    const contracts: Contract[] = []

    // 從第二行開始讀取資料
    for (let i = 1; i < rows.length; i++) {
      const row = rows[i]
      if (!row || row.length === 0) continue

      const getColumnValue = (colName: string) => {
        const colIndex = headers.indexOf(colName)
        return colIndex >= 0 && row[colIndex] ? String(row[colIndex]) : ''
      }

      // 不同分頁的表頭命名不一致，有的叫「合約編號」有的叫「合約編碼」
      const 合約編碼 = getColumnValue('合約編號') || getColumnValue('合約編碼')

      const contract: Contract = {
        id: `${sheetName}-${i}`,
        用印日期: getColumnValue('用印日期'),
        合約名稱: getColumnValue('合約名稱'),
        合約對象: getColumnValue('合約對象'),
        合約期間: getColumnValue('合約期間'),
        合約申請人: getColumnValue('合約申請人'),
        歸檔日期: getColumnValue('歸檔日期'),
        備註: getColumnValue('備註'),
        合約審核單編號: getColumnValue('合約審核單編號'),
        合約編碼,
        性質: getColumnValue('性質'),
        檔案連結: pdfMap.get(合約編碼) || '',
      }

      contracts.push(contract)
    }

    return contracts
  } catch (error) {
    console.error('Error fetching contracts:', error)
    return []
  }
}

// 搜尋和篩選合約
export function filterContracts(
  contracts: Contract[],
  query: string,
  category: string
): Contract[] {
  return contracts.filter(contract => {
    const matchesQuery = !query ||
      contract.合約名稱.toLowerCase().includes(query.toLowerCase()) ||
      contract.合約對象.toLowerCase().includes(query.toLowerCase()) ||
      contract.合約申請人.toLowerCase().includes(query.toLowerCase()) ||
      contract.合約編碼.toLowerCase().includes(query.toLowerCase())

    const matchesCategory = !category || contract.性質 === category

    return matchesQuery && matchesCategory
  })
}

// 排序合約
export function sortContracts(
  contracts: Contract[],
  sortBy: 'date' | 'name' | 'applicant',
  sortOrder: 'asc' | 'desc' = 'desc'
): Contract[] {
  const sorted = [...contracts].sort((a, b) => {
    let compareA: string
    let compareB: string

    switch (sortBy) {
      case 'date':
        compareA = a.用印日期 || ''
        compareB = b.用印日期 || ''
        break
      case 'name':
        compareA = a.合約名稱
        compareB = b.合約名稱
        break
      case 'applicant':
        compareA = a.合約申請人
        compareB = b.合約申請人
        break
    }

    if (compareA < compareB) return sortOrder === 'asc' ? -1 : 1
    if (compareA > compareB) return sortOrder === 'asc' ? 1 : -1
    return 0
  })

  return sorted
}
