const fs = require('fs');
const csvParser = require('csv-parser');

class CSVHandler {
  // reads employee csv and returns array of { name, email }
  static readEmployees(filepath) {
    return new Promise((resolve, reject) => {
      if (!filepath) {
        return reject(new Error('no file path provided'));
      }

      if (!fs.existsSync(filepath)) {
        return reject(new Error('file not found: ' + filepath));
      }

      const rows = [];

      fs.createReadStream(filepath)
        .pipe(csvParser())
        .on('data', (row) => {
          const name = (row['Employee_Name'] || row['employee_name'] || '').trim();
          const email = (row['Employee_EmailID'] || row['employee_emailid'] || '').trim().toLowerCase();

          if (name && email) {
            rows.push({ name, email });
          }
        })
        .on('end', () => {
          if (rows.length === 0) {
            reject(new Error('csv was empty or had wrong headers. expected: Employee_Name, Employee_EmailID'));
          } else {
            resolve(rows);
          }
        })
        .on('error', (err) => reject(new Error('failed to read csv: ' + err.message)));
    });
  }

  // reads previous year assignments csv
  // returns array of { giverEmail, receiverEmail }
  static readPreviousAssignments(filepath) {
    return new Promise((resolve, reject) => {
      if (!filepath || !fs.existsSync(filepath)) {
        return resolve([]); // no previous file is fine
      }

      const pairs = [];

      fs.createReadStream(filepath)
        .pipe(csvParser())
        .on('data', (row) => {
          const giverEmail = (row['Employee_EmailID'] || '').trim().toLowerCase();
          const receiverEmail = (row['Secret_Child_EmailID'] || '').trim().toLowerCase();

          if (giverEmail && receiverEmail) {
            pairs.push({ giverEmail, receiverEmail });
          }
        })
        .on('end', () => resolve(pairs))
        .on('error', (err) => reject(new Error('failed to read previous assignments: ' + err.message)));
    });
  }

  // validates if a file path looks legit
  static validateFile(filepath) {
    if (!filepath) return false;
    if (!fs.existsSync(filepath)) return false;
    if (!filepath.toLowerCase().endsWith('.csv')) return false;
    return true;
  }
}

module.exports = CSVHandler;


// const fs = require('fs');
// const csvParser = require('csv-parser');

// function readEmployeeCSV(filepath) {
//   return new Promise((resolve, reject) => {
//     if (!fs.existsSync(filepath)) {
//       return reject(new Error('file not found: ' + filepath));
//     }

//     const rows = [];

//     fs.createReadStream(filepath)
//       .pipe(csvParser())
//       .on('data', (row) => {
//         const name = (row['Employee_Name'] || row['employee_name'] || '').trim();
//         const email = (row['Employee_EmailID'] || row['employee_emailid'] || '').trim().toLowerCase();

//         if (name && email) {
//           rows.push({ name, email });
//         }
//       })
//       .on('end', () => {
//         if (rows.length === 0) {
//           reject(new Error('csv was empty or had wrong headers'));
//         } else {
//           resolve(rows);
//         }
//       })
//       .on('error', reject);
//   });
// }

// function readPreviousAssignments(filepath) {
//   return new Promise((resolve, reject) => {
//     if (!filepath || !fs.existsSync(filepath)) {
//       return resolve([]);
//     }

//     const pairs = [];

//     fs.createReadStream(filepath)
//       .pipe(csvParser())
//       .on('data', (row) => {
//         const giverEmail = (row['Employee_EmailID'] || '').trim().toLowerCase();
//         const receiverEmail = (row['Secret_Child_EmailID'] || '').trim().toLowerCase();

//         if (giverEmail && receiverEmail) {
//           pairs.push({ giverEmail, receiverEmail });
//         }
//       })
//       .on('end', () => resolve(pairs))
//       .on('error', reject);
//   });
// }

// module.exports = { readEmployeeCSV, readPreviousAssignments };