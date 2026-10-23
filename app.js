// ============================================================================
// الجزء الأول (1/2) من ملف app.js للموقع العام — شبكة البوصلة (النسخة الخفيفة والذكية)
// ============================================================================
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

// 1. إعدادات Firebase الافتراضية أو المخصصة (لدعم بيع ونقل النظام SaaS)
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
  } catch (e) {
    console.warn("Using default Firebase config.");
  }
  return DEFAULT_FIREBASE_CONFIG;
}

const DEFAULT_LOGO = "https://i.ibb.co/BHHHLttP/image.png";
const DEFAULT_FAVICON = "https://i.ibb.co/WWSTnMgd/image.jpg";
const SETTINGS_CACHE_KEY = "bosla_cached_public_settings_v1";

// دوال مساعدة سريعة وآمنة للتعامل مع عناصر الصفحة
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

// 2. قاموس اللغتين لواجهة الموقع (عربي / English)
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
    browserTransUnsupported: "متصفحك لا يحتوي على مترجم تلقائي مدمج؛ تم تحويل واجهة الموقع ويمكنك تفعيل ترجمة المتصفح من القائمة.",
    browserTransReady: "تم تفعيل وضع اللغة الإنجليزية؛ سيقوم مترجم متصفحك بترجمة النصوص تلقائياً.",
    switchedToArabic: "تمت العودة إلى الواجهة العربية الأصلية."
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
    authorBadge: "Verified Contributor at Al-Bosla",
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
    browserTransUnsupported: "Your browser does not have an active built-in translator. Interface switched to English.",
    browserTransReady: "English mode active. Use your browser's built-in translator for full article text.",
    switchedToArabic: "Switched back to original Arabic interface."
  }
};

