module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('deliveries', 'problem_id', {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: { model: 'problems', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: null,
      defaultValue: null,
    })
  },

  down: queryInterface => {
    return queryInterface.removeColumn('deliveries', 'problem_id')
  },
}
