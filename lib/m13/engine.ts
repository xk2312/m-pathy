import fs from "fs"
import path from "path"

export type EngineState = {
  active: boolean
  extensionId: string | null
  stepId: string | null
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
          stepId: null
        },
        extensionId: null,
        stepId: null,
        step: null
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
          stepId: null
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
          stepId: null
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
          stepId: null
        },
        extensionId: null,
        stepId: null,
        step: null
      }
    }

    return {
      active: true,
      state: {
        active: true,
        extensionId: state.extensionId,
        stepId: next
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
      stepId: firstStepId
    },
    extensionId: matched.id,
    stepId: firstStepId,
    step: firstStep
  }
}