const FALLBACK_CATEGORIES = [
  { name: "محلية", nameEn: "Local News", slug: "local", icon: "location_on", order: 1, visible: true, subcategories: ["السياسة اليمنية", "شؤون المحافظات"] },
  { name: "دولية", nameEn: "International", slug: "world", icon: "public", order: 2, visible: true, subcategories: ["الشرق الأوسط", "السياسة الدولية"] },
  { name: "تحقيقات وتقارير", nameEn: "Reports", slug: "reports", icon: "policy", order: 3, visible: true, subcategories: ["ملفات خاصة", "تقارير معمقة"] },
  { name: "حوارات", nameEn: "Interviews", slug: "interviews", icon: "forum", order: 4, visible: true, subcategories: [] },
  { name: "المقالات", nameEn: "Opinion", slug: "articles", icon: "edit_note", order: 5, visible: true, subcategories: [] },
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

// قراءة الإعدادات والشعار المحفوظ فوراً لمنع وميض الشعار القديم عند فتح الموقع
try {
  const cachedSettings = localStorage.getItem(SETTINGS_CACHE_KEY);
  if (cachedSettings) {
    const parsed = JSON.parse(cachedSettings);
    if (parsed && typeof parsed === "object") {
      siteSettings = { ...siteSettings, ...parsed };
    }
  }
} catch (e) {}

let publishedPosts = [];
let staffDirectory = {};
let categories = [...FALLBACK_CATEGORIES];
let activeAds = [];
let selectedCategory = "all";
let selectedSubcategory = "all";
let searchQuery = "";
const trackedAdImpressions = new Set();

// متغيرات شريط العاجل الدوار
let breakingNewsList = [];
let breakingCurrentIndex = 0;
let breakingIntervalId = null;

function t(key) {
  return (I18N[currentLang] && I18N[currentLang][key]) ? I18N[currentLang][key] : (I18N.ar[key] || key);
}

// ============================================================================
// 3. مشغل مترجم المتصفح المدمج الذكي (بدون مفاتيح API خارجية)
// ============================================================================
async function triggerBrowserTranslation(targetLang) {
  // إخفاء شريط انتظار الترجمة القديم إن وجد
  $("translation-status-bar")?.classList.add("hidden");

  // تفعيل وسوم المتصفح القياسية لحث كروم وسفاري وإيدج على ترجمة الصفحة
  document.documentElement.setAttribute("translate", "yes");
  document.body.setAttribute("translate", "yes");

  if (targetLang === "en") {
    // فحص ما إذا كان المتصفح يدعم واجهة الترجمة المدمجة الحديثة (Browser Translation API)
    const hasNativeTranslator = ("translation" in window) || ("Translator" in window);

    if (hasNativeTranslator) {
      showPublicToast(I18N.ar.browserTransReady);
    } else {
      // تنبيه واضح ولطيف للزائر كما طلبت تماماً
      showPublicToast(I18N.ar.browserTransUnsupported);
    }
  } else {
    showPublicToast(I18N.ar.switchedToArabic);
  }
}

// 4. تفعيل الأزرار والتفاعلات فوراً عند فتح الصفحة
function bindImmediateUIEvents() {
  initTheme();
  initLanguage();
  // تطبيق الشعار المحفوظ فوراً في اللحظة صفر لمنع ظهور الشعار القديم
  applyLanguageAndIdentity();
  renderCategoriesNav();
  renderSidebarMenu();
  updateMobileNavPill();

  safeOn("open-sidebar-btn", "click", openSidebarDrawer);
  safeOn("close-sidebar-btn", "click", closeSidebarDrawer);
  safeOn("sidebar-backdrop", "click", closeSidebarDrawer);
  safeOn("theme-toggle-btn", "click", toggleTheme);

  // زر تبديل اللغة المعتمد على مترجم المتصفح
  safeOn("lang-toggle-btn", "click", async () => {
    currentLang = currentLang === "ar" ? "en" : "ar";
    localStorage.setItem("bosla_lang", currentLang);

    applyDocumentDirection();
    applyLanguageAndIdentity();
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

    await triggerBrowserTranslation(currentLang);
    setTimeout(updateMobileNavPill, 80);
  });

  // أزرار البحث الذكي الفوري
  safeOn("search-toggle-btn", "click", () => {
    const drawer = $("search-drawer");
    if (!drawer) return;
    drawer.classList.toggle("hidden");
    if (!drawer.classList.contains("hidden")) {
      $("global-search-input")?.focus();
    }
  });

  safeOn("close-search-btn", "click", () => {
    $("search-drawer")?.classList.add("hidden");
    searchQuery = "";
    const inp = $("global-search-input");
    if (inp) inp.value = "";
    renderHomeFeed();
  });

  safeOn("global-search-input", "input", (e) => {
    searchQuery = (e.target.value || "").trim();
    showView("view-home");
    renderHomeFeed();
  });

  // أزرار التحكم اليدوي بشريط الأخبار العاجلة الدوار
  safeOn("breaking-next-btn", "click", () => stepBreakingNews(1));
  safeOn("breaking-prev-btn", "click", () => stepBreakingNews(-1));

  // الشعار والعودة للرئيسية
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

  // شريط التنقل السفلي للهواتف
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

// 5. إدارة اللغة والمظهر الليلي/النهاري
function initLanguage() {
  const savedLang = localStorage.getItem("bosla_lang");
  currentLang = (savedLang === "ar" || savedLang === "en") ? savedLang : "ar";
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

// 6. جلب الهوية البصرية وحفظها في الكاش السريع لمنع وميض الشعار مستقبلاً
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
      try {
        localStorage.setItem(SETTINGS_CACHE_KEY, JSON.stringify(siteSettings));
      } catch (e) {}
    }
  } catch (err) {
    console.warn("Settings fetch notice:", err);
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
      if (img.src !== activeLogo) img.src = activeLogo;
      img.alt = displaySiteName;
    }
  });

  $("brand-text-wrap")?.classList.toggle("hidden", siteSettings.hideTextLogo !== false);

  setText("ui-site-name", displaySiteName);
  setText("ui-network-name", displayNetName);
  setText("footer-site-name", displaySiteName);
  setText("footer-site-desc", currentLang === "en" ? `${displaySiteName} — ${displayNetName}` : siteSettings.siteDesc);

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

// 7. جلب الأقسام وبناء شريط الأقسام + القائمة الجانبية
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
    btn.addEventListener("click", () => {
      selectCategoryAndRender(btn.dataset.cat);
    });
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
// ============================================================================
// الجزء الثاني (2/2) من ملف app.js للموقع العام — يُلصق مباشرة أسفل الجزء الأول
// ============================================================================

// 8. جلب دليل الصحفيين والتوثيق (Staff Profiles & Verified Badges)
async function fetchStaffDirectory() {
  try {
    const snap = await getDocs(collection(db, "staff"));
    const map = {};
    snap.docs.forEach(d => {
      const data = d.data();
      const emailKey = d.id.toLowerCase().trim();
      map[emailKey] = { email: emailKey, ...data };
      if (data.name) map[data.name.trim()] = { email: emailKey, ...data };
      if (data.displayName) map[data.displayName.trim()] = { email: emailKey, ...data };
    });
    staffDirectory = map;
  } catch (err) {
    console.warn("Staff directory notice:", err);
  }
}

