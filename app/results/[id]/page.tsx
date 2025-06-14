// This is the server component
import ResultsClient from "./ResultsClient"

export default function ResultsPage({ params }: { params: { id: string } }) {
  return <ResultsClient examId={params.id} />
}
