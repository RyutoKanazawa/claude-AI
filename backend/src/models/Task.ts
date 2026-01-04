import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database';
import { TaskAttributes, Priority } from '../types';
import Category from './Category';

class Task extends Model<TaskAttributes> implements TaskAttributes {
  public id!: number;
  public title!: string;
  public description?: string;
  public isCompleted!: boolean;
  public priority!: Priority;
  public dueDate?: Date;
  public categoryId?: number;
  public tags?: string[];
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Task.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [1, 255],
      },
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    isCompleted: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    priority: {
      type: DataTypes.ENUM('high', 'medium', 'low'),
      allowNull: false,
      defaultValue: Priority.MEDIUM,
    },
    dueDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    categoryId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: Category,
        key: 'id',
      },
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE',
    },
    tags: {
      type: DataTypes.TEXT,
      allowNull: true,
      get() {
        const rawValue = this.getDataValue('tags' as keyof TaskAttributes);
        if (!rawValue) return [];
        if (typeof rawValue === 'string') {
          try {
            return JSON.parse(rawValue);
          } catch {
            return [];
          }
        }
        return rawValue as string[];
      },
      set(value: string[] | undefined) {
        if (value && Array.isArray(value)) {
          this.setDataValue('tags' as keyof TaskAttributes, JSON.stringify(value) as any);
        } else {
          this.setDataValue('tags' as keyof TaskAttributes, null as any);
        }
      },
    },
  },
  {
    sequelize,
    tableName: 'tasks',
    timestamps: true,
  }
);

export default Task;