function getAuthorMeta(post) {
  const emailKey = (post.authorEmail || "").toLowerCase().trim();
  const nameKey = (post.author || "").trim();
  const staff = staffDirectory[emailKey] || staffDirectory[nameKey] || {};

  const isSovereign = emailKey === "a1hmedrashad@gmail.com" || emailKey === "rawialshamal@gmail.com";
  const verified = isSovereign || !!staff.verified || !!post.authorVerified;
  const avatarUrl = staff.avatarUrl || post.authorAvatar || siteSettings.faviconUrl || DEFAULT_FAVICON;
  const bio = staff.bio || post.authorBio || "";
  const jobTitle = staff.jobTitle || post.authorJobTitle || "";
  const socialX = staff.socialX || "";
  const socialFb = staff.socialFb || "";

  return { verified, avatarUrl, bio, jobTitle, socialX, socialFb };
}

// 9. جلب وعرض الرعايات والإعلانات الذكية
async function fetchAds() {
  try {
    const snap = await getDocs(collection(db, "ads"));
    activeAds = snap.docs
      .map(d => ({ id: d.id, ...d.data() }))
      .filter(a => a.active !== false);
  } catch (err) {
    console.warn("Ads notice:", err);
  }
}

function getAdForPlacement(placementKey) {
  const matching = activeAds.filter(a => a.placement === placementKey || a.placement === "all");
  if (matching.length === 0) return null;
  return matching[Math.floor(Math.random() * matching.length)];
}

async function trackAdImpression(adId) {
  if (!adId || trackedAdImpressions.has(adId)) return;
  trackedAdImpressions.add(adId);
  try {
    await updateDoc(doc(db, "ads", adId), { views: increment(1) });
  } catch (e) {}
}

window.handleAdClick = async (adId) => {
  if (!adId) return;
  try {
    await updateDoc(doc(db, "ads", adId), { clicks: increment(1) });
  } catch (e) {}
};

function buildSmartAdHTML(ad, domWrapperId) {
  if (!ad) return "";
  trackAdImpression(ad.id);
  const thumb = ad.imageUrl || siteSettings.logoUrl || DEFAULT_LOGO;

  if (ad.adStyle === "banner") {
    return `
      <div class="leaderboard-ad-banner" id="${domWrapperId}">
        <button type="button" class="glass-ad-close leaderboard-close-float" onclick="document.getElementById('${domWrapperId}').remove()">
          <span class="material-symbols-rounded" style="font-size:16px;">close</span>
        </button>
        <a href="${ad.targetUrl}" target="_blank" rel="noopener sponsored" class="leaderboard-ad-link" onclick="window.handleAdClick('${ad.id}')">
          <img src="${thumb}" alt="${ad.title}" class="leaderboard-ad-img" loading="lazy">
          <div class="leaderboard-ad-bar">
            <span><strong style="color:var(--sponsor-gold)">${t("sponsoredTag")}</strong> • ${ad.title}</span>
            <span>${t("sponsoredBy")} ${ad.sponsorName} ↗</span>
          </div>
        </a>
      </div>
    `;
  }

  return `
    <div class="glass-ad-banner" id="${domWrapperId}">
      <a href="${ad.targetUrl}" target="_blank" rel="noopener sponsored" class="glass-ad-clickable" onclick="window.handleAdClick('${ad.id}')">
        <img src="${thumb}" alt="${ad.sponsorName}" class="glass-ad-thumb" loading="lazy">
        <div>
          <span class="glass-ad-tag">${t("sponsoredTag")}</span>
          <div class="glass-ad-title">${ad.title}</div>
          <div class="glass-ad-sponsor">${t("sponsoredBy")} ${ad.sponsorName}</div>
        </div>
      </a>
      <button type="button" class="glass-ad-close" onclick="document.getElementById('${domWrapperId}').remove()">
        <span class="material-symbols-rounded" style="font-size:16px;">close</span>
      </button>
    </div>
  `;
}

