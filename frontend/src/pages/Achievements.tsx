import { useEffect, useState } from 'react';
import { Trophy } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { fetchAchievements } from '@/store/slices/achievementsSlice';
import { RootState, useAppDispatch, useAppSelector } from '@/store';

export default function Achievements() {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { achievements, isLoading } = useAppSelector(
    (state: RootState) => state.achievements
  );
  const [loadingTimeout, setLoadingTimeout] = useState(false);

  useEffect(() => {
    dispatch(fetchAchievements());

    const timer = setTimeout(() => {
      if (isLoading) {
        setLoadingTimeout(true);
      }
    }, 5000);

    return () => clearTimeout(timer);
  }, [dispatch]);

  useEffect(() => {
    if (!isLoading) {
      setLoadingTimeout(false);
    }
  }, [isLoading]);

  if (isLoading && !loadingTimeout) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-belgian-yellow" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-belgian-black mb-4">
          {t('achievements.title')}
        </h1>
        <p className="text-xl text-gray-600">
          Track your progress and unlock achievements
        </p>
      </div>

      {achievements.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {achievements.map((achievement) => (
            <div
              key={achievement.id}
              className="bg-white p-6 rounded-lg shadow-md"
            >
              <div className="flex items-center justify-between mb-4">
                <Trophy className="h-8 w-8 text-belgian-yellow" />
                <span className="text-sm text-gray-500">
                  {new Date(achievement.earnedAt).toLocaleDateString()}
                </span>
              </div>
              <h3 className="text-xl font-semibold text-belgian-black mb-2">
                {achievement.title.en}
              </h3>
              <p className="text-gray-600 mb-4">{achievement.description.en}</p>
              {achievement.progress !== undefined && (
                <div className="mt-4">
                  <div className="flex justify-between text-sm text-gray-500 mb-1">
                    <span>Progress</span>
                    <span>
                      {achievement.progress} / {achievement.maxProgress}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-belgian-yellow rounded-full h-2"
                      style={{
                        width: `${
                          achievement.maxProgress != undefined
                            ? (achievement.progress / achievement.maxProgress) *
                              100
                            : '50'
                        }%`,
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center">
          <Trophy className="h-16 w-16 text-belgian-yellow mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-belgian-black mb-2">
            {t('achievements.noAchievements')}
          </h3>
          <p className="text-gray-600">{t('achievements.startDriving')}</p>
        </div>
      )}
    </div>
  );
}
