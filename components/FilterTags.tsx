'use client'

interface FilterTagsProps {
  categories: string[]
  selectedCategory: string
  onCategoryChange: (category: string) => void
}

export default function FilterTags({
  categories,
  selectedCategory,
  onCategoryChange,
}: FilterTagsProps) {
  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => onCategoryChange('')}
        className={`px-3 py-1 rounded-full text-sm font-medium transition ${
          selectedCategory === ''
            ? 'bg-blue-500 text-white'
            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
        }`}
      >
        全部
      </button>
      {categories.map((category) => (
        <button
          key={category}
          onClick={() => onCategoryChange(category)}
          className={`px-3 py-1 rounded-full text-sm font-medium transition ${
            selectedCategory === category
              ? 'bg-blue-500 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          {category || '未分類'}
        </button>
      ))}
    </div>
  )
}
