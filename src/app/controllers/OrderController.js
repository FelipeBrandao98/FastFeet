import * as Yup from 'yup'
// Models import
import Order from '../models/Order'
import Recipient from '../models/Recipient'
import Deliveryman from '../models/Deliveryman'
import Avatar from '../models/Avatar'
import Signature from '../models/Signature'

class OrderController {
  /*
  || Index method
  */
  async index(req, res) {
    const { page = 1 } = req.query
    const orders = await Order.findAll({
      where: { canceled_at: null },
      order: ['created_at'],
      limit: 5,
      offset: (page - 1) * 5,
      attributes: ['id', 'product', 'start_at', 'end_at'],
      include: [
        {
          model: Recipient,
          as: 'recipient',
          attributes: [
            'destname',
            'street',
            'number',
            'complement',
            'state',
            'city',
            'cep',
          ],
        },
        {
          model: Deliveryman,
          as: 'deliveryman',
          attributes: ['id', 'name', 'email'],
          include: [
            {
              model: Avatar,
              as: 'avatar',
              attributes: ['id', 'path', 'url'],
            },
          ],
        },
        {
          model: Signature,
          as: 'signature',
          attributes: ['id', 'path', 'url'],
        },
      ],
    })

    return res.json(orders)
  }

  /*
  || Store method
  */
  async store(req, res) {
    /*
    || Validations
    */
    const schema = Yup.object().shape({
      product: Yup.string().required(),
      recipient_id: Yup.number().required(),
      deliveryman_id: Yup.number().required(),
    })

    if (!(await schema.isValid(req.body))) {
      return res.status(401).json({ error: 'Validation fails' })
    }

    /*
    || Store algorithm
    */
    const checkRecipientExists = await Recipient.findByPk(req.body.recipient_id)

    if (!checkRecipientExists) {
      return res.status(401).json({ error: 'Recipient does not exists' })
    }

    const checkDeliverymanExists = await Deliveryman.findByPk(
      req.body.deliveryman_id
    )

    if (!checkDeliverymanExists) {
      return res.status(401).json({ error: 'Deliveryman does not exists' })
    }

    const order = await Order.create(req.body)

    return res.json(order)
  }

  /*
  || Update method
  */
  async update(req, res) {
    const { delivery, id } = req.params

    console.log(delivery)

    if (delivery === 'start') {
      const { deliveryman_id } = req.body
      const checkOrder = await Order.findOne({ where: { id, deliveryman_id } })
      if (!checkOrder) {
        return res
          .status(401)
          .json({ error: 'This deliveryman can not start this order' })
      }
      const start = await Order.findByPk(id)

      start.start_at = new Date()

      start.save()

      return res.json({ message: 'Withdrawn product' })
    }

    if (delivery === 'end') {
      const { deliveryman_id, signature_id } = req.body

      const checkOrder = await Order.findOne({ where: { id, deliveryman_id } })
      if (!checkOrder) {
        return res
          .status(401)
          .json({ error: 'This deliveryman can not start this order' })
      }

      const checkOrderStarted = await Order.findOne({
        where: { id, deliveryman_id, start_at: null },
      })

      if (checkOrderStarted) {
        return res
          .status(401)
          .json({ error: 'You need to catch the product first' })
      }

      const checkOrderEnds = await Order.findOne({
        where: { id, deliveryman_id, end_at: null },
      })

      if (!checkOrderEnds) {
        return res.status(401).json({
          error: 'This delivery has alredy been completed',
        })
      }

      const signatureExists = await Signature.findByPk(signature_id)

      if (!signatureExists) {
        return res.status(401).json({ error: 'This signature does not exists' })
      }

      const order = await Order.findOne({
        where: { id, deliveryman_id, end_at: null },
      })

      const orderFinalized = await order.update({
        end_at: new Date(),
        signature_id,
      })

      return res.json({ message: 'Finalized delivery' })
    }

    return res.status(404).json()
  }
}

export default new OrderController()
