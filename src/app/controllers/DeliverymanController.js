import Deliveryman from '../models/Deliveryman'
import Avatar from '../models/Avatar'
import * as Yup from 'yup'

class DeliverymanController {
  /*
  || Index method
  */
  async index(req, res) {
    const deliverymans = await Deliveryman.findAll({
      include: [
        { model: Avatar, as: 'avatar', attributes: ['name', 'path', 'url'] },
      ],
    })
    return res.json(deliverymans)
  }
  /*
  || Store method
  */
  async store(req, res) {
    /*
    || Validations
    */
    const schema = Yup.object().shape({
      name: Yup.string(),
      email: Yup.string().email().required(),
      avatar_id: Yup.number(),
    })

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' })
    }

    /*
    || Store algorithm
    */
    const avatarExists = await Avatar.findByPk(req.body.avatar_id)

    if (!avatarExists) {
      return res.status(400).json({ error: 'You need register avatar first' })
    }

    const deliverymanExists = await Deliveryman.findOne({
      where: { email: req.body.email },
    })

    if (deliverymanExists) {
      return res.status(401).json({ error: 'Deliveryman exists' })
    }

    const deliveryman = await Deliveryman.create(req.body)

    return res.json(deliveryman)
  }
  /*
  || Update method
  */
  async update(req, res) {
    /*
    || Validations
    */
    const schema = Yup.object().shape({
      name: Yup.string(),
      email: Yup.string().email(),
      avatar_id: Yup.number(),
    })

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' })
    }

    /*
    || Update algorithm
    */

    const deliveryman = await Deliveryman.findByPk(req.params.id)

    if (!deliveryman) {
      return res.status(401).json({ error: 'Deliveryman does not exists' })
    }

    if (req.body.email) {
      const deliverymanExists = await Deliveryman.findOne({
        where: { email: req.body.email },
      })

      if (deliverymanExists) {
        return res.status(401).json({ error: 'Deliveryman exists' })
      }
    }

    const deliverymanUpdated = await deliveryman.update(req.body)
    return res.json(deliverymanUpdated)
  }
  /*
  || Delete method
  */
  async delete(req, res) {
    const deliveryman = await Deliveryman.findByPk(req.params.id)

    if (!deliveryman) {
      return res.status(401).json({ error: 'Deliveryman does not exists' })
    }

    deliveryman.fired = new Date()

    await deliveryman.save()

    return res.json(deliveryman)
  }
}

export default new DeliverymanController()
