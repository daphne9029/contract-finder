'use client'

import { useEffect, useMemo, useState } from 'react'
import useSWR from 'swr'
import SearchBar from '@/components/SearchBar'
import FilterTags from '@/components/FilterTags'
import ContractTable from '@/components/ContractTable'
import { Contract, SearchFilters } from '@/lib/types'

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export default function Home() {
  const [filters, setFilters] = useState<SearchFilters>({
    query: '',
    category: '',
    sortBy: 'date',
    sortOrder: 'desc',
  })

  const [selectedSheet, setSelectedSheet] = useState('平台通路合約A_OK')
  const [allContracts, setAllContracts] = useState<Contract[]>([])
  const [categories, setCategories] = useState<string[]>([])
  const [selectedYears, setSelectedYears] = useState<string[]>([])
  const [selectedApplicants, setSelectedApplicants] = useState<string[]>([])

  // 構建 API URL
  const queryParams = new URLSearchParams({
    sheet: selectedSheet,
    q: filters.query,
    category: filters.category,
    sort: filters.sortBy,
    order: filters.sortOrder,
  })

  const { data, error, isLoading } = useSWR(
    `/api/contracts?${queryParams.toString()}`,
    fetcher,
    {
      revalidateOnFocus: false,
      dedupingInterval: 60000, // 1分鐘
    }
  )

  // 抽取所有的性質分類
  useEffect(() => {
    if (data?.data) {
      const uniqueCategories = [
        ...new Set(data.data.map((c: Contract) => c.性質)),
      ].filter(Boolean)
      setCategories(uniqueCategories as string[])
      setAllContracts(data.data)
    }
  }, [data])

  const yearOptions = useMemo(() => {
    const years = allContracts
      .map((c) => c.用印日期?.match(/^\d{4}/)?.[0])
      .filter((y): y is string => !!y)
    return [...new Set(years)].sort((a, b) => b.localeCompare(a))
  }, [allContracts])

  const applicantOptions = useMemo(() => {
    const applicants = allContracts.map((c) => c.合約申請人).filter(Boolean)
    return [...new Set(applicants)].sort((a, b) => a.localeCompare(b, 'zh-Hant'))
  }, [allContracts])

  const displayedContracts = useMemo(() => {
    return allContracts.filter((c) => {
      const year = c.用印日期?.match(/^\d{4}/)?.[0]
      const matchesYear = selectedYears.length === 0 || (year && selectedYears.includes(year))
      const matchesApplicant =
        selectedApplicants.length === 0 || selectedApplicants.includes(c.合約申請人)
      return matchesYear && matchesApplicant
    })
  }, [allContracts, selectedYears, selectedApplicants])

  const handleSheetChange = (sheet: string) => {
    setSelectedSheet(sheet)
    setSelectedYears([])
    setSelectedApplicants([])
  }

  const handleQueryChange = (query: string) => {
    setFilters({ ...filters, query })
  }

  const handleCategoryChange = (category: string) => {
    setFilters({ ...filters, category })
  }

  const handleSort = (field: 'date' | 'name' | 'applicant' | 'code') => {
    if (filters.sortBy === field) {
      setFilters({
        ...filters,
        sortOrder: filters.sortOrder === 'asc' ? 'desc' : 'asc',
      })
    } else {
      setFilters({ ...filters, sortBy: field, sortOrder: 'desc' })
    }
  }

  return (
    <div className="space-y-6">
      {/* 工作表選擇 */}
      <div className="bg-white rounded-lg shadow p-4">
        <h2 className="text-lg font-semibold text-gray-900 mb-3">選擇工作表</h2>
        <div className="flex flex-wrap gap-2">
          {[
            { name: 'A客戶/平台/通路合約', value: '平台通路合約A_OK' },
            { name: 'B行銷合約', value: '行銷合約B_OK' },
            { name: 'C加工/原料/產品供應', value: '供應商合約C_OK' },
            { name: 'D勞務合約', value: '勞務合約D_OK' },
            { name: 'E系統合約', value: '系統合約E_OK' },
            { name: 'F總務類合約', value: '總務合約F_OK' },
            { name: 'H財務股務', value: 'H財務股務_OK' },
          ].map((sheet) => (
            <button
              key={sheet.value}
              onClick={() => handleSheetChange(sheet.value)}
              className={`px-3 py-2 rounded-lg font-medium text-sm transition whitespace-nowrap ${
                selectedSheet === sheet.value
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {sheet.name}
            </button>
          ))}
        </div>
      </div>

      {/* 搜尋欄 */}
      <div className="bg-white rounded-lg shadow p-4">
        <h2 className="text-lg font-semibold text-gray-900 mb-3">搜尋合約</h2>
        <SearchBar value={filters.query} onChange={handleQueryChange} />
      </div>


      {/* 結果統計 */}
      <div className="text-sm text-gray-600">
        {isLoading ? (
          <span>載入中...</span>
        ) : error ? (
          <span className="text-red-600">載入出錯</span>
        ) : (
          <span>
            找到 <strong>{displayedContracts.length}</strong> 份合約
          </span>
        )}
      </div>

      {/* 合約表格 */}
      {isLoading ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <p className="text-gray-500">載入中...</p>
        </div>
      ) : error ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <p className="text-red-600">
            無法載入資料。請確認 Google Sheet 的存取權限。
          </p>
        </div>
      ) : (
        <ContractTable
          contracts={displayedContracts}
          onSort={handleSort}
          sortBy={filters.sortBy}
          sortOrder={filters.sortOrder}
          yearOptions={yearOptions}
          selectedYears={selectedYears}
          onYearFilterChange={setSelectedYears}
          applicantOptions={applicantOptions}
          selectedApplicants={selectedApplicants}
          onApplicantFilterChange={setSelectedApplicants}
        />
      )}
    </div>
  )
}
