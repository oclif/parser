import { MultipleValueFlag } from './multiple'

export class MultipleStringFlag extends MultipleValueFlag<string> {
  get value() { return this.inputs }
}
