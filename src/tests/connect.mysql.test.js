const mysql = require("mysql2");

const pool = mysql.createPool({
    host: "127.0.0.1", // Your MySQL host
    user: "root", // Your MySQL username
    password: "123456", // Your MySQL root password
    database: "shopDev", // Your MySQL database name
    port: 8833, // The port you've exposed
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
});

const batchSize = 100000;
const totalSize = 10_000_000;

console.time(":::::::::TIME::::");
let currentId = 1000001;
const insertBatch = async () => {
    const values = [];
    for (let i = 0; i < batchSize && currentId <= totalSize; i++) {
        const name = `name-${currentId}`;
        const age = currentId;
        const address = `address-${currentId}`;
        values.push([currentId, name, age, address]);
        currentId++;
    }
    if (!values.length) {
        console.timeEnd(":::::::::TIME::::");
        pool.end((err) => {
            if (err) {
                console.log(`Error occurred while running batch`);
            } else {
                console.log(`Batch executed successfully`);
            }
        });

        return;
    }

    const sql = `INSERT INTO test_table (id, name, age, address) VALUES ?`;

    pool.query(sql, [values], async function (err, results) {
        if (err) throw err;

        console.log(`Inserted ${results.affectedRows} records`);
        await insertBatch();
    });
};

insertBatch().catch((err) => console.error(err));
