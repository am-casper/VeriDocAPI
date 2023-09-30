import { useState } from "react";
import axios from "axios";
import CryptoJS from 'crypto-js';

function App() {
  const [qr, setQr] = useState(null);
  function generateQR() {
    axios.post(
      "https://my.veridocglobal.com/api/generateqr",
      {},
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          apikey:
          process.env.REACT_APP_APP_KEY,
          payload:
          CryptoJS.SHA256(process.env.REACT_APP_APP_KEY+process.env.REACT_APP_CLIENT_KEY).toString(),
          // "Content-Length": "0",
        },
      }
    ).then((res) => {
      setQr(res.data);
      console.log(res.data.qrimage);
    });
  }
  return (
    <div >
      <button onClick={generateQR}>Generate QR</button>
      <p><img src={qr?.qrimage} /></p>
    </div>
  );
}

export default App;
