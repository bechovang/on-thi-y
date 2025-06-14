"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, Clock, Download, Home, RefreshCw, XCircle, Eye, ZoomIn, ZoomOut } from "lucide-react"
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { ThemeToggle } from "@/components/theme-toggle"

interface ExamResults {
  examId: string
  title: string
  studentName: string
  timeSpent: number
  answers: Record<number, string>
  correctAnswers: number
  totalQuestions: number
  questions: Array<{
    id: number
    image: string
    answer: string
  }>
}

interface ResultsClientProps {
  examId: string
}

export default function ResultsClient({ examId }: ResultsClientProps) {
  const router = useRouter()
  const [results, setResults] = useState<ExamResults | null>(null)
  const [selectedQuestion, setSelectedQuestion] = useState<number | null>(null)
  const [showImageDialog, setShowImageDialog] = useState(false)

  useEffect(() => {
    const resultsData = localStorage.getItem(`results_de${examId}`)
    if (!resultsData) {
      router.push("/")
      return
    }
    const parsedData = JSON.parse(resultsData)
    // Ensure questions array exists
    if (!parsedData.questions) {
      parsedData.questions = Array.from({ length: parsedData.totalQuestions }, (_, i) => ({
        id: i + 1,
        image: `/images/de${examId}/${i + 1}.jpg`,
        answer: "A" // Default answer
      }))
    }
    setResults(parsedData)
  }, [examId, router])

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes} phút ${remainingSeconds} giây`
  }

  const handleRetakeExam = () => {
    localStorage.removeItem(`userAnswers_de${examId}`)
    localStorage.removeItem(`timeLeft_de${examId}`)
    localStorage.removeItem(`results_de${examId}`)
    router.push(`/exam/${examId}`)
  }

  const handleSelectNewExam = () => {
    router.push("/select-exam")
  }

  const handleDownloadResults = () => {
    if (!results) return

    const resultsText = `
Kết quả bài thi: ${results.title}
Thí sinh: ${results.studentName}
Thời gian làm bài: ${formatTime(results.timeSpent)}
Điểm số: ${results.correctAnswers}/${results.totalQuestions}
Tỉ lệ đúng: ${((results.correctAnswers / results.totalQuestions) * 100).toFixed(2)}%

Chi tiết câu trả lời:
${Object.entries(results.answers)
  .map(([questionId, answer]) => {
    const question = results.questions[Number(questionId) - 1]
    return `Câu ${questionId}: ${answer} (Đáp án của bạn) - ${question.answer} (Đáp án đúng)`
  })
  .join("\n")}
