export interface Contract {
  id: string
  用印日期: string
  合約名稱: string
  合約對象: string
  合約期間: string
  合約申請人: string
  歸檔日期: string
  備註: string
  合約審核單編號: string
  合約編碼: string
  性質: string
  檔案連結?: string
}

export interface SearchFilters {
  query: string
  category: string
  sortBy: 'date' | 'name' | 'applicant'
  sortOrder: 'asc' | 'desc'
}
