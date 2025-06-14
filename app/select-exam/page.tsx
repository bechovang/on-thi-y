"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Leaf, ScrollText, Hourglass, AlertTriangle, Info, Loader2, BookHeart } from "lucide-react" // Added BookHeart, Leaf, ScrollText, Hourglass
import { ThemeToggle } from "@/components/theme-toggle"

// Interface for the data structure expected from deX.json files
interface FetchedExamData {
  examId: string;
  title: string;
  description: string;
}

// Interface for the data structure used to render exam cards
interface ExamCardDisplayData {
  id: number; 
  examIdToDisplay: string; 
  titleToDisplay: string; 
  descriptionToDisplay: string; 
  isLoading: boolean; 
  isAvailable: boolean; 
}

const MAX_EXAMS_TO_CHECK = 10; 

export default function SelectPracticePage() {
  const router = useRouter()
  const [studentName, setStudentName] = useState("")
  const [practiceSets, setPracticeSets] = useState<ExamCardDisplayData[]>([])

  useEffect(() => {
    const name = localStorage.getItem("studentName")
    if (!name) {
      router.push("/") // Redirect to login if no name
      return
    }
    setStudentName(name)

    const loadAllExamData = async () => {
      const examIdsToTry = Array.from({ length: MAX_EXAMS_TO_CHECK }, (_, i) => i + 1);

      const initialPlaceholderSets: ExamCardDisplayData[] = examIdsToTry.map(id => ({
        id,
        examIdToDisplay: `biquyet${id}`, // Thematic ID prefix
        titleToDisplay: `Bí Quyết ${id}`, // Thematic title
        descriptionToDisplay: "Đang tìm dược liệu...", // Thematic loading text
        isLoading: true,
        isAvailable: false,
      }));
      setPracticeSets(initialPlaceholderSets);

      const settledPromises = await Promise.allSettled(
        examIdsToTry.map(async (id) => {
          const response = await fetch(`/data/de${id}.json`); // Still fetching deX.json
          if (!response.ok) {
            throw new Error(`File de${id}.json not found or not accessible`);
          }
          const data: FetchedExamData = await response.json();
          return { id, ...data }; 
        })
      );

      const updatedSets = initialPlaceholderSets.map((placeholderSet, index) => {
        const result = settledPromises[index];
        if (result.status === "fulfilled") {
          const loadedData = result.value;
          return {
            id: placeholderSet.id,
            examIdToDisplay: loadedData.examId,
            titleToDisplay: loadedData.title, // Use title from JSON
            descriptionToDisplay: loadedData.description, // Use description from JSON
            isLoading: false,
            isAvailable: true,
          };
        } else {
          return {
            ...placeholderSet,
            descriptionToDisplay: "Bí kíp này chưa được ghi chép.", // Thematic unavailable text
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
      alert("Bí kíp này hiện không thể lĩnh hội hoặc đang được chuẩn bị.");
      return;
    }
    localStorage.setItem("selectedPractice", practice.id.toString()) 
    router.push(`/practice/${practice.id}`)
  }

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-green-50 via-emerald-50 to-teal-100 dark:from-green-900 dark:via-emerald-950 dark:to-teal-950 p-4">
      <div className="mx-auto w-full max-w-6xl">
        <Card className="mb-6 shadow-lg bg-lime-50/70 dark:bg-green-800/30 backdrop-blur-sm border-green-200 dark:border-green-700">
          <CardHeader className="bg-gradient-to-r from-green-600 to-emerald-700 text-white relative">
            <CardTitle className="text-center text-2xl flex items-center justify-center gap-2">
              <Image src="/bechovang.webp" alt="Logo Y Học" width={32} height={32} className="rounded-full" /> {/* Consider a thematic logo */}
              Y Quán Khai Tâm - Luyện Trí Cổ Truyền
            </CardTitle>
            <div className="absolute top-1/2 right-4 -translate-y-1/2">
              <ThemeToggle />
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="text-center">
              <h2 className="text-xl font-semibold text-green-800 dark:text-green-100 mb-2">
                Kính chào đạo hữu {studentName}! 🙏
              </h2>
              <p className="text-green-700 dark:text-green-300 mb-4">
                Mời đạo hữu chọn một bí kíp để bắt đầu hành trình tu dưỡng trí tuệ.
              </p>
              <div className="flex flex-wrap justify-center items-center gap-4 md:gap-6 text-sm text-green-600 dark:text-green-400">
                <div className="flex items-center gap-1">
                  <Leaf className="h-4 w-4 text-green-500" />
                  <span>Linh Dược Tức Thời</span>
                </div>
                <div className="flex items-center gap-1">
                  <Hourglass className="h-4 w-4 text-amber-600" /> {/* Hourglass for time */}
                  <span>Tu Luyện Tự Tại</span>
                </div>
                <div className="flex items-center gap-1">
                  <ScrollText className="h-4 w-4 text-yellow-700" /> {/* Scroll for knowledge */}
                  <span>Mật Tịch Chân Truyền</span>
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
                  ? 'bg-white dark:bg-green-800/60 border-green-200 dark:border-green-700 hover:shadow-xl hover:scale-105 hover:bg-green-50 dark:hover:bg-green-700/80 hover:border-green-400 dark:hover:border-green-500 cursor-pointer'
                  : 'opacity-70 bg-stone-100 dark:bg-stone-800/50 border-stone-300 dark:border-stone-700 cursor-not-allowed'
              }`}
              onClick={() => practice.isAvailable && !practice.isLoading && handleSelectPractice(practice)}
            >
              <CardContent className="flex flex-col h-full p-6">
                <div className="flex items-start justify-between mb-4">
                  {practice.isAvailable ? 
                    <BookHeart className="h-8 w-8 text-green-500 flex-shrink-0" /> : // BookHeart for available 'prescriptions'
                    <AlertTriangle className="h-8 w-8 text-amber-500 flex-shrink-0" />
                  }
                </div>
                
                {practice.isLoading ? (
                  <div className="flex-grow flex flex-col items-center justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-green-600" />
                    <p className="text-sm text-green-700 dark:text-green-300 mt-2">{practice.titleToDisplay}</p>
                    <p className="text-xs text-green-500 dark:text-green-400 mt-1">{practice.descriptionToDisplay}</p>
                  </div>
                ) : (
                  <>
                    <h3 className="text-xl font-semibold text-green-800 dark:text-green-100 mb-1">
                      {practice.titleToDisplay}
                    </h3>
                    {practice.isAvailable && (
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-2 flex items-center">
                        <Info size={12} className="mr-1 text-gray-400"/> Mã bí kíp: {practice.examIdToDisplay}
                      </p>
                    )}
                    <p className={`text-green-700 dark:text-green-300 mb-3 flex-grow text-sm ${!practice.isAvailable ? 'italic' : ''}`}>
                      {practice.descriptionToDisplay}
                    </p>
                  </>
                )}
                
                <Button 
                  className={`mt-auto w-full font-medium ${
                  practice.isAvailable && !practice.isLoading
                    ? 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white'
                    : 'bg-stone-300 dark:bg-stone-600 text-stone-500 dark:text-stone-400 cursor-not-allowed'
                  }`}
                  disabled={!practice.isAvailable || practice.isLoading}
                >
                  {practice.isLoading ? (
                    <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Đang chuẩn bị...</>
                  ) : practice.isAvailable ? (
                    'Lĩnh Hội Bí Kíp'
                  ) : (
                    'Chưa Sẵn Sàng'
                  )}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-8 text-center">
          <p className="text-sm text-green-600 dark:text-green-400">
            🌿 Lời khuyên: Kiên trì tu dưỡng, trí tuệ sẽ khai thông, tâm thân an lạc.
          </p>
        </div>
      </div>
    </div>
  )
}