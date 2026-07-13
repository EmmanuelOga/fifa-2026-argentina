/**
 * UI chrome strings — nav labels, buttons, control captions, footer. This is the
 * non-prose layer (the prose lives in content collections). Sim islands receive
 * the relevant slice as serialized JSON so their client-side labels are localized
 * and es-AR number formatting applies.
 */
import type { Locale, TabKey } from '../lib/i18n';

export const TAB_LABEL: Record<TabKey, Record<Locale, string>> = {
  story: { en: 'The Story', es: 'La Historia' },
  feasibility: { en: 'Could It Be Done?', es: '¿Se Puede?' },
  probabilities: { en: 'The Probabilities', es: 'Las Probabilidades' },
  'who-wins': { en: 'Who Wins?', es: '¿Quién Gana?' },
  ask: { en: 'Ask the Research', es: 'Preguntá a la Investigación' },
  sources: { en: 'Sources', es: 'Fuentes' },
  log: { en: 'The Log', es: 'La Bitácora' },
};

export const TAB_SHORT: Record<TabKey, Record<Locale, string>> = {
  story: { en: 'Story', es: 'Historia' },
  feasibility: { en: 'Feasible?', es: '¿Se Puede?' },
  probabilities: { en: 'Odds', es: 'Probabilidades' },
  'who-wins': { en: 'Who Wins', es: 'Quién Gana' },
  ask: { en: 'Ask', es: 'Preguntá' },
  sources: { en: 'Sources', es: 'Fuentes' },
  log: { en: 'Log', es: 'Bitácora' },
};

type Dict = {
  tagline: string;
  byline: string;
  bylineLink: string;
  skipToContent: string;
  primaryNav: string;
  switchTo: string;
  snapshotAs: string;
  speculative: string;
  forLabel: string;
  againstLabel: string;
  changeMind: string;
  theMath: string;
  learnMore: string;
  whyItMatters: string;
  readMore: string;
  readLess: string;
  sourcesForThis: string;
  linkUnverified: string;
  searchThis: string;
  thread: { sporting: string; financial: string };
  home: string;
  backToTop: string;
  footer: {
    madeWith: string;
    connect: string;
    viewSource: string;
    rights: string;
  };
  ask: {
    placeholder: string;
    send: string;
    thinking: string;
    suggestions: string;
    suggestionList: string[];
    disclaimer: string;
    unanswered: string;
    unavailable: string;
    error: string;
    sourcesLabel: string;
    youLabel: string;
    botLabel: string;
  };
  sim: {
    reset: string;
    presets: string;
    speculativeToy: string;
    // conspiracy
    peopleSilent: string;
    leakChance: string;
    years: string;
    survives: string;
    conspiracyTakeawayHi: string;
    conspiracyTakeawayLo: string;
    presetSingleRef: string;
    presetCalciopoli: string;
    presetInstitutional: string;
    // bayes
    prior: string;
    posterior: string;
    publishedRange: string;
    evidence: string;
    weak: string;
    neutral: string;
    strong: string;
    // monte carlo
    runSim: string;
    running: string;
    titleOdds: string;
    biasNudge: string;
    nudgeOff: string;
    clean: string;
    adjusted: string;
    strength: string;
    champions: string;
    seed: string;
  };
};

