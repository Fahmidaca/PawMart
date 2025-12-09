import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Translation resources
const resources = {
  en: {
    translation: {
      // Navigation
      home: "Home",
      login: "Login", 
      signup: "Sign Up",
      logout: "Logout",
      profile: "Profile",
      
      // Common
      loading: "Loading...",
      error: "Error",
      success: "Success",
      cancel: "Cancel",
      save: "Save",
      delete: "Delete",
      edit: "Edit",
      
      // Home page
      welcome: "Welcome to PawMart",
      findYourFurryFriend: "Find Your Furry Friend",
      adoptLoveCare: "Adopt Love & Care",
      keepPetsWarmSafe: "Keep Pets Warm & Safe",
      expertPetServices: "Expert Pet Services",
      browsePetsSupplies: "Browse Pets & Supplies",
      ourServices: "Our Services",
      recentListings: "Recent Listings",
      viewAllServices: "View All Services",
      meetOurPetExperts: "Meet Our Pet Experts",
      bookConsultation: "Book Consultation",
      meetOurPetHeroes: "Meet Our Pet Heroes",
      
      // Categories
      pets: "Pets",
      food: "Food", 
      accessories: "Accessories",
      careProducts: "Care Products",
      
      // Values
      saveALife: "Save a Life",
      unconditionalLove: "Unconditional Love",
      supportCommunity: "Support Community",
      
      // Auth
      email: "Email",
      password: "Password",
      name: "Name",
      confirmPassword: "Confirm Password",
      forgotPassword: "Forgot Password?",
      dontHaveAccount: "Don't have an account?",
      alreadyHaveAccount: "Already have an account?",
      
      // Footer
      aboutUs: "About Us",
      contactUs: "Contact Us",
      privacyPolicy: "Privacy Policy",
      termsOfService: "Terms of Service",
      copyright: "© 2024 PawMart. All rights reserved."
    }
  },
  bn: {
    translation: {
      // Navigation
      home: "হোম",
      login: "লগইন",
      signup: "সাইন আপ",
      logout: "লগআউট",
      profile: "প্রোফাইল",
      
      // Common
      loading: "লোড হচ্ছে...",
      error: "ত্রুটি",
      success: "সফল",
      cancel: "বাতিল",
      save: "সংরক্ষণ",
      delete: "মুছে ফেলুন",
      edit: "সম্পাদনা",
      
      // Home page
      welcome: "পওমার্টে স্বাগতম",
      findYourFurryFriend: "আপনার পোষা বন্ধু খুঁজুন",
      adoptLoveCare: "ভালোবাসা ও যত্ন গ্রহণ করুন",
      keepPetsWarmSafe: "পোষা প্রাণীদের নিরাপদ রাখুন",
      expertPetServices: "বিশেষজ্ঞ পোষা প্রাণী সেবা",
      browsePetsSupplies: "পোষা প্রাণী ও সরবরাহ ব্রাউজ করুন",
      ourServices: "আমাদের সেবা",
      recentListings: "সাম্প্রতিক তালিকা",
      viewAllServices: "সকল সেবা দেখুন",
      meetOurPetExperts: "আমাদের পোষা প্রাণী বিশেষজ্ঞদের সাথে পরিচিত হোন",
      bookConsultation: "পরামর্শ বুক করুন",
      meetOurPetHeroes: "আমাদের পোষা প্রাণী বীরদের সাথে পরিচিত হোন",
      
      // Categories
      pets: "পোষা প্রাণী",
      food: "খাবার",
      accessories: "আনুষাঙ্গিক",
      careProducts: "যত্নের পণ্য",
      
      // Values
      saveALife: "একটি জীবন বাঁচান",
      unconditionalLove: "নিঃশর্ত ভালোবাসা",
      supportCommunity: "সম্প্রদায়কে সহায়তা করুন",
      
      // Auth
      email: "ইমেইল",
      password: "পাসওয়ার্ড",
      name: "নাম",
      confirmPassword: "পাসওয়ার্ড নিশ্চিত করুন",
      forgotPassword: "পাসওয়ার্ড ভুলে গেছেন?",
      dontHaveAccount: "অ্যাকাউন্ট নেই?",
      alreadyHaveAccount: "ইতিমধ্যে অ্যাকাউন্ট আছে?",
      
      // Footer
      aboutUs: "আমাদের সম্পর্কে",
      contactUs: "যোগাযোগ করুন",
      privacyPolicy: "গোপনীয়তা নীতি",
      termsOfService: "সেবার শর্তাবলী",
      copyright: "© ২০২৪ পওমার্ট। সকল অধিকার সংরক্ষিত।"
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    debug: false,
    
    interpolation: {
      escapeValue: false,
    },
    
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
    }
  });

export default i18n;