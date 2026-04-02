const { Parser } = require('json2csv');
const fs = require('fs');
const path = require('path');

class FileExporter {
  constructor(outputDir = null) {
    this.outputDir = outputDir || path.join(__dirname, '../../output');

    // create output folder if missing
    if (!fs.existsSync(this.outputDir)) {
      fs.mkdirSync(this.outputDir, { recursive: true });
    }
  }

  // converts assignments array to csv and saves to disk
  exportToCSV(assignments, customFilename = null) {
    if (!assignments || assignments.length === 0) {
      throw new Error('nothing to export - assignments list is empty');
    }

    // map internal format to the required output format
    const rows = assignments.map(a => ({
      Employee_Name: a.giverName,
      Employee_EmailID: a.giverEmail,
      Secret_Child_Name: a.receiverName,
      Secret_Child_EmailID: a.receiverEmail
    }));

    const fields = [
      'Employee_Name',
      'Employee_EmailID',
      'Secret_Child_Name',
      'Secret_Child_EmailID'
    ];

    const parser = new Parser({ fields });
    const csvString = parser.parse(rows);

    const filename = customFilename || `secret_santa_${Date.now()}.csv`;
    const fullPath = path.join(this.outputDir, filename);

    fs.writeFileSync(fullPath, csvString, 'utf-8');

    return fullPath;
  }

  // returns the csv as string (useful for sending in response)
  toCSVString(assignments) {
    if (!assignments || assignments.length === 0) {
      throw new Error('nothing to convert');
    }

    const rows = assignments.map(a => ({
      Employee_Name: a.giverName,
      Employee_EmailID: a.giverEmail,
      Secret_Child_Name: a.receiverName,
      Secret_Child_EmailID: a.receiverEmail
    }));

    const fields = ['Employee_Name', 'Employee_EmailID', 'Secret_Child_Name', 'Secret_Child_EmailID'];
    const parser = new Parser({ fields });
    return parser.parse(rows);
  }
}

module.exports = FileExporter;


// const { Parser } = require('json2csv');
// const fs = require('fs');
// const path = require('path');

// function exportAssignmentsToCSV(assignments) {
//   if (!assignments.length) {
//     throw new Error('nothing to export');
//   }

//   // map to the output format they want
//   const rows = assignments.map(a => ({
//     Employee_Name: a.giverName,
//     Employee_EmailID: a.giverEmail,
//     Secret_Child_Name: a.receiverName,
//     Secret_Child_EmailID: a.receiverEmail
//   }));

//   const fields = ['Employee_Name', 'Employee_EmailID', 'Secret_Child_Name', 'Secret_Child_EmailID'];
//   const parser = new Parser({ fields });
//   const csvString = parser.parse(rows);

//   // make sure output folder exists
//   const outputDir = path.join(__dirname, '../../output');
//   if (!fs.existsSync(outputDir)) {
//     fs.mkdirSync(outputDir, { recursive: true });
//   }

//   const filename = `secret_santa_${Date.now()}.csv`;
//   const fullPath = path.join(outputDir, filename);

//   fs.writeFileSync(fullPath, csvString);

//   return fullPath;
// }

// module.exports = { exportAssignmentsToCSV };