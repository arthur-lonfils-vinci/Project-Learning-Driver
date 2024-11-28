import { v4 as uuidv4 } from 'uuid';
import { RoadRuleCategory } from '../types/roadRules.js';

const categoryId1 = uuidv4();
const ruleId1 = uuidv4();
const quizId1 = uuidv4();

const categoryId2 = uuidv4();
const ruleId2 = uuidv4();
const quizId2 = uuidv4();
/*
const categoryId1 = '1';
const ruleId1 = '1';
const quizId1 = '1';

const categoryId2 = '2';
const ruleId2 = '2';
const quizId2 = '2';
*/

export const roadRulesData: RoadRuleCategory[] = [
  {
    id: categoryId1,
    icon: 'book',
    orderIndex: 1,
    translations: {
      en: {
        name: 'General Regulations',
        description:
          'Royal Decree of December 1, 1975 - General regulations on road traffic police and public roadway use',
      },
      fr: {
        name: 'Règlement Général',
        description: `Arrêté royal du 1er décembre 1975 - Règlement général sur la police de la circulation routière et de l'usage de la voie publique`,
      },
      nl: {
        name: 'Algemeen Reglement',
        description:
          'Koninklijk besluit van 1 december 1975 - Algemeen reglement op de politie van het wegverkeer en van het gebruik van de openbare weg',
      },
      de: {
        name: 'Allgemeine Vorschriften',
        description:
          'Königlicher Erlass vom 1. Dezember 1975 - Allgemeine Vorschriften zur Straßenverkehrspolizei und zur Nutzung öffentlicher Straßen',
      },
    },
    rules: [
      {
        id: ruleId1,
        orderIndex: 1,
        categoryId: categoryId1,
        validUntil: '2026-09-01',
        translations: {
          en: {
            title: 'Scope and Validity',
            content:
              'The general regulation applies to all road users in Belgium. It will remain in effect until September 1, 2026, when it will be replaced by four new regional codes.',
          },
          fr: {
            title: 'Portée et Validité',
            content:
              "Le règlement général s'applique à tous les usagers de la route en Belgique. Il restera en vigueur jusqu'au 1er septembre 2026, date à laquelle il sera remplacé par quatre nouveaux codes régionaux.",
          },
          nl: {
            title: 'Toepassingsgebied en Geldigheid',
            content:
              'Het algemeen reglement is van toepassing op alle weggebruikers in België. Het blijft van kracht tot 1 september 2026, wanneer het zal worden vervangen door vier nieuwe gewestelijke codes.',
          },
          de: {
            title: 'Geltungsbereich und Gültigkeit',
            content:
              'Die allgemeinen Vorschriften gelten für alle Verkehrsteilnehmer in Belgien. Sie bleiben bis zum 1. September 2026 in Kraft, wenn sie durch vier neue regionale Vorschriften ersetzt werden.',
          },
        },
        quiz: [
          {
            id: quizId1,
            ruleId: ruleId1,
            correctOption: 1,
            translations: {
              en: {
                question:
                  'When will the current general regulation be replaced by regional codes?',
                options: [
                  'January 1, 2025',
                  'September 1, 2026',
                  'January 1, 2027',
                  'September 1, 2027',
                ],
                explanation:
                  'The current general regulation will be replaced by four new regional codes on September 1, 2026.',
              },
              fr: {
                question:
                  'Quand le règlement général actuel sera-t-il remplacé par des codes régionaux ?',
                options: [
                  '1er janvier 2025',
                  '1er septembre 2026',
                  '1er janvier 2027',
                  '1er septembre 2027',
                ],
                explanation:
                  'Le règlement général actuel sera remplacé par quatre nouveaux codes régionaux le 1er septembre 2026.',
              },
              nl: {
                question:
                  'Wanneer wordt het huidige algemeen reglement vervangen door gewestelijke codes?',
                options: [
                  '1 januari 2025',
                  '1 september 2026',
                  '1 januari 2027',
                  '1 september 2027',
                ],
                explanation:
                  'Het huidige algemeen reglement wordt op 1 september 2026 vervangen door vier nieuwe gewestelijke codes.',
              },
              de: {
                question:
                  'Wann wird die aktuelle allgemeine Vorschrift durch regionale Vorschriften ersetzt?',
                options: [
                  '1. Januar 2025',
                  '1. September 2026',
                  '1. Januar 2027',
                  '1. September 2027',
                ],
                explanation:
                  'Die aktuelle allgemeine Vorschrift wird am 1. September 2026 durch vier neue regionale Vorschriften ersetzt.',
              },
            },
          },
        ],
      },
    ],
  },
  {
    id: categoryId2,
    icon: 'traffic-light',
    orderIndex: 2,
    translations: {
      en: {
        name: 'Traffic Signs and Signals',
        description:
          'Understanding and obeying traffic signs, signals, and road markings in Belgium',
      },
      fr: {
        name: 'Panneaux et Signaux de Circulation',
        description:
          'Comprendre et respecter les panneaux de signalisation, les feux de circulation et les marquages routiers en Belgique',
      },
      nl: {
        name: 'Verkeersborden en Signalen',
        description:
          'Begrijpen en naleven van verkeersborden, verkeerslichten en wegmarkeringen in België',
      },
      de: {
        name: 'Verkehrszeichen und Signale',
        description:
          'Verstehen und Befolgen von Verkehrszeichen, Ampeln und Straßenmarkierungen in Belgien',
      },
    },
    rules: [
      {
        id: ruleId2,
        orderIndex: 1,
        categoryId: categoryId2,
        validFrom: '2023-01-01',
        translations: {
          en: {
            title: 'Priority Signs',
            content:
              'Priority signs indicate who has the right of way at intersections. The inverted triangle means "yield", while the octagonal stop sign requires a full stop.',
          },
          fr: {
            title: 'Panneaux de Priorité',
            content:
              'Les panneaux de priorité indiquent qui a la priorité aux intersections. Le triangle inversé signifie "céder le passage", tandis que le panneau stop octogonal exige un arrêt complet.',
          },
          nl: {
            title: 'Voorrangsborden',
            content:
              'Voorrangsborden geven aan wie voorrang heeft op kruispunten. De omgekeerde driehoek betekent "voorrang verlenen", terwijl het achthoekige stopbord een volledige stop vereist.',
          },
          de: {
            title: 'Vorfahrtszeichen',
            content:
              'Vorfahrtszeichen zeigen an, wer an Kreuzungen Vorfahrt hat. Das umgekehrte Dreieck bedeutet "Vorfahrt gewähren", während das achteckige Stoppschild ein vollständiges Anhalten erfordert.',
          },
        },
        quiz: [
          {
            id: quizId2,
            ruleId: ruleId2,
            correctOption: 2,
            translations: {
              en: {
                question: 'What does an inverted triangle sign mean?',
                options: [
                  'Stop completely',
                  'Yield (give way)',
                  'You have priority',
                  'No entry',
                ],
                explanation:
                  'An inverted triangle sign means "yield" or "give way". It indicates that you must give priority to other road users.',
              },
              fr: {
                question:
                  'Que signifie un panneau en forme de triangle inversé ?',
                options: [
                  'Arrêt complet',
                  'Céder le passage',
                  'Vous avez la priorité',
                  'Entrée interdite',
                ],
                explanation:
                  'Un panneau en forme de triangle inversé signifie "céder le passage". Il indique que vous devez donner la priorité aux autres usagers de la route.',
              },
              nl: {
                question: 'Wat betekent een omgekeerd driehoekig bord?',
                options: [
                  'Volledig stoppen',
                  'Voorrang verlenen',
                  'U heeft voorrang',
                  'Geen toegang',
                ],
                explanation:
                  'Een omgekeerd driehoekig bord betekent "voorrang verlenen". Het geeft aan dat u voorrang moet geven aan andere weggebruikers.',
              },
              de: {
                question: 'Was bedeutet ein umgekehrtes Dreieckschild?',
                options: [
                  'Vollständig anhalten',
                  'Vorfahrt gewähren',
                  'Sie haben Vorfahrt',
                  'Keine Einfahrt',
                ],
                explanation:
                  'Ein umgekehrtes Dreieckschild bedeutet "Vorfahrt gewähren". Es zeigt an, dass Sie anderen Verkehrsteilnehmern Vorfahrt gewähren müssen.',
              },
            },
          },
        ],
      },
    ],
  },
];
