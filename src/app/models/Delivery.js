import Sequelize, { Model } from 'sequelize'

class Delivery extends Model {
  static init(sequelize) {
    super.init(
      {
        product: Sequelize.STRING,
        canceled_at: Sequelize.DATE,
        start_at: Sequelize.DATE,
        end_at: Sequelize.DATE,
      },
      {
        sequelize,
      }
    )
  }
  static associate(models) {
    this.belongsTo(models.Recipient, {
      foreignKey: 'recipient_id',
      as: 'recipient',
    })
    this.belongsTo(models.Deliveryman, {
      foreignKey: 'deliveryman_id',
      as: 'deliveryman',
    })
    this.belongsTo(models.Signature, {
      foreignKey: 'signature_id',
      as: 'signature',
    })
  }
}

export default Delivery
