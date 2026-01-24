// lib/i18n.doorman.ts
// Doorman-Copy – EN als Master, alle 13 Sprachen konsistent.
// Ziel: ruhig, erlaubend, kein Leistungsimpuls.

type DictRoot = Record<string, any>;

export const doormanDict = {

en: {
  "prompt.doorman.main": "This workspace is governed, verifiable,",
  "prompt.doorman.sub": "and built for accountability.",
},

de: {
  "prompt.doorman.main": "Dieser Arbeitsraum ist reguliert und überprüfbar,",
  "prompt.doorman.sub": "gebaut für Nachvollziehbarkeit und Verantwortung.",
},

fr: {
  "prompt.doorman.main": "Cet espace est gouverné et vérifiable,",
  "prompt.doorman.sub": "conçu pour la responsabilité.",
},

es: {
  "prompt.doorman.main": "Este espacio está regulado y es verificable,",
  "prompt.doorman.sub": "diseñado para la responsabilidad.",
},

it: {
  "prompt.doorman.main": "Questo spazio è regolato e verificabile,",
  "prompt.doorman.sub": "progettato per la responsabilità.",
},

pt: {
  "prompt.doorman.main": "Este espaço é governado e verificável,",
  "prompt.doorman.sub": "concebido para responsabilidade.",
},

nl: {
  "prompt.doorman.main": "Deze werkomgeving is gereguleerd en verifieerbaar,",
  "prompt.doorman.sub": "ontworpen voor verantwoording.",
},

ru: {
  "prompt.doorman.main": "Это пространство регулируемо и проверяемо,",
  "prompt.doorman.sub": "создано для подотчетности.",
},

zh: {
  "prompt.doorman.main": "此工作空间受控且可验证，",
  "prompt.doorman.sub": "专为责任与可追溯性而建。",
},

ja: {
  "prompt.doorman.main": "この作業空間は管理され検証可能で、",
  "prompt.doorman.sub": "説明責任のために設計されています。",
},

ko: {
  "prompt.doorman.main": "이 작업 공간은 관리되고 검증 가능하며,",
  "prompt.doorman.sub": "책임성을 위해 설계되었습니다.",
},

ar: {
  "prompt.doorman.main": "هذه البيئة خاضعة للحوكمة وقابلة للتحقق،",
  "prompt.doorman.sub": "ومصممة للمساءلة.",
},

hi: {
  "prompt.doorman.main": "यह कार्यक्षेत्र नियंत्रित और सत्यापन योग्य है,",
  "prompt.doorman.sub": "और उत्तरदायित्व के लिए बनाया गया है।",
},


} as const;

export function attachDoorman(dict: DictRoot) {
  for (const [locale, values] of Object.entries(doormanDict)) {
    const current = (dict as DictRoot)[locale] ?? {};
    (dict as DictRoot)[locale] = {
      ...current,
      ...values,
    };
  }
}
