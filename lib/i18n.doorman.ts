// lib/i18n.doorman.ts
// Doorman-Copy – EN als Master, alle 13 Sprachen konsistent.
// Wird in lib/i18n.ts via attachDoorman(DICTS) ans Legacy-Chat-Dict angehängt.

type DictRoot = Record<string, any>;

export const doormanDict = {
  en: {
    "prompt.doorman.main": "Build something that wasn't there five seconds ago.",
    "prompt.doorman.sub":
      "Click the Build button in the top-left column and watch it unfold.",
  },

  de: {
    "prompt.doorman.main": "Bau etwas, das vor fünf Sekunden noch nicht da war.",
    "prompt.doorman.sub":
      "Klicke oben links in der Säule auf „Bauen“ und schau zu, wie es entsteht.",
  },

  fr: {
    "prompt.doorman.main": "Crée quelque chose qui n’existait pas il y a cinq secondes.",
    "prompt.doorman.sub":
      "Clique sur le bouton « Construire » en haut à gauche de la colonne et regarde comment cela prend forme.",
  },

  es: {
    "prompt.doorman.main": "Construye algo que hace cinco segundos no estaba ahí.",
    "prompt.doorman.sub":
      "Haz clic en el botón «Construir» en la columna superior izquierda y mira cómo cobra vida.",
  },

  it: {
    "prompt.doorman.main": "Costruisci qualcosa che cinque secondi fa non esisteva ancora.",
    "prompt.doorman.sub":
      "Fai clic sul pulsante «Costruire» nella colonna in alto a sinistra e guardalo prendere forma.",
  },

  pt: {
    "prompt.doorman.main": "Constrói algo que há cinco segundos ainda não existia.",
    "prompt.doorman.sub":
      "Clica no botão «Construir» na coluna superior esquerda e vê como tudo ganha forma.",
  },

  nl: {
    "prompt.doorman.main": "Bouw iets dat vijf seconden geleden nog niet bestond.",
    "prompt.doorman.sub":
      "Klik op de knop ‘Bouwen’ linksboven in de kolom en kijk hoe het tot leven komt.",
  },

  ru: {
    "prompt.doorman.main": "Создай то, чего пять секунд назад ещё не было.",
    "prompt.doorman.sub":
      "Нажми кнопку «Создать» в левом верхнем углу колонки и наблюдай, как это возникает.",
  },

  zh: {
    "prompt.doorman.main": "创造一个在五秒前还不存在的东西。",
    "prompt.doorman.sub":
      "点击左上方栏中的「构建」按钮，看看它如何逐渐呈现出来。",
  },

  ja: {
    "prompt.doorman.main": "5秒前には存在しなかったものをつくってみよう。",
    "prompt.doorman.sub":
      "左上のカラムにある「ビルド」ボタンを押して、その姿が現れる様子を見てください。",
  },

  ko: {
    "prompt.doorman.main": "5초 전에는 없던 것을 만들어 보세요.",
    "prompt.doorman.sub":
      "왼쪽 상단 열의 ‘빌드’ 버튼을 눌러 어떻게 형태가 드러나는지 지켜보세요.",
  },

  ar: {
    "prompt.doorman.main": "ابنِ شيئًا لم يكن موجودًا قبل خمس ثوانٍ فقط.",
    "prompt.doorman.sub":
      "اضغط زر «البناء» في أعلى يسار العمود وشاهد كيف يتشكّل أمامك.",
  },

  hi: {
    "prompt.doorman.main": "कुछ ऐसा बनाओ जो पाँच सेकंड पहले तक मौजूद नहीं था।",
    "prompt.doorman.sub":
      "बाएँ-ऊपर वाले कॉलम में «बिल्ड» बटन दबाओ और देखो, यह कैसे आकार लेता है।",
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
