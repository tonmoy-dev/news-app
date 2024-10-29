"use client";
import Script from "next/script";
import { useCallback, useEffect, useState } from "react";

const languages = [
  { label: "English", value: "en", src: "https://flagcdn.com/h60/us.png" },
  { label: "Bangla", value: "bn", src: "https://flagcdn.com/h60/bd.png" },
  { label: "Spanish", value: "es", src: "https://flagcdn.com/h60/es.png" },
  { label: "French", value: "fr", src: "https://flagcdn.com/h60/fr.png" },
  { label: "German", value: "de", src: "https://flagcdn.com/h60/de.png" },
  { label: "Japanese", value: "ja", src: "https://flagcdn.com/h60/jp.png" },
  { label: "Korean", value: "ko", src: "https://flagcdn.com/h60/kr.png" },
  { label: "Portuguese", value: "pt", src: "https://flagcdn.com/h60/pt.png" },
  { label: "Russian", value: "ru", src: "https://flagcdn.com/h60/ru.png" },
  { label: "Arabic", value: "ar", src: "https://flagcdn.com/h60/sa.png" },
  { label: "Italian", value: "it", src: "https://flagcdn.com/h60/it.png" },
];


export function GoogleTranslator({ prefLangCookie }) {
  const [langCookie, setLangCookie] = useState(decodeURIComponent(prefLangCookie));
  const includedLanguages = languages.map(lang => lang.value).join(",");

  // Initialize Google Translate
  const googleTranslateElementInit = useCallback(() => {
    if (window.google && window.google.translate) {
      new window.google.translate.TranslateElement(
        {
          pageLanguage: "auto",
          includedLanguages,
          autoDisplay: false,
        },
        "google_translate_element"
      );

      const hideGoogleTranslateUI = () => {
        // Hide unwanted Google Translate UI elements
        document.querySelectorAll('.skiptranslate, .goog-te-spinner-pos').forEach(el => {
          el.style.display = 'none';
        });

        const googTeIcon = document.querySelector('.goog-te-gadget-icon');
        if (googTeIcon) {
          googTeIcon.style.display = 'none';
        }

        // Hide Google Translate loading indicator
        document.querySelectorAll('img[src*="translate_loading.gif"]').forEach(el => {
          el.style.display = 'none';
        });

        // Remove body margin added by Google Translate
        document.body.style.top = '0px';
      };

      // Apply the UI hiding repeatedly to ensure nothing reappears
      hideGoogleTranslateUI();
      setTimeout(hideGoogleTranslateUI, 500);
      setTimeout(hideGoogleTranslateUI, 1500);

      // Use MutationObserver to detect and hide new UI elements
      const observer = new MutationObserver(() => {
        hideGoogleTranslateUI();
      });

      observer.observe(document.body, { childList: true, subtree: true });
    }
  }, [includedLanguages]);

  useEffect(() => {
    window.googleTranslateElementInit = googleTranslateElementInit;
  }, []);

  const onChange = (value) => {
    const lang = `/en/${value}`;
    setLangCookie(lang);

    const element = document.querySelector(".goog-te-combo");
    if (element) {
      element.value = value;
      element.dispatchEvent(new Event("change"));

      // Clear any lingering translation settings for smoother transitions
      window.googleTranslateElementInit();

      // Force reinitialization after a delay to reset the translation element state
      setTimeout(() => {
        window.googleTranslateElementInit();
      }, 500);
    }
  };

  return (
    <div className="relative">
      <div
        id="google_translate_element"
        className="absolute opacity-0 pointer-events-none"
        style={{ visibility: "hidden", width: "1px", height: "1px" }}
      />

      <LanguageSelector onChange={onChange} value={langCookie} />

      <Script
        src="https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
        strategy="afterInteractive"
      />

      <style jsx global>{`
        /* Hide Google Translate elements */
        .goog-te-banner-frame,
        .goog-te-gadget-icon,
        .goog-te-spinner-pos,
        .goog-te-spinner,
        img[src*="translate_loading.gif"] {
          display: none !important;
        }
        .goog-te-menu-value,
        .VIpgJd-ZVi9od-l4eHX-hSRGPd,
        .VIpgJd-ZVi9od-l4eHX-hSRGPd:hover {
          display: none !important;
        }
        body {
          top: 0 !important;
        }
      `}</style>
    </div>
  );
}

function LanguageSelector({ onChange, value }) {
  const langCookie = value.split("/")[2];

  return (
    <select
      onChange={(e) => onChange(e.target.value)}
      value={langCookie}
      className="px-2 py-2 focus:outline-none focus:ring-none"
    >
      {languages.map((lang) => (
        <option value={lang.value} key={lang.value}>
          {lang.label}
        </option>
      ))}
    </select>

  );
}
