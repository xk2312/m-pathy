// lib/i18n.doorman.ts
// Doorman-Copy für Chat/PreChat – EN als Master.
// Wird in lib/i18n.ts via attachDoorman(dict) an das Legacy-Chat-Dict angehängt.

type DictRoot = Record<string, any>;

export const doormanDict = {
  en: {
    "prompt.doorman.main": "Build something that didn't exist five seconds ago.",
    "prompt.doorman.sub": "Press Build in the top-left column and watch it unfold.",
  },

  de: {
    "prompt.doorman.main": "Bau etwas, das vor fünf Sekunden noch nicht existiert hat.",
    "prompt.doorman.sub": "Klicke oben links in der Säule auf „Bauen“ und sieh zu, wie es entsteht.",
  },

  fr: {
    "prompt.doorman.main": "Construis quelque chose qui n’existait pas il y a cinq secondes.",
    "prompt.doorman.sub":
      "Clique sur le bouton « Construire » en haut à gauche de la colonne et regarde-le se déployer.",
  },

  es: {
    "prompt.doorman.main": "Construye algo que hace cinco segundos no existía.",
    "prompt.doorman.sub":
      "Pulsa el botón «Construir» en la columna superior izquierda y mira cómo todo se despliega.",
  },

  it: {
    "prompt.doorman.main": "Costruisci qualcosa che cinque secondi fa non esisteva.",
    "prompt.doorman.sub":
      "Fai clic sul pulsante «Costruire» in alto a sinistra nella colonna e guardalo prendere forma.",
  },

  pt: {
    "prompt.doorman.main": "Construa algo que não existia há cinco segundos.",
    "prompt.doorman.sub":
      "Clique no botão «Criar» na parte superior esquerda da coluna e veja tudo se desenrolar.",
  },

  nl: {
    "prompt.doorman.main": "Bouw iets dat vijf seconden geleden nog niet bestond.",
    "prompt.doorman.sub":
      "Klik op de knop ‘Bouwen’ linksboven in de kolom en kijk hoe het zich ontvouwt.",
  },

  ru: {
    "prompt.doorman.main": "Создай то, чего ещё не было пять секунд назад.",
    "prompt.doorman.sub":
      "Нажми кнопку «Создать» в левом верхнем углу колонки и смотри, как всё разворачивается.",
  },

  zh: {
    "prompt.doorman.main": "构建一个在五秒前还不存在的东西。",
    "prompt.doorman.sub": "点击左上方栏中的「构建」按钮，看看它如何一步步展开。",
  },

  ja: {
    "prompt.doorman.main": "5秒前には存在しなかったものをつくってみよう。",
    "prompt.doorman.sub":
      "左上のカラムにある「ビルド」ボタンを押して、その姿が立ち上がる様子を見てください。",
  },

  ko: {
    "prompt.doorman.main": "5초 전까지만 해도 없던 것을 지금 만들어 보세요.",
    "prompt.doorman.sub":
      "왼쪽 상단 열에 있는 ‘빌드’ 버튼을 눌러, 어떻게 펼쳐지는지 지켜보세요.",
  },

  ar: {
    "prompt.doorman.main": "ابنِ شيئًا لم يكن موجودًا منذ خمس ثوانٍ فقط.",
    "prompt.doorman.sub":
      "اضغط زر «الإنشاء» في أعلى يسار العمود وشاهد كيف يتكشف كل شيء أمامك.",
  },

  hi: {
    "prompt.doorman.main": "कुछ ऐसा बनाओ जो पाँच सेकंड पहले तक मौजूद ही नहीं था।",
    "prompt.doorman.sub":
      "बाएँ-ऊपर वाले कॉलम में «बिल्ड» बटन दबाओ और देखो, सब तुम्हारे सामने कैसे खुलकर आता है।",
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
