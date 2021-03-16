// const connection = require('../config/connection');

// const viewAllEmployees = () => {
//     connection.query('SELECT * FROM Employee', (err, res) => {
//         if (err) throw err;
//         res.forEach(({ id, first_name, last_name, role_id, manager_id }) => {
//             console.log(`${id} | ${first_name} | ${last_name} | ${role_id} | ${manager_id}`);
//         });
//         console.log('-----------------');
//     });
// };

// module.exports = viewAllEmployees;