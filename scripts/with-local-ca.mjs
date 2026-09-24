import { spawn } from 'node:child_process'
import { existsSync } from 'node:fs'
import os from 'node:os'
import path from 'node:path'

const extraCa = path.join(
  os.homedir(),
  'AppData',
  'Local',
  'node-extra-ca',
  'avast-web-mail-shield-root.pem',
)

const env = { ...process.env }
if (!env.NODE_EXTRA_CA_CERTS && existsSync(extraCa)) {
  env.NODE_EXTRA_CA_CERTS = extraCa
}

const child = spawn(process.argv[2], process.argv.slice(3), {
  env,
  stdio: 'inherit',
  shell: true,
})

child.on('exit', (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal)
    return
  }
  process.exit(code ?? 1)
})
