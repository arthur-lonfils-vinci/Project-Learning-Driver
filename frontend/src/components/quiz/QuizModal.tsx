import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { X } from 'lucide-react';
import { fetchQuizQuestions } from '@/store/slices/roadRulesSlice';
import { resetQuiz } from '@/store/slices/quizSlice';
import QuizQuestion from './QuizQuestion';
import QuizResults from './QuizResults';
import type { AppDispatch, RootState } from '@/store';

interface QuizModalProps {
  ruleId: string;
  onClose: () => void;
}

export default function QuizModal({ ruleId, onClose }: QuizModalProps) {
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const { isComplete } = useSelector((state: RootState) => state.quiz);

  useEffect(() => {
    dispatch(fetchQuizQuestions(ruleId));
    return () => {
      dispatch(resetQuiz());
    };
  }, [dispatch, ruleId]);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" />
        
        <div className="relative w-full max-w-2xl rounded-lg bg-white p-6 shadow-xl">
          <button
            onClick={onClose}
            className="absolute right-4 top-4 text-gray-400 hover:text-gray-500"
          >
            <X className="h-6 w-6" />
          </button>

          <div className="mt-4">
            <h2 className="text-2xl font-bold text-belgian-black mb-6">
              {t('quiz.title')}
            </h2>

            {isComplete ? (
              <QuizResults onClose={onClose} />
            ) : (
              <QuizQuestion />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}