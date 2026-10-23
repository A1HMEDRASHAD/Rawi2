// ============================================================================
// الجزء الأول (1/2) من ملف app.js للموقع العام — نسخة عربية صافية بدون ترجمة وبدون روابط ثابتة
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

// 1. إعدادات Firebase (الافتراضية أو المخصصة من لوحة التحكم SaaS)
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

const SETTINGS_CACHE_KEY = "bosla_cached_public_settings_v2";

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

// 2. الأقسام الاحتياطية الأولية إلى حين جلب الأقسام من غرفة العمليات
const FALLBACK_CATEGORIES = [
  { name: "محلية", slug: "local", icon: "location_on", order: 1, visible: true, subcategories: ["السياسة اليمنية", "شؤون المحافظات"] },
  { name: "دولية", slug: "world", icon: "public", order: 2, visible: true, subcategories: ["الشرق الأوسط", "السياسة الدولية"] },
  { name: "تحقيقات وتقارير", slug: "reports", icon: "policy", order: 3, visible: true, subcategories: ["ملفات خاصة", "تقارير معمقة"] },
  { name: "حوارات", slug: "interviews", icon: "forum", order: 4, visible: true, subcategories: [] },
  { name: "المقالات", slug: "articles", icon: "edit_note", order: 5, visible: true, subcategories: [] },
  { name: "نافذة التقنية", slug: "tech", icon: "memory", order: 6, visible: true, subcategories: [] },
  { name: "الثقافة والفن", slug: "culture", icon: "theater_comedy", order: 7, visible: true, subcategories: [] }
];

// إعدادات الموقع بدون أي روابط صور قديمة أو افتراضية
let siteSettings = {
  siteName: "بوصلة السياسة اليمنية",
  networkName: "شبكة البوصلة",
  siteDesc: "منصة إخبارية وتحليلية ترصد كواليس السياسة والتقنية والثقافة",
  logoUrl: "",
  faviconUrl: "",
  ogImageUrl: "",
  hideTextLogo: true,
  accentColor: "#3b82f6",
  showAboutMenu: true,
  aboutContent: "",
  privacyContent: "",
  contactEmail: "",
  contactPhone: "",
  adsEnabled: false,
  customAdText: "",
  customAdLink: ""
};

// قراءة الإعدادات المحفوظة في المتصفح فوراً في اللحظة صفر لمنع ظهور الشعار القديم
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

// متغيرات شريط الأخبار العاجلة الدوار
let breakingNewsList = [];
let breakingCurrentIndex = 0;
let breakingIntervalId = null;

// 3. تهيئة فورية للواجهة وإخفاء زر الترجمة والشعار القديم
function sanitizeInitialDOM() {
  // إخفاء زر الترجمة وشريط الترجمة نهائياً بدون الحاجة لتعديل index.html
  $("lang-toggle-btn")?.remove();
  $("translation-status-bar")?.remove();

  // ضبط اتجاه الصفحة للعربية دائماً
  document.documentElement.lang = "ar";
  document.documentElement.dir = "rtl";

  // منع ظهور الشعار القديم الموجود في index.html قبل وصول شعار غرفة العمليات
  ["custom-logo-img", "sidebar-logo-img", "footer-logo-img"].forEach(id => {
    const img = $(id);
    if (!img) return;
    if (siteSettings.logoUrl) {
      img.src = siteSettings.logoUrl;
      img.style.visibility = "visible";
    } else {
      img.removeAttribute("src");
      img.style.visibility = "hidden";
    }
  });
}

