import { readdir, readFile } from 'node:fs/promises'
import { join } from 'node:path'
import ts from 'typescript'

const roots = ['src', 'scripts']
const extensions = new Set(['.ts', '.tsx', '.js', '.jsx', '.mjs'])
const forbidden = new Map([
  [ts.SyntaxKind.SwitchStatement, 'switch'],
  [ts.SyntaxKind.LetKeyword, 'let']
])

const findFiles = async (directory) => {
  const entries = await readdir(directory, { withFileTypes: true })
  const nested = await Promise.all(
    entries.map(async (entry) => {
      const path = join(directory, entry.name)

      if (entry.isDirectory()) {
        return findFiles(path)
      }

      if (
        entry.isFile() &&
        [...extensions].some((extension) => path.endsWith(extension))
      ) {
        return [path]
      }

      return []
    })
  )

  return nested.flat()
}

const files = (await Promise.all(roots.map(findFiles))).flat()
const violations = (
  await Promise.all(
    files.map(async (file) => {
      const source = await readFile(file, 'utf8')
      const tree = ts.createSourceFile(
        file,
        source,
        ts.ScriptTarget.Latest,
        true
      )
      const found = []
      const visit = (node) => {
        const blocked = forbidden.get(node.kind)

        if (blocked) {
          found.push(`${file}: ${blocked} is forbidden`)
        }

        if (
          ts.isVariableDeclarationList(node) &&
          node.flags & ts.NodeFlags.Let
        ) {
          found.push(`${file}: let is forbidden`)
        }

        if (ts.isIfStatement(node) && node.elseStatement) {
          found.push(`${file}: else is forbidden`)
        }

        ts.forEachChild(node, visit)
      }

      visit(tree)
      return found
    })
  )
).flat()

if (violations.length > 0) {
  throw new Error(violations.join('\n'))
}
