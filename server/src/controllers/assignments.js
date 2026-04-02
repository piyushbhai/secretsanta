const CSVHandler = require('../services/csvHandler');
const FileExporter = require('../services/fileExporter');
const SantaEngine = require('../services/santaEngine');
const Employee = require('../models/employee.model');
const Assignment = require('../models/assignment.model');

const exporter = new FileExporter();

async function generate(req, res, next) {
  try {
    // get employees from db
    const employees = await Employee.find({}, { name: 1, email: 1, _id: 0 }).lean();

    if (employees.length < 2) {
      return res.status(400).json({
        error: 'upload at least 2 employees first'
      });
    }

    // figure out previous year constraints
    let prevPairs = [];

    if (req.file) {
      prevPairs = await CSVHandler.readPreviousAssignments(req.file.path);
    } else {
      // check db for last year
      const lastYear = new Date().getFullYear() - 1;
      const dbPrev = await Assignment.find({ year: lastYear }).lean();
      prevPairs = dbPrev.map(d => ({
        giverEmail: d.giverEmail,
        receiverEmail: d.receiverEmail
      }));
    }

    // run the algorithm
    const engine = new SantaEngine(employees, prevPairs);
    const results = engine.generate();

    // save to db
    const year = new Date().getFullYear();
    await Assignment.deleteMany({ year });
    const docs = results.map(r => ({ ...r, year }));
    await Assignment.insertMany(docs);

    // save csv file
    const csvPath = exporter.exportToCSV(results);

    res.json({
      message: `generated ${results.length} assignments`,
      assignments: results,
      csvFile: csvPath
    });
  } catch (err) {
    next(err);
  }
}

async function getByYear(req, res, next) {
  try {
    const year = parseInt(req.params.year) || new Date().getFullYear();
    const data = await Assignment.find({ year }).lean();
    res.json({ year, count: data.length, assignments: data });
  } catch (err) {
    next(err);
  }
}

async function downloadCsv(req, res, next) {
  try {
    const year = parseInt(req.params.year) || new Date().getFullYear();
    const data = await Assignment.find({ year }).lean();

    if (!data.length) {
      return res.status(404).json({ error: 'no assignments for year ' + year });
    }

    const filepath = exporter.exportToCSV(data, `secret_santa_${year}.csv`);
    res.download(filepath);
  } catch (err) {
    next(err);
  }
}

module.exports = { generate, getByYear, downloadCsv };


// const { readPreviousAssignments } = require('../services/csvHandler');
// const { exportAssignmentsToCSV } = require('../services/fileExporter');
// const SantaEngine = require('../services/santaEngine');
// const Employee = require('../models/employee.model');
// const Assignment = require('../models/assignment.model');

// async function generate(req, res, next) {
//   try {
//     const employees = await Employee.find({}, { name: 1, email: 1, _id: 0 }).lean();

//     if (employees.length < 2) {
//       return res.status(400).json({ error: 'upload at least 2 employees first' });
//     }

//     let prevPairs = [];

//     if (req.file) {
//       prevPairs = await readPreviousAssignments(req.file.path);
//     } else {
//       const lastYear = new Date().getFullYear() - 1;
//       const dbPrev = await Assignment.find({ year: lastYear }).lean();
//       prevPairs = dbPrev.map(d => ({
//         giverEmail: d.giverEmail,
//         receiverEmail: d.receiverEmail
//       }));
//     }

//     const engine = new SantaEngine(employees, prevPairs);
//     const results = engine.generate();

//     const year = new Date().getFullYear();
//     await Assignment.deleteMany({ year });

//     const docs = results.map(r => ({ ...r, year }));
//     await Assignment.insertMany(docs);

//     const csvPath = exportAssignmentsToCSV(results);

//     res.json({
//       message: `generated ${results.length} assignments`,
//       assignments: results,
//       csvFile: csvPath
//     });
//   } catch (err) {
//     next(err);
//   }
// }

// async function getByYear(req, res, next) {
//   try {
//     const year = parseInt(req.params.year) || new Date().getFullYear();
//     const data = await Assignment.find({ year }).lean();
//     res.json({ year, count: data.length, assignments: data });
//   } catch (err) {
//     next(err);
//   }
// }

// async function downloadCsv(req, res, next) {
//   try {
//     const year = parseInt(req.params.year) || new Date().getFullYear();
//     const data = await Assignment.find({ year }).lean();

//     if (!data.length) {
//       return res.status(404).json({ error: 'no assignments for year ' + year });
//     }

//     const filepath = exportAssignmentsToCSV(data);
//     res.download(filepath);
//   } catch (err) {
//     next(err);
//   }
// }

// module.exports = { generate, getByYear, downloadCsv };