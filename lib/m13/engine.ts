import fs from "fs"
import path from "path"

export type EngineState = {
  active: boolean
  extensionId: string | null
  stepId: string | null
  collected?: Record<string, any>
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
}

export function runEngine(ctx: EngineContext): EngineResult {
  const { message, state, registry } = ctx

const collected = state.collected || {}
  const setDeep = (obj: any, path: string, value: any) => {
    const keys = path.split(".")
    let current = obj
    for (let i = 0; i < keys.length - 1; i++) {
      if (!current[keys[i]]) current[keys[i]] = {}
      current = current[keys[i]]
    }
    current[keys[keys.length - 1]] = value
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

const language = detectLanguage(message)
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
          collected: state.collected
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
    collected: state.collected
  },
  extensionId: state.extensionId,
  stepId: fallbackId,
  step: extension.steps[fallbackId],
  instruction: extension.steps[fallbackId]?.instruction || null
}
}

    if (currentStep.type === "input") {
  const value = String(message).trim()
  if (currentStep.key) {
setDeep(collected, currentStep.key, value)
state.collected = collected  }
}

if (currentStep.type === "selection") {
  const raw = String(message).trim()

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
  collected: state.collected
},
  extensionId: state.extensionId,
  stepId: state.stepId,
  step: currentStep,
  instruction: currentStep.instruction || null
}
  }
}

if (currentStep.type === "execution") {
  try {
    const inputPath = path.join(process.cwd(), "run/01_input.json")
fs.writeFileSync(inputPath, JSON.stringify(state.collected || {}, null, 2), "utf-8")
    const { execSync } = require("child_process")
    execSync("bash run.sh", { stdio: "inherit" })

    const outputPath = path.join(process.cwd(), "run/08_c6_challenge1.json")
    const rawOutput = fs.readFileSync(outputPath, "utf-8")
    const parsed = JSON.parse(rawOutput)

    const result = parsed?.response_after || ""

    const questions = [
      "Welche der identifizierten Risiken ist aus Ihrer Sicht aktuell am kritischsten für Ihre Einrichtung?",
      "Bestehen für diese Bereiche bereits konkrete Absicherungen oder gibt es hier noch Lücken?",
      "Wünschen Sie eine gezielte Einordnung, wie diese Risiken typischerweise in der Sachversicherung strukturiert abgesichert werden?"
    ]

    const finalText = result + "\n\n" + questions.map((q, i) => `${i + 1}. ${q}`).join("\n")

    return {
      active: false,
      state: {
        active: false,
        extensionId: null,
        stepId: null,
        collected: state.collected

      },
      extensionId: null,
      stepId: null,
      step: null,
      instruction: null,
      action: "final_output",
      payload: {
        input_keys: [],
        rules: { output: finalText }
      }
    }
  } catch (err) {
    console.error("[ENGINE][ERROR] execution failed:", err)
    return {
      active: false,
      state: {
        active: false,
        extensionId: null,
        stepId: null,
        collected: state.collected

      },
      extensionId: null,
      stepId: null,
      step: null
    }
  }
}

const next = currentStep.next

    if (next === undefined) {
      console.error("[ENGINE][ERROR] next missing in step:", state.stepId)
      return {
        active: false,
        state: {
          active: false,
          extensionId: null,
          stepId: null,
          collected: state.collected


        },
        extensionId: null,
        stepId: null,
        step: null
      }
    }

  if (next === null) {
  console.log("[ENGINE] exit reached at step:", state.stepId)

if (currentStep.type === "action") {
  state.collected = collected

  return {
    active: true,
    state: {
      active: true,
      extensionId: state.extensionId,
      stepId: currentStep.next,
      collected,
    },
    extensionId: state.extensionId,
    stepId: currentStep.next,
    step: extension.steps[currentStep.next],
    instruction: extension.steps[currentStep.next]?.instruction || null
  }
}

  return {
    active: false,
    state: {
      active: false,
      extensionId: null,
      stepId: null,
      collected: state.collected


    },
    extensionId: null,
    stepId: null,
    step: currentStep
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
          collected: state.collected


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
    collected: state.collected


  },
  extensionId: state.extensionId,
  stepId: next,
  step: stepWithRender,
  instruction: nextStep.instruction || null
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
        collected: state.collected

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
      collected: state.collected

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
    collected: state.collected


  },
  extensionId: matched.id,
  stepId: firstStepId,
  step: firstStepWithRender,
  instruction: firstStep.instruction || null
}
}