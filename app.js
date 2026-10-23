import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { 
  getFirestore, 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  updateDoc, 
  increment 
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// 1. إعدادات Firebase الديناميكية (تدعم النقل والبيع كنظام SaaS)
const DEFAULT_FIREBASE_CONFIG = {
  apiKey: "AIzaSyAd4Df_Fpp2GlGkRPyvmKuFW68LbL_a4yU",
  authDomain: "rawi-01.firebaseapp.com",
  projectId: "rawi-01",
  storageBucket: "rawi-01.firebasestorage.app",
  messagingSenderId: "91203142966",
  appId: "1:91203142966:web:a44f7c06c98529a57a9f97",
  measurementId: "G-2VNWNSZLBJ"
};

function getActiveFirebaseConfig() {
  try {
    const saved = localStorage.getItem("bosla_custom_firebase_config");
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed && parsed.apiKey && parsed.projectId) return parsed;
    }
  } catch (e) {}
  return DEFAULT_FIREBASE_CONFIG;
}

const DEFAULT_LOGO = "https://i.ibb.co/BHHHLttP/image.png";
const DEFAULT_FAVICON = "https://i.ibb.co/WWSTnMgd/image.jpg";

// دوال حماية صارمة لمنع توقف المحرك
const $ = (id) => document.getElementById(id);
const safeOn = (id, event, handler) => {
  const el = document.getElementById(id);
  if (el) el.addEventListener(event, handler);
};
const setText = (id, val) => {
  const el = document.getElementById(id);
  if (el) el.textContent = val ?? "";
};
const setHtml = (id, val) => {
  const el = document.getElementById(id);
  if (el) el.innerHTML = val ?? "";
};

const app = initializeApp(getActiveFirebaseConfig());
const db = getFirestore(app);

// 2. قاموس اللغتين الشامل لواجهة الموقع
const I18N = {
  ar: {
    home: "الرئيسية",
    breaking: "عاجل",
    latestFeed: "أحدث التحليلات والتقارير",
    trendingHeading: "الأكثر قراءة في البوصلة",
    searchPlaceholder: "ابحث بذكاء في العناوين، الملخصات، الكتّاب، أو الوسوم...",
    searchResultsFor: "نتائج البحث الذكي عن:",
    noPosts: "لا توجد مواد صحفية منشورة في هذا القسم حالياً.",
    backToNews: "العودة للأخبار",
    backToHome: "العودة للرئيسية",
    summaryLabel: "خلاصة البوصلة",
    shareLabel: "مشاركة المادة:",
    copyLink: "نسخ الرابط",
    linkCopied: "تم نسخ رابط المادة بنجاح",
    relatedHeading: "موضوعات ذات صلة",
    authorBadge: "قلم في شبكة البوصلة",
    authorVerifiedBadge: "صحفي موثق في شبكة البوصلة",
    authorTotalPosts: "إجمالي المواد المنشورة:",
    aboutUs: "من نحن",
    privacyPolicy: "سياسة الخصوصية",
    allInCat: "الكل في",
    sponsoredTag: "✨ رعاية وإعلان",
    sponsoredBy: "الراعي الرسمي:",
    listenOn: "استمع للحلقة كاملة عبر",
    podcastEpisode: "حلقة بودكاست صوتية",
    viewsUnit: "قراءة",
    mobHome: "الرئيسية",
    mobTrending: "الأكثر قراءة",
    mobSearch: "البحث",
    mobTheme: "المظهر",
    editorialTeam: "هيئة التحرير",
    rightsReserved: "© جميع الحقوق محفوظة —",
    contactUsHeader: "للتواصل والإعلانات الرسمية",
    translatingMsg: "جاري تعريب المحتوى..."
  },
  en: {
    home: "Home",
    breaking: "BREAKING",
    latestFeed: "Latest Reports & Analysis",
    trendingHeading: "Most Read on Compass",
    searchPlaceholder: "Smart search in titles, summaries, authors, or tags...",
    searchResultsFor: "Smart Search Results for:",
    noPosts: "No published articles available in this section yet.",
    backToNews: "Back to News",
    backToHome: "Back to Home",
    summaryLabel: "Executive Summary",
    shareLabel: "Share Article:",
    copyLink: "Copy Link",
    linkCopied: "Article link copied to clipboard",
    relatedHeading: "Related Coverage",
    authorBadge: "Contributor at Al-Bosla Network",
    authorVerifiedBadge: "Verified Journalist at Al-Bosla Network",
    authorTotalPosts: "Total Published Articles:",
    aboutUs: "About Us",
    privacyPolicy: "Privacy Policy",
    allInCat: "All in",
    sponsoredTag: "✨ Sponsored",
    sponsoredBy: "Sponsored by:",
    listenOn: "Listen to full episode on",
    podcastEpisode: "Podcast Episode",
    viewsUnit: "views",
    mobHome: "Home",
    mobTrending: "Trending",
    mobSearch: "Search",
    mobTheme: "Theme",
    editorialTeam: "Editorial Desk",
    rightsReserved: "© All Rights Reserved —",
    contactUsHeader: "Official Contact & Advertising",
    translatingMsg: "Translating full content to English..."
  }
};

