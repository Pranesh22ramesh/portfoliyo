import { defineConfig } from '@playwright/test';
import { existsSync } from 'node:fs';
const chrome = 'C:/Program Files/Google/Chrome/Application/chrome.exe';

export default defineConfig({
  testDir:'./e2e', testMatch:'**/*.spec.ts', workers:1, timeout:90000,
  use:{baseURL:process.env.PLAYWRIGHT_BASE_URL??'http://127.0.0.1:3000', browserName:'chromium',
    launchOptions:{executablePath:existsSync(chrome)?chrome:undefined,args:['--enable-webgl','--use-angle=swiftshader','--enable-unsafe-swiftshader']}},
});
