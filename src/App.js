import { useState } from "react";
import axios from "axios";
import CryptoJS from "crypto-js";

function App() {
  const [qr, setQr] = useState(null);
  const [fileurl, setFileurl] = useState("");
  const [status, setStatus] = useState("");
  const [details, setDetails] = useState(null);
  function generateQR() {
    axios
      .post(
        "https://my.veridocglobal.com/api/generateqr",
        {},
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            apikey: process.env.REACT_APP_APP_KEY,
            payload: CryptoJS.SHA256(
              process.env.REACT_APP_APP_KEY + process.env.REACT_APP_CLIENT_KEY
            ).toString(),
            // "Content-Length": "0",
          },
        }
      )
      .then((res) => {
        setQr(res.data);
        console.log(res.data);
      });
  }
  function handleInput(e) {
    setFileurl(e.target.value);
  }
  const handleSubmit = () => {
    const payload = CryptoJS.SHA256(
      process.env.REACT_APP_APP_KEY +
        qr?.uniqueId +
        fileurl +
        process.env.REACT_APP_CLIENT_KEY
    ).toString();
    axios
      .post(
        "https://veridocglobal.com/api/submitdocument",
        {
          uniqueId: qr?.uniqueId,
          fileurl: fileurl,
        },
        {
          headers: {
            apikey: process.env.REACT_APP_APP_KEY,
            payload: payload,
          },
        }
      )
      .then((res) => {
        console.log(res.data);
        getStatus();
      });
  };
  const getStatus = () => {
    const payloadNew = CryptoJS.SHA256(
      process.env.REACT_APP_APP_KEY +
        qr?.uniqueId +
        process.env.REACT_APP_CLIENT_KEY
    ).toString();
    axios
      .post(
        "https://veridocglobal.com/api/getblockchainstatus",
        {
          uniqueId: qr?.uniqueId,
        },
        {
          headers: {
            apikey: process.env.REACT_APP_APP_KEY,
            payload: payloadNew,
          },
        }
      )
      .then((res) => {
        console.log(res.data);
        console.log(payloadNew);
        if (res.data.blockchainstatus !== "Success") {
          getStatus();
        } else{
          setDetails(res.data);
        }
        setStatus(res.data.blockchainstatus);
        
      });
  }
  return (
    <div>
      <button onClick={generateQR}>Generate QR</button>
      <p>
        <img src={qr?.qrimage} />
      </p>
      File Url:
      <input type="text" value={fileurl} onChange={handleInput} />
      <button onClick={handleSubmit}>Submit</button>
      <p>Blockchain Status:{status===""?`Upload document`:status}</p>
      {
        details&&(
          <div>
            <p>Transaction ID:{details.transactionid}</p>
            <p>Blockchain URL:<a href={details.blockchainurl}>{details.blockchainurl}</a></p>
          </div>
        )
      }
    </div>
  );
}

export default App;
