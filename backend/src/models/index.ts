import sequelize from '../config/database';
import Task from './Task';
import Category from './Category';

// Define associations
Category.hasMany(Task, {
  foreignKey: 'categoryId',
  as: 'tasks',
});

Task.belongsTo(Category, {
  foreignKey: 'categoryId',
  as: 'category',
});

// Sync database
export const syncDatabase = async () => {
  try {
    await sequelize.sync({ alter: process.env.NODE_ENV === 'development' });
    console.log('Database synchronized successfully');
  } catch (error) {
    console.error('Error synchronizing database:', error);
    throw error;
  }
};

export { Task, Category, sequelize };
