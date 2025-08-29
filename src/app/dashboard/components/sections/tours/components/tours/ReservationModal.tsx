"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Tour } from "../../../../../../../data/toursData";
import ReservationForm from "./ReservationForm/ReservationForm";
import { ReservationFormData } from "./ReservationForm/types";

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
  return (
    <AnimatePresence>
      {showModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black mt-20 bg-opacity-70 flex items-center justify-center z-50 p-2 sm:p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowModal(false);
            }
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
        </motion.div>
      )}
    </AnimatePresence>
  );
}
