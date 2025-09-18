"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Tour } from "../../../../../../../data/toursData";
import ReservationForm from "./ReservationForm/ReservationForm";
import { ReservationFormData } from "./ReservationForm/types";
import { useEffect } from "react";

interface ReservationModalProps {
  tour: Tour;
  formRef: React.RefObject<HTMLFormElement>;
  sendEmail: (e: React.FormEvent<HTMLFormElement>) => void;
  isSubmitting: boolean;
  hasSubmitted: boolean;
  showModal: boolean;
  setShowModal: (show: boolean) => void;
  availableDates: Date[];
  formData: ReservationFormData;
  setFormData: React.Dispatch<React.SetStateAction<ReservationFormData>>;
  showWhatsApp: boolean;
  setShowWhatsApp: (show: boolean) => void;
}

export default function ReservationModal({
  tour,
  formRef,
  sendEmail,
  isSubmitting,
  hasSubmitted,
  showModal,
  setShowModal,
  availableDates,
  formData,
  setFormData,
  showWhatsApp,
  setShowWhatsApp,
}: ReservationModalProps) {
  // Handle modal scroll and positioning
  useEffect(() => {
    if (showModal) {
      // Prevent body scroll and ensure modal starts at top
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";

      // Force scroll to top when modal opens
      window.scrollTo(0, 0);

      // Hide only specific navigation elements but keep footer
      const styleElement = document.createElement("style");
      styleElement.id = "modal-overlay-styles";
      styleElement.innerHTML = `
        /* Hide specific navigation elements only */
        nav[class*="fixed"]:not([data-modal]),
        header[class*="fixed"]:not([data-modal]) {
          visibility: hidden !important;
          opacity: 0 !important;
          pointer-events: none !important;
        }
        
        /* Ensure modal elements are always visible and on top */
        [data-modal], [data-modal-content] {
          visibility: visible !important;
          opacity: 1 !important;
          pointer-events: auto !important;
          position: fixed !important;
          top: 0 !important;
          left: 0 !important;
          width: 100% !important;
          height: 100% !important;
          z-index: 9999 !important;
        }
      `;
      document.head.appendChild(styleElement);
    } else {
      // Restore body scroll
      document.body.style.overflow = "unset";
      document.documentElement.style.overflow = "unset";

      // Remove styles
      const styleElement = document.getElementById("modal-overlay-styles");
      if (styleElement) {
        styleElement.remove();
      }
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = "unset";
      document.documentElement.style.overflow = "unset";
      const styleElement = document.getElementById("modal-overlay-styles");
      if (styleElement) {
        styleElement.remove();
      }
    };
  }, [showModal]);

  return (
    <AnimatePresence>
      {showModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-95 z-[9999]"
          style={{
            zIndex: 9999,
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100vh",
          }}
          data-modal="true"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowModal(false);
            }
          }}
        >
          <div
            className="w-full h-full"
            data-modal-content="true"
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100%",
              height: "100vh",
              overflow: "hidden",
            }}
          >
            <ReservationForm
              tour={tour}
              formRef={formRef}
              sendEmail={sendEmail}
              isSubmitting={isSubmitting}
              hasSubmitted={hasSubmitted}
              setShowModal={setShowModal}
              availableDates={availableDates}
              formData={formData}
              setFormData={setFormData}
              showWhatsApp={showWhatsApp}
              setShowWhatsApp={setShowWhatsApp}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
