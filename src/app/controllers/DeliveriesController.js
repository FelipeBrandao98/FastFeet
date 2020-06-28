import { Op } from 'sequelize'

import Delivery from '../models/Delivery'

class DeliveriesController {
  async index(req, res) {
    const { id, finalized } = req.params
    const { page = 1 } = req.query

    console.log(finalized)

    if (finalized === 'finalized') {
      const Deliverys = await Delivery.findAll({
        where: { deliveryman_id: id, end_at: { [Op.ne]: null } },
        order: ['created_at'],
        limit: 5,
        offset: (page - 1) * 5,
      })
      return res.json(Deliverys)
    }

    const deliveries = await Delivery.findAll({
      where: { deliveryman_id: id, start_at: null },
      order: ['created_at'],
      limit: 5,
      offset: (page - 1) * 5,
    })
    return res.json(deliveries)
  }
}
export default new DeliveriesController()
