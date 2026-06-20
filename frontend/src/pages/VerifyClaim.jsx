import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { FiCheckCircle } from "react-icons/fi";
import api from "../api/axios";

export default function VerifyClaim() {
const { claimId } = useParams();

const [claim, setClaim] = useState(null);
const [loading, setLoading] = useState(true);
const [message, setMessage] = useState("");

useEffect(() => {
loadClaim();
}, []);

const loadClaim = async () => {
try {
const res = await api.get(`/verify-claim/${claimId}/`);
setClaim(res.data);
} catch (err) {
setMessage("Claim not found");
} finally {
setLoading(false);
}
};

const verifyClaim = async () => {
try {
const res = await api.post(`/confirm-claim/${claimId}/`);
setMessage(res.data.message || "Claim verified successfully");
} catch (err) {
setMessage("Verification failed");
}
};

if (loading) {
return ( <div className="p-10 text-center">
Loading... </div>
);
}

return ( <div className="space-y-6"> <div className="rounded-3xl bg-gradient-to-r from-indigo-600 to-purple-600 p-8 text-white"> <h1 className="text-3xl font-bold">
QR Claim Verification </h1>

```
    <p className="mt-2 text-indigo-100">
      Verify ownership before handing over items.
    </p>
  </div>

  <div className="bg-slate-800 rounded-3xl p-8">
    <div className="flex justify-center">
      <img
        src={
          claim?.qr_code ||
          "https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=CLAIM001"
        }
        alt="QR Code"
        className="rounded-xl"
      />
    </div>

    <div className="text-center mt-6">
      <h2 className="text-2xl text-white font-semibold">
        Claim ID
      </h2>

      <p className="text-green-400 text-xl mt-2">
        {claimId}
      </p>

      {claim?.found_item && (
        <div className="mt-6 text-white">
          <p>
            <strong>Found Item:</strong>{" "}
            {claim.found_item.title}
          </p>

          <p>
            <strong>Location:</strong>{" "}
            {claim.found_item.location}
          </p>
        </div>
      )}

      <button
        onClick={verifyClaim}
        className="mt-6 bg-green-600 hover:bg-green-700 px-6 py-3 rounded-xl text-white flex items-center gap-2 mx-auto"
      >
        <FiCheckCircle />
        Verify Claim
      </button>

      {message && (
        <p className="mt-4 text-yellow-300">
          {message}
        </p>
      )}
    </div>
  </div>
</div>


);
}
