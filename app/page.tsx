"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Search, BookOpen, Leaf, Clock, Heart } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"

interface Student {
  id: string
  name: string
}

export default function LoginPage() {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")
  const [customName, setCustomName] = useState("")
  const [students, setStudents] = useState<Student[]>([])
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([])
  const [showDropdown, setShowDropdown] = useState(false)

  useEffect(() => {
    // Load student data
    const studentData: Student[] = [
      { id: "SV001", name: "Nguyễn Văn An" },
      { id: "SV002", name: "Trần Thị Bình" },
      { id: "SV003", name: "Phạm Minh Châu" },
      { id: "SV004", name: "Lê Hoàng Dũng" },
      { id: "SV005", name: "Hoàng Thị Em" },
      { id: "SV006", name: "Vũ Quang Huy" },
      { id: "SV007", name: "Đặng Thị Hương" },
      { id: "SV008", name: "Ngô Bá Khá" },
      { id: "SV009", name: "Đinh Thị Linh" },
      { id: "SV010", name: "Bùi Quốc Minh" },
    ]
    setStudents(studentData)
  }, [])

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredStudents([])
      setShowDropdown(false)
      return
    }

    const filtered = students.filter((student) => student.name.toLowerCase().includes(searchTerm.toLowerCase()))
    setFilteredStudents(filtered)
    setShowDropdown(filtered.length > 0)
  }, [searchTerm, students])

  const handleStudentSelect = (student: Student) => {
    setSearchTerm(student.name)
    setShowDropdown(false)
  }

  const handleStartPractice = () => {
    const studentName = searchTerm.trim() || customName.trim()
    if (studentName) {
      localStorage.setItem("studentName", studentName)
      router.push("/select-exam")
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 dark:from-green-900 dark:via-emerald-900 dark:to-teal-900 p-4">
      <div className="w-full max-w-md">
        {/* Header Section */}
        <div className="text-center mb-8 relative">
          <div className="absolute top-0 right-0">
            <ThemeToggle />
          </div>
          <Image
            src="/bechovang.webp"
            alt="Y Học Cổ Truyền Logo"
            width={64}
            height={64}
            className="mx-auto mb-4 rounded-full"
          />
          <h1 className="text-3xl font-bold text-green-800 dark:text-green-100 mb-2">Y Học Cổ Truyền</h1>
          <p className="text-green-600 dark:text-green-300">Nền tảng ôn thi Y học cổ truyền thông minh</p>
        </div>

        {/* Features Section */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="text-center">
            <div className="w-12 h-12 bg-green-100 dark:bg-green-800/50 rounded-full flex items-center justify-center mx-auto mb-2">
              <Leaf className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <p className="text-xs text-green-600 dark:text-green-300">Dược liệu</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-green-100 dark:bg-green-800/50 rounded-full flex items-center justify-center mx-auto mb-2">
              <Clock className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <p className="text-xs text-green-600 dark:text-green-300">Lý luận YHCT</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-green-100 dark:bg-green-800/50 rounded-full flex items-center justify-center mx-auto mb-2">
              <Heart className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <p className="text-xs text-green-600 dark:text-green-300">Chẩn đoán</p>
          </div>
        </div>

        {/* Login Card */}
        <Card className="shadow-xl border-0 bg-white/80 dark:bg-green-900/80 backdrop-blur">
          <CardHeader className="text-center">
            <CardTitle className="text-xl font-bold text-green-800 dark:text-green-100">Bắt đầu ôn tập</CardTitle>
            <p className="text-sm text-green-600 dark:text-green-300 mt-1">Nhập tên để bắt đầu hành trình học tập</p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <div className="relative">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-green-500" />
                  <Input
                    type="text"
                    placeholder="Tìm tên sinh viên..."
                    className="pl-9 border-2 focus:border-green-500 transition-colors"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onFocus={() => {
                      if (filteredStudents.length > 0) {
                        setShowDropdown(true)
                      }
                    }}
                  />
                </div>

                {showDropdown && (
                  <div className="absolute z-10 mt-1 w-full rounded-md border border-green-200 bg-white shadow-lg">
                    <ul className="max-h-60 overflow-auto py-1">
                      {filteredStudents.map((student) => (
                        <li
                          key={student.id}
                          className="cursor-pointer px-4 py-2 hover:bg-green-50 transition-colors"
                          onClick={() => handleStudentSelect(student)}
                        >
                          <div className="font-medium">{student.name}</div>
                          <div className="text-xs text-green-500">{student.id}</div>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center">
              <div className="flex-grow border-t border-green-300 dark:border-green-700"></div>
              <span className="mx-4 text-sm text-green-500 dark:text-green-300 bg-white dark:bg-green-900/80 px-2">HOẶC</span>
              <div className="flex-grow border-t border-green-300 dark:border-green-700"></div>
            </div>

            <div className="space-y-2">
              <Input
                type="text"
                placeholder="Nhập tên của bạn..."
                className="border-2 focus:border-green-500 transition-colors"
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
              />
            </div>

            <Button 
              className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 h-12 text-base font-medium shadow-lg transition-all duration-200 hover:shadow-xl" 
              onClick={handleStartPractice} 
              disabled={!searchTerm && !customName}
            >
              <BookOpen className="mr-2 h-5 w-5" />
              Bắt đầu ôn tập
            </Button>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-8 text-sm text-green-600 dark:text-green-300">
          <p>💡 Học Y học cổ truyền hiệu quả với phương pháp luyện tập trắc nghiệm</p>
        </div>
      </div>
    </div>
  )
}