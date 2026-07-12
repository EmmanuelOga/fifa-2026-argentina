/**
 * Configuration for the Bayesian Explorer (Tab 3). Per hypothesis: a set of
 * plain-language evidence items, each mapping a slider to a likelihood ratio
 * (LR > 1 supports, < 1 argues against). Default LRs are chosen for
 * interpretability; the island back-solves the default PRIOR so that, at the
 * reset defaults, the posterior reproduces the midpoint of the published band.
 *
 * These are tool labels + parameters (config), not narrative prose — the
 * hypothesis prose itself lives in the content collection.
 */
import type { Locale } from '../lib/i18n';

export interface Evidence {
  id: string;
  label: Record<Locale, string>;
  lrMin: number;
  lrMax: number;
  defaultLR: number;
}

export interface BayesHypo {
  code: 'H1' | 'H2' | 'H3' | 'H4';
  evidence: Evidence[];
}

export const BAYES: BayesHypo[] = [
  {
    code: 'H1',
    evidence: [
      {
        id: 'penalties',
        label: {
          en: 'Penalty outlier — how surprising if there were NO favoritism?',
          es: 'Dato atípico de penales — ¿qué tan sorprendente si NO hubiera favoritismo?',
        },
        lrMin: 0.5,
        lrMax: 4,
        defaultLR: 1.6,
      },
      {
        id: 'defensible',
        label: {
          en: 'Each flagged call has a defensible rule-based explanation.',
          es: 'Cada fallo señalado tiene una explicación reglamentaria defendible.',
        },
        lrMin: 0.2,
        lrMax: 1.5,
        defaultLR: 0.6,
      },
      {
        id: 'precedent',
        label: {
          en: 'No World Cup finals match has ever been proven fixed.',
          es: 'Nunca se probó un arreglo en un partido de fase final de un Mundial.',
        },
        lrMin: 0.2,
        lrMax: 1.2,
        defaultLR: 0.5,
      },
    ],
  },
  {
    code: 'H2',
    evidence: [
      {
        id: 'sourcing',
        label: {
          en: 'La Nación + Miami Herald: independent, credible sourcing.',
          es: 'La Nación + Miami Herald: fuentes independientes y creíbles.',
        },
        lrMin: 1,
        lrMax: 8,
        defaultLR: 3,
      },
      {
        id: 'nocharges',
        label: {
          en: 'No charges filed yet; the FBI declined to comment.',
          es: 'Sin cargos aún; el FBI no hizo comentarios.',
        },
        lrMin: 0.5,
        lrMax: 1.2,
        defaultLR: 0.9,
      },
      {
        id: 'fit',
        label: {
          en: 'A textbook FIFA-Gate jurisdictional fit (dollars, US banks).',
          es: 'Un encaje jurisdiccional de manual con el FIFA-Gate (dólares, bancos de EE.UU.).',
        },
        lrMin: 0.8,
        lrMax: 3,
        defaultLR: 1.5,
      },
    ],
  },
  {
    code: 'H3',
    evidence: [
      {
        id: 'literature',
        label: {
          en: 'Peer-reviewed status-bias literature (Garicano et al.).',
          es: 'Literatura revisada por pares sobre sesgo de estatus (Garicano et al.).',
        },
        lrMin: 0.8,
        lrMax: 4,
        defaultLR: 1.8,
      },
      {
        id: 'nulls',
        label: {
          en: 'Some studies find null results (Morgulev et al.).',
          es: 'Algunos estudios dan resultados nulos (Morgulev et al.).',
        },
        lrMin: 0.4,
        lrMax: 1.3,
        defaultLR: 0.8,
      },
      {
        id: 'profile',
        label: {
          en: 'Argentina fits the champion-with-a-megastar profile.',
          es: 'Argentina encaja en el perfil de campeón con megaestrella.',
        },
        lrMin: 0.7,
        lrMax: 2.5,
        defaultLR: 1.3,
      },
    ],
  },
  {
    code: 'H4',
    evidence: [
      {
        id: 'knockouts',
        label: {
          en: 'Three straight tight / extra-time knockouts breed narratives.',
          es: 'Tres eliminatorias seguidas ajustadas / en alargue generan relatos.',
        },
        lrMin: 0.8,
        lrMax: 3,
        defaultLR: 1.5,
      },
      {
        id: 'explanations',
        label: {
          en: 'Correct rule explanations existed for the viral moments.',
          es: 'Había explicaciones reglamentarias correctas para los momentos virales.',
        },
        lrMin: 0.8,
        lrMax: 3,
        defaultLR: 1.4,
      },
      {
        id: 'persists',
        label: {
          en: 'But the penalty outlier stubbornly persists.',
          es: 'Pero el dato atípico de penales persiste tozudamente.',
        },
        lrMin: 0.4,
        lrMax: 1.3,
        defaultLR: 0.7,
      },
    ],
  },
];
