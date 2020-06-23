module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('deliverymans', 'fired', {
      type: Sequelize.DATE,
      allowNull: true,
      defaultValue: null,
    })
  },

  down: queryInterface => {
    return queryInterface.removeColumn('deliverymans', 'fired')
  },
}
