export async function processRecords(records) {
  const res = await fetch("http://localhost:8000/process", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ records }),
  });

  if (!res.ok) {
    throw new Error("Backend error: " + res.statusText);
  }

  return await res.json();
}
