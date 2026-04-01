import fs from "fs"
import path from "path"

export type EngineState = {
  active: boolean
  extensionId: string | null
  stepId: string | null
  answers?: Record<string, string>
}

export type EngineContext = {
  message: string
  state: EngineState
  registry: any
}

export type EngineResult = {
  active: boolean
  state: EngineState
  extensionId: string | null
  stepId: string | null
  step: any | null
}

export function runEngine(ctx: EngineContext): EngineResult {
  const { message, state, registry } = ctx

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
          stepId: null
        },
        extensionId: null,
        stepId: null,
        step: null
      }
    }

    const extensionPath = path.join(process.cwd(), entry.path)
    const raw = fs.readFileSync(extensionPath, "utf-8")
    const extension = JSON.parse(raw)

    const currentStep = extension.steps[state.stepId]

    if (!currentStep) {
      console.error("[ENGINE][ERROR] step not found:", state.stepId)
      return {
        active: false,
        state: {
          active: false,
          extensionId: null,
          stepId: null,
          answers: {}
        },
        extensionId: null,
        stepId: null,
        step: null
      }
    }

    const answers = state.answers ?? {}
    const nextAnswers = { ...answers }

    if (currentStep.type === "selection") {
      const options = currentStep.content?.options ?? {}
      if (!message || !options[message]) {
        console.error("[ENGINE][ERROR] invalid selection input:", message)
        return {
          active: true,
          state: {
            active: true,
            extensionId: state.extensionId,
            stepId: state.stepId,
            answers
          },
          extensionId: state.extensionId,
          stepId: state.stepId,
          step: currentStep
        }
      }
      if (currentStep.key) {
        nextAnswers[currentStep.key] = options[message]
      }
    }

    if (currentStep.type === "question") {
      const trimmedMessage = message.trim()
      if (!trimmedMessage || trimmedMessage.toLowerCase() === "weiter") {
        console.error("[ENGINE][ERROR] invalid question input:", message)
        return {
          active: true,
          state: {
            active: true,
            extensionId: state.extensionId,
            stepId: state.stepId,
            answers
          },
          extensionId: state.extensionId,
          stepId: state.stepId,
          step: currentStep
        }
      }
      if (currentStep.key) {
        nextAnswers[currentStep.key] = trimmedMessage
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
          answers: {}
        },
        extensionId: null,
        stepId: null,
        step: null
      }
    }

    if (next === null) {
      console.log("[ENGINE] exit reached at step:", state.stepId)
      return {
        active: false,
        state: {
          active: false,
          extensionId: null,
          stepId: null,
          answers: {}
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
          answers: {}
        },
        extensionId: null,
        stepId: null,
        step: null
      }
    }

    if (nextStep.type === "action") {
      const requiredKeys = nextStep.input_keys ?? []
      const missingKeys = requiredKeys.filter((key: string) => !nextAnswers[key])

      if (missingKeys.length > 0) {
        console.error("[ENGINE][ERROR] missing action inputs:", missingKeys)
        return {
          active: true,
          state: {
            active: true,
            extensionId: state.extensionId,
            stepId: state.stepId,
            answers: nextAnswers
          },
          extensionId: state.extensionId,
          stepId: state.stepId,
          step: currentStep
        }
      }
    }

    return {
      active: true,
      state: {
        active: true,
        extensionId: state.extensionId,
        stepId: next,
        answers: nextAnswers
      },
      extensionId: state.extensionId,
      stepId: next,
      step: nextStep
    }
  }

  const matched = entries.find(
    (entry: any) => entry.command === message
  )

  if (!matched) {
    console.log("[ENGINE] no command match")
    return {
      active: false,
      state,
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

  console.log("[ENGINE] first step:", firstStepId)

   return {
    active: true,
    state: {
      active: true,
      extensionId: matched.id,
      stepId: firstStepId,
      answers: {}
    },
    extensionId: matched.id,
    stepId: firstStepId,
    step: firstStep
  }
}