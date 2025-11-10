import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface DraftRequest {
  jobName?: string;
  region?: string;
  lpar?: string;
  currentStep?: number;
  [key: string]: any;
}

export default function ShoppingCardPage() {
  const [cartItems, setCartItems] = useState<DraftRequest[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const load = () => {
      const saved = JSON.parse(localStorage.getItem("draftRequests") || "[]");
      setCartItems(saved);
    };

    load();
    window.addEventListener("drafts-updated", load);
    return () => window.removeEventListener("drafts-updated", load);
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Draft Requests</h1>

      {cartItems.length === 0 ? (
        <p className="text-gray-500">No draft requests available.</p>
      ) : (
        <div className="space-y-4">
          {cartItems.map((item, i) => (
            <div
              key={i}
              className="p-4 border rounded-lg bg-white shadow flex justify-between items-center"
            >
              <div>
                <p className="font-semibold">{item.jobName || "Untitled Job"}</p>
                <p className="text-sm text-gray-600">
                  Region: {item.region || "N/A"} | LPAR: {item.lpar || "N/A"}
                </p>
              </div>

              <div className="flex gap-2">
                {/* Continue button */}
                <button
                  onClick={() => {
                    localStorage.setItem("resumeDraft", JSON.stringify(item));
                    navigate("/schedule-job-v1", { state: { startStep: item.currentStep || 1 } });
                  }}
                  className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Continue
                </button>

                {/* Remove button */}
                <button
                  onClick={() => {
                    const updated = cartItems.filter((_, idx) => idx !== i);
                    setCartItems(updated);
                    localStorage.setItem("draftRequests", JSON.stringify(updated));
                    window.dispatchEvent(new Event("drafts-updated"));
                  }}
                  className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
