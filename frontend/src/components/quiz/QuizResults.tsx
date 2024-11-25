import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import Confetti from 'react-confetti';
import Button from '@/components/ui/Button';
import type { RootState } from '@/store';

interface QuizResultsProps {
  onClose: () => void;
}

export default function QuizResults({ onClose }: QuizResultsProps) {
  const { t } = useTranslation();
  const { questions, score } = useSelector((state: RootState) => state.quiz);
  const percentage = (score / questions.length) * 100;
  const passed = percentage >= 70;

  return (
    <div className="text-center">
      {passed && <Confetti numberOfPieces={200} recycle={false} />}

      <div className="mb-8">
        <h3 className="text-2xl font-bold mb-4">
          {passed ? t('quiz.congratulations') : t('quiz.tryAgain')}
        </h3>
        <p className="text-lg text-gray-600">
          {t('quiz.score', { score, total: questions.length })}
        </p>
        <div className="mt-4 w-full bg-gray-200 rounded-full h-2">
          <div
            className={`h-2 rounded-full ${
              passed ? 'bg-green-500' : 'bg-red-500'
            }`}
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>

      <Button onClick={onClose}>
        {passed ? t('quiz.continue') : t('quiz.reviewAndTryAgain')}
      </Button>
    </div>
  );
}
