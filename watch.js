#!/usr/bin/env node
import { watch } from "fs"
import { execSync } from "child_process"

const OBSIDIAN_VAULT = "/Users/ap/Documents/Obsidian Vault"
const QUARTZ_DIR = "/Users/ap/Desktop/quartz/quartz"
const DEBOUNCE_MS = 30000 // 30 seconds after last change

let timer = null

function deploy() {
  try {
    console.log(`[${new Date().toLocaleString()}] Syncing Obsidian -> GitHub...`)
    execSync(`bash "${QUARTZ_DIR}/deploy.sh"`, { stdio: "inherit" })
  } catch (e) {
    console.error("Deploy failed:", e.message)
  }
  timer = null
}

function onChange() {
  if (timer) clearTimeout(timer)
  timer = setTimeout(deploy, DEBOUNCE_MS)
}

console.log("Watching Obsidian vault for changes...")
console.log(`  Path: ${OBSIDIAN_VAULT}`)
console.log(`  Debounce: ${DEBOUNCE_MS / 1000}s`)

watch(OBSIDIAN_VAULT, { recursive: true }, (event, filename) => {
  if (!filename) return
  // Skip hidden/system files
  if (filename.startsWith(".") || filename.endsWith(".DS_Store")) return
  console.log(`  Changed: ${filename}`)
  onChange()
})
