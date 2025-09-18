"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Tour } from "../../../../../../../data/toursData";
import ReservationForm from "./ReservationForm/ReservationForm";
import { ReservationFormData } from "./ReservationForm/types";
import { useEffect, useCallback } from "react";

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
  // Optimizar manejo de estilos del modal
  const handleModalStyles = useCallback((show: boolean) => {
    if (show) {
      // Prevent body scroll
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";

      // Force scroll to top
      window.scrollTo(0, 0);

      // Create styles more efficiently
      const existingStyle = document.getElementById("modal-overlay-styles");
      if (!existingStyle) {
        const styleElement = document.createElement("style");
        styleElement.id = "modal-overlay-styles";
        styleElement.textContent = `
          nav[class*="fixed"]:not([data-modal]),
          header[class*="fixed"]:not([data-modal]) {
            visibility: hidden !important;
            opacity: 0 !important;
            pointer-events: none !important;
          }
          
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
      }
    } else {
      // Restore styles
      document.body.style.overflow = "unset";
      document.documentElement.style.overflow = "unset";

      const styleElement = document.getElementById("modal-overlay-styles");
      if (styleElement) {
        styleElement.remove();
      }
    }
  }, []);

  // Handle modal scroll and positioning
  useEffect(() => {
    handleModalStyles(showModal);

    // Cleanup on unmount
    return () => {
      handleModalStyles(false);
    };
  }, [showModal, handleModalStyles]);

  // Memoizar el click handler del backdrop
  const handleBackdropClick = useCallback(
    (e: React.MouseEvent) => {
      if (e.target === e.currentTarget) {
        setShowModal(false);
      }
    },
    [setShowModal]
  );

  return (
    <AnimatePresence mode="wait">
      {showModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }} // Reducir duración de animación
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
          onClick={handleBackdropClick}
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