// 4. تفعيل الأزرار والتفاعلات فوراً عند فتح الصفحة
function bindImmediateUIEvents() {
  sanitizeInitialDOM();
  initTheme();
  applyIdentitySettings();
  renderCategoriesNav();
  renderSidebarMenu();
  updateMobileNavPill();

  safeOn("open-sidebar-btn", "click", openSidebarDrawer);
  safeOn("close-sidebar-btn", "click", closeSidebarDrawer);
  safeOn("sidebar-backdrop", "click", closeSidebarDrawer);
  safeOn("theme-toggle-btn", "click", toggleTheme);

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
      applyIdentitySettings();
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

// 5. إدارة المظهر الليلي والنهاري والقائمة الجانبية
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

// 6. جلب الهوية البصرية والشعار من غرفة العمليات حصرياً
async function fetchSettings() {
  try {
    const snap = await getDoc(doc(db, "settings", "global"));
    if (snap.exists()) {
      const data = snap.data();
      siteSettings = {
        ...siteSettings,
        ...data,
        logoUrl: data.logoUrl || "",
        faviconUrl: data.faviconUrl || data.logoUrl || "",
        ogImageUrl: data.ogImageUrl || data.faviconUrl || data.logoUrl || ""
      };
      try {
        localStorage.setItem(SETTINGS_CACHE_KEY, JSON.stringify(siteSettings));
      } catch (e) {}
    }
  } catch (err) {
    console.warn("Settings fetch notice:", err);
  }
}

function applyIdentitySettings() {
  const activeLogo = siteSettings.logoUrl || "";
  const activeFavicon = siteSettings.faviconUrl || activeLogo;
  const activeOgImage = siteSettings.ogImageUrl || activeFavicon;
  const displaySiteName = siteSettings.siteName || "بوصلة السياسة اليمنية";
  const displayNetName = siteSettings.networkName || "شبكة البوصلة";

  document.title = `${displaySiteName} | ${displayNetName}`;
  $("meta-desc")?.setAttribute("content", siteSettings.siteDesc || "");
  $("og-title")?.setAttribute("content", `${displaySiteName} | ${displayNetName}`);
  $("og-desc")?.setAttribute("content", siteSettings.siteDesc || "");

  if (activeOgImage) {
    $("og-image")?.setAttribute("content", activeOgImage);
    $("twitter-image")?.setAttribute("content", activeOgImage);
  }

  if (activeFavicon) {
    if ($("dynamic-favicon")) $("dynamic-favicon").href = activeFavicon;
    if ($("apple-favicon")) $("apple-favicon").href = activeFavicon;
  }

  ["custom-logo-img", "sidebar-logo-img", "footer-logo-img"].forEach(id => {
    const img = $(id);
    if (!img) return;
    if (activeLogo) {
      if (img.src !== activeLogo) img.src = activeLogo;
      img.alt = displaySiteName;
      img.style.visibility = "visible";
    } else {
      img.style.visibility = "hidden";
    }
  });

  $("brand-text-wrap")?.classList.toggle("hidden", siteSettings.hideTextLogo !== false);

  setText("ui-site-name", displaySiteName);
  setText("ui-network-name", displayNetName);
  setText("footer-site-name", displaySiteName);
  setText("footer-site-desc", siteSettings.siteDesc || "");
  setHtml("ui-copyright-text", `© جميع الحقوق محفوظة — <b id="footer-network-copy">${displayNetName}</b>`);

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

// 7. جلب الأقسام وبناء شريط الأقسام والقائمة الجانبية
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

function renderCategoriesNav() {
  const nav = $("categories-nav-list");
  if (!nav) return;

  const itemsHtml = categories.map(c => `
    <button class="cat-pill ${selectedCategory === c.slug ? "active" : ""}" data-cat="${c.slug}">
      <span class="material-symbols-rounded">${c.icon || "newspaper"}</span>
      <span>${c.name}</span>
    </button>
  `).join("");

  nav.innerHTML = `
    <button class="cat-pill ${selectedCategory === "all" ? "active" : ""}" data-cat="all">
      <span class="material-symbols-rounded">home</span>
      <span>الرئيسية</span>
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
          <span>من نحن</span>
          <span class="material-symbols-rounded">info</span>
        </button>
      </li>
    `);
  }

  categories.forEach(c => {
    items.push(`
      <li class="sidebar-menu-item">
        <button type="button" class="sidebar-menu-btn ${selectedCategory === c.slug ? "active" : ""}" data-side-cat="${c.slug}">
          <span>${c.name}</span>
          <span class="material-symbols-rounded">${c.icon || "chevron_left"}</span>
        </button>
      </li>
    `);
  });

  if (siteSettings.showAboutMenu !== false) {
    items.push(`
      <li class="sidebar-menu-item">
        <button type="button" class="sidebar-menu-btn" onclick="window.openStaticPage('privacy')">
          <span>سياسة الخصوصية</span>
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
    <button class="sub-pill ${selectedSubcategory === "all" ? "active" : ""}" data-sub="all">الكل في ${catObj.name}</button>
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
