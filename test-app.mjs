import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  
  console.log('📱 Acessando http://localhost:3000...');
  await page.goto('http://localhost:3000');
  await page.waitForLoadState('networkidle');
  
  // Take initial screenshot
  await page.screenshot({ path: 'screenshot-1-initial.png' });
  console.log('✅ Screenshot 1: Página inicial capturada');
  
  // Check if we're on login page
  const title = await page.title();
  console.log(`🔍 Título da página: "${title}"`);
  
  // Try to find elements
  const hasLoginButton = await page.locator('button:has-text("Login")').isVisible().catch(() => false);
  const hasRegisterLink = await page.locator('a:has-text("Registrar")').isVisible().catch(() => false);
  const hasEmail = await page.locator('input[type="email"]').isVisible().catch(() => false);
  
  console.log(`📋 Elementos detectados:`);
  console.log(`  - Input Email: ${hasEmail}`);
  console.log(`  - Botão Login: ${hasLoginButton}`);
  console.log(`  - Link Registrar: ${hasRegisterLink}`);
  
  // Check page content
  const bodyText = await page.locator('body').textContent();
  console.log(`📄 Conteúdo da página:\n${bodyText.substring(0, 300)}...`);
  
  // Wait for user interaction
  console.log('\n⏳ Navegador aberto. Você pode interagir com o app (30s timeout)...');
  await new Promise(resolve => setTimeout(resolve, 30000));
  
  await browser.close();
  console.log('✅ Teste concluído');
})().catch(err => {
  console.error('❌ Erro:', err.message);
  process.exit(1);
});