function renderTopBannerAd() {
  const topSlot = $("ad-slot-top");
  if (!topSlot) return;

  const topAd = getAdForPlacement("top");
  if (topAd) {
    topSlot.innerHTML = buildSmartAdHTML(topAd, "ad-dom-top");
    return;
  }

  if (siteSettings.adsEnabled && siteSettings.customAdText) {
    topSlot.innerHTML = `
      <div class="glass-ad-banner" id="ad-dom-fallback">
        <a href="${siteSettings.customAdLink || "#"}" target="_blank" rel="noopener" class="glass-ad-clickable">
          <div>
            <span class="glass-ad-tag">${t("sponsoredTag")}</span>
            <div class="glass-ad-title">${siteSettings.customAdText}</div>
          </div>
        </a>
        <button type="button" class="glass-ad-close" onclick="document.getElementById('ad-dom-fallback').remove()">
          <span class="material-symbols-rounded" style="font-size:16px;">close</span>
        </button>
      </div>
    `;
  } else {
    topSlot.innerHTML = "";
  }
}

// 10. جلب المنشورات + شريط الأخبار العاجلة العالمي الدوّار (Smart Rotating Ticker)
async function fetchPublishedPosts() {
  try {
    const snap = await getDocs(collection(db, "posts"));
    publishedPosts = snap.docs
      .map(d => ({ id: d.id, ...d.data() }))
      .filter(p => p.status === "published")
      .sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));

    renderBreakingTicker();
    renderTrendingSidebar();
  } catch (err) {
    console.error("Posts fetch error:", err);
  } finally {
    $("loading-skeleton")?.remove();
  }
}

function getPostTitle(post) {
  if (currentLang === "en" && post.titleEn) return post.titleEn;
  return post.title || "";
}

function getPostSummary(post) {
  if (currentLang === "en" && post.summaryEn) return post.summaryEn;
  return post.summary || "";
}

function getPostAuthor(post) {
  return post.author || t("editorialTeam");
}

function getPostCatName(post) {
  const catObj = categories.find(c => c.slug === post.category);
  if (catObj) return getCatDisplayName(catObj);
  return currentLang === "en" && post.categoryNameEn ? post.categoryNameEn : (post.categoryName || post.category || "");
}

function renderBreakingTicker() {
  const wrap = $("breaking-ticker-wrap");
  if (!wrap) return;

  breakingNewsList = publishedPosts.filter(p => p.isBreaking);
  if (breakingIntervalId) {
    clearInterval(breakingIntervalId);
    breakingIntervalId = null;
  }

  if (breakingNewsList.length === 0) {
    wrap.classList.add("hidden");
    return;
  }

  wrap.classList.remove("hidden");
  breakingCurrentIndex = 0;
  renderCurrentBreakingItem();

  if (breakingNewsList.length > 1) {
    breakingIntervalId = setInterval(() => {
      stepBreakingNews(1);
    }, 6000);
  }
}

function renderCurrentBreakingItem() {
  const listEl = $("breaking-list");
  const counterEl = $("breaking-counter");
  if (!listEl || breakingNewsList.length === 0) return;

  const currentPost = breakingNewsList[breakingCurrentIndex] || breakingNewsList[0];
  if (counterEl) {
    counterEl.textContent = `${breakingCurrentIndex + 1}/${breakingNewsList.length}`;
  }

  listEl.innerHTML = `
    <a class="breaking-item" translate="yes" onclick="window.openArticle('${currentPost.id}')">
      ⚡ ${getPostTitle(currentPost)}
    </a>
  `;
}

function stepBreakingNews(direction = 1) {
  if (breakingNewsList.length <= 1) return;
  breakingCurrentIndex = (breakingCurrentIndex + direction + breakingNewsList.length) % breakingNewsList.length;
  renderCurrentBreakingItem();

  if (breakingIntervalId) {
    clearInterval(breakingIntervalId);
    breakingIntervalId = setInterval(() => stepBreakingNews(1), 6000);
  }
}

