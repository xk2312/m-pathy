// lib/keywordExtract.ts
// GPTM-Galaxy+ · m-pathy Archive + Verification System v5
// Keyword Extraction (Multi-Language, deterministic, local)

import { TArchiveEntry } from './types'

/**
 * Sprachspezifische Stopword-Listen
 */
const STOPWORDS_BY_LANG: Record<string, string[]> = {
  en: ['the','and','a','an','is','in','to','of','for','on','at','it','this','that','with','as','by'],
  de: ['und','der','die','das','ist','im','mit','den','zu','von','ein','eine','nicht','oder'],
  fr: ['le','la','les','et','de','du','des','un','une','dans','en','que','pour'],
  es: ['el','la','los','las','y','de','del','un','una','en','por','para','con'],
  it: ['il','la','le','lo','gli','e','di','da','un','una','per','con','che'],
  pt: ['o','a','os','as','e','de','do','da','um','uma','em','por','para'],
  nl: ['de','het','een','en','van','op','in','met','voor','naar'],
  ru: ['и','в','во','на','по','с','к','из','что','это','как','а','но','или'],
  zh: ['的','了','在','是','和','有','不','我','他','她','它'],
  ja: ['の','に','を','は','が','で','と','も','へ','から'],
  ko: ['의','이','가','은','는','을','를','에','에서','와','과','또는'],
  ar: ['و','في','على','من','إلى','عن','أن','مع','هذا','ذلك'],
  hi: ['और','का','की','के','है','में','से','पर','यह','था','थे'],
}

/**
 * Liefert Stopwords-Set für angegebene Sprache
 */
function getStopwords(lang: string): Set<string> {
  return new Set(STOPWORDS_BY_LANG[lang] || STOPWORDS_BY_LANG['en'])
}

/**
 * Tokenizer – extrahiert Wörter, filtert Sonderzeichen & Stopwords
 */
function tokenize(content: string, lang = 'en'): string[] {
  const stopwords = getStopwords(lang)
  return content
    .toLowerCase()
    .replace(
      /[^a-z\u00C0-\u024F0-9\u0400-\u04FF\u0600-\u06FF\u0900-\u097F\u4E00-\u9FFFぁ-んァ-ン一-龥\s]/gi,
      '',
    )
    .split(/\s+/)
    .filter((w) => w.length > 2 && !stopwords.has(w))
}

/**
 * Ermittelt Top-Keywords pro Chat (deterministisch)
 */
export function extractTopKeywords(
  entries: TArchiveEntry[],
  topN = 7,
  lang = 'en',
): string[] {
  const freq: Record<string, number> = {}
  entries.forEach((e) => {
    tokenize(e.content, lang).forEach((word) => {
      freq[word] = (freq[word] || 0) + 1
    })
  })
  const sorted = Object.entries(freq)
    .sort((a, b) => b[1] - a[1])
    .map(([word]) => word)
  return sorted.slice(0, topN)
}

/**
 * Erzeugt Keyword-Cluster pro Chat-Gruppe
 */
export function getChatKeywordClusters(
  groupedChats: { chat_serial: number; messages: TArchiveEntry[] }[],
  lang = 'en',
): { chat_serial: number; keywords: string[] }[] {
  return groupedChats.map((chat) => ({
    chat_serial: chat.chat_serial,
    keywords: extractTopKeywords(chat.messages, 7, lang),
  }))
}
