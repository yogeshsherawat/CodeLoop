import React, { Fragment , useState } from 'react';
import axios from 'axios';
import AddNextLine from '../utils/addNextLine';
import enterDetection from '../utils/enterDetection';

const Editor = (props) => {
    
    const [isCompiling, setisCompiling] = useState(false);

    const [input, setInput] = useState('');

    const [lang, setLang] = useState('PYTHON3');

    const {code, setCode , codeOutput , setCodeOutput } = props;

    const handleChange = (e) => {
        setCode(e.target.value);
    }
    const handleInputChange = (e) => {
        setInput(e.target.value);
    }
    const JavaBtn = () => {
        setLang('JAVA8');
    }
    const Python3Btn = () => {
        setLang('PYTHON3');
    }
    const cppBtn = () => {
        setLang('CPP');
    }
    
    

    const handleClick = async () => {
        
        setisCompiling(true);
        let CODE_EVALUATION_URL = 'https://api.hackerearth.com/v4/partner/code-evaluation/submissions/';
        let Code_Eval_URL = 'https://cors-anywhere.herokuapp.com/' + CODE_EVALUATION_URL;
        let callback ='https://coding-bros-42213.herokuapp.com/callback'
        let clientSecret = '5ce27249c8c7ee4fe414c322a8aa5f309221677d';  
        let inputNew = await AddNextLine(input);
        let dataString = {
            'source': code,
            'lang': lang,
            'time_limit': 5,
            'memory_limit': 246323,
            'input': inputNew,
            'callback': callback,
            'id': "2343847837"
        }
        let headers = {
            'Access-Control-Allow-Origin':'*',
            'cache-control': 'no-cache',
            'client-secret': clientSecret,
            'Content-Type': 'application/json'
        };
        let config = {
            headers: headers,
            body: dataString
        };
        try {
            const res = await axios.post(Code_Eval_URL, dataString, config);
            console.log(res);
            const statusUrl = res.data.status_update_url;
            console.log(statusUrl);
            let finalStatusUrl = 'https://cors-anywhere.herokuapp.com/' + statusUrl;
            const res2 = await axios.get(finalStatusUrl, config);
            const code_status = res2.data.result.run_status.status;
            const code_time = res2.data.result.run_status.time_used;
            console.log("compile status:" + res2.data.result.compile_status);
            if (code_status === "AC") {
                const outputURL = res2.data.result.run_status.output;

                let res3 = await axios.get(outputURL);
                const finalOutput = res3.data;

                let enterDetectedOutput =await enterDetection(finalOutput);
                console.log(enterDetectedOutput);
                setCodeOutput({ ...codeOutput, output: enterDetectedOutput, status: 'AC', time: code_time });
                setisCompiling(false);
                console.log(codeOutput);
            }
            else {
                let output = res2.data.result.run_status.stderr;
                setCodeOutput({ ...codeOutput, output: output, status: code_status, time: code_time });
                setisCompiling(false);

                console.log(codeOutput);
            }
            
        }
        catch (error) {
            console.log(error);
            setisCompiling(false);
        }

    }


    return (<Fragment>
        <h1 className='ml-5 pt-2 txtColor-white'><i><span className='txtColor-orange'>Code</span>Loop</i></h1>
        <div className='borderDiv pl-3'>
            <h3 className='text-center txtColor-white'><i><span className='txtColor-orange'>{lang} </span> Editor</i></h3>
            <button
                className='btn btn-outline-primary' 
                onClick={JavaBtn}>
                Java
            </button>
            <button
                className='btn btn-outline-danger ml-2' 
                onClick={Python3Btn}>
                PYTHON3
            </button>
            <button
                className='btn btn-outline-warning ml-2'
                onClick={cppBtn}>
                C++
            </button>
            <textarea
                className='codeArea mt-3 pt-2 pl-2'
                onChange={handleChange}
                value={code} placeholder="Enter Code Here" >
            </textarea>
            <button
                className='btn btn-primary' 
                style={{ backgroundColor: '#ffb84d', borderColor:'black' , color:'black' }}
                
                onClick={handleClick}>
                Compile & Run
            </button>
            {isCompiling === true && <i className='txtColor-orange ml-4'>Compiling...</i> }
            
            
        
        </div>
        <div className="input-output txtColor-white">
            <textarea
                className='pt-2 pl-2'
                rows={7}
                cols={50}
                onChange={handleInputChange}
                value={input}
                placeholder='Enter Input Here'>
            </textarea>
            <h1 className='txtColor-orange'>
                Output:
            </h1>
            <span className='txtColor-orange'
            >Result:</span>{codeOutput.status}
            <br />
            <span className='txtColor-orange'>
                Execution Time:</span>{codeOutput.time}
            <br />
            <span className='txtColor-orange' >
                Output Console:
                </span><br />
            <textarea
                className="mt-2"
                value={codeOutput.output}
                rows={7}
                cols={50}
                readOnly>
            
            </textarea>
        </div>
    </Fragment>
    );

}

export default Editor;