// 11. عرض الصفحة الرئيسية والبطاقات الذكية مع صورة الصحفي وشارة التوثيق الزرقاء
function renderHomeFeed() {
  const heroContainer = $("hero-section");
  const gridContainer = $("posts-grid");
  const feedHeading = $("feed-heading");
  const countBadge = $("search-count-badge");
  if (!gridContainer) return;

  const filtered = publishedPosts.filter(post => {
    if (selectedCategory !== "all" && post.category !== selectedCategory) return false;
    if (selectedSubcategory !== "all" && post.subcategory !== selectedSubcategory) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const haystack = [
        post.title, post.titleEn, post.summary, post.summaryEn,
        post.content, post.author, post.categoryName, ...(post.tags || [])
      ].join(" ").toLowerCase();
      return haystack.includes(q);
    }
    return true;
  });

  if (searchQuery) {
    if (countBadge) {
      countBadge.textContent = `${filtered.length}`;
      countBadge.classList.remove("hidden");
    }
  } else {
    countBadge?.classList.add("hidden");
  }

  if (filtered.length === 0) {
    if (heroContainer) heroContainer.innerHTML = "";
    gridContainer.innerHTML = `<div class="skeleton-card glass-surface">${t("noPosts")}</div>`;
    return;
  }

  const catObj = categories.find(c => c.slug === selectedCategory);
  if (feedHeading) {
    feedHeading.textContent = searchQuery
      ? `${t("searchResultsFor")} "${searchQuery}" (${filtered.length})`
      : selectedCategory === "all"
      ? t("latestFeed")
      : getCatDisplayName(catObj);
  }

  const featuredPost = filtered.find(p => p.isFeatured) || filtered[0];
  const remainingPosts = filtered.filter(p => p.id !== featuredPost.id);

  if (heroContainer) {
    if (!searchQuery && featuredPost) {
      const heroImg = featuredPost.imageUrl || siteSettings.logoUrl || DEFAULT_LOGO;
      const authorMeta = getAuthorMeta(featuredPost);
      heroContainer.innerHTML = `
        <div class="hero-card glass-surface" translate="yes" onclick="window.openArticle('${featuredPost.id}')">
          <div class="hero-img-wrap">
            <img src="${heroImg}" alt="${getPostTitle(featuredPost)}" loading="eager">
          </div>
          <div class="hero-content">
            <div class="article-badges">
              <span class="badge-pill">${getPostCatName(featuredPost)}</span>
            </div>
            <h2 class="hero-title">${getPostTitle(featuredPost)}</h2>
            <p class="hero-summary">${getPostSummary(featuredPost)}</p>
            <div class="card-footer">
              <span class="card-author-wrap">
                <img src="${authorMeta.avatarUrl}" alt="" class="card-author-avatar">
                <span>${getPostAuthor(featuredPost)}</span>
                ${authorMeta.verified ? `<span class="verified-badge" translate="no" title="موثق">verified</span>` : ""}
              </span>
              <span>${formatDate(featuredPost.createdAt)}</span>
            </div>
          </div>
        </div>
      `;
    } else {
      heroContainer.innerHTML = "";
    }
  }

  const listToRender = searchQuery ? filtered : remainingPosts;
  const cardsWithAds = [];
  const feedAd = getAdForPlacement("between_posts");

  listToRender.forEach((post, idx) => {
    cardsWithAds.push(createCardHTML(post));
    if (idx === 2 && feedAd) {
      cardsWithAds.push(`<div style="grid-column: 1 / -1;">${buildSmartAdHTML(feedAd, "ad-dom-feed")}</div>`);
    }
  });

  gridContainer.innerHTML = cardsWithAds.join("");
}

function createCardHTML(post) {
  const img = post.imageUrl || siteSettings.logoUrl || DEFAULT_LOGO;
  const type = post.postType || "article";
  const authorMeta = getAuthorMeta(post);

  let overlayIcon = "";
  if (type === "video" || type === "infographic") {
    overlayIcon = `<div class="media-overlay-icon" translate="no"><span class="material-symbols-rounded">play_arrow</span></div>`;
  } else if (type === "podcast") {
    overlayIcon = `<div class="media-overlay-icon" translate="no"><span class="material-symbols-rounded">headphones</span></div>`;
  } else if (type === "photos") {
    overlayIcon = `<div class="media-overlay-icon" translate="no"><span class="material-symbols-rounded">photo_library</span></div>`;
  }

  return `
    <article class="news-card glass-surface" translate="yes" onclick="window.openArticle('${post.id}')">
      <div class="card-thumb-wrap">
        <img src="${img}" alt="${getPostTitle(post)}" loading="lazy">
        <span class="card-cat-float">${getPostCatName(post)}</span>
        ${overlayIcon}
      </div>
      <div class="card-body">
        <h3 class="card-title">${getPostTitle(post)}</h3>
        <p class="card-excerpt">${getPostSummary(post)}</p>
        <div class="card-footer">
          <span class="card-author-wrap">
            <img src="${authorMeta.avatarUrl}" alt="" class="card-author-avatar">
            <span>${getPostAuthor(post)}</span>
            ${authorMeta.verified ? `<span class="verified-badge" translate="no" title="صحفي موثق">verified</span>` : ""}
          </span>
          <span>${formatDate(post.createdAt)}</span>
        </div>
      </div>
    </article>
  `;
}

