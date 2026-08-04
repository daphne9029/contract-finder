'use client'

import { Contract } from '@/lib/types'
import { Download, ChevronDown } from 'lucide-react'
import { useState } from 'react'

interface ContractTableProps {
  contracts: Contract[]
  onSort: (field: 'date' | 'name' | 'applicant') => void
  sortBy: 'date' | 'name' | 'applicant'
  sortOrder: 'asc' | 'desc'
}

export default function ContractTable({
  contracts,
  onSort,
  sortBy,
  sortOrder,
}: ContractTableProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const SortHeader = ({
    label,
    field,
  }: {
    label: string
    field: 'date' | 'name' | 'applicant'
  }) => (
    <button
      onClick={() => onSort(field)}
      className="flex items-center gap-1 font-semibold text-gray-700 hover:text-gray-900"
    >
      {label}
      {sortBy === field && (
        <ChevronDown
          className={`w-4 h-4 transition ${
            sortOrder === 'desc' ? 'rotate-0' : 'rotate-180'
          }`}
        />
      )}
    </button>
  )

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="w-full">
        {/* 表頭 */}
        <div className="grid gap-0 bg-gray-50 border-b" style={{ gridTemplateColumns: '1fr 2fr 1fr 1fr 1.2fr 0.8fr' }}>
          <div className="px-4 py-3 border-r">合約編碼</div>
          <div className="px-4 py-3 border-r">
            <SortHeader label="合約名稱" field="name" />
          </div>
          <div className="px-4 py-3 border-r">
            <SortHeader label="用印日期" field="date" />
          </div>
          <div className="px-4 py-3 border-r">
            <SortHeader label="申請人" field="applicant" />
          </div>
          <div className="px-4 py-3 border-r">性質</div>
          <div className="px-4 py-3 text-center">操作</div>
        </div>

        {/* 表身 */}
        {contracts.length === 0 ? (
          <div className="px-6 py-8 text-center text-gray-500">
            沒有找到匹配的合約
          </div>
        ) : (
          contracts.map((contract) => (
            <div key={contract.id}>
              {/* 資料行 */}
              <div
                className="grid gap-0 border-b hover:bg-gray-50"
                style={{ gridTemplateColumns: '1fr 2fr 1fr 1fr 1.2fr 0.8fr' }}
              >
                <div className="px-4 py-4 border-r text-gray-600 whitespace-nowrap">
                  {contract.合約編碼}
                </div>
                <div className="px-4 py-4 border-r font-medium text-gray-900 break-words">
                  {contract.合約名稱}
                </div>
                <div className="px-4 py-4 border-r text-gray-600 whitespace-nowrap">
                  {contract.用印日期}
                </div>
                <div className="px-4 py-4 border-r text-gray-600 whitespace-nowrap">
                  {contract.合約申請人}
                </div>
                <div className="px-4 py-4 border-r">
                  <span className="inline-block px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm whitespace-nowrap">
                    {contract.性質}
                  </span>
                </div>
                <div className="px-4 py-4 text-center">
                  <button
                    onClick={() =>
                      setExpandedId(
                        expandedId === contract.id ? null : contract.id
                      )
                    }
                    className="text-blue-600 hover:text-blue-800 font-medium whitespace-nowrap"
                  >
                    {expandedId === contract.id ? '隱藏' : '詳情'}
                  </button>
                </div>
              </div>

              {/* 詳情行 */}
              {expandedId === contract.id && (
                <div className="bg-gray-50 border-b p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">
                        合約詳情
                      </h4>
                      <div className="space-y-2 text-sm">
                        <p>
                          <span className="font-medium text-gray-700">
                            合約對象:
                          </span>{' '}
                          {contract.合約對象}
                        </p>
                        <p>
                          <span className="font-medium text-gray-700">
                            合約期間:
                          </span>{' '}
                          {contract.合約期間}
                        </p>
                        <p>
                          <span className="font-medium text-gray-700">
                            合約編碼:
                          </span>{' '}
                          {contract.合約編碼}
                        </p>
                        <p>
                          <span className="font-medium text-gray-700">
                            審核單號:
                          </span>{' '}
                          {contract.合約審核單編號}
                        </p>
                        <p>
                          <span className="font-medium text-gray-700">
                            歸檔日期:
                          </span>{' '}
                          {contract.歸檔日期}
                        </p>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">
                        備註
                      </h4>
                      <p className="text-sm text-gray-600">
                        {contract.備註 || '無備註'}
                      </p>
                      {contract.檔案連結 ? (
                        <a
                          href={contract.檔案連結}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium"
                        >
                          <Download className="w-4 h-4" />
                          下載 PDF
                        </a>
                      ) : (
                        <button
                          disabled
                          className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-gray-300 text-gray-500 rounded-lg text-sm font-medium cursor-not-allowed"
                        >
                          <Download className="w-4 h-4" />
                          沒有 PDF
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  )
}
