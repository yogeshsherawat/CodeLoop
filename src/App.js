import React, { useState } from 'react';
import "./app.css";
import Editor from './components/Editor';

function App()  {
  
  const [code, setCode] = useState("");
  
  const [codeOutput, setCodeOutput] = useState({
    status: '',
    output: '',
    time:''
  })

    return (
      <div style={{backgroundColor:'black'}}>
        <Editor code={code} setCode={setCode} codeOutput={codeOutput} setCodeOutput={setCodeOutput}  />
      </div>
    );
  }
  
  


export default App;
