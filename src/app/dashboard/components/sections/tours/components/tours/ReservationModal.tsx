"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Tour } from "../../../../../../../data/toursData";
import ReservationForm from "./ReservationForm/ReservationForm";
import { ReservationFormData } from "./ReservationForm/types";
import { useEffect, useCallback, useMemo } from "react";

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
  // Detectar si es móvil para optimizaciones específicas
  const isMobile = useMemo(() => {
    if (typeof window === "undefined") return false;
    return window.innerWidth < 768;
  }, []);

  // Optimizar estilos del modal con mejores selectores y menos CSS
  const handleModalStyles = useCallback(
    (show: boolean) => {
      const body = document.body;
      const html = document.documentElement;

      if (show) {
        // Usar classes CSS predefinidas para mejor rendimiento
        body.style.cssText =
          "overflow: hidden !important; position: fixed !important; width: 100% !important;";
        html.style.cssText = "overflow: hidden !important;";

        // Optimización para móvil: prevenir scroll bounce
        if (isMobile) {
          body.style.touchAction = "none";
          // Usar setProperty para propiedades webkit
          body.style.setProperty("-webkit-overflow-scrolling", "auto");
        }

        // Scroll a top solo en móvil donde es más necesario
        if (isMobile) {
          window.scrollTo(0, 0);
        }

        // Crear estilos de manera más eficiente
        let existingStyle = document.getElementById("modal-overlay-styles");
        if (!existingStyle) {
          existingStyle = document.createElement("style");
          existingStyle.id = "modal-overlay-styles";
          // CSS optimizado para móvil
          existingStyle.textContent = `
          nav[class*="fixed"]:not([data-modal]),
          header[class*="fixed"]:not([data-modal]) {
            visibility: hidden !important;
            opacity: 0 !important;
            pointer-events: none !important;
            transform: translateZ(0) !important;
          }
          
          [data-modal], [data-modal-content] {
            visibility: visible !important;
            opacity: 1 !important;
            pointer-events: auto !important;
            position: fixed !important;
            top: 0 !important;
            left: 0 !important;
            width: 100% !important;
            height: 100vh !important;
            z-index: 9999 !important;
            transform: translateZ(0) !important;
            will-change: transform !important;
          }
          
          @media (max-width: 767px) {
            [data-modal-content] {
              overscroll-behavior: contain !important;
              -webkit-overflow-scrolling: touch !important;
            }
          }
        `;
          document.head.appendChild(existingStyle);
        }
      } else {
        // Restore estilos de manera más eficiente
        body.style.cssText = "";
        html.style.cssText = "";

        if (isMobile) {
          body.style.touchAction = "";
          body.style.removeProperty("-webkit-overflow-scrolling");
        }

        const styleElement = document.getElementById("modal-overlay-styles");
        if (styleElement) {
          styleElement.remove();
        }
      }
    },
    [isMobile]
  );

  // Manejar modal con mejor cleanup
  useEffect(() => {
    if (showModal) {
      // Usar setTimeout para evitar bloqueo del hilo principal
      setTimeout(() => handleModalStyles(true), 0);
    } else {
      handleModalStyles(false);
    }

    // Cleanup optimizado en unmount
    return () => {
      if (showModal) {
        handleModalStyles(false);
      }
    };
  }, [showModal, handleModalStyles]);

  // Memoizar el click handler del backdrop con mejor detección
  const handleBackdropClick = useCallback(
    (e: React.MouseEvent) => {
      // Solo cerrar si se hace clic exactamente en el backdrop
      if (e.target === e.currentTarget && !isMobile) {
        setShowModal(false);
      }
    },
    [setShowModal, isMobile]
  );

  return (
    <AnimatePresence mode="wait">
      {showModal && (
        <motion.div
          initial={isMobile ? { opacity: 0 } : { opacity: 0, scale: 0.95 }}
          animate={isMobile ? { opacity: 1 } : { opacity: 1, scale: 1 }}
          exit={isMobile ? { opacity: 0 } : { opacity: 0, scale: 0.95 }}
          transition={{
            duration: isMobile ? 0.2 : 0.15,
            ease: isMobile ? "easeInOut" : "easeOut",
          }}
          className="fixed inset-0 bg-black bg-opacity-95 z-[9999] touch-manipulation"
          style={
            {
              zIndex: 9999,
              position: "fixed" as const,
              top: 0,
              left: 0,
              width: "100%",
              height: "100vh",
              contain: "layout style paint" as const,
              willChange: "opacity, transform",
              WebkitBackfaceVisibility: "hidden" as const,
              backfaceVisibility: "hidden" as const,
              transform: "translateZ(0)",
            } as React.CSSProperties
          }
          data-modal="true"
          onClick={handleBackdropClick}
        >
          <div
            className="w-full h-full"
            data-modal-content="true"
            style={
              {
                position: "fixed" as const,
                top: 0,
                left: 0,
                width: "100%",
                height: "100vh",
                overflow: "hidden" as const,
                contain: "layout style paint" as const,
                transform: "translateZ(0)",
                WebkitOverflowScrolling: isMobile
                  ? ("touch" as const)
                  : ("auto" as const),
                overscrollBehavior: isMobile
                  ? ("contain" as const)
                  : ("auto" as const),
              } as React.CSSProperties
            }
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
