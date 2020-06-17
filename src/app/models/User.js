import Sequelize, { Model } from 'sequelize'
import bcrypt from 'bcryptjs'

class User extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        email: Sequelize.STRING,
        pasword: Sequelize.VIRTUAL,
        password_hash: Sequelize.STRING,
        provider: Sequelize.BOOLEAN,
      },
      { sequelize }
    )
    this.addHook('beforeSave', async user => {
      if (user.pasword) {
        user.password_hash = await bcrypt.hash(user.pasword, 8)
      }
    })
    return this
  }
  checkPassword(pasword) {
    return bcrypt.compare(pasword, this.password_hash)
  }
}

export default User
