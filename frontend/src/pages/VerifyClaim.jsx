import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FiCheckCircle, FiMapPin, FiPackage, FiShield } from "react-icons/fi";
import api from "../api/axios";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import PageHeader from "../components/ui/PageHeader";
import LoadingSpinner from "../components/ui/LoadingSpinner";

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
    return <LoadingSpinner />;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6 max-w-2xl mx-auto"
    >
      <PageHeader
        eyebrow="Secure Handover"
        title="QR Claim Verification"
        subtitle="Verify ownership before handing over items."
        icon={FiShield}
      />

      <Card delay={0.1} className="p-8">
        <div className="flex justify-center">
          <div
            className="rounded-2xl p-4 border hairline"
            style={{ background: "var(--surface-2)" }}
          >
            <img
              src={
                claim?.qr_code ||
                "https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=CLAIM001"
              }
              alt="QR Code"
              className="rounded-xl"
            />
          </div>
        </div>

        <div className="text-center mt-8">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] faint">
            Claim ID
          </p>

          <p className="text-xl mt-2 font-mono font-semibold accent-text">
            {claimId}
          </p>

          {claim?.found_item && (
            <div className="mt-6 space-y-3 text-left">
              <div
                className="flex items-center gap-3 rounded-2xl p-4 border hairline"
                style={{ background: "var(--surface-2)" }}
              >
                <div className="accent-soft grid h-10 w-10 shrink-0 place-items-center rounded-xl">
                  <FiPackage className="accent-text" size={18} />
                </div>
                <div>
                  <p className="text-xs faint">Found Item</p>
                  <p className="font-semibold" style={{ color: "var(--text)" }}>
                    {claim.found_item.title}
                  </p>
                </div>
              </div>

              <div
                className="flex items-center gap-3 rounded-2xl p-4 border hairline"
                style={{ background: "var(--surface-2)" }}
              >
                <div className="accent-soft grid h-10 w-10 shrink-0 place-items-center rounded-xl">
                  <FiMapPin className="accent-text" size={18} />
                </div>
                <div>
                  <p className="text-xs faint">Location</p>
                  <p className="font-semibold" style={{ color: "var(--text)" }}>
                    {claim.found_item.location}
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="mt-8 flex justify-center">
            <Button
              variant="primary"
              size="lg"
              icon={FiCheckCircle}
              onClick={verifyClaim}
            >
              Verify Claim
            </Button>
          </div>

          {message && (
            <motion.p
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 inline-block rounded-xl px-4 py-2 text-sm font-medium bg-amber-500/15 text-amber-400"
            >
              {message}
            </motion.p>
          )}
        </div>
      </Card>
    </motion.div>
  );
}
