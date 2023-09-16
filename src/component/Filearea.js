import React, { useRef, useState } from 'react';
import fileareacss from './Filearea.css';

function Filearea() {
    const [file, setFile] = useState([]);
    const [status,setStatus] = useState('');
    const [convertBtnClick,setConvertBtnClick] = useState(false);
    const [dataLen,setDataLen] = useState(0);
    const [cdataLen,setCDataLen] = useState(0);
    const fieldref = useRef(null);
    const handleDrop = async (event) => {
        event.preventDefault();
        setFile([...file, ...event.dataTransfer.files]);
    }
    const handleDragOver = async (event) => {
        event.preventDefault();
    }
    const removeFile = async(event)=>{
        let temp = [...file];
        temp.splice(+event.target.id,1);
        setFile([...temp]);
    }
    const sendBackend = async()=>{
        setConvertBtnClick(true);
        let tempForm = new FormData();
        file.forEach((value,index)=>tempForm.append('images',value));
        try{
            //let result = await fetch('https://imagetopdfbackendapi.onrender.com/api/imagetopdf',
            let result = await fetch('http://localhost:3000/api/imagetopdf',
                {
                    method:'POST',
                    mode:'cors',
                    body:tempForm,
                }
            );
            //result = await result.json();
            //setStatus(result);
            let tempResult = '';
            const reader = result.body.getReader();
            const { value } = await reader.read();
            const tempVal = new TextDecoder().decode(value);
            const totelLenIdx = tempVal.match('<<>>').index;
            setDataLen(+tempVal.slice(0,totelLenIdx));
            tempResult += tempVal.slice(totelLenIdx+4,);
            setCDataLen((tempResult.length/dataLen)*100);
            while (true) {
                const { done, value } = await reader.read();
                if (done) {
                  break;
                }
                tempResult += new TextDecoder().decode(value);
                setCDataLen((tempResult.length/dataLen)*100);
            }
            setStatus({result:tempResult});
        }
        catch(error){
            console.warn(error);
        }
    }

    return (
        <div className='main'>
            <p>Convert JPG/PNG Images To PDF In Seconds. With Simple Steps, Just Select The Iamges And Click To Convert Button.</p>
            {
                file.length > 0 ?
                    <div style={fileareacss} className='filearea' onDragOver={handleDragOver} onDrop={handleDrop}>
                        <ul>
                            {file.map((files, idx) => 
                                <div key={idx} className='filels'>
                                    <img alt='Image_Not_Found' src={URL.createObjectURL(files)} loading="lazy" width="120" height="130"/>
                                    <div className='filelstxt'>
                                        <li key={idx}>{files.name}</li>
                                        <img id={idx} alt="" src={process.env.PUBLIC_URL+'/icon/delete.svg'} onClick={removeFile} loading="lazy" width="14" height="14" className="imfo-img"/>
                                    </div>
                                </div>
                            )}
                        </ul>
                        <div className='filebtn'>
                            <button type='button' onClick={() => fieldref.current.click()}>Add More</button>
                            <button type='button' onClick={() => setFile([])}>clear</button>
                            <input id='selectfile' ref={fieldref} accept='image/*' type='file' hidden multiple onChange={(e) => setFile([...file, ...e.target.files])} />
                        </div>
                    </div>
                    :
                    <div style={fileareacss} className='filearea' onDragOver={handleDragOver} onDrop={handleDrop}>
                        <label htmlFor='selectfile'>Drag And Drop</label>
                        <label htmlFor='selectfile'>Or</label>
                        <label htmlFor='selectfile'>Select Images</label>
                        <input id='selectfile' ref={fieldref} accept='image/*' type='file' hidden multiple onChange={(e) => setFile([...file, ...e.target.files])} />
                    </div>
            }
            <div className='cbutton'>
                {
                    file.length>0?<button className='upload-btn'type="button" onClick={sendBackend}>Convert To</button>:null
                }
                {
                    (function(){
                        if(convertBtnClick){
                            if(status.result){
                                const buf = status.result;
                                return (
                                    <div className="download-btn">
                                        <h2>You PDF Is Ready For Download</h2>
                                        <a href={buf} download={'output.pdf'} onClick={()=>{setTimeout(()=>{setFile([]);setStatus('');setConvertBtnClick(false)},3000)}}>
                                            <button type='button' className='download-btn-click'>
                                                <img alt='' className='download-btn-icon'src={process.env.PUBLIC_URL+'/icon/download-icon.svg'}/>
                                                Download
                                            </button>
                                        </a>
                                        <div>
                                            <img className='download-close' onClick={()=>{setStatus('');setConvertBtnClick(false)}}alt='' src={process.env.PUBLIC_URL+'/icon/close-icon.svg'}/>
                                        </div>
                                    </div>
                                )
                            }
                            else{
                                return (
                                    <div className="download-btn">
                                        <h2>PDF Uploaded &#8594; Converting To PDF </h2>
                                        <progress id="file" value={cdataLen} max="100"/>
                                        <img className='download-close' onClick={()=>{setStatus('');setConvertBtnClick(false)}}alt='' src={process.env.PUBLIC_URL+'/icon/close-icon.svg'}/>
                                    </div>
                                )
                            }
                        }
                    })()
                }
            </div>
            <div className='infolist'>
                <div className="info">
                    <img alt="" src={process.env.PUBLIC_URL+'/icon/idea.svg'} loading="lazy" width="48" height="48" className="imfo-img"/>
                    <div className="infofst">Fast and Easy JPG to PDF Converter</div>
                    <div className="infosecond">You can drag and drop your JPG image into the toolbox above to quickly transform it into a PDF document. Various settings are available for you to adjust the format of the output file.</div>
                </div>
                <div className="info">
                    <img alt="" src={process.env.PUBLIC_URL+'/icon/prize.svg'} loading="lazy" width="48" height="48" className="imfo-img"/>
                    <div className="infofst">File Protection Guaranteed</div>
                    <div className="infosecond">We employ SSL encryption to guarantee the complete security of your JPEG/PNG images during the transfer, ensuring that no one can access your files, and we will also delete them after 5 minutes of processing for added confidentiality.</div>
                </div>
                <div className="info">
                    <img alt="" src={process.env.PUBLIC_URL+'/icon/like.svg'} loading="lazy" width="48" height="48" className="imfo-img"/>
                    <div className="infofst">Convert your JPG/PNG to PDF Online</div>
                    <div className="infosecond">Our web-based JPG/PNG to PDF converter operates independently of your operating system (OS), making it accessible on Mac, Windows, Android, and Linux platforms with ease.</div>
                </div>
                <div className="info">
                    <img alt="" src={process.env.PUBLIC_URL+'/icon/lock.svg'} loading="lazy" width="48" height="48" className="imfo-img"/>
                    <div className="infofst">Add Additional Documents</div>
                    <div className="infosecond">After you upload your JPG/PNG to PDF,  there is also an option for you to add more images, in case you wish to combine multiple image files into one PDF with our online service.</div>
                </div>
                <div className="info">
                    <img alt="" src={process.env.PUBLIC_URL+'/icon/format.svg'} loading="lazy" width="48" height="48" className="imfo-img"/>
                    <div className="infofst">Other image formats</div>
                    <div className="infosecond">This online web base tool also functions as an all-in-one image to PDF converter. As such, you can also add GIF, BMP, and TIFF to save them to PDF format.</div>
                </div>
            </div>
        </div>
    )
}

export default Filearea;