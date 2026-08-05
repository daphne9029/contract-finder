'use client'

import { Filter } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

interface ColumnFilterDropdownProps {
  options: string[]
  selected: string[]
  onChange: (selected: string[]) => void
}

export default function ColumnFilterDropdown({
  options,
  selected,
  onChange,
}: ColumnFilterDropdownProps) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const toggleValue = (value: string) => {
    if (selected.includes(value)) {
      onChange(selected.filter((v) => v !== value))
    } else {
      onChange([...selected, value])
    }
  }

  const isActive = selected.length > 0

  return (
    <div className="relative inline-block" ref={ref}>
      <button
        onClick={(e) => {
          e.stopPropagation()
          setOpen((v) => !v)
        }}
        className={`p-0.5 rounded hover:bg-gray-200 ${
          isActive ? 'text-blue-600' : 'text-gray-400'
        }`}
      >
        <Filter className="w-3.5 h-3.5" fill={isActive ? 'currentColor' : 'none'} />
      </button>
      {open && (
        <div
          onClick={(e) => e.stopPropagation()}
          className="absolute z-20 mt-1 w-48 max-h-64 overflow-y-auto bg-white border rounded-lg shadow-lg p-2 text-left font-normal normal-case"
        >
          <div className="flex justify-between text-xs text-gray-500 mb-1 px-1">
            <button className="hover:underline" onClick={() => onChange(options)}>
              全選
            </button>
            <button className="hover:underline" onClick={() => onChange([])}>
              清除
            </button>
          </div>
          {options.length === 0 ? (
            <p className="text-xs text-gray-400 px-1 py-1">無選項</p>
          ) : (
            options.map((opt) => (
              <label
                key={opt}
                className="flex items-center gap-2 px-1 py-1 text-sm text-gray-700 hover:bg-gray-50 rounded cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={selected.includes(opt)}
                  onChange={() => toggleValue(opt)}
                  className="rounded"
                />
                <span className="truncate">{opt}</span>
              </label>
            ))
          )}
        </div>
      )}
    </div>
  )
}
