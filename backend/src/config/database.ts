import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

const databasePath = path.resolve(__dirname, '../../', process.env.DATABASE_PATH || './database/todo.db');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: databasePath,
  logging: process.env.NODE_ENV === 'development' ? console.log : false,
});

export default sequelize;
