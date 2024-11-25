import { useEffect, useState, useMemo } from 'react';
import { Book, ChevronRight, ChevronDown, Globe } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '@/store';
import {
  fetchCategories,
  fetchRulesByCategory,
} from '@/store/slices/roadRulesSlice';
import type { Language } from '@/types/i18n';
import type { RoadRule } from '@/types/roadRules';
import i18n from '@/i18n';
import QuizButton from '@/components/quiz/QuizButton';
import { useParams, useLocation } from 'react-router-dom';
//import { v4 as uuidv4 } from 'uuid'; // If needed for debugging

export default function RoadRulesContent() {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { categoryId } = useParams<{ categoryId: string }>();
  const location = useLocation();
  const passedCategory = location.state?.category;

  const [expandRules, setExpandedRules] = useState<Set<string>>(new Set());
  const { categories, isLoading, error } = useAppSelector(
    (state) => state.roadRules
  );
  const [rules, setRules] = useState<RoadRule[]>([]);

  // Use passed category or find it in the Redux store
  const category = useMemo(() => {
    if (passedCategory) return passedCategory;
    return categories?.find((cat) => String(cat.id) === categoryId) || null;
  }, [passedCategory, categories, categoryId]);

  useEffect(() => {
    if (!category && categoryId) {
      dispatch(fetchCategories());
    }
  }, [dispatch, category, categoryId]);

  useEffect(() => {
    if (category) {
      dispatch(fetchRulesByCategory(category.id))
        .unwrap()
        .then((fetchedRules) => {
          setRules(fetchedRules);
        })
        .catch((error) => {
          console.error('Error fetching rules:', error);
        });
    }
  }, [dispatch, category]);

  const toggleRule = (ruleId: string) => {
    const newExpanded = new Set(expandRules);
    if (expandRules.has(ruleId)) {
      newExpanded.delete(ruleId);
    } else {
      newExpanded.add(ruleId);
    }
    setExpandedRules(newExpanded);
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

  if (!category) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-500">{t('roadRules.noCategory')}</div>
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
          <p className="text-xl text-gray-600">
            {category.translations[i18n.language]?.name ||
              category.translations['en'].name}
          </p>
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

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3">
          <div className="bg-white rounded-lg shadow">
            {rules.length > 0 ? (
              <div className="divide-y divide-gray-200">
                {rules.map((rule: RoadRule) => (
                  <div key={rule.id} className="p-4">
                    <button
                      onClick={() => toggleRule(rule.id)}
                      className="w-full flex justify-between items-center"
                    >
                      <h3 className="text-lg font-medium text-belgian-black">
                        {rule.translations[i18n.language]?.title ||
                          rule.translations['en'].title}
                      </h3>
                      {expandRules.has(rule.id) ? (
                        <ChevronDown className="h-5 w-5 text-gray-500" />
                      ) : (
                        <ChevronRight className="h-5 w-5 text-gray-500" />
                      )}
                    </button>
                    {expandRules.has(rule.id) && (
                      <div className="mt-4 prose max-w-none">
                        <p className="text-gray-600 whitespace-pre-line">
                          {rule.translations[i18n.language]?.content ||
                            rule.translations['en'].content}
                        </p>
                        {rule.mediaUrl && (
                          <div className="mt-4">
                            {rule.mediaUrl.includes('youtube.com') ? (
                              <iframe
                                className="w-full aspect-video rounded-lg"
                                src={rule.mediaUrl}
                                title={
                                  rule.translations[i18n.language]?.title ||
                                  rule.translations['en'].title
                                }
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                              />
                            ) : (
                              <img
                                src={rule.mediaUrl}
                                alt={
                                  rule.translations[i18n.language]?.title ||
                                  rule.translations['en'].title
                                }
                                className="w-full rounded-lg"
                              />
                            )}
                          </div>
                        )}
                        <QuizButton ruleId={rule.id} />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center text-gray-500">
                {t('roadRules.noRules')}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
