import { Contract } from './types'

const SHEET_ID = process.env.GOOGLE_SHEET_ID || '1itd22cfFXkzydebKDMK3WT_ZeQWMU9eQyDc5tmAtnUY'

// Google Sheets 公開共享的 API endpoint
// 使用 CSV 匯出功能讀取資料
export async function fetchContractsFromSheet(sheetName: string = '合約1'): Promise<Contract[]> {
  try {
    // CSV 匯出 URL
    const csvUrl = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent(sheetName)}`

    const response = await fetch(csvUrl, {
      cache: 'no-store',
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch sheet: ${response.statusText}`)
    }

    const text = await response.text()
    const lines = text.trim().split('\n')

    if (lines.length === 0) return []

    // 解析 CSV header
    const headers = parseCSVLine(lines[0])

    const contracts: Contract[] = []

    // 解析每一行資料
    for (let i = 1; i < lines.length; i++) {
      const values = parseCSVLine(lines[i])
      if (values.length === 0) continue

      const contract: Contract = {
        id: `${sheetName}-${i}`,
        用印日期: values[headers.indexOf('用印日期')] || '',
        合約名稱: values[headers.indexOf('合約名稱')] || '',
        合約對象: values[headers.indexOf('合約對象')] || '',
        合約期間: values[headers.indexOf('合約期間')] || '',
        合約申請人: values[headers.indexOf('合約申請人')] || '',
        歸檔日期: values[headers.indexOf('歸檔日期')] || '',
        備註: values[headers.indexOf('備註')] || '',
        合約審核單編號: values[headers.indexOf('合約審核單編號')] || '',
        合約編碼: values[headers.indexOf('合約編碼')] || '',
        性質: values[headers.indexOf('性質')] || '',
        檔案連結: values[headers.indexOf('檔案連結')] || '',
      }

      contracts.push(contract)
    }

    return contracts
  } catch (error) {
    console.error('Error fetching contracts:', error)
    return []
  }
}

// 解析 CSV 行（處理引號和逗號）
function parseCSVLine(line: string): string[] {
  const result: string[] = []
  let current = ''
  let inQuotes = false

  for (let i = 0; i < line.length; i++) {
    const char = line[i]
    const nextChar = line[i + 1]

    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        current += '"'
        i++
      } else {
        inQuotes = !inQuotes
      }
    } else if (char === ',' && !inQuotes) {
      result.push(current)
      current = ''
    } else {
      current += char
    }
  }

  result.push(current)
  return result
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