function renderTrendingSidebar() {
  const listEl = $("trending-list");
  if (!listEl) return;
  const sorted = [...publishedPosts]
    .sort((a, b) => (b.views || 0) - (a.views || 0))
    .slice(0, 5);

  listEl.innerHTML = sorted.map((p, idx) => `
    <div class="trend-item" translate="yes" onclick="window.openArticle('${p.id}')">
      <span class="trend-rank" translate="no">${idx + 1}</span>
      <div>
        <div class="trend-title">${getPostTitle(p)}</div>
        <div class="trend-views">${p.views || 0} ${t("viewsUnit")}</div>
      </div>
    </div>
  `).join("");
}

// 12. فتح قراءة المقال (خفيف وسريع ويدعم مترجم المتصفح مباشرة)
function extractYouTubeEmbedUrl(url) {
  if (!url) return null;
  const regExp = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?|shorts)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i;
  const match = url.match(regExp);
  return match && match[1] ? `https://www.youtube.com/embed/${match[1]}?rel=0` : null;
}

window.openArticle = async (postId, pushHistory = true) => {
  const post = publishedPosts.find(p => p.id === postId);
  if (!post) return;

  if (pushHistory) {
    window.history.pushState({ postId }, "", `?post=${postId}`);
  }

  const displayTitle = getPostTitle(post);
  const displaySummary = getPostSummary(post);
  const displayBodyRaw = post.content || "";
  const displayAuthor = getPostAuthor(post);

  const displaySiteName = currentLang === "en" ? (siteSettings.siteNameEn || siteSettings.siteName) : siteSettings.siteName;
  document.title = `${displayTitle} | ${displaySiteName}`;
  $("og-title")?.setAttribute("content", displayTitle);
  $("og-desc")?.setAttribute("content", displaySummary);
  if (post.imageUrl) {
    $("og-image")?.setAttribute("content", post.imageUrl);
    $("twitter-image")?.setAttribute("content", post.imageUrl);
  }

  setHtml("art-badges", `
    <span class="badge-pill">${getPostCatName(post)}</span>
    ${post.subcategory ? `<span class="badge-pill">${post.subcategory}</span>` : ""}
  `);
  setText("art-title", displayTitle);
  setText("art-summary", displaySummary);
  setText("art-author", displayAuthor);
  setText("art-date", formatDate(post.createdAt));
  setText("art-views", (post.views || 0) + 1);

  const authorMeta = getAuthorMeta(post);
  if ($("art-author-avatar")) $("art-author-avatar").src = authorMeta.avatarUrl;
  $("art-author-verified")?.classList.toggle("hidden", !authorMeta.verified);

  const authorBtn = $("art-author-btn");
  if (authorBtn) {
    authorBtn.onclick = () => window.openAuthorProfile(post.author || "هيئة التحرير", post.authorEmail || "");
  }

  const mediaSlot = $("art-media-slot");
  const type = post.postType || "article";
  const coverImg = post.imageUrl || siteSettings.logoUrl || DEFAULT_LOGO;

  if (mediaSlot) {
    if ((type === "video" || type === "infographic") && post.videoUrl) {
      const embedUrl = extractYouTubeEmbedUrl(post.videoUrl);
      if (embedUrl) {
        mediaSlot.innerHTML = `
          <div class="video-embed-wrap">
            <iframe src="${embedUrl}" title="${displayTitle}" allowfullscreen allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"></iframe>
          </div>
        `;
      } else {
        mediaSlot.innerHTML = `<figure class="article-figure"><img src="${coverImg}" alt="${displayTitle}"></figure>`;
      }
    } else if (type === "podcast" && post.podcastUrl) {
      mediaSlot.innerHTML = `
        <div class="podcast-player-box">
          <div class="podcast-info-side">
            <img src="${coverImg}" alt="${displayTitle}" class="podcast-cover">
            <div>
              <span class="badge-pill">🎙️ ${post.podcastPlatform || "Podcast"}</span>
              <h3 style="margin-top:6px;">${t("podcastEpisode")} ${post.podcastDuration ? `(${post.podcastDuration})` : ""}</h3>
            </div>
          </div>
          <a href="${post.podcastUrl}" target="_blank" rel="noopener" class="podcast-listen-btn">
            <span class="material-symbols-rounded" translate="no">headphones</span>
            <span>${t("listenOn")} ${post.podcastPlatform || "Podcast"}</span>
          </a>
        </div>
      `;
    } else if (post.imageUrl) {
      mediaSlot.innerHTML = `<figure class="article-figure"><img src="${post.imageUrl}" alt="${displayTitle}"></figure>`;
    } else {
      mediaSlot.innerHTML = "";
    }
  }

  const paragraphs = displayBodyRaw
    .split("\n")
    .map(line => line.trim())
    .filter(Boolean)
    .map(line => {
      if (line === "---") return `<hr>`;
      let formatted = line
        .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
        .replace(/\*(.*?)\*/g, "<em>$1</em>")
        .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank" rel="noopener" style="color:var(--accent);font-weight:700;">$1</a>');
      if (formatted.startsWith("### ")) return `<h3>${formatted.replace("### ", "")}</h3>`;
      if (formatted.startsWith("## ")) return `<h2>${formatted.replace("## ", "")}</h2>`;
      if (formatted.startsWith("> ")) return `<blockquote>${formatted.replace("> ", "")}</blockquote>`;
      if (formatted.startsWith("- ")) return `<p>• ${formatted.replace("- ", "")}</p>`;
      return `<p>${formatted}</p>`;
    });

  const inArticleAd = getAdForPlacement("in_article");
  if (inArticleAd && paragraphs.length >= 2) {
    paragraphs.splice(2, 0, `<div class="ad-slot-wrapper">${buildSmartAdHTML(inArticleAd, "ad-dom-in-article")}</div>`);
  }

  setHtml("art-body", paragraphs.join(""));
  setHtml("art-tags", (post.tags || []).map(tag => `<span class="tag-chip">#${tag}</span>`).join(""));

  const shareUrl = window.location.href;
  const shareTitle = `${displayTitle} - ${displaySiteName}`;

  if ($("share-wa")) $("share-wa").onclick = () => window.open(`https://wa.me/?text=${encodeURIComponent(shareTitle + "\n" + shareUrl)}`, "_blank");
  if ($("share-x")) $("share-x").onclick = () => window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareTitle)}&url=${encodeURIComponent(shareUrl)}`, "_blank");
  if ($("share-tg")) $("share-tg").onclick = () => window.open(`https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareTitle)}`, "_blank");
  if ($("share-copy")) $("share-copy").onclick = async () => {
    await navigator.clipboard.writeText(shareUrl);
    showPublicToast(t("linkCopied"));
  };

  const related = publishedPosts
    .filter(p => p.id !== post.id && p.category === post.category)
    .slice(0, 3);
  setHtml("related-grid", related.map(createCardHTML).join(""));

  showView("view-article");
  window.scrollTo({ top: 0, behavior: "smooth" });

  try {
    await updateDoc(doc(db, "posts", post.id), { views: increment(1) });
    post.views = (post.views || 0) + 1;
  } catch (e) {}
};

// 13. صفحة الملف الشخصي المتكامل للكاتب / الصحفي الموثق (Author Profile View)
window.openAuthorProfile = async (authorName, authorEmail = "") => {
  const samplePost = publishedPosts.find(p =>
    (authorEmail && (p.authorEmail || "").toLowerCase() === authorEmail.toLowerCase()) ||
    p.author === authorName
  ) || { author: authorName, authorEmail };

  const meta = getAuthorMeta(samplePost);
  const authorPosts = publishedPosts.filter(p =>
    (authorEmail && (p.authorEmail || "").toLowerCase() === authorEmail.toLowerCase()) ||
    (p.author || t("editorialTeam")) === authorName
  );

  if ($("profile-author-avatar")) $("profile-author-avatar").src = meta.avatarUrl;
  setText("profile-author-name", authorName);
  $("profile-author-verified")?.classList.toggle("hidden", !meta.verified);
  setText("profile-author-job", meta.jobTitle || "");
  setText("profile-author-bio", meta.bio || "");
  setText("profile-author-count", `${t("authorTotalPosts")} ${authorPosts.length}`);

  const socialHtml = [];
  if (meta.socialX) socialHtml.push(`<a href="${meta.socialX}" target="_blank" rel="noopener" class="social-pill">X / Twitter</a>`);
  if (meta.socialFb) socialHtml.push(`<a href="${meta.socialFb}" target="_blank" rel="noopener" class="social-pill">Profile Link</a>`);
  setHtml("profile-author-socials", socialHtml.join(""));

  setHtml("author-posts-grid", authorPosts.map(createCardHTML).join(""));
  showView("view-author");
  window.scrollTo({ top: 0, behavior: "smooth" });
};

// 14. فتح الصفحات القانونية الثابتة ("من نحن" و"سياسة الخصوصية")
window.openStaticPage = async (pageType) => {
  closeSidebarDrawer();
  window.history.pushState({ pageType }, "", `?page=${pageType}`);

  const displayNetName = currentLang === "en" ? (siteSettings.networkNameEn || siteSettings.networkName) : siteSettings.networkName;
  setText("static-page-badge", displayNetName);

  let title = "";
  let rawContent = "";

  if (pageType === "about") {
    title = t("aboutUs");
    rawContent = (currentLang === "en" && siteSettings.aboutContentEn)
      ? siteSettings.aboutContentEn
      : (siteSettings.aboutContent || `## ${t("aboutUs")}\n\n${siteSettings.siteDesc}`);
  } else {
    title = t("privacyPolicy");
    rawContent = siteSettings.privacyContent || `## ${t("privacyPolicy")}\n\n${siteSettings.siteDesc}`;
  }

  setText("static-page-title", title);

  const html = rawContent
    .split("\n")
    .map(l => l.trim())
    .filter(Boolean)
    .map(l => {
      if (l.startsWith("## ")) return `<h2>${l.replace("## ", "")}</h2>`;
      return `<p>${l}</p>`;
    }).join("");

  const contactBlock = (siteSettings.contactEmail || siteSettings.contactPhone) ? `
    <hr>
    <h3>${t("contactUsHeader")}</h3>
    ${siteSettings.contactEmail ? `<p>📧 Email: <a href="mailto:${siteSettings.contactEmail}" style="color:var(--accent);font-weight:700;">${siteSettings.contactEmail}</a></p>` : ""}
    ${siteSettings.contactPhone ? `<p>📞 WhatsApp / Phone: <strong dir="ltr">${siteSettings.contactPhone}</strong></p>` : ""}
  ` : "";

  setHtml("static-page-body", html + contactBlock);
  showView("view-static");
  window.scrollTo({ top: 0, behavior: "smooth" });
};

