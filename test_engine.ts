import { runEngine } from "./lib/m13/engine"
import registry from "./registry/registry.json"

import type { EngineState } from "./lib/m13/engine"

let state: EngineState = {
  active: false,
  extensionId: null,
  stepId: null
}

// START
let res1 = runEngine({
  message: "echo linkedin copilot",
  state,
  registry
})

console.log("STEP 1:", res1)

state = res1.state

// NEXT
let res2 = runEngine({
  message: "1",
  state,
  registry
})

console.log("STEP 2:", res2)

state = res2.state

// NEXT
let res3 = runEngine({
  message: "2",
  state,
  registry
})

console.log("STEP 3:", res3)
