import { useState } from 'react';
import { BookOpen } from 'lucide-react';
import Button from '@/components/ui/Button';
import QuizModal from './QuizModal';

interface QuizButtonProps {
  ruleId: string;
}

export default function QuizButton({ ruleId }: QuizButtonProps) {
  const [showQuiz, setShowQuiz] = useState(false);

  return (
    <>
      <Button
        onClick={() => setShowQuiz(true)}
        variant="outline"
        className="mt-4"
      >
        <BookOpen className="w-4 h-4 mr-2" />
        Take Quiz
      </Button>

      {showQuiz && (
        <QuizModal ruleId={ruleId} onClose={() => setShowQuiz(false)} />
      )}
    </>
  );
}
