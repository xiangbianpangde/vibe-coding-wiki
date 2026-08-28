// Fix Sol #3: header button nesting in term.html + all pages/*.html
const fs = require('fs');
const path = require('path');

const files = [
  'term.html',
  'pages/citations.html',
  'pages/compare.html',
  'pages/glossary.html',
  'pages/graph.html',
  'pages/layers.html',
  'pages/scenarios.html',
  'pages/stats.html',
];

let count = 0;
for (const f of files) {
  const fp = path.join(__dirname, '..', f);
  let html = fs.readFileSync(fp, 'utf8');
  const original = html;

  // 修 topnav__search button
  html = html.replace(
    /<button class="topnav__search" onclick="[^"]*">/,
    `<button type="button" class="topnav__search" aria-label="搜索术语（按 �K）" onclick="document.getElementById('search-modal').classList.add('open')">`
  );

  // 修 lang-toggle button
  html = html.replace(
    /<button class="lang-toggle" aria-label="Switch language" type="button">/,
    `<button type="button" class="lang-toggle" aria-label="Switch language">`
  );

  // 修 theme-toggle button
  html = html.replace(
    /<button class="theme-toggle" aria-label="切换暗色\/浅色主题，按 Enter 切换">/,
    `<button type="button" class="theme-toggle" aria-label="切换暗色/浅色主题">`
  );

  // 修 vc-nav-toggle button（如果存在）
  html = html.replace(
    /<button class="vc-nav-toggle" aria-label="打开主导航菜单">/,
    `<button type="button" class="vc-nav-toggle" aria-label="打开主导航菜单">`
  );

  // 修复：lang-toggle button 缺 type
  html = html.replace(
    /<button class="lang-toggle" aria-label="Switch language">/,
    `<button type="button" class="lang-toggle" aria-label="Switch language">`
  );

  if (html !== original) {
    fs.writeFileSync(fp, html);
    count++;
    console.log(`[fix] ${f}`);
  } else {
    console.log(`[skip] ${f} (no changes)`);
  }
}

console.log(`[fix] Updated ${count} files`);
