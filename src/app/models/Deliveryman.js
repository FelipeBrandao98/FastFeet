import Sequelize, { Model } from 'sequelize'

class Deliveryman extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        email: Sequelize.INTEGER,
        fired: Sequelize.DATE,
      },
      {
        sequelize,
      }
    )
  }
  static associate(models) {
    this.belongsTo(models.Avatar, { foreignKey: 'avatar_id', as: 'avatar' })
  }
}

export default Deliveryman
