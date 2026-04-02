function ResultsTable({ data }) {
  if (!data || data.length === 0) return null;

  return (
    <div className="results-wrap">
      <h3>Assignments ({data.length})</h3>
      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>Employee</th>
            <th>Email</th>
            <th></th>
            <th>Secret Child</th>
            <th>Child Email</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr key={i}>
              <td>{i + 1}</td>
              <td>{row.giverName}</td>
              <td>{row.giverEmail}</td>
              <td style={{ textAlign: 'center' }}>→</td>
              <td>{row.receiverName}</td>
              <td>{row.receiverEmail}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ResultsTable;