export const UI: Record<Locale, Dict> = {
  en: {
    tagline: 'A celebration with footnotes.',
    byline: 'By',
    bylineLink: 'Emmanuel Oga',
    skipToContent: 'Skip to content',
    primaryNav: 'Primary',
    switchTo: 'Español',
    snapshotAs: 'Snapshot as of',
    speculative: 'Speculative',
    forLabel: 'For',
    againstLabel: 'Against',
    changeMind: 'What would change my mind',
    theMath: 'The math',
    learnMore: 'Learn more',
    whyItMatters: 'Why it matters',
    readMore: 'Read more',
    readLess: 'Read less',
    sourcesForThis: 'Sources',
    linkUnverified: 'link unverified — search',
    searchThis: 'Search',
    thread: { sporting: 'Sporting thread', financial: 'Financial thread' },
    home: 'Home',
    backToTop: 'Back to top',
    footer: {
      madeWith: 'Made with Claude.',
      connect: 'Connect on LinkedIn',
      viewSource: 'Source on GitHub',
      rights: 'Opinion & analysis. Not affiliated with FIFA or AFA.',
    },
    ask: {
      placeholder: 'Ask about the run, the calls, the FBI story…',
      send: 'Ask',
      thinking: 'Reading the research…',
      suggestions: 'Try asking',
      suggestionList: [
        'Is the FBI probe about match-fixing?',
        'Why is H1 different from H2?',
        'How likely is Argentina to win it?',
        'Was the Embolo red card correct?',
      ],
      disclaimer:
        'Answers come only from this site’s compiled research and are opinion/analysis, not reporting. Every probability is speculative.',
      unanswered:
        'I couldn’t answer that from the research on this site. I’ve logged the question for the next re-run — thanks for the nudge.',
      unavailable:
        'The live chat needs the Cloudflare deployment (with an API key configured). In the meantime, browse the tabs or reach out on LinkedIn.',
      error: 'Something went wrong reaching the assistant. Please try again.',
      sourcesLabel: 'Sources',
      youLabel: 'You',
      botLabel: 'La Alegría',
    },
    sim: {
      reset: 'Reset',
      presets: 'Presets',
      speculativeToy: 'Speculative — an intuition pump, not a forecast.',
      peopleSilent: 'People who must stay silent',
      leakChance: 'Each person’s yearly chance of exposing it',
      years: 'Years the secret must hold',
      survives: 'Chance the secret survives',
      conspiracyTakeawayHi: 'A secret this size is expected to hold.',
      conspiracyTakeawayLo: 'A secret this size is expected to break — big fixes leak.',
      presetSingleRef: 'Single bribed ref',
      presetCalciopoli: 'Calciopoli-scale',
      presetInstitutional: 'Institutional WC fix',
      prior: 'Prior',
      posterior: 'Posterior',
      publishedRange: 'My published range',
      evidence: 'Evidence',
      weak: 'weak',
      neutral: 'neutral',
      strong: 'strong',
      runSim: 'Run 10,000 tournaments',
      running: 'Running…',
      titleOdds: 'Title odds',
      biasNudge: 'Speculative bias nudge (H1 what-if)',
      nudgeOff: 'off',
      clean: 'Clean model',
      adjusted: 'With nudge',
      strength: 'Strength',
      champions: 'champion',
      seed: 'Seed',
    },
  },
  es: {
    tagline: 'Una celebración con notas al pie.',
    byline: 'Por',
    bylineLink: 'Emmanuel Oga',
    skipToContent: 'Saltar al contenido',
    primaryNav: 'Principal',
    switchTo: 'English',
    snapshotAs: 'Foto al',
    speculative: 'Especulativo',
    forLabel: 'A favor',
    againstLabel: 'En contra',
    changeMind: 'Qué me haría cambiar de opinión',
    theMath: 'La matemática',
    learnMore: 'Saber más',
    whyItMatters: 'Por qué importa',
    readMore: 'Leer más',
    readLess: 'Leer menos',
    sourcesForThis: 'Fuentes',
    linkUnverified: 'enlace sin verificar — buscar',
    searchThis: 'Buscar',
    thread: { sporting: 'Hilo deportivo', financial: 'Hilo financiero' },
    home: 'Inicio',
    backToTop: 'Volver arriba',
    footer: {
      madeWith: 'Hecho con Claude.',
      connect: 'Conectá por LinkedIn',
      viewSource: 'Código en GitHub',
      rights: 'Opinión y análisis. Sin afiliación con FIFA ni AFA.',
    },
    ask: {
      placeholder: 'Preguntá por la campaña, los fallos, la historia del FBI…',
      send: 'Preguntar',
      thinking: 'Leyendo la investigación…',
      suggestions: 'Probá preguntar',
      suggestionList: [
        '¿La pesquisa del FBI es por arreglo de partidos?',
        '¿Por qué H1 es distinto de H2?',
        '¿Qué chance tiene Argentina de salir campeón?',
        '¿Estuvo bien la roja a Embolo?',
      ],
      disclaimer:
        'Las respuestas salen solo de la investigación compilada de este sitio y son opinión/análisis, no periodismo. Toda probabilidad es especulativa.',
      unanswered:
        'No pude responder eso con la investigación de este sitio. Registré la pregunta para la próxima re-corrida — gracias por el empujón.',
      unavailable:
        'El chat en vivo necesita el despliegue en Cloudflare (con una API key configurada). Mientras tanto, recorré las pestañas o escribime por LinkedIn.',
      error: 'Algo salió mal al contactar al asistente. Probá de nuevo.',
      sourcesLabel: 'Fuentes',
      youLabel: 'Vos',
      botLabel: 'La Alegría',
    },
    sim: {
      reset: 'Reiniciar',
      presets: 'Preajustes',
      speculativeToy: 'Especulativo — un empujón a la intuición, no un pronóstico.',
      peopleSilent: 'Personas que deben callar',
      leakChance: 'Chance anual de que cada una lo exponga',
      years: 'Años que el secreto debe aguantar',
      survives: 'Chance de que el secreto sobreviva',
      conspiracyTakeawayHi: 'Un secreto de este tamaño se espera que aguante.',
      conspiracyTakeawayLo: 'Un secreto de este tamaño se espera que caiga — los arreglos grandes se filtran.',
      presetSingleRef: 'Un árbitro sobornado',
      presetCalciopoli: 'Escala Calciopoli',
      presetInstitutional: 'Arreglo institucional de Mundial',
      prior: 'Prior',
      posterior: 'Posterior',
      publishedRange: 'Mi rango publicado',
      evidence: 'Evidencia',
      weak: 'débil',
      neutral: 'neutral',
      strong: 'fuerte',
      runSim: 'Correr 10.000 torneos',
      running: 'Corriendo…',
      titleOdds: 'Chances de título',
      biasNudge: 'Empujón de sesgo especulativo (qué-pasaría-si H1)',
      nudgeOff: 'apagado',
      clean: 'Modelo limpio',
      adjusted: 'Con empujón',
      strength: 'Fuerza',
      champions: 'campeón',
      seed: 'Semilla',
    },
  },
};
