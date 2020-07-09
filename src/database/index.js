// Index do Banco de dados - usado para percorrer a conexão com cada tabela no banco

import Sequelize from 'sequelize'

// Importação dos models
import User from '../app/models/User'
import Recipient from '../app/models/Recipient'
import Deliveryman from '../app/models/Deliveryman'
import Avatar from '../app/models/Avatar'
import Signature from '../app/models/Signature'
import Delivery from '../app/models/Delivery'
import Problem from '../app/models/Problem'

// Configuração do banco de dados
import dataBaseConfig from '../config/database'

// Armazena os models em uma lista
const models = [
  User,
  Recipient,
  Avatar,
  Signature,
  Deliveryman,
  Delivery,
  Problem,
]

// Instancia a classe do banco de dados
class Database {
  constructor() {
    this.init()
  }
  init() {
    this.connection = new Sequelize(dataBaseConfig)

    // Percorre o array models e retorna cada conexão com cada tabela
    models
      .map(model => {
        model.init(this.connection)
        return model
      })
      .map(model => model.associate && model.associate(this.connection.models))
  }
}

export default new Database()