const FALLBACK_CATEGORIES = [
  { name: "محلية", nameEn: "Local News", slug: "local", icon: "location_on", order: 1, visible: true, subcategories: ["السياسة اليمنية", "شؤون المحافظات"] },
  { name: "دولية", nameEn: "International", slug: "world", icon: "public", order: 2, visible: true, subcategories: ["الشرق الأوسط", "السياسة الدولية"] },
  { name: "تحقيقات وتقارير", nameEn: "Reports & Investigations", slug: "reports", icon: "policy", order: 3, visible: true, subcategories: ["ملفات خاصة", "تقارير معمقة"] },
  { name: "حوارات", nameEn: "Interviews", slug: "interviews", icon: "forum", order: 4, visible: true, subcategories: [] },
  { name: "المقالات", nameEn: "Opinion Articles", slug: "articles", icon: "edit_note", order: 5, visible: true, subcategories: [] },
  { name: "نافذة التقنية", nameEn: "Technology", slug: "tech", icon: "memory", order: 6, visible: true, subcategories: [] },
  { name: "الثقافة والفن", nameEn: "Culture & Art", slug: "culture", icon: "theater_comedy", order: 7, visible: true, subcategories: [] }
];

let currentLang = "ar";
let siteSettings = {
  siteName: "بوصلة السياسة اليمنية",
  siteNameEn: "Yemeni Politics Compass",
  networkName: "شبكة البوصلة",
  networkNameEn: "Al-Bosla Network",
  siteDesc: "منصة إخبارية وتحليلية ترصد كواليس السياسة والتقنية والثقافة",
  logoUrl: DEFAULT_LOGO,
  faviconUrl: DEFAULT_FAVICON,
  ogImageUrl: DEFAULT_FAVICON,
  hideTextLogo: true,
  accentColor: "#3b82f6",
  translateProvider: "auto_free",
  translateApiKey: "",
  showAboutMenu: true,
  aboutContent: "",
  aboutContentEn: "",
  privacyContent: "",
  contactEmail: "A1HMEDRASHAD@GMAIL.COM",
  contactPhone: "",
  adsEnabled: false,
  customAdText: "",
  customAdLink: ""
};

let publishedPosts = [];
let staffProfilesMap = {}; // خريطة ملفات الكتّاب والصحفيين الموثقين
let categories = [...FALLBACK_CATEGORIES];
let activeAds = [];
let selectedCategory = "all";
let selectedSubcategory = "all";
let searchQuery = "";
const trackedAdImpressions = new Set();

// متغيرات شريط الأخبار العاجلة الدوّار الذكي
let breakingNewsList = [];
let currentBreakingIndex = 0;
let breakingIntervalTimer = null;

function t(key) {
  return (I18N[currentLang] && I18N[currentLang][key]) ? I18N[currentLang][key] : (I18N.ar[key] || key);
}

// =========================================================================
// 3. محرك الترجمة الفورية الشاملة (Full-Site & Full-Article AI/Cloud Engine)
// =========================================================================
const translationMemory = new Map();

function loadCachedTranslations() {
  try {
    const raw = sessionStorage.getItem("bosla_translation_cache_v2");
    if (raw) {
      const obj = JSON.parse(raw);
      Object.entries(obj).forEach(([k, v]) => translationMemory.set(k, v));
    }
  } catch (e) {}
}

function saveCachedTranslations() {
  try {
    const obj = {};
    translationMemory.forEach((v, k) => {
      if (k.length < 300) obj[k] = v;
    });
    sessionStorage.setItem("bosla_translation_cache_v2", JSON.stringify(obj));
  } catch (e) {}
}

