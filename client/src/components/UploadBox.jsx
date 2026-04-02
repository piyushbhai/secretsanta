import { useRef, useState } from 'react';

function UploadBox({ label, onFileReady }) {
  const inputRef = useRef();
  const [fileName, setFileName] = useState('');

  function handleChange(e) {
    const f = e.target.files[0];
    if (!f) return;

    if (!f.name.endsWith('.csv')) {
      alert('pick a .csv file');
      return;
    }

    setFileName(f.name);
    if (onFileReady) onFileReady(f);
  }

  return (
    <div className="upload-box">
      <label>{label}</label>
      <div className="upload-row">
        <input ref={inputRef} type="file" accept=".csv" onChange={handleChange} />
        {fileName && <span className="file-tag">{fileName}</span>}
      </div>
    </div>
  );
}

export default UploadBox;
