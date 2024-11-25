import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      roadRules: {
        title: 'Road Rules',
        categories: 'Categories',
        loading: 'Loading rules...',
        error: 'Failed to load road rules'
      },
      achievements: {
        title: 'Achievements',
        noAchievements: 'No achievements yet',
        startDriving: 'Start driving to earn achievements!',
        newAchievement: 'New Achievement Unlocked!',
        progress: 'Progress: {{progress}} / {{max}}'
      }
    }
  },
  fr: {
    translation: {
      roadRules: {
        title: 'Code de la Route',
        categories: 'Catégories',
        loading: 'Chargement des règles...',
        error: 'Échec du chargement des règles'
      },
      achievements: {
        title: 'Réalisations',
        noAchievements: 'Pas encore de réalisations',
        startDriving: 'Commencez à conduire pour gagner des réalisations !',
        newAchievement: 'Nouvelle Réalisation Débloquée !',
        progress: 'Progression : {{progress}} / {{max}}'
      }
    }
  },
  nl: {
    translation: {
      roadRules: {
        title: 'Verkeersregels',
        categories: 'Categorieën',
        loading: 'Regels laden...',
        error: 'Laden van regels mislukt'
      },
      achievements: {
        title: 'Prestaties',
        noAchievements: 'Nog geen prestaties',
        startDriving: 'Begin met rijden om prestaties te verdienen!',
        newAchievement: 'Nieuwe Prestatie Ontgrendeld!',
        progress: 'Voortgang: {{progress}} / {{max}}'
      }
    }
  },
  de: {
    translation: {
      roadRules: {
        title: 'Verkehrsregeln',
        categories: 'Kategorien',
        loading: 'Regeln werden geladen...',
        error: 'Fehler beim Laden der Regeln'
      },
      achievements: {
        title: 'Erfolge',
        noAchievements: 'Noch keine Erfolge',
        startDriving: 'Starten Sie mit dem Fahren, um Erfolge zu erzielen!',
        newAchievement: 'Neuer Erfolg Freigeschaltet!',
        progress: 'Fortschritt: {{progress}} / {{max}}'
      }
    }
  }
};

i18n.use(initReactI18next).init({
  resources,
  lng: 'en',
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false
  }
});

export default i18n;