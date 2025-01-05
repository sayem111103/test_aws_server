import path from 'path'
import dotenv from 'dotenv'
dotenv.config({ path: path.join(process.cwd(), '.env') })

export const config = {
  port: process.env.PORT,
  DB: process.env.DB,
  node_env: process.env.NODE_ENV,
  saltRounds: process.env.SALTROUNDS,
  secret: process.env.SECRET,
  expirein: process.env.EXPIREIN
}
