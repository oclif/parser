import { IFlag } from './flags'

export function flagUsage(flag: IFlag<any>, options: { displayRequired?: boolean } = {}): [string, string | undefined] {
  const label = []
  if (flag.char) label.push(`-${flag.char}`)
  if (flag.name) label.push(` --${flag.name}`)
  const usage = flag.type === 'option' ? ` ${flag.name.toUpperCase()}` : ''
  let description = flag.description || ''
  if (options.displayRequired && flag.required) description = `(required) ${description}`
  return [label.join(',').trim() + usage, description] as [string, string | undefined]
}
