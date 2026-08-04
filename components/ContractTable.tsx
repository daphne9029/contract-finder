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
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <table className="w-full">
        <thead className="bg-gray-50 border-b">
          <tr>
            <th className="px-6 py-3 text-left">
              <SortHeader label="合約名稱" field="name" />
            </th>
            <th className="px-6 py-3 text-left">
              <SortHeader label="用印日期" field="date" />
            </th>
            <th className="px-6 py-3 text-left">
              <SortHeader label="申請人" field="applicant" />
            </th>
            <th className="px-6 py-3 text-left">性質</th>
            <th className="px-6 py-3 text-center">操作</th>
          </tr>
        </thead>
        <tbody>
          {contracts.length === 0 ? (
            <tr>
              <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                沒有找到匹配的合約
              </td>
            </tr>
          ) : (
            contracts.map((contract) => (
              <tbody key={contract.id}>
                <tr className="border-b hover:bg-gray-50 cursor-pointer">
                  <td className="px-6 py-4 font-medium text-gray-900">
                    {contract.合約名稱}
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    {contract.用印日期}
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    {contract.合約申請人}
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                      {contract.性質}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button
                      onClick={() =>
                        setExpandedId(
                          expandedId === contract.id ? null : contract.id
                        )
                      }
                      className="text-blue-600 hover:text-blue-800 font-medium"
                    >
                      {expandedId === contract.id ? '隱藏' : '詳情'}
                    </button>
                  </td>
                </tr>
                {expandedId === contract.id && (
                  <tr className="bg-gray-50 border-b">
                    <td colSpan={5} className="px-6 py-4">
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
                    </td>
                  </tr>
                )}
              </tbody>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}
