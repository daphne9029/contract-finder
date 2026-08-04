import { NextRequest, NextResponse } from 'next/server'
import { fetchContractsFromSheet, filterContracts, sortContracts } from '@/lib/googleSheets'

export const dynamic = 'force-dynamic'
export const revalidate = 300 // 5分鐘快取

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const sheetName = searchParams.get('sheet') || '合約1'
    const query = searchParams.get('q') || ''
    const category = searchParams.get('category') || ''
    const sortBy = (searchParams.get('sort') as 'date' | 'name' | 'applicant') || 'date'
    const sortOrder = (searchParams.get('order') as 'asc' | 'desc') || 'desc'

    // 從 Google Sheet 獲取合約資料
    let contracts = await fetchContractsFromSheet(sheetName)

    // 篩選
    if (query || category) {
      contracts = filterContracts(contracts, query, category)
    }

    // 排序
    contracts = sortContracts(contracts, sortBy, sortOrder)

    return NextResponse.json({
      success: true,
      data: contracts,
      count: contracts.length,
    })
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
