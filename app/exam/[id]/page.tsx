import ExamClient from "./ExamClient"

export default function ExamPage({ params }: { params: { id: string } }) {
  return <ExamClient examId={params.id} />
}
