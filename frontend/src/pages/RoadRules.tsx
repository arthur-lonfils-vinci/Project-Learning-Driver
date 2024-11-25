import { useEffect } from 'react';
import { Book, ChevronRight, Globe } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '@/store'; // Import typed hooks
import {
  fetchCategories,
  fetchRulesByCategory,
} from '@/store/slices/roadRulesSlice';
import type { Language } from '@/types/i18n';
import type { RoadRuleCategory } from '@/types/roadRules';
import i18n from '@/i18n';
import { useNavigate } from 'react-router-dom';

export default function RoadRules() {
  const { t } = useTranslation();
  const dispatch = useAppDispatch(); // Typed dispatch
  const { categories, selectedCategory, isLoading, error } = useAppSelector(
    (state) => state.roadRules // Typed selector
  );
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  useEffect(() => {
    if (selectedCategory) {
      dispatch(fetchRulesByCategory(selectedCategory));
    }
  }, [dispatch, selectedCategory]);

  const handleCategorySelect = (categoryId: string) => {
    const selectedCategory = categories.find((cat) => cat.id === categoryId);
    navigate(`/rulesContent/${categoryId}`, {
      state: { category: selectedCategory },
    });
  };

  const changeLanguage = (language: Language) => {
    i18n.changeLanguage(language);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-belgian-yellow" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex justify-around items-center text-center mb-12">
        <div>
          <h1 className="text-4xl font-bold text-belgian-black mb-4">
            {t('roadRules.title')}
          </h1>
          <p className="text-xl text-gray-600">{t('roadRules.categories')}</p>
        </div>
        <div className="flex items-center space-x-2">
          <Globe className="h-5 w-5 text-gray-500" />
          <select
            className="border-gray-300 rounded-md shadow-sm focus:border-belgian-yellow focus:ring-belgian-yellow"
            value={i18n.language}
            onChange={(e) => changeLanguage(e.target.value as Language)}
          >
            <option value="en">English</option>
            <option value="fr">Français</option>
            <option value="nl">Nederlands</option>
            <option value="de">Deutsch</option>
          </select>
        </div>
      </div>

      <div className={'grid grid-cols-1 lg:grid-cols-4 gap-8'}>
        {/* Categories */}
        <div className={'lg:col-span-3'}>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories.map((category: RoadRuleCategory) => (
              <button
                key={category.id}
                onClick={() => handleCategorySelect(category.id)}
                className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-all text-left"
              >
                <div className="flex items-center justify-between mb-4">
                  <Book className="h-8 w-8 text-belgian-yellow" />
                  <ChevronRight className="h-6 w-6 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-belgian-black mb-2">
                  {category.translations[i18n.language]?.name ||
                    category.translations.en.name}
                </h3>
                <p className="text-gray-600">
                  {category.translations[i18n.language]?.description ||
                    category.translations.en.description}
                </p>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