loadCachedTranslations();

async function translateSingleText(text, targetLang = "en") {
  if (!text || !text.trim()) return "";
  const clean = text.trim();
  const cacheKey = `${targetLang}::${clean}`;
  if (translationMemory.has(cacheKey)) return translationMemory.get(cacheKey);

  const provider = siteSettings.translateProvider || "auto_free";
  const apiKey = (siteSettings.translateApiKey || "").trim();

  try {
    // 1. إذا اختار المالك Google Cloud Translation API الرسمي مع مفتاح
    if (provider === "google_cloud" && apiKey) {
      const res = await fetch(`https://translation.googleapis.com/language/translate/v2?key=${encodeURIComponent(apiKey)}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ q: clean, target: targetLang, format: "text" })
      });
      const json = await res.json();
      const translated = json?.data?.translations?.[0]?.translatedText;
      if (translated) {
        translationMemory.set(cacheKey, translated);
        saveCachedTranslations();
        return translated;
      }
    }

    // 2. إذا اختار المالك DeepL API مع مفتاح
    if (provider === "deepl" && apiKey) {
      const endpoint = apiKey.endsWith(":fx") ? "https://api-free.deepl.com/v2/translate" : "https://api.deepl.com/v2/translate";
      const params = new URLSearchParams();
      params.append("auth_key", apiKey);
      params.append("text", clean);
      params.append("target_lang", targetLang.toUpperCase());
      const res = await fetch(endpoint, { method: "POST", body: params });
      const json = await res.json();
      const translated = json?.translations?.[0]?.text;
      if (translated) {
        translationMemory.set(cacheKey, translated);
        saveCachedTranslations();
        return translated;
      }
    }

    // 3. المحرك السحابي الفوري المدمج (يعمل تلقائياً وبسرعة فائقة)
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${targetLang}&dt=t&q=${encodeURIComponent(clean)}`;
    const res = await fetch(url);
    const data = await res.json();
    if (Array.isArray(data) && Array.isArray(data[0])) {
      const result = data[0].map(part => part[0]).join("");
      if (result) {
        translationMemory.set(cacheKey, result);
        saveCachedTranslations();
        return result;
      }
    }
  } catch (err) {
    console.warn("Translation notice:", err);
  }
  return clean;
}

function showTranslationLoader(show) {
  const bar = $("translation-status-bar");
  if (!bar) return;
  setText("translation-status-text", t("translatingMsg"));
  bar.classList.toggle("hidden", !show);
}

// ترجمة جميع بطاقات الأخبار والأقسام والعاجل عند التحويل للإنجليزية
async function translateAllFeedPostsIfNeeded() {
  if (currentLang !== "en") return;

  const untranslatedPosts = publishedPosts.filter(p => !p._enTranslatedReady);
  if (untranslatedPosts.length === 0) return;

  showTranslationLoader(true);
  try {
    await Promise.all(untranslatedPosts.map(async (post) => {
      const [tTitle, tSum, tAuthor, tCat] = await Promise.all([
        post.titleEn ? Promise.resolve(post.titleEn) : translateSingleText(post.title, "en"),
        post.summaryEn ? Promise.resolve(post.summaryEn) : translateSingleText(post.summary, "en"),
        translateSingleText(post.author || "هيئة التحرير", "en"),
        post.categoryNameEn ? Promise.resolve(post.categoryNameEn) : translateSingleText(post.categoryName || "عام", "en")
      ]);
      post._titleEn = tTitle;
      post._summaryEn = tSum;
      post._authorEn = tAuthor;
      post._catEn = tCat;
      post._enTranslatedReady = true;
    }));
  } finally {
    showTranslationLoader(false);
  }
}

// 4. تفعيل الأزرار والتفاعلات فوراً عند فتح الموقع
function bindImmediateUIEvents() {
  initTheme();
  initLanguage();
  applyLanguageAndIdentity();
  renderCategoriesNav();
  renderSidebarMenu();
  updateMobileNavPill();

  safeOn("open-sidebar-btn", "click", openSidebarDrawer);
  safeOn("close-sidebar-btn", "click", closeSidebarDrawer);
  safeOn("sidebar-backdrop", "click", closeSidebarDrawer);
  safeOn("theme-toggle-btn", "click", toggleTheme);

  // أزرار التنقل اليدوي لشريط الأخبار العاجلة الدوّار
  safeOn("breaking-prev-btn", "click", () => stepBreakingNews(-1));
  safeOn("breaking-next-btn", "click", () => stepBreakingNews(1));

  // زر تبديل اللغة الشامل (عربي <-> English)
  safeOn("lang-toggle-btn", async () => {
    currentLang = currentLang === "ar" ? "en" : "ar";
    localStorage.setItem("bosla_lang", currentLang);
    applyDocumentDirection();
    applyLanguageAndIdentity();

    if (currentLang === "en") {
      await translateAllFeedPostsIfNeeded();
    }

    renderCategoriesNav();
    renderSidebarMenu();
    renderSubcategoriesBar();
    renderBreakingTicker();
    renderTopBannerAd();
    renderTrendingSidebar();

    const params = new URLSearchParams(window.location.search);
    const postId = params.get("post");
    const pageId = params.get("page");
    if (postId && publishedPosts.some(p => p.id === postId)) {
      await window.openArticle(postId, false);
    } else if (pageId) {
      await window.openStaticPage(pageId);
    } else {
      renderHomeFeed();
    }
    setTimeout(updateMobileNavPill, 80);
  });

  // البحث الذكي الفوري
  safeOn("search-toggle-btn", "click", () => {
    const drawer = $("search-drawer");
    if (!drawer) return;
    drawer.classList.toggle("hidden");
    if (!drawer.classList.contains("hidden")) $("global-search-input")?.focus();
  });

  safeOn("close-search-btn", "click", () => {
    $("search-drawer")?.classList.add("hidden");
    searchQuery = "";
    if ($("global-search-input")) $("global-search-input").value = "";
    renderHomeFeed();
  });

  safeOn("global-search-input", "input", (e) => {
    searchQuery = (e.target.value || "").trim();
    showView("view-home");
    renderHomeFeed();
  });

  safeOn("home-brand-link", "click", (e) => {
    e.preventDefault();
    selectedCategory = "all";
    selectedSubcategory = "all";
    searchQuery = "";
    window.history.pushState({}, "", "./");
    renderCategoriesNav();
    renderSidebarMenu();
    renderSubcategoriesBar();
    showView("view-home");
    renderHomeFeed();
  });

  ["back-to-home-btn", "author-back-btn", "static-back-btn"].forEach(btnId => {
    safeOn(btnId, "click", () => {
      window.history.pushState({}, "", "./");
      applyLanguageAndIdentity();
      showView("view-home");
      renderHomeFeed();
    });
  });

  document.querySelectorAll(".mob-nav-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".mob-nav-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      updateMobileNavPill();

      const action = btn.dataset.action;
      if (action === "home") {
        $("home-brand-link")?.click();
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else if (action === "trending") {
        showView("view-home");
        document.querySelector(".trending-widget")?.scrollIntoView({ behavior: "smooth" });
      } else if (action === "search") {
        $("search-drawer")?.classList.remove("hidden");
        $("global-search-input")?.focus();
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else if (action === "theme") {
        toggleTheme();
      }
    });
  });

  window.addEventListener("resize", updateMobileNavPill);
  window.addEventListener("popstate", handleUrlRouting);
}

// 5. إقلاع الموقع وجلب البيانات من Firebase
async function bootPublicSite() {
  bindImmediateUIEvents();

  await Promise.allSettled([
    fetchSettings(),
    fetchCategories(),
    fetchStaffProfiles(),
    fetchPublishedPosts(),
    fetchSponsoredAds()
  ]);

  if (currentLang === "en") {
    await translateAllFeedPostsIfNeeded();
  }

  applyLanguageAndIdentity();
  renderCategoriesNav();
  renderSidebarMenu();
  renderBreakingTicker();
  renderTopBannerAd();
  renderTrendingSidebar();
  await handleUrlRouting();
  setTimeout(updateMobileNavPill, 120);
}

function initLanguage() {
  const savedLang = localStorage.getItem("bosla_lang");
  if (savedLang === "ar" || savedLang === "en") {
    currentLang = savedLang;
  } else {
    currentLang = "ar";
  }
  applyDocumentDirection();
}

function applyDocumentDirection() {
  document.documentElement.lang = currentLang;
  document.documentElement.dir = currentLang === "ar" ? "rtl" : "ltr";
  setText("lang-toggle-label", currentLang === "ar" ? "EN" : "عربي");

  const arrowIcon = currentLang === "ar" ? "arrow_forward" : "arrow_back";
  document.querySelectorAll("#back-arrow-icon, #author-back-btn .material-symbols-rounded, #static-back-btn .material-symbols-rounded").forEach(el => {
    el.textContent = arrowIcon;
  });
}

function initTheme() {
  const saved = localStorage.getItem("bosla_theme") || "dark";
  document.documentElement.setAttribute("data-theme", saved);
  updateThemeIcon(saved);
}

function toggleTheme() {
  const current = document.documentElement.getAttribute("data-theme");
  const next = current === "dark" ? "light" : "dark";
  document.documentElement.setAttribute("data-theme", next);
  localStorage.setItem("bosla_theme", next);
  updateThemeIcon(next);
}

function updateThemeIcon(theme) {
  setText("theme-icon", theme === "dark" ? "light_mode" : "dark_mode");
}

function updateMobileNavPill() {
  const activeBtn = document.querySelector("#mobile-bottom-nav .mob-nav-btn.active");
  const indicator = $("mob-nav-indicator");
  if (!activeBtn || !indicator) return;
  indicator.style.width = `${activeBtn.offsetWidth}px`;
  indicator.style.transform = `translateX(${activeBtn.offsetLeft}px)`;
}

function openSidebarDrawer() {
  $("sidebar-drawer")?.classList.add("open");
  $("sidebar-backdrop")?.classList.remove("hidden");
}

function closeSidebarDrawer() {
  $("sidebar-drawer")?.classList.remove("open");
  $("sidebar-backdrop")?.classList.add("hidden");
}

// 6. جلب الإعدادات وتطبيق الهوية البصرية وصورة معاينة واتساب المستقلة (og:image)
async function fetchSettings() {
  try {
    const snap = await getDoc(doc(db, "settings", "global"));
    if (snap.exists()) {
      const data = snap.data();
      siteSettings = {
        ...siteSettings,
        ...data,
        logoUrl: data.logoUrl || DEFAULT_LOGO,
        faviconUrl: data.faviconUrl || DEFAULT_FAVICON,
        ogImageUrl: data.ogImageUrl || data.faviconUrl || DEFAULT_FAVICON
      };
      // تحديث إعدادات Firebase الديناميكية إن وجدت
      if (data.firebaseCustomJson) {
        try {
          const parsed = JSON.parse(data.firebaseCustomJson);
          if (parsed && parsed.apiKey && parsed.projectId) {
            localStorage.setItem("bosla_custom_firebase_config", JSON.stringify(parsed));
          }
        } catch (e) {}
      }
    }
  } catch (err) {
    console.warn("Settings notice:", err);
  }
}

function applyLanguageAndIdentity() {
  const activeLogo = siteSettings.logoUrl || DEFAULT_LOGO;
  const activeFavicon = siteSettings.faviconUrl || DEFAULT_FAVICON;
  const activeOgImage = siteSettings.ogImageUrl || activeFavicon;
  const displaySiteName = currentLang === "en" ? (siteSettings.siteNameEn || siteSettings.siteName) : siteSettings.siteName;
  const displayNetName = currentLang === "en" ? (siteSettings.networkNameEn || siteSettings.networkName) : siteSettings.networkName;

  document.title = `${displaySiteName} | ${displayNetName}`;
  $("meta-desc")?.setAttribute("content", siteSettings.siteDesc || "");
  $("og-title")?.setAttribute("content", `${displaySiteName} | ${displayNetName}`);
  $("og-desc")?.setAttribute("content", siteSettings.siteDesc || "");
  $("og-image")?.setAttribute("content", activeOgImage);
  $("twitter-image")?.setAttribute("content", activeOgImage);

  if ($("dynamic-favicon")) $("dynamic-favicon").href = activeFavicon;
  if ($("apple-favicon")) $("apple-favicon").href = activeFavicon;

  ["custom-logo-img", "sidebar-logo-img", "footer-logo-img"].forEach(id => {
    const img = $(id);
    if (img) {
      img.src = activeLogo;
      img.alt = displaySiteName;
    }
  });

  $("brand-text-wrap")?.classList.toggle("hidden", siteSettings.hideTextLogo !== false);

  setText("ui-site-name", displaySiteName);
  setText("ui-network-name", displayNetName);
  setText("footer-site-name", displaySiteName);
  setText("footer-site-desc", currentLang === "en" ? `${displaySiteName} — Independent news and analytical platform under ${displayNetName}.` : siteSettings.siteDesc);

  setText("ui-breaking-label", t("breaking"));
  if ($("global-search-input")) $("global-search-input").placeholder = t("searchPlaceholder");
  setText("ui-trending-heading", t("trendingHeading"));
  setText("ui-back-btn-text", t("backToNews"));
  setText("ui-author-back-text", t("backToHome"));
  setText("ui-static-back-text", t("backToHome"));
  setText("ui-summary-label", t("summaryLabel"));
  setText("ui-share-label", t("shareLabel"));
  setText("ui-copy-link-label", t("copyLink"));
  setText("ui-related-heading", t("relatedHeading"));
  setText("ui-author-badge", t("authorBadge"));
  setText("ui-footer-about", t("aboutUs"));
  setText("ui-footer-privacy", t("privacyPolicy"));
  setHtml("ui-copyright-text", `${t("rightsReserved")} <b id="footer-network-copy">${displayNetName}</b>`);

  setText("ui-mob-home", t("mobHome"));
  setText("ui-mob-trending", t("mobTrending"));
  setText("ui-mob-search", t("mobSearch"));
  setText("ui-mob-theme", t("mobTheme"));

  if (siteSettings.accentColor) {
    document.documentElement.style.setProperty("--accent", siteSettings.accentColor);
  }

  const links = [];
  if (siteSettings.socialWhatsapp) links.push(`<a href="${siteSettings.socialWhatsapp}" target="_blank" rel="noopener" class="social-pill">WhatsApp</a>`);
  if (siteSettings.socialTelegram) links.push(`<a href="${siteSettings.socialTelegram}" target="_blank" rel="noopener" class="social-pill">Telegram</a>`);
  if (siteSettings.socialX) links.push(`<a href="${siteSettings.socialX}" target="_blank" rel="noopener" class="social-pill">X</a>`);
  if (siteSettings.socialFacebook) links.push(`<a href="${siteSettings.socialFacebook}" target="_blank" rel="noopener" class="social-pill">Facebook</a>`);

  setHtml("footer-social-links", links.join(""));
  setHtml("sidebar-social-links", links.join(""));
}

// 7. جلب ملفات الصحفيين والكتّاب الموثقين (لعرض الصور الشخصية والشارة الزرقاء والسيرة الذاتية)
async function fetchStaffProfiles() {
  try {
    const snap = await getDocs(collection(db, "staff"));
    staffProfilesMap = {};
    snap.docs.forEach(d => {
      const data = d.data();
      const emailKey = d.id.toLowerCase().trim();
      staffProfilesMap[emailKey] = data;
      if (data.name) staffProfilesMap[data.name.trim()] = data;
      if (data.displayName) staffProfilesMap[data.displayName.trim()] = data;
    });
  } catch (err) {
    console.warn("Staff profiles notice:", err);
  }
}

function getAuthorMetadata(post) {
  const emailKey = (post.authorEmail || "").toLowerCase().trim();
  const nameKey = (post.author || "").trim();
  const staffDoc = staffProfilesMap[emailKey] || staffProfilesMap[nameKey] || {};

  const isSovereign = emailKey === "a1hmedrashad@gmail.com" || emailKey === "rawialshamal@gmail.com";
  const verified = isSovereign || staffDoc.verified === true || post.authorVerified === true;
  const avatar = staffDoc.avatarUrl || post.authorAvatar || siteSettings.faviconUrl || DEFAULT_FAVICON;
  const bio = staffDoc.bio || post.authorBio || "";
  const jobTitle = staffDoc.jobTitle || post.authorJobTitle || "";
  const socialX = staffDoc.socialX || "";
  const socialFb = staffDoc.socialFb || "";

  return { verified, avatar, bio, jobTitle, socialX, socialFb };
}

// 8. جلب الأقسام وبناء شريط الأقسام والقائمة الجانبية
async function fetchCategories() {
  try {
    const snap = await getDocs(collection(db, "categories"));
    if (!snap.empty) {
      const all = snap.docs
        .map(d => ({ id: d.id, ...d.data() }))
        .sort((a, b) => (a.order || 99) - (b.order || 99));
      categories = all.filter(c => c.visible !== false);
    }
  } catch (err) {
    console.warn("Categories notice:", err);
  }
}

function getCatDisplayName(catObj) {
  if (!catObj) return "";
  return currentLang === "en" && catObj.nameEn ? catObj.nameEn : catObj.name;
}

function renderCategoriesNav() {
  const nav = $("categories-nav-list");
  if (!nav) return;

  const itemsHtml = categories.map(c => `
    <button class="cat-pill ${selectedCategory === c.slug ? "active" : ""}" data-cat="${c.slug}">
      <span class="material-symbols-rounded">${c.icon || "newspaper"}</span>
      <span>${getCatDisplayName(c)}</span>
    </button>
  `).join("");

  nav.innerHTML = `
    <button class="cat-pill ${selectedCategory === "all" ? "active" : ""}" data-cat="all">
      <span class="material-symbols-rounded">home</span>
      <span>${t("home")}</span>
    </button>
    ${itemsHtml}
  `;

  nav.querySelectorAll(".cat-pill").forEach(btn => {
    btn.addEventListener("click", () => selectCategoryAndRender(btn.dataset.cat));
  });
}

function renderSidebarMenu() {
  const list = $("sidebar-menu-list");
  if (!list) return;
  const items = [];

  if (siteSettings.showAboutMenu !== false) {
    items.push(`
      <li class="sidebar-menu-item">
        <button type="button" class="sidebar-menu-btn" onclick="window.openStaticPage('about')">
          <span>${t("aboutUs")}</span>
          <span class="material-symbols-rounded">info</span>
        </button>
      </li>
    `);
  }

  categories.forEach(c => {
    items.push(`
      <li class="sidebar-menu-item">
        <button type="button" class="sidebar-menu-btn ${selectedCategory === c.slug ? "active" : ""}" data-side-cat="${c.slug}">
          <span>${getCatDisplayName(c)}</span>
          <span class="material-symbols-rounded">${c.icon || "chevron_left"}</span>
        </button>
      </li>
    `);
  });

  if (siteSettings.showAboutMenu !== false) {
    items.push(`
      <li class="sidebar-menu-item">
        <button type="button" class="sidebar-menu-btn" onclick="window.openStaticPage('privacy')">
          <span>${t("privacyPolicy")}</span>
          <span class="material-symbols-rounded">verified_user</span>
        </button>
      </li>
    `);
  }

  list.innerHTML = items.join("");

  list.querySelectorAll("[data-side-cat]").forEach(btn => {
    btn.addEventListener("click", () => {
      closeSidebarDrawer();
      selectCategoryAndRender(btn.dataset.sideCat);
    });
  });
}

function selectCategoryAndRender(catSlug) {
  selectedCategory = catSlug;
  selectedSubcategory = "all";
  renderCategoriesNav();
  renderSidebarMenu();
  showView("view-home");
  window.history.pushState({}, "", "./");
  renderSubcategoriesBar();
  renderHomeFeed();
}

function renderSubcategoriesBar() {
  const bar = $("subcategories-bar");
  if (!bar) return;

  if (selectedCategory === "all") {
    bar.classList.add("hidden");
    return;
  }
  const catObj = categories.find(c => c.slug === selectedCategory);
  const subs = catObj?.subcategories || [];
  if (subs.length === 0) {
    bar.classList.add("hidden");
    return;
  }

  bar.classList.remove("hidden");
  bar.innerHTML = `
    <button class="sub-pill ${selectedSubcategory === "all" ? "active" : ""}" data-sub="all">${t("allInCat")} ${getCatDisplayName(catObj)}</button>
    ${subs.map(s => `<button class="sub-pill ${selectedSubcategory === s ? "active" : ""}" data-sub="${s}">${s}</button>`).join("")}
  `;

  bar.querySelectorAll(".sub-pill").forEach(pill => {
    pill.addEventListener("click", () => {
      selectedSubcategory = pill.dataset.sub;
      renderSubcategoriesBar();
      renderHomeFeed();
    });
  });
}

// 9. جلب المنشورات ودوال القراءة المترجمة
async function fetchPublishedPosts() {
  try {
    const snap = await getDocs(collection(db, "posts"));
    const raw = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    publishedPosts = raw
      .filter(p => p.status === "published")
      .sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
  } catch (err) {
    console.error("Error loading posts:", err);
  }
}

function getPostTitle(post) {
  if (currentLang ===
