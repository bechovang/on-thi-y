"use client"

import { useRouter } from "next/navigation"

export default function LoginPage() {
  const router = useRouter()

  const handleStart = () => {
    // Sử dụng window.location để đảm bảo chuyển trang hoạt động trên Netlify
    window.location.href = "/select-exam"
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-400 via-green-500 to-green-600">
      <div className="text-center p-8 rounded-2xl bg-white/10 backdrop-blur-lg shadow-2xl transform hover:scale-105 transition-all duration-300">
        <h1 className="text-4xl font-bold mb-8 text-white drop-shadow-lg">
          Chào mừng đến với website ôn thi Y
        </h1>
        <p className="text-white/90 mb-8 text-lg">
          Hãy bắt đầu hành trình học tập của bạn ngay hôm nay
        </p>
        <button
          onClick={handleStart}
          className="bg-white text-green-600 hover:bg-green-50 font-bold py-4 px-12 rounded-full text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
        >
          Bắt đầu
        </button>
      </div>
    </div>
  )
}