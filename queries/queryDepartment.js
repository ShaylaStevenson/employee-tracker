// const queryAllDepartment = () => {
//     connection.query(
//         'SELECT * FROM Department', (err, res) => {
//         if (err) throw err;
//         res.forEach(({ id, name }) => {
//             console.log(`${id} | ${name}`);
//         });
//         console.log('-----------------');
//     });
// };

// const queryDeliDepartment = () => {
//     const query = connection.query(
//         'SELECT * FROM Department WHERE name=?',
//         ['Deli'],
//         (err, res) => {
//             if (err) throw err;
//             res.forEach(({ id, name }) => {
//                 console.log(`${id} | ${name}`);
//             });
//         }
//     );
//     console.log(query.sql);
//     connection.end();
// };

// module.exports = queryAllDepartment();
// module.exports = queryDeliDepartment();