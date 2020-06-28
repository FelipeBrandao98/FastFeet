import * as Yup from 'yup'
import { format } from 'date-fns'
import { Op } from 'sequelize'
// Models import
import Delivery from '../models/Delivery'
import Recipient from '../models/Recipient'
import Deliveryman from '../models/Deliveryman'
import Avatar from '../models/Avatar'
import Signature from '../models/Signature'
// Libs import
import Mail from '../../lib/Mail'

class DeliveryController {
  /*
  || Index method
  */
  async index(req, res) {
    const { page = 1 } = req.query
    const deliveries = await Delivery.findAll({
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

    return res.json(deliveries)
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
    const recipient = await Recipient.findByPk(req.body.recipient_id)

    if (!recipient) {
      return res.status(401).json({ error: 'Recipient does not exists' })
    }

    const deliveryman = await Deliveryman.findByPk(req.body.deliveryman_id)

    if (!deliveryman) {
      return res.status(401).json({ error: 'Deliveryman does not exists' })
    }

    const delivery = await Delivery.create(req.body)

    await Mail.sendMail({
      to: `${deliveryman.name} <${deliveryman.email}>`,
      subject: `Entrega do produto: ${req.body.product}`,
      text: `Você tem uma nova entrega disponível, retire o produto e entregue a(o) senhor(a) ${recipient.destname} no seguinte endereço:
      Rua: ${recipient.street},
      Número: ${recipient.number},
      Complemento: ${recipient.complement},
      Estado: ${recipient.state},
      Cidade: ${recipient.city},
      Cep: ${recipient.cep},
      `,
    })

    return res.json(delivery)
  }

  /*
  || Update method
  */
  async update(req, res) {
    const { delivery, id } = req.params

    console.log(delivery)

    if (delivery === 'start') {
      const { deliveryman_id } = req.body

      const checkDeliveryExists = await Delivery.findByPk(id)

      if (!checkDeliveryExists) {
        return res.status(401).json({ error: 'This Delivery does not exists' })
      }

      const checkDeliveryman = await Delivery.findOne({
        where: { id, deliveryman_id },
      })
      if (!checkDeliveryman) {
        return res
          .status(401)
          .json({ error: 'This deliveryman can not start this Delivery' })
      }

      const checkDeliveryStarted = await Delivery.findOne({
        where: { id, deliveryman_id, start_at: null },
      })

      if (!checkDeliveryStarted) {
        return res
          .status(401)
          .json({ error: 'This pruduct has alredy been whithdrawn' })
      }

      const checkWithdrawalHour = format(new Date(), 'HH')

      if (checkWithdrawalHour >= '18' || checkWithdrawalHour <= '08') {
        return res.status(401).json({
          error: 'You can only make withdrawals between 08:00h and 18:00h',
        })
      }

      const start = await Delivery.findByPk(id)

      start.start_at = new Date()

      start.save()

      return res.json({ message: 'Withdrawn product' })
    }

    if (delivery === 'end') {
      const { deliveryman_id, signature_id } = req.body

      const checkDelivery = await Delivery.findOne({
        where: { id, deliveryman_id },
      })

      if (!checkDelivery) {
        return res
          .status(401)
          .json({ error: 'This deliveryman can not start this Delivery' })
      }

      const checkDeliveryStarted = await Delivery.findOne({
        where: {
          start_at: { [Op.ne]: null },
        },
      })

      if (!checkDeliveryStarted) {
        return res
          .status(401)
          .json({ error: 'You need to catch the product first' })
      }

      const checkDeliveryEnds = await Delivery.findOne({
        where: { id, deliveryman_id, end_at: null },
      })

      if (!checkDeliveryEnds) {
        return res.status(401).json({
          error: 'This delivery has alredy been completed',
        })
      }

      const signatureExists = await Signature.findByPk(signature_id)

      if (!signatureExists) {
        return res.status(401).json({ error: 'This signature does not exists' })
      }

      const delivery = await Delivery.findOne({
        where: { id, deliveryman_id, end_at: null },
      })

      const deliveryFinalized = await delivery.update({
        end_at: new Date(),
        signature_id,
      })

      return res.json({ message: 'Finalized delivery' }, deliveryFinalized)
    }

    return res.status(404).json()
  }

  /*
  || Delete method
  */
  async delete(req, res) {
    return res.json()
  }
}

export default new DeliveryController()
