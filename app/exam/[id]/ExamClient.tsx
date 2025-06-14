"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { ChevronLeft, ChevronRight, Clock, ZoomIn, ZoomOut, Move } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch"

interface Question {
  id: number
  image: string
  answer: string
}

interface ExamData {
  examId: string
  title: string
  questions: Question[]
}

interface ExamClientProps {
  examId: string
}

export default function ExamClient({ examId }: ExamClientProps) {
  const router = useRouter()
  const [examData, setExamData] = useState<ExamData | null>(null)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [userAnswers, setUserAnswers] = useState<Record<number, string>>({})
  const [timeLeft, setTimeLeft] = useState(60 * 60) // 60 minutes in seconds
  const [showSubmitDialog, setShowSubmitDialog] = useState(false)
  const [showTimeUpDialog, setShowTimeUpDialog] = useState(false)
  const [scale, setScale] = useState(1)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const imageContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const studentName = localStorage.getItem("studentName")
    if (!studentName) {
      router.push("/")
      return
    }

    // In a real app, this would be fetched from an API
    const mockExamData: ExamData = {
      examId: `de${examId}`,
      title: `Đề Thi Số ${examId}`,
      questions: Array.from({ length: 50 }, (_, i) => ({
        id: i + 1,
        image: `/images/de${examId}/${i + 1}.jpg`,
        answer: ["A", "B", "C", "D", "E"][Math.floor(Math.random() * 5)],
      })),
    }
    setExamData(mockExamData)

    // Load saved answers from localStorage if they exist
    const savedAnswers = localStorage.getItem(`userAnswers_de${examId}`)
    if (savedAnswers) {
      setUserAnswers(JSON.parse(savedAnswers))
    }

    // Load saved time if it exists
    const savedTime = localStorage.getItem(`timeLeft_de${examId}`)
    if (savedTime) {
      setTimeLeft(Number.parseInt(savedTime))
    }
  }, [examId, router])

  useEffect(() => {
    // Save answers to localStorage whenever they change
    if (Object.keys(userAnswers).length > 0) {
      localStorage.setItem(`userAnswers_de${examId}`, JSON.stringify(userAnswers))
    }
  }, [userAnswers, examId])

  useEffect(() => {
    // Timer countdown
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        const newTime = prev - 1
        localStorage.setItem(`timeLeft_de${examId}`, newTime.toString())

        if (newTime <= 0) {
          clearInterval(timer)
          setShowTimeUpDialog(true)
          return 0
        }
        return newTime
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [examId])

  const handleAnswerSelect = (value: string) => {
    setUserAnswers((prev) => ({
      ...prev,
      [currentQuestion + 1]: value,
    }))
  }

  const goToNextQuestion = () => {
    if (examData && currentQuestion < examData.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    }
  }

  const goToPrevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
    }
  }

  const handleSubmit = () => {
    // Calculate results
    if (examData) {
      const results = {
        examId: examData.examId,
        title: examData.title,
        studentName: localStorage.getItem("studentName") || "Unknown",
        timeSpent: 60 * 60 - timeLeft,
        answers: userAnswers,
        correctAnswers: examData.questions.reduce((count, question) => {
          return userAnswers[question.id] === question.answer ? count + 1 : count
        }, 0),
        totalQuestions: examData.questions.length,
      }

      // Save results to localStorage
      localStorage.setItem(`results_de${examId}`, JSON.stringify(results))

      // Clear the timer
      localStorage.removeItem(`timeLeft_de${examId}`)

      // Navigate to results page
      router.push(`/results/${examId}`)
    }
  }

  const handleZoomIn = () => {
    setScale((prev) => Math.min(3, prev + 0.5))
  }

  const handleZoomOut = () => {
    setScale((prev) => Math.max(1, prev - 0.5))
    if (scale <= 1) {
      setPosition({ x: 0, y: 0 })
    }
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    if (scale > 1) {
      setIsDragging(true)
      setDragStart({
        x: e.clientX - position.x,
        y: e.clientY - position.y
      })
    }
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && scale > 1) {
      const newX = e.clientX - dragStart.x
      const newY = e.clientY - dragStart.y
      setPosition({ x: newX, y: newY })
    }
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const handleMouseLeave = () => {
    setIsDragging(false)
    if (scale <= 1) {
      setPosition({ x: 0, y: 0 })
    }
  }

  if (!examData) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Loading exam data...</p>
      </div>
    )
  }

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`
  }

  const answeredCount = Object.keys(userAnswers).length
  const progressPercentage = (answeredCount / examData.questions.length) * 100

  return (
    <div className="flex min-h-screen flex-col bg-gray-50 p-4">
      <div className="mx-auto w-full max-w-4xl">
        <Card className="mb-4">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle>{examData.title}</CardTitle>
            <div className="flex items-center gap-2 rounded-full bg-gray-100 px-3 py-1">
              <Clock className="h-4 w-4 text-gray-600" />
              <span className={`font-medium ${timeLeft < 300 ? "text-red-500" : "text-gray-600"}`}>
                {formatTime(timeLeft)}
              </span>
            </div>
          </CardHeader>
          <CardContent className="pb-2">
            <div className="mb-2 flex justify-between text-sm">
              <span>
                Câu hỏi {currentQuestion + 1} / {examData.questions.length}
              </span>
              <span>
                Đã trả lời: {answeredCount} / {examData.questions.length}
              </span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
          </CardContent>
        </Card>

        <Card className="mb-4">
          <CardContent className="p-4 pt-6">
            <div className="mb-6 overflow-hidden rounded-lg border">
              <div className="relative">
                <TransformWrapper
                  initialScale={1}
                  minScale={1}
                  maxScale={3}
                  centerOnInit
                  wheel={{ step: 0.1 }}
                >
                  {({ zoomIn, zoomOut, resetTransform }) => (
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
                        <div className="relative aspect-[4/3] w-full">
                          <img
                            src={examData.questions[currentQuestion].image}
                            alt={`Câu hỏi ${currentQuestion + 1}`}
                            className="w-full h-full object-contain"
                          />
                        </div>
                      </TransformComponent>
                    </>
                  )}
                </TransformWrapper>
              </div>
            </div>

            <RadioGroup
              value={userAnswers[currentQuestion + 1] || ""}
              onValueChange={handleAnswerSelect}
              className="grid grid-cols-2 gap-3 sm:grid-cols-3"
            >
              {["A", "B", "C", "D", "E", "F"].map((option) => (
                <div
                  key={option}
                  className={`relative flex cursor-pointer items-center justify-center rounded-lg border-2 p-4 transition-all hover:bg-gray-50 ${
                    userAnswers[currentQuestion + 1] === option
                      ? "border-blue-500 bg-blue-50 shadow-sm"
                      : "border-gray-200"
                  }`}
                  onClick={() => handleAnswerSelect(option)}
                >
                  <RadioGroupItem
                    value={option}
                    id={`option-${option}`}
                    className="peer sr-only"
                  />
                  <div className="flex items-center justify-center">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-full border-2 text-lg font-semibold transition-colors ${
                      userAnswers[currentQuestion + 1] === option
                        ? "border-blue-500 bg-blue-500 text-white"
                        : "border-gray-300 text-gray-700"
                    }`}>
                      {option}
                    </div>
                  </div>
                  {userAnswers[currentQuestion + 1] === option && (
                    <div className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-blue-500 text-xs text-white">
                      ✓
                    </div>
                  )}
                </div>
              ))}
            </RadioGroup>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={goToPrevQuestion} disabled={currentQuestion === 0}>
              <ChevronLeft className="mr-2 h-4 w-4" /> Câu trước
            </Button>
            <Button
              variant="outline"
              onClick={() => setShowSubmitDialog(true)}
              className="bg-green-500 text-white hover:bg-green-600"
            >
              Hoàn tất
            </Button>
            <Button
              variant="outline"
              onClick={goToNextQuestion}
              disabled={currentQuestion === examData.questions.length - 1}
            >
              Câu sau <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>

        <div className="grid grid-cols-5 gap-2 sm:grid-cols-10">
          {examData.questions.map((_, index) => (
            <Button
              key={index}
              variant={userAnswers[index + 1] ? "default" : "outline"}
              className={`h-10 w-10 p-0 ${currentQuestion === index ? "ring-2 ring-blue-500" : ""} ${
                userAnswers[index + 1] ? "bg-blue-500 text-white hover:bg-blue-600" : ""
              }`}
              onClick={() => setCurrentQuestion(index)}
            >
              {index + 1}
            </Button>
          ))}
        </div>
      </div>

      <AlertDialog open={showSubmitDialog} onOpenChange={setShowSubmitDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Nộp bài thi?</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn đã trả lời {answeredCount} trên {examData.questions.length} câu hỏi. Bạn có chắc chắn muốn nộp bài?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction onClick={handleSubmit}>Nộp bài</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={showTimeUpDialog} onOpenChange={setShowTimeUpDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hết thời gian!</AlertDialogTitle>
            <AlertDialogDescription>
              Thời gian làm bài đã kết thúc. Bài làm của bạn sẽ được nộp tự động.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={handleSubmit}>Xem kết quả</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
} 