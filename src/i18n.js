import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      "hospital_name": "City General Hospital",
      "submit_enquiry": "Submit Enquiry",
      "track_enquiry": "Track Enquiry",
      "staff_login": "Staff Login",
      "admin_dashboard": "Admin Dashboard",
      "receptionist_dashboard": "Receptionist Dashboard",
      "enquiry_type": "Enquiry Type",
      "patient_name": "Patient Name",
      "phone_number": "Phone Number",
      "age": "Age",
      "description": "Description",
      "submit": "Submit",
      "status": "Status",
      "date": "Date"
    }
  },
  te: {
    translation: {
      "hospital_name": "సిటీ జనరల్ ఆసుపత్రి",
      "submit_enquiry": "విచారణ సమర్పించండి",
      "track_enquiry": "విచారణను ట్రాక్ చేయండి",
      "staff_login": "సిబ్బంది లాగిన్",
      "admin_dashboard": "అడ్మిన్ డాష్‌బోర్డ్",
      "receptionist_dashboard": "రిసెప్షనిస్ట్ డాష్‌బోర్డ్",
      "enquiry_type": "విచారణ రకం",
      "patient_name": "రోగి పేరు",
      "phone_number": "ఫోన్ నంబర్",
      "age": "వయస్సు",
      "description": "వివరణ",
      "submit": "సమర్పించండి",
      "status": "స్థితి",
      "date": "తేదీ"
    }
  },
  hi: {
    translation: {
      "hospital_name": "सिटी जनरल अस्पताल",
      "submit_enquiry": "पूछताछ दर्ज करें",
      "track_enquiry": "पूछताछ ट्रैक करें",
      "staff_login": "कर्मचारी लॉगिन",
      "admin_dashboard": "व्यवस्थापक डैशबोर्ड",
      "receptionist_dashboard": "रिसेप्शनिस्ट डैशबोर्ड",
      "enquiry_type": "पूछताछ का प्रकार",
      "patient_name": "रोगी का नाम",
      "phone_number": "फोन नंबर",
      "age": "आयु",
      "description": "विवरण",
      "submit": "जमा करें",
      "status": "स्थिति",
      "date": "दिनांक"
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: "en",
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
