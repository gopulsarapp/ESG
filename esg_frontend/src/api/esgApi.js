export async function processRecords(records) {
  const res = await fetch("https://esg-1-b693.onrender.com/process", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ records }),
  });

  if (!res.ok) {
    throw new Error("Backend error: " + res.statusText);
  }

  return await res.json();
}
