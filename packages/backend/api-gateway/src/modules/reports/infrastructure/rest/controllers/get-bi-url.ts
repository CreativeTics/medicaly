import { Request, Response } from 'express'
import constants from '../../../../../config'
import JWTSigner from '../../services/jwt-signer'

export class GetBiReportUrl {
  async execute(req: Request, res: Response) {
    try {
      const code = Number(req.params.code)
      if (isNaN(code)) {
        res.status(400).json({ message: 'Invalid dashboard code' })
        return
      }

      const payload = {
        resource: { dashboard: code },
        params: {},
        exp: Math.round(Date.now() / 1000) + 30 * 60, // 30 minute expiration
      }
      const token = new JWTSigner().sign(
        payload,
        constants().METABASE.SECRET_KEY
      )

      const iframeUrl =
        constants().METABASE.URL +
        '/embed/dashboard/' +
        token +
        '#bordered=false&titled=false'

      res.json({ url: iframeUrl })
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' })
    }
  }
}
