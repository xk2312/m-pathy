// lib/keywordExtract.ts
// GPTM-Galaxy+ · m-pathy Archive + Verification System
// Keyword Extraction — Final Gate Pipeline (13 languages, deterministic)

import { TArchiveEntry } from './types'

/* ============================================================
 * STOPWORDS
 * ============================================================
 */
const STOPWORDS_BY_LANG: Record<string, Set<string>> = {
  en: new Set(['i','you','he','she','it','we','they','me','him','her','us','them','a','an','the','this','that','these','those','and','or','but','for','to','of','in','on','with','by','from','as','at','into','about','is','are','was','were','be','been','being','have','has','had','do','does','did','can','could','should','would','may','might','must','will','shall','who','what','where','when','why','how']),
  de: new Set(['ich','du','er','sie','es','wir','ihr','mich','dich','ihn','uns','euch','der','die','das','den','dem','des','ein','eine','einen','einem','eines','und','oder','aber','für','zu','von','mit','auf','in','an','bei','über','ist','sind','war','waren','sein','bin','bist','wer','was','wann','warum','wie','wo']),
  fr: new Set(['je','tu','il','elle','nous','vous','ils','elles','le','la','les','un','une','des','et','ou','pour','de','dans','avec','est','être','qui','quoi','quand','comment']),
  es: new Set(['yo','tú','el','ella','nosotros','vosotros','ellos','ellas','el','la','los','las','un','una','y','o','para','de','con','es','ser','quién','qué','cómo']),
  it: new Set(['io','tu','lui','lei','noi','voi','loro','il','la','lo','i','gli','le','un','una','e','o','per','di','con','è','essere','chi','cosa']),
  pt: new Set(['eu','tu','ele','ela','nós','vocês','eles','elas','o','a','os','as','um','uma','e','ou','para','de','com','é','ser','quem']),
  nl: new Set(['ik','jij','hij','zij','wij','jullie','de','het','een','en','of','voor','van','met','is','zijn','wie','wat']),
  ru: new Set(['я','ты','он','она','мы','вы','они','и','или','для','в','на','с','это','есть','кто','что']),
  zh: new Set(['的','了','在','是','和','有','不','我','你','他','她','它','们']),
  ja: new Set(['の','に','を','は','が','で','と','も','へ','から','する','ある','いる']),
  ko: new Set(['의','이','가','은','는','을','를','에','에서','와','과','하다','있다']),
  ar: new Set(['و','في','على','من','إلى','عن','أن','مع','هو','هي','هم','هذا','ذلك','كان']),
  hi: new Set(['और','का','की','के','है','थे','था','में','से','पर','यह','वह','कौन','क्या']),
}

/* ============================================================
 * DECORATIVE ADJECTIVES
 * ============================================================
 */
const DECORATIVE_ADJ_BY_LANG: Record<string, Set<string>> = {
  en: new Set(['important','good','bad','real','true','big','small','great','nice','many','most']),
  de: new Set(['wichtig','gut','schlecht','echt','wahr','groß','klein','viele','meiste']),
  fr: new Set(['important','bon','mauvais','vrai','grand','petit','beaucoup']),
  es: new Set(['importante','bueno','malo','real','verdadero','grande','muchos']),
  it: new Set(['importante','buono','cattivo','vero','grande','molti']),
  pt: new Set(['importante','bom','mau','verdadeiro','grande','muitos']),
  nl: new Set(['belangrijk','goed','slecht','echt','waar','groot','veel']),
  ru: new Set(['важный','хороший','плохой','настоящий','большой','много']),
  zh: new Set(['重要','真正','伟大','许多']),
  ja: new Set(['重要','本当','大きい','多く']),
  ko: new Set(['중요한','진짜','큰','많은']),
  ar: new Set(['مهم','جيد','سيئ','حقيقي','كبير','كثير']),
  hi: new Set(['महत्वपूर्ण','अच्छा','बुरा','सच्चा','बड़ा','बहुत']),
}

/* ============================================================
 * GENERIC PLACEHOLDERS
 * ============================================================
 */
const GENERIC_GLOBALS = new Set([
  'people','person','thing','things','world','life','everything','everyone','someone','something',
  'menschen','mensch','ding','dinge','welt','leben','alles',
  'personne','personas','persona','persone','coisa','cosas','cosa','chose','choses',
  'люди','человек','вещь','вещи','мир','жизнь',
  '人','东西','世界','生活',
  'الناس','شخص','شيء','أشياء','العالم','الحياة',
  'लोग','व्यक्ति','चीज','दुनिया','जीवन',
])

/* ============================================================
 * META / UI FILTERS
 * ============================================================
 */
const META_PHRASES = [
  'timestamp','version','truth hash','public key','orbit context','context chat'
]

const REQUEST_TOKENS = new Set([
  'gib','sag','mach','liste','tabelle','zeige','antworte',
  'give','tell','make','list','table','show','answer',
  'please','bitte'
])

/* ============================================================
 * Utilities
 * ============================================================
 */
function normalize(text: string): string {
  return text
    .normalize('NFKC')
    .toLowerCase()
    .replace(/[^a-z\u00C0-\u024F\u0400-\u04FF\u0600-\u06FF\u0900-\u097F\u4E00-\u9FFFぁ-んァ-ン一-龥0-9\s-]/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function singularize(token: string): string {
  if (token.endsWith('ies')) return token.slice(0, -3) + 'y'
  if (token.endsWith('s') && token.length > 3) return token.slice(0, -1)
  return token
}

function isMeta(candidate: string): boolean {
  if (META_PHRASES.some(p => candidate.includes(p))) return true
  if (/\d{4}-\d{2}-\d{2}/.test(candidate)) return true
  if (/[a-f0-9]{16,}/.test(candidate)) return true
  return false
}

/* ============================================================
 * Main extraction
 * ============================================================
 */
export function extractTopKeywords(
  entries: TArchiveEntry[],
  topN = 7,
  lang = 'en',
): string[] {
  const stopwords = STOPWORDS_BY_LANG[lang] || STOPWORDS_BY_LANG.en
  const decorative = DECORATIVE_ADJ_BY_LANG[lang] || DECORATIVE_ADJ_BY_LANG.en

  const text = normalize(entries.map(e => e.content).join(' '))
  const tokens = text.split(' ').filter(Boolean)

  const freq = new Map<string, number>()

  for (let i = 0; i < tokens.length; i++) {
    const w = singularize(tokens[i])
    if (stopwords.has(w)) continue
    if (REQUEST_TOKENS.has(w)) continue
    if (GENERIC_GLOBALS.has(w)) continue

    const phrase = tokens[i + 1]
      ? `${w} ${singularize(tokens[i + 1])}`
      : w

    if (isMeta(phrase)) continue
    if (decorative.has(w)) continue

    freq.set(phrase, (freq.get(phrase) || 0) + 1)
  }

  return [...freq.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, topN)
    .map(([k]) => k)
}

export function getChatKeywordClusters(
  groupedChats: { chat_serial: number; messages: TArchiveEntry[] }[],
  lang = 'en',
) {
  return groupedChats.map(chat => ({
    chat_serial: chat.chat_serial,
    keywords: extractTopKeywords(chat.messages, 7, lang),
  }))
}
