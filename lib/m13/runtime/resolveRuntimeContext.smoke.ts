import { resolveRuntimeContext } from "./resolveRuntimeContext";

type SmokeEnv = Record<string, string | undefined>;

function assert(condition: boolean, message: string): void {
  if (!condition) {
    throw new Error(message);
  }
}

function runSmokeTest(name: string, test: () => void): void {
  try {
    test();
    console.log(`PASS ${name}`);
  } catch (error) {
    console.error(`FAIL ${name}`);
    console.error(error);
    process.exitCode = 1;
  }
}

const productionEnv: SmokeEnv = {
  M13_RUNTIME_ENV: "production",
  M13_BILLING_CONTEXT: "main",
  M13_LEDGER_CONTEXT: "production",
  M13_CHECKOUT_CONTEXT: "stripe_live",
  M13_BALANCE_SOURCE: "main_account_token_balance",
  APP_BASE_URL: "https://m-pathy.ai",
  AUTH_CALLBACK_BASE_URL: "https://m-pathy.ai",
  MAGIC_LINK_BASE_URL: "https://m-pathy.ai",
};

const stagingEnv: SmokeEnv = {
  M13_RUNTIME_ENV: "staging",
  M13_BILLING_CONTEXT: "staging_dev",
  M13_LEDGER_CONTEXT: "staging",
  M13_CHECKOUT_CONTEXT: "disabled_admin_grant",
  M13_BALANCE_SOURCE: "staging_dev_token_balance",
  APP_BASE_URL: "https://staging.m-pathy.ai",
  AUTH_CALLBACK_BASE_URL: "https://staging.m-pathy.ai",
  MAGIC_LINK_BASE_URL: "https://staging.m-pathy.ai",
};

runSmokeTest("accepts valid production runtime context", () => {
  const result = resolveRuntimeContext(productionEnv);

  assert(result.ok === true, "production context should be valid");

  if (!result.ok) return;

  assert(result.context.runtimeEnv === "production", "runtimeEnv mismatch");
  assert(result.context.billingContext === "main", "billingContext mismatch");
  assert(result.context.ledgerContext === "production", "ledgerContext mismatch");
  assert(result.context.checkoutContext === "stripe_live", "checkoutContext mismatch");
  assert(
    result.context.balanceSource === "main_account_token_balance",
    "balanceSource mismatch"
  );
});

runSmokeTest("accepts valid staging runtime context", () => {
  const result = resolveRuntimeContext(stagingEnv);

  assert(result.ok === true, "staging context should be valid");

  if (!result.ok) return;

  assert(result.context.runtimeEnv === "staging", "runtimeEnv mismatch");
  assert(result.context.billingContext === "staging_dev", "billingContext mismatch");
  assert(result.context.ledgerContext === "staging", "ledgerContext mismatch");
  assert(
    result.context.checkoutContext === "disabled_admin_grant",
    "checkoutContext mismatch"
  );
  assert(
    result.context.balanceSource === "staging_dev_token_balance",
    "balanceSource mismatch"
  );
});

runSmokeTest("rejects missing runtime env", () => {
  const result = resolveRuntimeContext({
    ...productionEnv,
    M13_RUNTIME_ENV: undefined,
  });

  assert(result.ok === false, "missing runtime env should be invalid");

  if (result.ok) return;

  assert(
    result.missing.includes("M13_RUNTIME_ENV"),
    "missing should include M13_RUNTIME_ENV"
  );
});

runSmokeTest("rejects production with staging balance source", () => {
  const result = resolveRuntimeContext({
    ...productionEnv,
    M13_BALANCE_SOURCE: "staging_dev_token_balance",
  });

  assert(result.ok === false, "mixed production balance should be invalid");

  if (result.ok) return;

  assert(
    result.invalid.includes("M13_BALANCE_SOURCE"),
    "invalid should include M13_BALANCE_SOURCE"
  );
});

runSmokeTest("rejects staging with stripe live checkout", () => {
  const result = resolveRuntimeContext({
    ...stagingEnv,
    M13_CHECKOUT_CONTEXT: "stripe_live",
  });

  assert(result.ok === false, "staging stripe live should be invalid");

  if (result.ok) return;

  assert(
    result.invalid.includes("M13_CHECKOUT_CONTEXT"),
    "invalid should include M13_CHECKOUT_CONTEXT"
  );
});

runSmokeTest("rejects next public base url as server authority", () => {
  const result = resolveRuntimeContext({
    ...productionEnv,
    APP_BASE_URL: undefined,
    NEXT_PUBLIC_BASE_URL: "https://m-pathy.ai",
  });

  assert(result.ok === false, "NEXT_PUBLIC_BASE_URL must not replace APP_BASE_URL");

  if (result.ok) return;

  assert(result.missing.includes("APP_BASE_URL"), "missing should include APP_BASE_URL");
});