import emailjs from '@emailjs/browser';

export const sendReservationEmail = async (formRef: React.RefObject<HTMLFormElement>) => {
    try {
        await emailjs.sendForm(
            "service_48b978l",
            "template_uk4drlm",
            formRef.current!,
            "Bl8NYZsWuRuNA-Jbi"
        );
        return true;
    } catch (error) {
        console.error('Error sending email:', error);
        return false;
    }
};