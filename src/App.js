import { useState } from "react";
import axios from "axios";
import CryptoJS from "crypto-js";

function App() {
  const [qr, setQr] = useState(null);
  const [fileurl, setFileurl] = useState("");
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
      });
  };
  return (
    <div>
      <button onClick={generateQR}>Generate QR</button>
      <p>
        <img src={qr?.qrimage} />
      </p>
      File Url:
      <input type="text" value={fileurl} onChange={handleInput} />
      <button onClick={handleSubmit}>Submit</button>
    </div>
  );
}

export default App;
