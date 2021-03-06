module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('deliverymans', 'avatar_id', {
      type: Sequelize.INTEGER,
      references: { model: 'avatars', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    })
  },

  down: queryInterface => {
    return queryInterface.removeColumn('deliverymans', 'avatar_id')
  },
}
