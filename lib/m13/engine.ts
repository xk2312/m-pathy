import fs from "fs"
import path from "path"

export type EngineState = {
  active: boolean
  extensionId: string | null
  stepId: string | null
  language?: string
  collectedData?: any
}
export type EngineContext = {
  message: string
  state: EngineState
  registry: any
}

export type EngineResult = {
  active: boolean
  state?: EngineState
  extensionId?: string | null
  stepId?: string | null
  step?: any | null
  instruction?: string | null
  action?: string
  payload?: {
    input_keys: string[]
    rules: any
  }
  collectedData?: any
}

export function runEngine(ctx: EngineContext): EngineResult {
const { message, state, registry } = ctx

const input = {
  value: String(message).trim(),
  stepId: state.stepId
}
const detectLanguage = (text: string) => {
  if (!text) return undefined
  const lower = text.toLowerCase()

  if (/[äöüß]/.test(lower)) return "de"
  if (/[éèêëàâîïôûùç]/.test(lower)) return "fr"
  if (/[áéíóúñ]/.test(lower)) return "es"
  if (/[àèéìíîòóù]/.test(lower)) return "it"
  if (/[ãõáéíóúç]/.test(lower)) return "pt"
  if (/[ij]/.test(lower) && /\b(de|het|een)\b/.test(lower)) return "nl"

  if (/[а-я]/.test(lower)) return "ru"
  if (/[一-龯]/.test(lower)) return "zh"
  if (/[ぁ-んァ-ン]/.test(lower)) return "ja"
  if (/[가-힣]/.test(lower)) return "ko"
  if (/[ء-ي]/.test(lower)) return "ar"
  if (/[०-९]/.test(lower)) return "hi"

  return "en"
}

const language = state.language ?? detectLanguage(message)

console.log("[ENGINE] incoming message:", message)
console.log("[ENGINE] current state:", state)

  const entries = registry?.registry?.entries || []

  if (state.active && state.extensionId && state.stepId) {
    console.log("[ENGINE] loop mode active")

    const entry = entries.find(
      (e: any) => e.id === state.extensionId
    )

    if (!entry) {
      console.error("[ENGINE][ERROR] extension not found:", state.extensionId)
      return {
        active: false,
        state: {
          active: false,
          extensionId: null,
          stepId: null,
          language

        },
        extensionId: null,
        stepId: null,
        step: null
      }
    }

    const extensionPath = path.join(process.cwd(), entry.path)
    const raw = fs.readFileSync(extensionPath, "utf-8")
    const extension = JSON.parse(raw)

let currentStep = extension.steps[state.stepId]
console.log("[ENGINE][INPUT RECEIVED]", {
  rawMessage: message,
  normalized: message,
  stepId: state.stepId,
  expectedKey: currentStep?.key,
  type: currentStep?.type
})

if (!currentStep) {
  console.error("[ENGINE][ERROR] step not found, resetting to entry:", state.stepId)
  const fallbackId = extension.entry
  currentStep = extension.steps[fallbackId]

  return {
    active: true,
    state: {
      active: true,
      extensionId: state.extensionId,
      stepId: fallbackId,
      language
    },
    extensionId: state.extensionId,
    stepId: fallbackId,
    step: currentStep,
    instruction: currentStep.instruction || null
  }
}

  if (currentStep.type === "selection") {
  const raw = input.value

  if (currentStep.type === "input") {
  const raw = input.value

  if (!raw || raw === "1" || raw === "2" || raw === "3") {
    console.error("[ENGINE][ERROR] invalid input for input step", {
      stepId: state.stepId,
      value: raw
    })

    return {
      active: true,
      state: {
        ...state,
        language
      },
      extensionId: state.extensionId,
      stepId: state.stepId,
      step: currentStep,
      instruction: currentStep.instruction || null
    }
  }
}

const options = currentStep.content?.options || {}

const isValid =
  options[raw] !== undefined ||
  options[String(raw)] !== undefined ||
  options[Number(raw)] !== undefined

if (!isValid) {
console.error("[ENGINE][ERROR] invalid input for step:", state.stepId, "input:", raw);

return {
  active: true,
  state: {
  ...state,
  language
},
  extensionId: state.extensionId,
  stepId: state.stepId,
  step: currentStep,
  instruction: currentStep.instruction || null
}
  }
}

const collectedData = (state as any)?.collectedData || {};

if (currentStep.key) {
  const setNestedValue = (obj: any, path: string, value: any) => {
  const keys = path.split(".");
  let current = obj;

  keys.forEach((key, index) => {
    if (index === keys.length - 1) {
      current[key] = value;
    } else {
      if (!current[key]) current[key] = {};
      current = current[key];
    }
  });

  return obj;
};



console.log("[ENGINE][BEFORE PERSIST]", {
  stepId: state.stepId,
  key: currentStep.key,
  value: input.value
})

const updatedData = setNestedValue(
  JSON.parse(JSON.stringify((state as any).collectedData || {})),
  currentStep.key,
  input.value
);

(state as any).collectedData = updatedData;
}
console.log("[ENGINE][PERSIST AFTER STEP]", currentStep.key);
console.log(JSON.stringify((state as any).collectedData, null, 2));

// 🔥 EXECUTION PERSIST (RICHTIGER ORT)
if (currentStep.type === "execution" && currentStep.persist) {
  try {
    console.log("[M13][ENGINE][PERSIST][EXECUTION] START", currentStep.persist);

    for (const targetPath in currentStep.persist) {
      const sourceKey = currentStep.persist[targetPath];
      const value = (state as any).collectedData[sourceKey];

      if (value === undefined) continue;

      const parts = targetPath.split(".");
      let cursor = (state as any).collectedData;

      for (let i = 0; i < parts.length - 1; i++) {
        if (!cursor[parts[i]]) cursor[parts[i]] = {};
        cursor = cursor[parts[i]];
      }

      cursor[parts[parts.length - 1]] = value;

      console.log("[M13][ENGINE][PERSIST][EXECUTION] MAPPED", {
        from: sourceKey,
        to: targetPath,
        value
      });
    }

  } catch (err) {
    console.error("[M13][ENGINE][PERSIST][EXECUTION] ERROR", err);
  }
}

let next

const userInput = input?.value?.trim()

console.log("[ENGINE][ROUTING][START]", {
  stepId: state.stepId,
  type: currentStep.type,
  input: userInput
})

if (currentStep.type === "selection") {
  if (currentStep.next_map) {
    console.log("[ENGINE][ROUTING] using next_map")

    if (userInput in currentStep.next_map) {
      next = currentStep.next_map[userInput]

      console.log("[ENGINE][ROUTING] next_map hit", {
        input: userInput,
        resolvedNext: next
      })

    } else {
      console.error("[ENGINE][ERROR] invalid selection:", userInput)

      console.log("[ENGINE][ROUTING] available options:", Object.keys(currentStep.next_map))

      return {
        active: true,
        state: {
          ...state,
          language
        },
        extensionId: state.extensionId,
        stepId: state.stepId,
        step: currentStep,
        instruction: currentStep.instruction || null
      }
    }

  } else if (currentStep.next !== undefined) {
    console.log("[ENGINE][ROUTING] fallback to next")

    next = currentStep.next

  } else {
    console.error("[ENGINE][ERROR] no routing defined for selection step:", state.stepId)

    return {
      active: false,
      state: {
        active: false,
        extensionId: null,
        stepId: null,
        language
      },
      extensionId: null,
      stepId: null,
      step: null
    }
  }

} else {
  console.log("[ENGINE][ROUTING] non-selection step → using next")

  next = currentStep.next
}

console.log("[ENGINE][ROUTING][RESOLVED]", {
  stepId: state.stepId,
  next
})
if (next === null) {
  console.log("[ENGINE][ROUTING][EXIT]", {
    stepId: state.stepId
  })
}
  if (currentStep.type === "action") {
    return {
      active: false,
      action: currentStep.action,
      payload: {
        input_keys: currentStep.input_keys || [],
        rules: currentStep.rules || {}
      }
    }
  

  console.log("[M13][ENGINE][FINAL COLLECTED DATA]");
  console.log(JSON.stringify((state as any).collectedData, null, 2));

  return {
    active: false,
    state: {
      active: false,
      extensionId: null,
      stepId: null,
      language
    },
    extensionId: null,
    stepId: null,
    step: currentStep,
    collectedData: (state as any).collectedData
  }
  }

    const nextStep = extension.steps[next]

    if (!nextStep) {
      console.error("[ENGINE][ERROR] invalid next reference:", next)
      return {
        active: false,
        state: {
          active: false,
          extensionId: null,
          stepId: null,
          language

        },
        extensionId: null,
        stepId: null,
        step: null
      }
    }

    let stepWithRender = nextStep

if (nextStep?.content?.options && typeof nextStep.content.options === "object") {
  const renderedOptions = Object.entries(nextStep.content.options)
    .map(([id, label]) => `• ${id}: ${label}`)
    .join("\n")

  stepWithRender = {
    ...nextStep,
    content: {
      ...nextStep.content,
      renderedOptions
    }
  }
}

return {
  active: true,
  state: {
    active: true,
    extensionId: state.extensionId,
    stepId: next,
    language,
    collectedData: (state as any).collectedData
  },
  extensionId: state.extensionId,
  stepId: next,
  step: stepWithRender,
  instruction: nextStep.instruction || null,
  collectedData: (state as any).collectedData
}
  }

  const matched = entries.find(
    (entry: any) => entry.command === message
  )

  if (!matched) {
    console.log("[ENGINE] no command match")
    return {
      active: false,
      state: {
        ...state,
        language
      },
      extensionId: null,
      stepId: null,
      step: null
    }
  }

  console.log("[ENGINE] command matched:", matched.id)

  const extensionPath = path.join(process.cwd(), matched.path)
  const raw = fs.readFileSync(extensionPath, "utf-8")
  const extension = JSON.parse(raw)

 const firstStepId = extension.entry
const firstStep = extension.steps[firstStepId]

if (!firstStep) {
  console.error("[ENGINE][ERROR] invalid entry step:", firstStepId)
  return {
    active: false,
    state: {
      ...state,
      language
    },
    extensionId: null,
    stepId: null,
    step: null
  }
}

console.log("[ENGINE] first step:", firstStepId)
let firstStepWithRender = firstStep

if (firstStep?.content?.options && typeof firstStep.content.options === "object") {
  const renderedOptions = Object.entries(firstStep.content.options)
    .map(([id, label]) => `• ${id}: ${label}`)
    .join("\n")

  firstStepWithRender = {
    ...firstStep,
    content: {
      ...firstStep.content,
      renderedOptions
    }
  }
}

return {
  active: true,
  state: {
  active: true,
  extensionId: matched.id,
  stepId: firstStepId,
  language,
  collectedData: {}
},
  extensionId: matched.id,
  stepId: firstStepId,
  step: firstStepWithRender,
  instruction: firstStep.instruction || null
}
}