// const console.log = require('console.loggler')();
const mysql = require('@vlasky/mysql');
const Connection = require('@vlasky/mysql/lib/Connection');
const Pool = require('@vlasky/mysql/lib/Pool');

const connect = connection => new Promise((resolve, reject) => connection.connect((err) => {
  if (err) return reject(err);
  resolve();
}));

const connectionHandler = async (connection) => {
  if (connection instanceof Pool) {
    if (connection._closed) {
      connection = mysql.createPool(connection.config.connectionConfig);
    }
  }

  if (connection instanceof Connection) {
    if (connection.state !== 'connected') {
      connection = mysql.createConnection(connection.config);
    }
  }

  if (typeof connection === 'string') {
    connection = mysql.createConnection(connection);
  }

  if ((typeof connection === 'object') && (!(connection instanceof Connection) && !(connection instanceof Pool))) {
    if (connection.isPool) {
      connection = mysql.createPool(connection);
    } else {
      connection = mysql.createConnection(connection);
    }
  }

  if ((connection instanceof Connection) && (connection.state !== 'connected')) {
    await connect(connection);
  }

  return connection;
};

module.exports = connectionHandler;
