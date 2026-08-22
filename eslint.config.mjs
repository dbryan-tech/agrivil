import nextCoreWebVitals from 'eslint-config-next/core-web-vitals'
import nextTypescript from 'eslint-config-next/typescript'

const eslintConfig = [
  ...nextCoreWebVitals,
  ...nextTypescript,
  {
    ignores: ['mobile/**', 'node_modules/**', '.next/**', 'apks/**', 'scripts/**'],
  },
]

export default eslintConfig
