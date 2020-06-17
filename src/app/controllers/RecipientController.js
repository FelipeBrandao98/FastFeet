import Recipient from '../models/Recipient'

class RecipientController {
  async store(req, res) {
    const datas = req.body

    const recipient = await Recipient.create(datas)

    return res.json(recipient)
  }
}

export default new RecipientController()
