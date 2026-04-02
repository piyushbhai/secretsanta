import { useState } from 'react';
import UploadBox from './components/UploadBox';
import ResultsTable from './components/ResultsTable';
import Loader from './components/Loader';
import { uploadEmployeeFile, runSecretSanta, getDownloadUrl } from './helpers/api';
import './App.css';

function App() {
  const [empFile, setEmpFile] = useState(null);
  const [prevFile, setPrevFile] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState('');
  const [currentStep, setCurrentStep] = useState(1);

  async function handleUpload() {
    if (!empFile) {
      setMsg('pick a file first');
      return;
    }
    setBusy(true);
    setMsg('');
    try {
      const { data } = await uploadEmployeeFile(empFile);
      setEmployees(data.employees);
      setMsg(data.message);
      setCurrentStep(2);
    } catch (err) {
      setMsg(err.response?.data?.error || 'upload failed');
    }
    setBusy(false);
  }

  async function handleGenerate() {
    setBusy(true);
    setMsg('');
    try {
      const { data } = await runSecretSanta(prevFile);
      setAssignments(data.assignments);
      setMsg(data.message);
      setCurrentStep(3);
    } catch (err) {
      setMsg(err.response?.data?.error || 'generation failed');
    }
    setBusy(false);
  }

  function handleDownload() {
    window.open(getDownloadUrl(), '_blank');
  }

  return (
    <div className="container">
      <h1>Secret Santa</h1>
      <p className="subtitle">upload your employee list and let the magic happen</p>

      {msg && (
        <div className={`toast ${msg.includes('fail') || msg.includes('pick') ? 'bad' : 'good'}`}>
          {msg}
        </div>
      )}

      {busy && <Loader />}

      <div className="card">
        <h2>1. Employee List</h2>
        <UploadBox label="choose the employee csv file" onFileReady={(f) => setEmpFile(f)} />
        <button onClick={handleUpload} disabled={busy || !empFile}>Upload</button>

        {employees.length > 0 && (
          <div className="mini-list">
            <p>{employees.length} employees loaded:</p>
            <ul>
              {employees.map((e, i) => (
                <li key={i}>{e.name} ({e.email})</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {currentStep >= 2 && (
        <div className="card">
          <h2>2. Generate Assignments</h2>
          <UploadBox label="previous year assignments (optional)" onFileReady={(f) => setPrevFile(f)} />
          <button className="btn-primary" onClick={handleGenerate} disabled={busy}>
            Generate Secret Santa
          </button>
        </div>
      )}

      {currentStep >= 3 && assignments.length > 0 && (
        <div className="card">
          <h2>3. Results</h2>
          <button className="btn-green" onClick={handleDownload}>Download CSV</button>
          <ResultsTable data={assignments} />
        </div>
      )}
    </div>
  );
}

export default App;

// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from './assets/vite.svg'
// import heroImg from './assets/hero.png'
// import './App.css'

// function App() {
//   const [count, setCount] = useState(0)

//   return (
//     <>
//       <section id="center">
//         <div className="hero">
//           <img src={heroImg} className="base" width="170" height="179" alt="" />
//           <img src={reactLogo} className="framework" alt="React logo" />
//           <img src={viteLogo} className="vite" alt="Vite logo" />
//         </div>
//         <div>
//           <h1>Get started</h1>
//           <p>
//             Edit <code>src/App.jsx</code> and save to test <code>HMR</code>
//           </p>
//         </div>
//         <button
//           className="counter"
//           onClick={() => setCount((count) => count + 1)}
//         >
//           Count is {count}
//         </button>
//       </section>

//       <div className="ticks"></div>

//       <section id="next-steps">
//         <div id="docs">
//           <svg className="icon" role="presentation" aria-hidden="true">
//             <use href="/icons.svg#documentation-icon"></use>
//           </svg>
//           <h2>Documentation</h2>
//           <p>Your questions, answered</p>
//           <ul>
//             <li>
//               <a href="https://vite.dev/" target="_blank">
//                 <img className="logo" src={viteLogo} alt="" />
//                 Explore Vite
//               </a>
//             </li>
//             <li>
//               <a href="https://react.dev/" target="_blank">
//                 <img className="button-icon" src={reactLogo} alt="" />
//                 Learn more
//               </a>
//             </li>
//           </ul>
//         </div>
//         <div id="social">
//           <svg className="icon" role="presentation" aria-hidden="true">
//             <use href="/icons.svg#social-icon"></use>
//           </svg>
//           <h2>Connect with us</h2>
//           <p>Join the Vite community</p>
//           <ul>
//             <li>
//               <a href="https://github.com/vitejs/vite" target="_blank">
//                 <svg
//                   className="button-icon"
//                   role="presentation"
//                   aria-hidden="true"
//                 >
//                   <use href="/icons.svg#github-icon"></use>
//                 </svg>
//                 GitHub
//               </a>
//             </li>
//             <li>
//               <a href="https://chat.vite.dev/" target="_blank">
//                 <svg
//                   className="button-icon"
//                   role="presentation"
//                   aria-hidden="true"
//                 >
//                   <use href="/icons.svg#discord-icon"></use>
//                 </svg>
//                 Discord
//               </a>
//             </li>
//             <li>
//               <a href="https://x.com/vite_js" target="_blank">
//                 <svg
//                   className="button-icon"
//                   role="presentation"
//                   aria-hidden="true"
//                 >
//                   <use href="/icons.svg#x-icon"></use>
//                 </svg>
//                 X.com
//               </a>
//             </li>
//             <li>
//               <a href="https://bsky.app/profile/vite.dev" target="_blank">
//                 <svg
//                   className="button-icon"
//                   role="presentation"
//                   aria-hidden="true"
//                 >
//                   <use href="/icons.svg#bluesky-icon"></use>
//                 </svg>
//                 Bluesky
//               </a>
//             </li>
//           </ul>
//         </div>
//       </section>

//       <div className="ticks"></div>
//       <section id="spacer"></section>
//     </>
//   )
// }

// export default App
