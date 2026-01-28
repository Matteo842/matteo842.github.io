// Language translations for the portfolio
const translations = {
  en: {
    // Hero Section
    hero_headline: "Restoring Order to Chaos.",
    hero_headline_part1: "Restoring Order to ",
    hero_subheadline: "IT Generalist | Tool Developer | Problem Solver.",
    hero_cta: "Initialize Profile",

    // SaveState Section
    savestate_title: "SaveState",
    savestate_subtitle: "Automated Save Management Tool (Windows/Linux)",
    savestate_downloads: "4,300+ Downloads",
    savestate_stars: "360+ GitHub Stars",
    savestate_signed: "Digitally Signed by",
    savestate_featured: "Featured on:",
    savestate_covered: "Covered by YouTuber",
    savestate_subs: "(225k+ subs)",
    savestate_desc: "A zero-config backup tool for PC games. Solves data corruption and syncs via Cloud (Google Drive, WebDAV, FTP).",
    savestate_github: "GitHub Repo",
    savestate_website: "Website",

    // Xemu Tools Section
    xemu_badge: "CLASSIFIED",
    xemu_title: "Xemu Tools",
    xemu_codename: "(Code Name)",
    xemu_subtitle: "Low-level Xbox HDD Manipulation",
    xemu_desc: "An advanced Python-based research project (currently 6 months in development). It performs surgical extraction and restoration of save files directly from Xbox HDD images (FATX file system) without mounting the drive.",
    xemu_tech: "Tech Highlight:",
    xemu_tech_desc: "Handles FAT16/32 clustering, orphaned clusters, and smart adjacency fixes. Currently running 100+ daily automated tests.",
    xemu_status: "Status:",
    xemu_status_value: "Private Alpha / Research Prototype",

    // Luna's Apartment Section
    luna_title: "Luna's Apartment",
    luna_subtitle: "Live B&B Booking Platform",
    luna_desc: "A full-featured booking website for a real bed & breakfast property.",
    luna_feature: "Key Feature:",
    luna_feature_desc: "Custom mobile-responsive Admin Panel allowing the owner to change prices and availability in real-time from a smartphone.",
    luna_visit: "Visit Site",

    // SaveState Android Section
    android_title: "SaveState Android",
    android_subtitle: "Mobile Ecosystem Port",
    android_desc: "The mobile porting of the main desktop application to the Android ecosystem. Bringing save management to handheld gaming devices.",
    android_status: "Status:",
    android_status_value: "In Development",

    // About Section
    about_title: "The IT Paradox",
    about_text: "I bridge the gap between complex logic and user simplicity. While I don't fit the traditional 'programmer' box, I reverse-engineer file systems, build cloud sync tools, and solve hardware-level data problems.",
    about_contact: "Get In Touch",

    // Context Menu
    menu_language: "Language",
    menu_english: "English",
    menu_german: "Deutsch",

    // Footer
    footer_built: "Built with precision.",
  },
  de: {
    // Hero Section
    hero_headline: "Ordnung aus dem Chaos.",
    hero_headline_part1: "Ordnung aus dem ",
    hero_subheadline: "IT-Generalist | Tool-Entwickler | Problemlöser.",
    hero_cta: "Profil Initialisieren",

    // SaveState Section
    savestate_title: "SaveState",
    savestate_subtitle: "Automatisiertes Speicherverwaltungstool (Windows/Linux)",
    savestate_downloads: "4.300+ Downloads",
    savestate_stars: "360+ GitHub-Sterne",
    savestate_signed: "Digital signiert von",
    savestate_featured: "Vorgestellt auf:",
    savestate_covered: "Vorgestellt vom YouTuber",
    savestate_subs: "(225k+ Abonnenten)",
    savestate_desc: "Ein konfigurationsfreies Backup-Tool für PC-Spiele. Löst Datenkorruption und synchronisiert über Cloud (Google Drive, WebDAV, FTP).",
    savestate_github: "GitHub-Repo",
    savestate_website: "Webseite",

    // Xemu Tools Section
    xemu_badge: "VERTRAULICH",
    xemu_title: "Xemu Tools",
    xemu_codename: "(Codename)",
    xemu_subtitle: "Low-Level Xbox-HDD-Manipulation",
    xemu_desc: "Ein fortgeschrittenes Python-basiertes Forschungsprojekt (derzeit 6 Monate in Entwicklung). Es führt chirurgische Extraktion und Wiederherstellung von Speicherdateien direkt aus Xbox-HDD-Images (FATX-Dateisystem) ohne Laufwerksmontage durch.",
    xemu_tech: "Technisches Highlight:",
    xemu_tech_desc: "Behandelt FAT16/32-Clustering, verwaiste Cluster und intelligente Adjacency-Fixes. Führt derzeit 100+ tägliche automatisierte Tests durch.",
    xemu_status: "Status:",
    xemu_status_value: "Private Alpha / Forschungsprototyp",

    // Luna's Apartment Section
    luna_title: "Luna's Apartment",
    luna_subtitle: "Live B&B-Buchungsplattform",
    luna_desc: "Eine voll ausgestattete Buchungswebsite für eine echte Bed & Breakfast-Unterkunft.",
    luna_feature: "Hauptmerkmal:",
    luna_feature_desc: "Benutzerdefiniertes mobiles Admin-Panel, das dem Eigentümer ermöglicht, Preise und Verfügbarkeit in Echtzeit vom Smartphone aus zu ändern.",
    luna_visit: "Seite Besuchen",

    // SaveState Android Section
    android_title: "SaveState Android",
    android_subtitle: "Mobile Ökosystem-Port",
    android_desc: "Die mobile Portierung der Desktop-Anwendung auf das Android-Ökosystem. Bringt Speicherverwaltung auf tragbare Gaming-Geräte.",
    android_status: "Status:",
    android_status_value: "In Entwicklung",

    // About Section
    about_title: "Das IT-Paradoxon",
    about_text: "Ich überbrücke die Kluft zwischen komplexer Logik und Benutzerfreundlichkeit. Obwohl ich nicht in die traditionelle 'Programmierer'-Schublade passe, reverse-engineere ich Dateisysteme, baue Cloud-Sync-Tools und löse Datenprobleme auf Hardware-Ebene.",
    about_contact: "Kontakt Aufnehmen",

    // Context Menu
    menu_language: "Sprache",
    menu_english: "English",
    menu_german: "Deutsch",

    // Footer
    footer_built: "Mit Präzision gebaut.",
  }
};

// Current language state
let currentLang = localStorage.getItem('portfolio_lang') || 'en';

// Function to update all translatable elements
function updateLanguage(lang) {
  currentLang = lang;
  localStorage.setItem('portfolio_lang', lang);

  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (translations[lang] && translations[lang][key]) {
      el.textContent = translations[lang][key];
    }
  });

  // Update lang attribute on html element
  document.documentElement.lang = lang;

  // Update mobile toggle indicator
  const toggleIndicator = document.querySelector('.lang-toggle-indicator');
  if (toggleIndicator) {
    toggleIndicator.textContent = lang.toUpperCase();
  }
}

// Initialize language on page load
document.addEventListener('DOMContentLoaded', () => {
  updateLanguage(currentLang);
});
