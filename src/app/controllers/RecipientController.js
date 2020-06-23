import Recipient from '../models/Recipient'
import * as Yup from 'yup'

class RecipientController {
  async store(req, res) {
    /*
    || Validations
    */
    const schema = Yup.object().shape({
      destname: Yup.string().required(),
      street: Yup.string().max(50).required(),
      number: Yup.number().max(999999).required(),
      complement: Yup.string().max(15),
      state: Yup.string().max(2).uppercase().required(),
      city: Yup.string().max(50).required(),
      cep: Yup.number().max(99999999).required(),
    })

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' })
    }

    /*
    || Store algorithm
    */

    const recipient = await Recipient.create(req.body)

    return res.json(recipient)
  }
}

export default new RecipientController()
