export default function AuthErrorPage() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center space-y-3">
        <h1 className="text-xl font-bold text-gray-900">無法登入</h1>
        <p className="text-gray-600">
          這個系統僅開放 <span className="font-mono">tsagroup.com.tw</span> 網域的 Google 帳號使用。
        </p>
        <a href="/api/auth/signin" className="text-blue-600 hover:underline inline-block mt-2">
          換一個帳號登入
        </a>
      </div>
    </div>
  )
}
