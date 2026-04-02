const CSVHandler = require('../services/csvHandler');
const Employee = require('../models/employee.model');

async function uploadEmployees(req, res, next) {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'no file uploaded' });
    }

    const parsed = await CSVHandler.readEmployees(req.file.path);

    // upsert so we dont get duplicate email errors
    const ops = parsed.map(emp => ({
      updateOne: {
        filter: { email: emp.email },
        update: { $set: emp },
        upsert: true
      }
    }));

    await Employee.bulkWrite(ops);

    res.json({
      message: `uploaded ${parsed.length} employees`,
      employees: parsed
    });
  } catch (err) {
    next(err);
  }
}

async function getAll(req, res, next) {
  try {
    const list = await Employee.find({}).sort({ name: 1 }).lean();
    res.json({ count: list.length, employees: list });
  } catch (err) {
    next(err);
  }
}

module.exports = { uploadEmployees, getAll };

// const { readEmployeeCSV } = require('../services/csvHandler');
// const Employee = require('../models/employee.model');

// async function uploadEmployees(req, res, next) {
//   try {
//     if (!req.file) {
//       return res.status(400).json({ error: 'no file uploaded' });
//     }

//     const parsed = await readEmployeeCSV(req.file.path);

//     const ops = parsed.map(emp => ({
//       updateOne: {
//         filter: { email: emp.email },
//         update: { $set: emp },
//         upsert: true
//       }
//     }));

//     await Employee.bulkWrite(ops);

//     res.json({
//       message: `uploaded ${parsed.length} employees`,
//       employees: parsed
//     });
//   } catch (err) {
//     next(err);
//   }
// }

// async function getAll(req, res, next) {
//   try {
//     const list = await Employee.find({}).sort({ name: 1 }).lean();
//     res.json({ count: list.length, employees: list });
//   } catch (err) {
//     next(err);
//   }
// }

// module.exports = { uploadEmployees, getAll };