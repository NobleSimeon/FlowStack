import { execSync } from 'child_process'

try {
  console.log('Installing @supabase/ssr and @supabase/supabase-js...')
  execSync('cd /vercel/share/v0-project && pnpm add @supabase/ssr @supabase/supabase-js framer-motion swr bcryptjs', {
    stdio: 'inherit',
    timeout: 60000
  })
  console.log('Dependencies installed successfully!')
} catch (error) {
  console.error('Install failed:', error.message)
}
