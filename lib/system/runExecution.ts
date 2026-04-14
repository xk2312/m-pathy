export async function runExecution(userRegistry: any) {
  const res = await fetch("/api/run", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      user_registry: userRegistry || null,
    }),
  });

  if (!res.ok) {
    throw new Error("Execution failed");
  }

  return await res.json();
}