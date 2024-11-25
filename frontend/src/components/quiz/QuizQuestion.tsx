import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { selectOption, nextQuestion } from '@/store/slices/quizSlice';
import Button from '@/components/ui/Button';
import type { RootState } from '@/store';

export default function QuizQuestion() {
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const { questions, currentQuestionIndex, selectedOption, showExplanation, isLoading } = useSelector(
    (state: RootState) => state.quiz
  );

  if (isLoading || !questions.length) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-belgian-yellow" />
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  if (!currentQuestion) {
    return (
      <div className="text-center p-8 text-gray-500">
        {t('quiz.noQuestions')}
      </div>
    );
  }

  const translation = currentQuestion.translations[i18n.language as keyof typeof currentQuestion.translations] || 
                     currentQuestion.translations['en'];

  const handleOptionSelect = (optionIndex: number) => {
    if (selectedOption === null) {
      dispatch(selectOption(optionIndex));
    }
  };

  const handleNext = () => {
    dispatch(nextQuestion());
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-belgian-black mb-4">
          {translation.question}
        </h3>
        <div className="space-y-2">
          {translation.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleOptionSelect(index)}
              disabled={selectedOption !== null}
              className={`w-full p-4 text-left rounded-lg border transition-colors ${
                selectedOption === null
                  ? 'border-gray-200 hover:border-belgian-yellow'
                  : selectedOption === index
                    ? index === currentQuestion.correctOption
                      ? 'border-green-500 bg-green-50'
                      : 'border-red-500 bg-red-50'
                    : index === currentQuestion.correctOption
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-200 bg-gray-50'
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      {showExplanation && (
        <div className="p-4 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600">{translation.explanation}</p>
        </div>
      )}

      {selectedOption !== null && (
        <div className="flex justify-end">
          <Button onClick={handleNext}>
            {currentQuestionIndex < questions.length - 1
              ? t('quiz.nextQuestion')
              : t('quiz.finish')}
          </Button>
        </div>
      )}

      <div className="text-sm text-gray-500 text-center">
        {t('quiz.progress', {
          current: currentQuestionIndex + 1,
          total: questions.length,
        })}
      </div>
    </div>
  );
}