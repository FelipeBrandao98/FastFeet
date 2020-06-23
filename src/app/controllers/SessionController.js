import * as Yup from 'yup'
import jwt from 'jsonwebtoken'

// Configs
import authConfig from '../../config/auth'
// Models
import User from '../models/User'

class SessionController {
  /*
  || Store method
  */
  async store(req, res) {
    /*
    || Validations
    */
    const schema = Yup.object().shape({
      email: Yup.string().email().required(),
      password: Yup.string().required(),
    })

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' })
    }

    /*
    || Store algorithm
    */
    const { email, password } = req.body

    const user = await User.findOne({ where: { email: email } })

    if (!user) {
      return res.status(401).json({ error: 'User does not exists' })
    }
    if (!(await user.checkPassword(password))) {
      return res.status(401).json({ error: 'Invalid Password' })
    }
    const { id, name } = user

    return res.json({
      user: {
        id,
        name,
        email,
      },
      token: jwt.sign({ id }, authConfig.secret, {
        expiresIn: authConfig.expiresIn,
      }),
    })
  }
}

export default new SessionController()
