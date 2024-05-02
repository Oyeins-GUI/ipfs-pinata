import { useState } from "react";
import "./App.css";

function App() {
   const [selectedFile, setSelectedFile] = useState<File | null | undefined>();
   const [cid, setCid] = useState();

   const changeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
      setSelectedFile(e.target.files?.item(0));
   };

   const handleSubmission = async () => {
      try {
         const formData = new FormData();

         if (!selectedFile) return;

         formData.append("file", selectedFile);
         const metadata = JSON.stringify({
            name: `${selectedFile.name}`,
         });
         formData.append("metadata", metadata);

         const options = JSON.stringify({
            cidVersion: 0,
         });
         formData.append("options", options);

         const res = await fetch(
            "https://api.pinata.cloud/pinning/pinFileToIPFS",
            {
               method: "POST",
               headers: {
                  Authorization: `Bearer ${import.meta.env.VITE_PINATA_JWT}`,
               },
               body: formData,
            }
         );
         const resData = await res.json();
         setCid(resData.IpfsHash);
      } catch (error) {
         console.error(error);
      }
   };

   return (
      <div
         style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
            gap: "20px",
         }}
      >
         <label className="form-label" htmlFor="file">
            {" "}
            Choose File
         </label>
         <input type="file" id="file" onChange={changeHandler} />
         <button onClick={handleSubmission}>Submit</button>
         {cid && (
            <img
               src={`${import.meta.env.VITE_GATEWAY_URL}/ipfs/${cid}`}
               alt="ipfs image"
               style={{ width: "300px" }}
            />
         )}
      </div>
   );
}

export default App;