// 15. التوجيه، الإشعارات، والتشغيل الرئيسي
function showView(viewId) {
  document.querySelectorAll(".view-section").forEach(v => v.classList.add("hidden"));
  $(viewId)?.classList.remove("hidden");
}

function formatDate(ts) {
  if (!ts || !ts.seconds) return currentLang === "en" ? "Just now" : "الآن";
  const d = new Date(ts.seconds * 1000);
  return d.toLocaleDateString(currentLang === "en" ? "en-US" : "ar-YE", {
    year: "numeric",
    month: "short",
    day: "numeric"
  });
}

function showPublicToast(msg) {
  const toast = $("public-toast");
  if (!toast) return;
  toast.textContent = msg;
  toast.classList.remove("hidden");
  clearTimeout(window._boslaToastTimer);
  window._boslaToastTimer = setTimeout(() => toast.classList.add("hidden"), 4200);
}

async function handleUrlRouting() {
  const params = new URLSearchParams(window.location.search);
  const postId = params.get("post");
  const pageId = params.get("page");

  if (postId && publishedPosts.some(p => p.id === postId)) {
    await window.openArticle(postId, false);
  } else if (pageId === "about" || pageId === "privacy") {
    await window.openStaticPage(pageId);
  } else {
    showView("view-home");
    renderHomeFeed();
  }
}

async function initPublicSite() {
  bindImmediateUIEvents();

  await Promise.all([
    fetchSettings(),
    fetchCategories(),
    fetchStaffDirectory(),
    fetchAds(),
    fetchPublishedPosts()
  ]);

  applyLanguageAndIdentity();
  renderCategoriesNav();
  renderSidebarMenu();
  renderTopBannerAd();
  await handleUrlRouting();
  setTimeout(updateMobileNavPill, 150);
}

initPublicSite();
