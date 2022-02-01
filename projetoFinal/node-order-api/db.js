async function connect(){
    if(global.connection && global.connection.state !== 'disconnected')
        return global.connection;
 
    const mysql = require("mysql2/promise");
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST || 'localhost',
        port: 3306,
        user: 'test',
        password: 'test',
        database: 'finalProject',
        multipleStatements: true
      } );
    console.log("Conectou no MySQL!");
    global.connection = connection;
    return connection;
}

async function getAllOrders(){
    const conn = await connect();
    
    const query = `SELECT * FROM orders LIMIT 1000;`;
    console.log(`Executando query: ${query}`);

    const [rows, fields] = await connection.execute(query);
    console.log(`Rows: ${JSON.stringify(rows)}`);
    return rows;
}

async function getOrderById(id){
    const conn = await connect();
    
    const query = `SELECT * FROM orders WHERE id = ?;`;
    console.log(`Executando query: ${query}`);
    
    const [rows, fields] = await connection.execute(query);

    return rows;
}

async function getOrderByClientId(id){
    const conn = await connect();
    
    const query = `SELECT * FROM orders WHERE client_id = ?;`;
    console.log(`Executando query: ${query}`);
    
    const [rows, fields] = await connection.execute(query);

    return rows;
}

async function updateOrderById(id, clientId, productId, amount){
    try{
        const conn = await connect();
    
        const query = `UPDATE orders SET client_id = ?;, product_id = ?;, amount = ?; WHERE id = ?;`;
        console.log(`Executando query: ${query}`);
        
        const [rows] = await conn.execute(query);
        return rows;
    }catch(err){
        throw {code: 500, message: 'Erro inesperado ao tentar cadastrar pedido'};
    }
}

async function deleteOrderById(id){
    const conn = await connect();
    
    const query = `DELETE FROM orders WHERE id = ?;`;
    console.log(`Executando query: ${query}`);

    await connection.execute(query);
}

async function insertOrder(id, clientId, productId, amount, password){
    const conn = await connect();
    const users = await db.selectUserByLogin(req.body.username);
    const query = `INSERT INTO orders(id, client_id, product_id, amount) VALUES (?, ?, ?, ?;`;
    console.log(`Executando query: ${query}`);

    try{
        await connection.execute(query);
        const [rows, fields] = await connection.execute(query, [randomUUID(), user, password]);
        return rows;
    }catch(err){
        if(err.errno === 1062){
            throw {code: 400, message: 'Já existe um pedido cadastrado com este id!'};
        }else if(err.errno === 1452){
            throw {code: 400, message: 'Produto não encontrado!'};
        }else{
            throw {code: 500, message: 'Erro inesperado ao tentar cadastrar pedido'};
        }
    }
}

module.exports = {getOrderById, getOrderByClientId, getAllOrders, insertOrder, updateOrderById, deleteOrderById}
