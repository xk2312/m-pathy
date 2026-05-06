export type M13RuntimeEnv = "production" | "staging";
export type M13BillingContext = "main" | "staging_dev";
export type M13LedgerContext = "production" | "staging";
export type M13CheckoutContext = "stripe_live" | "disabled_admin_grant";
export type M13BalanceSource =
  | "main_account_token_balance"
  | "staging_dev_token_balance";

export type M13RuntimeContext = {
  runtimeEnv: M13RuntimeEnv;
  billingContext: M13BillingContext;
  ledgerContext: M13LedgerContext;
  checkoutContext: M13CheckoutContext;
  balanceSource: M13BalanceSource;
  appBaseUrl: string;
  authCallbackBaseUrl: string;
  magicLinkBaseUrl: string;
};

export type M13RuntimeContextResult =
  | {
      ok: true;
      context: M13RuntimeContext;
    }
  | {
      ok: false;
      error: "runtime_context_invalid";
      missing: string[];
      invalid: string[];
    };

type RuntimeEnvSource = Record<string, string | undefined>;

const REQUIRED_ENV_KEYS = [
  "M13_RUNTIME_ENV",
  "M13_BILLING_CONTEXT",
  "M13_LEDGER_CONTEXT",
  "M13_CHECKOUT_CONTEXT",
  "M13_BALANCE_SOURCE",
  "APP_BASE_URL",
  "AUTH_CALLBACK_BASE_URL",
  "MAGIC_LINK_BASE_URL",
] as const;

const ALLOWED_RUNTIME_ENVS = ["production", "staging"] as const;
const ALLOWED_BILLING_CONTEXTS = ["main", "staging_dev"] as const;
const ALLOWED_LEDGER_CONTEXTS = ["production", "staging"] as const;
const ALLOWED_CHECKOUT_CONTEXTS = [
  "stripe_live",
  "disabled_admin_grant",
] as const;
const ALLOWED_BALANCE_SOURCES = [
  "main_account_token_balance",
  "staging_dev_token_balance",
] as const;

function isOneOf<T extends readonly string[]>(
  value: string | undefined,
  allowed: T
): value is T[number] {
  return typeof value === "string" && allowed.includes(value);
}

function isHttpsUrl(value: string | undefined): value is string {
  if (!value) return false;

  try {
    const url = new URL(value);
    return url.protocol === "https:";
  } catch {
    return false;
  }
}

function pushInvalidIf(
  invalid: string[],
  condition: boolean,
  key: string
): void {
  if (condition && !invalid.includes(key)) {
    invalid.push(key);
  }
}

export function resolveRuntimeContext(
  env: RuntimeEnvSource = process.env
): M13RuntimeContextResult {
  const missing = REQUIRED_ENV_KEYS.filter((key) => !env[key]);
  const invalid: string[] = [];

  const runtimeEnv = env.M13_RUNTIME_ENV;
  const billingContext = env.M13_BILLING_CONTEXT;
  const ledgerContext = env.M13_LEDGER_CONTEXT;
  const checkoutContext = env.M13_CHECKOUT_CONTEXT;
  const balanceSource = env.M13_BALANCE_SOURCE;
  const appBaseUrl = env.APP_BASE_URL;
  const authCallbackBaseUrl = env.AUTH_CALLBACK_BASE_URL;
  const magicLinkBaseUrl = env.MAGIC_LINK_BASE_URL;

  pushInvalidIf(
    invalid,
    !!runtimeEnv && !isOneOf(runtimeEnv, ALLOWED_RUNTIME_ENVS),
    "M13_RUNTIME_ENV"
  );

  pushInvalidIf(
    invalid,
    !!billingContext && !isOneOf(billingContext, ALLOWED_BILLING_CONTEXTS),
    "M13_BILLING_CONTEXT"
  );

  pushInvalidIf(
    invalid,
    !!ledgerContext && !isOneOf(ledgerContext, ALLOWED_LEDGER_CONTEXTS),
    "M13_LEDGER_CONTEXT"
  );

  pushInvalidIf(
    invalid,
    !!checkoutContext && !isOneOf(checkoutContext, ALLOWED_CHECKOUT_CONTEXTS),
    "M13_CHECKOUT_CONTEXT"
  );

  pushInvalidIf(
    invalid,
    !!balanceSource && !isOneOf(balanceSource, ALLOWED_BALANCE_SOURCES),
    "M13_BALANCE_SOURCE"
  );

  pushInvalidIf(invalid, !!appBaseUrl && !isHttpsUrl(appBaseUrl), "APP_BASE_URL");

  pushInvalidIf(
    invalid,
    !!authCallbackBaseUrl && !isHttpsUrl(authCallbackBaseUrl),
    "AUTH_CALLBACK_BASE_URL"
  );

  pushInvalidIf(
    invalid,
    !!magicLinkBaseUrl && !isHttpsUrl(magicLinkBaseUrl),
    "MAGIC_LINK_BASE_URL"
  );

  if (runtimeEnv === "production") {
    pushInvalidIf(invalid, billingContext !== "main", "M13_BILLING_CONTEXT");
    pushInvalidIf(invalid, ledgerContext !== "production", "M13_LEDGER_CONTEXT");
    pushInvalidIf(
      invalid,
      checkoutContext !== "stripe_live",
      "M13_CHECKOUT_CONTEXT"
    );
    pushInvalidIf(
      invalid,
      balanceSource !== "main_account_token_balance",
      "M13_BALANCE_SOURCE"
    );
  }

  if (runtimeEnv === "staging") {
    pushInvalidIf(
      invalid,
      billingContext !== "staging_dev",
      "M13_BILLING_CONTEXT"
    );
    pushInvalidIf(invalid, ledgerContext !== "staging", "M13_LEDGER_CONTEXT");
    pushInvalidIf(
      invalid,
      checkoutContext !== "disabled_admin_grant",
      "M13_CHECKOUT_CONTEXT"
    );
    pushInvalidIf(
      invalid,
      balanceSource !== "staging_dev_token_balance",
      "M13_BALANCE_SOURCE"
    );
  }

  if (missing.length > 0 || invalid.length > 0) {
    return {
      ok: false,
      error: "runtime_context_invalid",
      missing,
      invalid,
    };
  }

  return {
    ok: true,
    context: {
      runtimeEnv: runtimeEnv as M13RuntimeEnv,
      billingContext: billingContext as M13BillingContext,
      ledgerContext: ledgerContext as M13LedgerContext,
      checkoutContext: checkoutContext as M13CheckoutContext,
      balanceSource: balanceSource as M13BalanceSource,
      appBaseUrl: appBaseUrl as string,
      authCallbackBaseUrl: authCallbackBaseUrl as string,
      magicLinkBaseUrl: magicLinkBaseUrl as string,
    },
  };
}