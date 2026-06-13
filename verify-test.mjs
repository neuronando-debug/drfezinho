import { run } from "node:test";
import { chromium } from "playwright";

const BASE = "http://localhost:3000";
const EMAIL = `test_${Date.now()}@gmail.com`;
const PASSWORD = "Test@12345";
const NAME = "João Teste";

const browser = await chromium.launch({ headless: true });
const ctx = await browser.newContext();
const page = await ctx.newPage();

// Captura logs do console e erros de rede
const consoleLogs = [];
const networkErrors = [];
page.on("console", m => consoleLogs.push(`[${m.type()}] ${m.text()}`));
page.on("requestfailed", req => networkErrors.push(`FAIL: ${req.url()} — ${req.failure()?.errorText}`));

const log = (msg) => console.log(`  ${msg}`);

// ---------- 1. Root redirect ----------
log("1. Acessando / ...");
await page.goto(BASE);
await page.waitForURL("**/login", { timeout: 5000 });
log(`   ✅ Redirecionado para: ${page.url()}`);

// ---------- 2. Cadastro ----------
log("2. Abrindo /register ...");
await page.goto(`${BASE}/register`);
await page.waitForLoadState("networkidle");

log(`   Preenchendo campos...`);
await page.fill("#name", NAME);
await page.fill("#email", EMAIL);
await page.fill("#password", PASSWORD);

// Capturar resposta da chamada ao Supabase
let supabaseResponse = null;
page.on("response", async (res) => {
  if (res.url().includes("supabase") && res.url().includes("signup")) {
    try {
      supabaseResponse = { status: res.status(), body: await res.json() };
    } catch {}
  }
});

log(`   Clicando em submit...`);
await page.click('button[type="submit"]');
await page.waitForTimeout(4000);

log(`   URL após submit: ${page.url()}`);

if (supabaseResponse) {
  log(`   Resposta Supabase signup: status=${supabaseResponse.status}`);
  if (supabaseResponse.body?.error_description || supabaseResponse.body?.msg) {
    log(`   ⚠️ Erro Supabase: ${supabaseResponse.body.error_description || supabaseResponse.body.msg}`);
  }
  if (supabaseResponse.body?.access_token) {
    log(`   ✅ Session criada com sucesso`);
  }
} else {
  log(`   ⚠️ Nenhuma chamada ao Supabase /signup detectada`);
}

if (consoleLogs.length) {
  log(`   Console logs:`);
  consoleLogs.forEach(l => log(`     ${l}`));
}
if (networkErrors.length) {
  log(`   Erros de rede:`);
  networkErrors.forEach(l => log(`     ${l}`));
}

// ---------- 3. Verificar página atual ----------
const pageTitle = await page.title();
const bodyText = await page.textContent("body");
log(`   Título da página: "${pageTitle}"`);

// Verificar se há mensagem de toast visível
const toastEl = await page.$('[data-state="open"]');
if (toastEl) {
  const toastText = await toastEl.textContent();
  log(`   Toast visível: "${toastText}"`);
}

if (page.url().includes("/welcome")) {
  log(`   ✅ Chegou em /welcome`);
} else if (page.url().includes("/dashboard")) {
  log(`   ✅ Chegou em /dashboard (proxy redirecionou)`);
} else {
  log(`   ❌ Ainda em: ${page.url()}`);
  // Mostrar primeiros 500 chars da body para debug
  log(`   Body snippet: ${bodyText?.slice(0, 500)}`);
  await browser.close();
  process.exit(1);
}

await browser.close();
console.log("\n✅ Diagnóstico concluído.");
run(test)