`

    const blob = new Blob([resultsText], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `ket-qua-${results.examId}-${results.studentName.replace(/\s+/g, "-")}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handleViewQuestion = (questionId: number) => {
    setSelectedQuestion(questionId)
    setShowImageDialog(true)
  }

  if (!results) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Loading results...</p>
      </div>
    )
  }

  const score = (results.correctAnswers / results.totalQuestions) * 100
  let scoreColor = "text-red-500"
  if (score >= 80) {
    scoreColor = "text-green-500"
  } else if (score >= 60) {
    scoreColor = "text-yellow-500"
  } else if (score >= 40) {
    scoreColor = "text-orange-500"
  }

  return (
    <div className="flex min-h-screen flex-col bg-gray-50 p-4">
      <div className="mx-auto w-full max-w-4xl">
        <Card className="mb-6">
          <CardHeader className="text-center relative">
            <CardTitle className="text-2xl">Kết quả bài thi</CardTitle>
            <div className="absolute top-1/2 right-4 -translate-y-1/2">
              <ThemeToggle />
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="rounded-lg bg-gray-100 p-6 text-center">
              <h2 className="mb-2 text-xl font-medium">{results.title}</h2>
              <p className="mb-4 text-gray-600">Thí sinh: {results.studentName}</p>
              <div className="mb-4 flex items-center justify-center gap-8">
                <div className="flex flex-col items-center">
                  <div className={`text-4xl font-bold ${scoreColor}`}>
                    {results.correctAnswers}/{results.totalQuestions}
                  </div>
                  <p className="text-sm text-gray-500">Số câu đúng</p>
                </div>
                <div className="flex flex-col items-center">
                  <div className="text-4xl font-bold text-blue-500">
                    {((results.correctAnswers / results.totalQuestions) * 10).toFixed(1)}
                  </div>
                  <p className="text-sm text-gray-500">Điểm số</p>
                </div>
              </div>
              <div className="flex items-center justify-center gap-2">
                <Clock className="h-5 w-5 text-gray-500" />
                <span className="text-gray-600">Thời gian hoàn thành: {formatTime(results.timeSpent)}</span>
              </div>
            </div>

            <div className="rounded-lg border p-4">
              <h3 className="mb-4 text-lg font-medium">Chi tiết câu trả lời</h3>
              <div className="max-h-96 overflow-y-auto">
                <table className="w-full">
                  <thead className="border-b">
                    <tr>
                      <th className="p-2 text-left">Câu hỏi</th>
                      <th className="p-2 text-left">Đáp án của bạn</th>
                      <th className="p-2 text-left">Đáp án đúng</th>
                      <th className="p-2 text-left">Kết quả</th>
                      <th className="p-2 text-left">Xem đề</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Array.from({ length: results?.totalQuestions || 0 }, (_, index) => {
                      const questionId = index + 1
                      const userAnswer = results?.answers[questionId] || "-"
                      const correctAnswer = results?.questions?.[index]?.answer || "-"
                      const isCorrect = userAnswer === correctAnswer
                      return (
                        <tr key={questionId} className="border-b last:border-0">
                          <td className="p-2">Câu {questionId}</td>
                          <td className="p-2">{userAnswer}</td>
                          <td className="p-2">{correctAnswer}</td>
                          <td className="p-2">
                            {isCorrect ? (
                              <div className="flex items-center text-green-500">
                                <CheckCircle className="mr-1 h-4 w-4" /> Đúng
                              </div>
                            ) : (
                              <div className="flex items-center text-red-500">
                                <XCircle className="mr-1 h-4 w-4" /> Sai
                              </div>
                            )}
                          </td>
                          <td className="p-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleViewQuestion(questionId)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-wrap justify-center gap-3">
            <Button variant="outline" className="flex items-center gap-2" onClick={handleDownloadResults}>
              <Download className="h-4 w-4" />
              Tải kết quả
            </Button>
            <Button variant="outline" className="flex items-center gap-2" onClick={handleRetakeExam}>
              <RefreshCw className="h-4 w-4" />
              Làm lại
            </Button>
            <Button variant="outline" className="flex items-center gap-2" onClick={handleSelectNewExam}>
              <Home className="h-4 w-4" />
              Chọn đề khác
            </Button>
          </CardFooter>
        </Card>
      </div>

      <Dialog open={showImageDialog} onOpenChange={setShowImageDialog}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Câu hỏi {selectedQuestion}</DialogTitle>
          </DialogHeader>
          {selectedQuestion && results?.questions?.[selectedQuestion - 1] && (
            <div className="relative aspect-[4/3] w-full">
              <TransformWrapper
                initialScale={1}
                minScale={1}
                maxScale={3}
                centerOnInit
                wheel={{ step: 0.1 }}
              >
                {({ zoomIn, zoomOut }) => (
                  <>
                    <div className="absolute right-2 top-2 z-10 flex gap-2">
                      <Button
                        variant="secondary"
                        size="icon"
                        onClick={() => zoomIn()}
                        className="h-8 w-8 bg-white/80 hover:bg-white"
                      >
                        <ZoomIn className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="secondary"
                        size="icon"
                        onClick={() => zoomOut()}
                        className="h-8 w-8 bg-white/80 hover:bg-white"
                      >
                        <ZoomOut className="h-4 w-4" />
                      </Button>
                    </div>
                    <TransformComponent wrapperClass="w-full" contentClass="w-full">
                      <img
                        src={results.questions[selectedQuestion - 1].image}
                        alt={`Câu hỏi ${selectedQuestion}`}
                        className="w-full h-full object-contain"
                      />
                    </TransformComponent>
                  </>
                )}
              </TransformWrapper>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
} 