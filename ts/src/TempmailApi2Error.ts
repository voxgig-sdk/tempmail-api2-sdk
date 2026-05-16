
import { Context } from './Context'


class TempmailApi2Error extends Error {

  isTempmailApi2Error = true

  sdk = 'TempmailApi2'

  code: string
  ctx: Context

  constructor(code: string, msg: string, ctx: Context) {
    super(msg)
    this.code = code
    this.ctx = ctx
  }

}

export {
  TempmailApi2Error
}

