"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, BookOpen, Clock, Target, AlertTriangle, Info, Loader2 } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"

// Interface for the data structure expected from deX.json files
interface FetchedExamData {
  examId: string;
  title: string;
  description: string;
  // questions: any[]; // We might use questions.length later if needed
}

// Interface for the data structure used to render exam cards
interface ExamCardDisplayData {
  id: number; // Numeric ID, e.g., 1 for de1.json
  examIdToDisplay: string; // examId from JSON, or a placeholder
  titleToDisplay: string; // title from JSON, or a placeholder
  descriptionToDisplay: string; // description from JSON, or a placeholder
  isLoading: boolean; // True while attempting to fetch this specific exam
  isAvailable: boolean; // True if successfully loaded, false otherwise
}

const MAX_EXAMS_TO_CHECK = 10; // Check for de1.json up to de10.json

export default function SelectPracticePage() {
  const router = useRouter()
  const [studentName, setStudentName] = useState("")
  const [practiceSets, setPracticeSets] = useState<ExamCardDisplayData[]>([])

  useEffect(() => {
    const name = localStorage.getItem("studentName")
    if (!name) {
      router.push("/")
      return
    }
    setStudentName(name)

    const loadAllExamData = async () => {
      const examIdsToTry = Array.from({ length: MAX_EXAMS_TO_CHECK }, (_, i) => i + 1);

      // Initial placeholder state
      const initialPlaceholderSets: ExamCardDisplayData[] = examIdsToTry.map(id => ({
        id,
        examIdToDisplay: `de${id}`,
        titleToDisplay: `Đề ${id}`,
        descriptionToDisplay: "Đang kiểm tra trạng thái...",
        isLoading: true,
        isAvailable: false,
      }));
      setPracticeSets(initialPlaceholderSets);

      const settledPromises = await Promise.allSettled(
        examIdsToTry.map(async (id) => {
          const response = await fetch(`/data/de${id}.json`);
          if (!response.ok) {
            throw new Error(`File de${id}.json not found or not accessible`);
          }
          const data: FetchedExamData = await response.json();
          return { id, ...data }; // Return id along with fetched data
        })
      );

      const updatedSets = initialPlaceholderSets.map((placeholderSet, index) => {
        const result = settledPromises[index];
        if (result.status === "fulfilled") {
          const loadedData = result.value;
          return {
            id: placeholderSet.id, // Ensure 'id' is the numeric id
            examIdToDisplay: loadedData.examId,
            titleToDisplay: loadedData.title,
            descriptionToDisplay: loadedData.description,
            isLoading: false,
            isAvailable: true,
          };
        } else {
          // Fetch failed for this ID (e.g., file not found)
          return {
            ...placeholderSet,
            descriptionToDisplay: "Dữ liệu đề thi không tồn tại.",
            isLoading: false,
            isAvailable: false,
          };
        }
      });
      setPracticeSets(updatedSets);
    };

    loadAllExamData();
  }, [router]);

  const handleSelectPractice = (practice: ExamCardDisplayData) => {
    if (!practice.isAvailable || practice.isLoading) {
      // This case should ideally not be met if button is properly disabled
      alert("Đề luyện tập này hiện không có sẵn hoặc đang tải.");
      return;
    }
    localStorage.setItem("selectedPractice", practice.id.toString()) // Use numeric id
    router.push(`/practice/${practice.id}`)
  }

  // getDifficultyColor is no longer used as difficulty is not displayed per card
  // const getDifficultyColor = (difficulty: string) => { ... }

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-950 p-4">
      <div className="mx-auto w-full max-w-6xl">
        <Card className="mb-6 shadow-lg bg-white dark:bg-gray-800/30">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white relative">
            <CardTitle className="text-center text-2xl flex items-center justify-center gap-2">
              <Image src="/bechovang.webp" alt="Logo" width={32} height={32} className="rounded-full" />
              Nền tảng luyện tập toán học
            </CardTitle>
            <div className="absolute top-1/2 right-4 -translate-y-1/2">
              <ThemeToggle />
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="text-center">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-2">
                Xin chào, {studentName}! 👋
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Chọn một bộ đề luyện tập để bắt đầu hành trình học toán của bạn
              </p>
              <div className="flex justify-center items-center gap-6 text-sm text-gray-500 dark:text-gray-400">
                <div className="flex items-center gap-1">
                  <Target className="h-4 w-4" />
                  <span>Feedback tức thì</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>Không giới hạn thời gian</span>
                </div>
                <div className="flex items-center gap-1">
                  <BookOpen className="h-4 w-4" />
                  <span>Giải thích chi tiết</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {practiceSets.map((practice) => (
            <Card
              key={practice.id}
              className={`transition-all duration-300 border-2 flex flex-col ${
                practice.isAvailable && !practice.isLoading
                  ? 'bg-white dark:bg-gray-800/50 hover:shadow-xl hover:scale-105 hover:bg-blue-50 dark:hover:bg-gray-800 hover:border-blue-200 dark:hover:border-blue-600 cursor-pointer'
                  : 'opacity-70 bg-gray-100 dark:bg-gray-800/50 cursor-not-allowed'
              }`}
              onClick={() => practice.isAvailable && !practice.isLoading && handleSelectPractice(practice)}
            >
              <CardContent className="flex flex-col h-full p-6">
                <div className="flex items-start justify-between mb-4">
                  {practice.isAvailable ? 
                    <FileText className="h-8 w-8 text-blue-500 flex-shrink-0" /> : 
                    <AlertTriangle className="h-8 w-8 text-orange-400 flex-shrink-0" />
                  }
                </div>
                
                {practice.isLoading ? (
                  <div className="flex-grow flex flex-col items-center justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
                    <p className="text-sm text-gray-500 mt-2">{practice.titleToDisplay}</p>
                    <p className="text-xs text-gray-400 mt-1">{practice.descriptionToDisplay}</p>
                  </div>
                ) : (
                  <>
                    <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-1">
                      {practice.titleToDisplay}
                    </h3>
                    {practice.isAvailable && (
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-2 flex items-center">
                        <Info size={12} className="mr-1 text-gray-400"/> ID: {practice.examIdToDisplay}
                      </p>
                    )}
                    <p className={`text-gray-600 dark:text-gray-400 mb-3 flex-grow text-sm ${!practice.isAvailable ? 'italic' : ''}`}>
                      {practice.descriptionToDisplay}
                    </p>
                  </>
                )}
                
                <Button 
                  className={`mt-auto w-full ${
                  practice.isAvailable && !practice.isLoading
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700'
                    : 'bg-gray-300 dark:bg-gray-700 cursor-not-allowed'
                  }`}
                  disabled={!practice.isAvailable || practice.isLoading}
                >
                  {practice.isLoading ? (
                    <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Đang tải...</>
                  ) : practice.isAvailable ? (
                    'Bắt đầu luyện tập'
                  ) : (
                    'Không có sẵn'
                  )}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            💡 Mẹo: Hãy thực hành thường xuyên để cải thiện kỹ năng toán học của bạn!
          </p>
        </div>
      </div>
    </div>
  )
}
