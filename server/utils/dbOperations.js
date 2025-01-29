const { pool, query, logger } = require('../config/db');

// Generic database operations
class DatabaseOperations {
  // Generic find operation with optional conditions
  static async find(table, conditions = {}, options = {}) {
    try {
      const {
        select = '*',
        limit,
        offset,
        orderBy,
        orderDirection = 'ASC'
      } = options;

      let sql = `SELECT ${select} FROM ${table}`;
      const params = [];

      // Add WHERE clause if conditions exist
      if (Object.keys(conditions).length > 0) {
        const whereConditions = [];
        Object.entries(conditions).forEach(([key, value]) => {
          whereConditions.push(`${key} = ?`);
          params.push(value);
        });
        sql += ` WHERE ${whereConditions.join(' AND ')}`;
      }

      // Add ORDER BY if specified
      if (orderBy) {
        sql += ` ORDER BY ${orderBy} ${orderDirection}`;
      }

      // Add LIMIT and OFFSET if specified
      if (limit) {
        sql += ` LIMIT ?`;
        params.push(parseInt(limit));
        if (offset) {
          sql += ` OFFSET ?`;
          params.push(parseInt(offset));
        }
      }

      return await query(sql, params);
    } catch (error) {
      logger.error('Database find operation failed:', error);
      throw error;
    }
  }

  // Generic insert operation
  static async insert(table, data) {
    try {
      const keys = Object.keys(data);
      const values = Object.values(data);
      const placeholders = keys.map(() => '?').join(', ');

      const sql = `
        INSERT INTO ${table} (${keys.join(', ')})
        VALUES (${placeholders})
      `;

      const result = await query(sql, values);
      return result;
    } catch (error) {
      logger.error('Database insert operation failed:', error);
      throw error;
    }
  }

  // Generic update operation
  static async update(table, id, data) {
    try {
      const keys = Object.keys(data);
      const values = Object.values(data);
      const setClause = keys.map(key => `${key} = ?`).join(', ');

      const sql = `
        UPDATE ${table}
        SET ${setClause}
        WHERE id = ?
      `;

      values.push(id);
      const result = await query(sql, values);
      return result;
    } catch (error) {
      logger.error('Database update operation failed:', error);
      throw error;
    }
  }

  // Generic delete operation
  static async delete(table, conditions) {
    try {
      const keys = Object.keys(conditions);
      const values = Object.values(conditions);
      const whereClause = keys.map(key => `${key} = ?`).join(' AND ');

      const sql = `
        DELETE FROM ${table}
        WHERE ${whereClause}
      `;

      const result = await query(sql, values);
      return result;
    } catch (error) {
      logger.error('Database delete operation failed:', error);
      throw error;
    }
  }

  // Transaction wrapper
  static async withTransaction(callback) {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();
      const result = await callback(connection);
      await connection.commit();
      return result;
    } catch (error) {
      await connection.rollback();
      logger.error('Transaction failed:', error);
      throw error;
    } finally {
      connection.release();
    }
  }

  // Batch insert operation
  static async batchInsert(table, dataArray) {
    if (!dataArray.length) return { affectedRows: 0 };

    try {
      const keys = Object.keys(dataArray[0]);
      const placeholders = dataArray.map(() => 
        `(${keys.map(() => '?').join(', ')})`
      ).join(', ');

      const values = dataArray.flatMap(item => 
        keys.map(key => item[key])
      );

      const sql = `
        INSERT INTO ${table} (${keys.join(', ')})
        VALUES ${placeholders}
      `;

      return await query(sql, values);
    } catch (error) {
      logger.error('Batch insert operation failed:', error);
      throw error;
    }
  }

  // Execute raw SQL with parameters
  static async raw(sql, params = []) {
    try {
      return await query(sql, params);
    } catch (error) {
      logger.error('Raw SQL execution failed:', error);
      throw error;
    }
  }

  // Check if table exists
  static async tableExists(tableName) {
    try {
      const [result] = await query(`
        SELECT COUNT(*) as count 
        FROM information_schema.tables 
        WHERE table_schema = DATABASE() 
        AND table_name = ?
      `, [tableName]);
      
      return result.count > 0;
    } catch (error) {
      logger.error('Table check failed:', error);
      throw error;
    }
  }

  // Get table columns
  static async getTableColumns(tableName) {
    try {
      return await query(`
        SELECT COLUMN_NAME, DATA_TYPE, IS_NULLABLE, COLUMN_DEFAULT
        FROM INFORMATION_SCHEMA.COLUMNS
        WHERE TABLE_SCHEMA = DATABASE()
        AND TABLE_NAME = ?
        ORDER BY ORDINAL_POSITION
      `, [tableName]);
    } catch (error) {
      logger.error('Get table columns failed:', error);
      throw error;
    }
  }

  // Create database backup
  static async createBackup(tables = []) {
    try {
      const backup = {};

      // If no tables specified, get all tables
      if (tables.length === 0) {
        const allTables = await query(`
          SELECT TABLE_NAME
          FROM INFORMATION_SCHEMA.TABLES
          WHERE TABLE_SCHEMA = DATABASE()
        `);
        tables = allTables.map(t => t.TABLE_NAME);
      }

      // Get data from each table
      for (const table of tables) {
        const data = await query(`SELECT * FROM ${table}`);
        backup[table] = data;
      }

      return backup;
    } catch (error) {
      logger.error('Database backup failed:', error);
      throw error;
    }
  }
}

module.exports = DatabaseOperations;
