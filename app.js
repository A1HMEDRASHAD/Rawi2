/* ==========================================================================
   البوابة التحريرية الذكية — حُجرية بريس (Hujariya Press Editorial Portal)
   المحرك البرمجي (app.js) — الجزء الأول:
   الأدمن السيادي، الدخول المستقل ورمز PIN، العزل التام للكتّاب،
   إحصائيات المشاهدات الدقيقة لكل منشور، رفع الصور، ودفتر الملاحظات المعزول
   ========================================================================== */

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getFirestore,
  collection,
  doc,
  getDoc,
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// ==================== 1. إعدادات الاتصال بقاعدة بيانات Firebase ====================
const FIREBASE_CONFIG = {
  apiKey: "AIzaSyAd4Df_Fpp2GlGkRPyvmKuFW68LbL_a4yU",
  authDomain: "rawi-01.firebaseapp.com",
  databaseURL: "https://rawi-01-default-rtdb.firebaseio.com",
  projectId: "rawi-01",
  storageBucket: "rawi-01.firebasestorage.app",
  messagingSenderId: "91203142966",
  appId: "1:91203142966:web:a44f7c06c98529a57a9f97",
  measurementId: "G-2VNWNSZLBJ"
};

const app = initializeApp(FIREBASE_CONFIG);
const db = getFirestore(app);

// مفاتيح التخزين المحلي للجلسة والجهاز الموثوق
const SESSION_STORAGE_KEY = "hujariya_portal_session_v1";
const TRUSTED_DEVICE_KEY = "hujariya_trusted_device_v1";
const DEFAULT_IMGBB_FALLBACK_KEY = "6d207e02198a847aa98d0a2a901485a5";

// بيانات الأدمن الرئيسي السيادي (تُزرع تلقائياً عند أول تشغيل لضمان دخولك الفوري)
const MASTER_ADMIN_SEED = {
  id: "master_chief_hujariya",
  name: "رئيس التحرير — حُجرية بريس",
  username: "hujariya_admin",
  password: "Hujariya#2026@Master",
  pinCode: "2026",
  jobTitle: "المدير العام ورئيس التحرير",
  role: "admin",
  isMasterAdmin: true,
  verified: true,
  suspended: false,
  requireReview: false,
  permissions: {
    canEditOwn: true,
    canDeleteOwn: true,
    managePosts: true,
    manageStaff: true,
    manageSettings: true
  }
};

// الأقسام الافتراضية المطابقة للموقع العام
const DEFAULT_COMPASSES = [
  {
    id: "yemen-politics",
    name: "السياسة اليمنية",
    subcategories: ["الشرعية ومؤسسات الدولة", "التحليلات الاستراتيجية", "الشأن المحلي والمحافظات", "كشف زيف الميليشيات"],
    visible: true,
    order: 1
  },
  {
    id: "saudi-politics",
    name: "السياسة السعودية",
    subcategories: ["الأمن القومي المشترك", "الدبلوماسية الإقليمية", "رؤية المملكة 2030", "المشاريع التنموية"],
    visible: true,
    order: 2
  },
  {
    id: "regional-international",
    name: "إقليمي ودولي",
    subcategories: ["الشرق الأوسط", "السياسة الدولية", "أمن البحر الأحمر والممرات"],
    visible: true,
    order: 3
  },
  {
    id: "economy-dev",
    name: "اقتصاد وأسواق",
    subcategories: ["أسواق وعملات", "طاقة ونفط", "إعمار وتنمية", "بورصات عالمية"],
    visible: true,
    order: 4
  },
  {
    id: "sports",
    name: "الرياضة",
    subcategories: ["الكرة اليمنية", "الدوري السعودي", "الكرة العالمية", "بطولات دولية"],
    visible: true,
    order: 5
  },
  {
    id: "health-science",
    name: "صحة وعلوم وفضاء",
    subcategories: ["طب وصحة", "أبحاث الفضاء والفلك", "اكتشافات علمية", "بيئة ومناخ"],
    visible: true,
    order: 6
  },
  {
    id: "tech-future",
    name: "تقنية ومستقبل",
    subcategories: ["الذكاء الاصطناعي", "الأمن السيبراني", "تطبيقات ومنصات", "ابتكارات"],
    visible: true,
    order: 7
  },
  {
    id: "culture-thought",
    name: "ثقافة وفكر",
    subcategories: ["أدب وفكر", "تاريخ وهوية", "قراءات وكتب", "مقالات الرأي"],
    visible: true,
    order: 8
  },
  {
    id: "art-media",
    name: "فن وإعلام",
    subcategories: ["فن ودراما", "إعلام رقمي", "تراث وفنون"],
    visible: true,
    order: 9
  }
];

// ==================== 2. حالة البوابة التحريرية (State) ====================
const state = {
  currentUser: null,
  pinBuffer: "",
  activeTab: "posts",
  postFilter: "all",
  postSearchQuery: "",
  selectedEditorCategories: ["السياسة اليمنية"],
  settings: {
    siteName: "حُجرية بريس",
    siteDescription: "حُجرية بريس — منصة إخبارية وتحليلية شاملة تندرج تحت مظلة مؤسسة RAWI-YE.COM الإعلامية الرقمية.",
    accentColor: "#ef3327",
    logoUrl: "",
    hideSiteName: false,
    defaultPostImageUrl: "",
    coverImageUrl: "",
    faviconUrl: "",
    appIconUrl: "",
    imgbbApiKey: "",
    aboutHtml: "",
    charterHtml: "",
    privacyHtml: "",
    socials: {}
  },
  compasses: [...DEFAULT_COMPASSES],
  posts: [],
  staff: [],
  notes: [],
  staffRequests: [],
  ads: []
};

// ==================== 3. الدوال المساعدة، منع تكرار الضغط، ورفع الصور ====================
function escapeHtml(str = "") {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function getCleanCategoryLabel(name = "") {
  return (
    String(name)
      .replace(/^بوصلة\s+/i, "")
      .replace(/^البوصلة\s+/i, "")
      .trim() || name
  );
}

function showPortalToast(msg) {
  const toast = document.getElementById("portal-toast");
  if (!toast) return;
  toast.textContent = msg;
  toast.classList.remove("hidden");
  clearTimeout(window.__portalToastTimer);
  window.__portalToastTimer = setTimeout(() => toast.classList.add("hidden"), 3200);
}

// قفل الزر أثناء التنفيذ لمنع النشر المزدوج أو النقرات المتكررة
function setButtonLoading(btn, isLoading, loadingText = "جاري التنفيذ...") {
  if (!btn) return;
  const textSpan = btn.querySelector(".btn-text") || btn;
  if (isLoading) {
    if (!btn.dataset.originalText) {
      btn.dataset.originalText = textSpan.textContent;
    }
    btn.disabled = true;
    btn.classList.add("is-loading");
    textSpan.textContent = loadingText;
  } else {
    btn.disabled = false;
    btn.classList.remove("is-loading");
    if (btn.dataset.originalText) {
      textSpan.textContent = btn.dataset.originalText;
    }
  }
}

function getItemTimestampMs(item) {
  if (!item) return 0;
  const t = item.createdAt || item.updatedAt;
  if (!t) return 0;
  if (typeof t.toMillis === "function") return t.toMillis();
  if (typeof t.seconds === "number") return t.seconds * 1000;
  const parsed = new Date(t).getTime();
  return isNaN(parsed) ? 0 : parsed;
}

function formatArabicDateTime(timestamp) {
  const ms = typeof timestamp === "number" ? timestamp : getItemTimestampMs({ createdAt: timestamp });
  if (!ms) return "الآن";
  return new Date(ms).toLocaleDateString("ar-YE", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
}

// محرك رفع الصور الذكي (يدعم ImgBB API المفتوح والقابل للتعديل من الإعدادات + التحويل الاحتياطي المضمون)
async function uploadImageFileToCloud(file) {
  if (!file) throw new Error("لم يتم اختيار ملف صورة");

  const apiKey = (state.settings.imgbbApiKey || DEFAULT_IMGBB_FALLBACK_KEY).trim();

  if (apiKey) {
    try {
      const formData = new FormData();
      formData.append("image", file);
      const response = await fetch(`https://api.imgbb.com/1/upload?key=${encodeURIComponent(apiKey)}`, {
        method: "POST",
        body: formData
      });
      if (response.ok) {
        const result = await response.json();
        const uploadedUrl = result?.data?.display_url || result?.data?.url;
        if (uploadedUrl) return uploadedUrl;
      }
    } catch (err) {
      console.warn("ImgBB upload fallback triggered:", err);
    }
  }

  // بديل فوري مضمون: ضغط الصورة وتحويلها لرابط بيانات نظيف في حال عدم توفر مفتاح خارجي
  return await compressImageToDataUrl(file, 960, 0.82);
}

function compressImageToDataUrl(file, maxWidth = 960, quality = 0.82) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const scale = Math.min(1, maxWidth / img.width);
        const canvas = document.createElement("canvas");
        canvas.width = Math.round(img.width * scale);
        canvas.height = Math.round(img.height * scale);
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL("image/jpeg", quality));
      };
      img.onerror = reject;
      img.src = e.target.result;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function bindImageFileUploader(fileInputId, urlInputId, previewBoxId = null, previewImgId = null) {
  const fileInput = document.getElementById(fileInputId);
  const urlInput = document.getElementById(urlInputId);
  if (!fileInput || !urlInput) return;

  fileInput.addEventListener("change", async () => {
    const file = fileInput.files?.[0];
    if (!file) return;

    const labelSpan = fileInput.parentElement?.querySelector("span:not(.material-symbols-rounded)");
    const origText = labelSpan ? labelSpan.textContent : "رفع";
    if (labelSpan) labelSpan.textContent = "جاري الرفع...";

    try {
      const url = await uploadImageFileToCloud(file);
      urlInput.value = url;
      showPortalToast("تم رفع الصورة بنجاح ✓");

      if (previewBoxId && previewImgId) {
        const box = document.getElementById(previewBoxId);
        const img = document.getElementById(previewImgId);
        if (box && img) {
          img.src = url;
          box.classList.remove("hidden");
        }
      }
    } catch (_) {
      showPortalToast("تعذر رفع الصورة، حاول مرة أخرى");
    } finally {
      if (labelSpan) labelSpan.textContent = origText;
      fileInput.value = "";
    }
  });
}

// ==================== 4. الصلاحيات الدقيقة وعزل البيانات (الأدمن الرئيسي مقابل الكاتب) ====================
function isMasterAdminUser(user = state.currentUser) {
  if (!user) return false;
  return Boolean(
    user.isMasterAdmin ||
      user.id === MASTER_ADMIN_SEED.id ||
      String(user.username || "").toLowerCase() === MASTER_ADMIN_SEED.username
  );
}

function canManageAllPosts(user = state.currentUser) {
  if (!user) return false;
  if (isMasterAdminUser(user) || user.role === "admin") return true;
  return Boolean(user.permissions?.managePosts);
}

function canManageStaffAndReviews(user = state.currentUser) {
  if (!user) return false;
  if (isMasterAdminUser(user) || user.role === "admin") return true;
  return Boolean(user.permissions?.manageStaff || user.permissions?.managePosts);
}

function canManageSovereignSettings(user = state.currentUser) {
  if (!user) return false;
  return Boolean(isMasterAdminUser(user) || user.role === "admin" || user.permissions?.manageSettings);
}

function doesPostBelongToUser(post, user = state.currentUser) {
  if (!post || !user) return false;
  const uId = String(user.id || "").toLowerCase();
  const uName = String(user.username || "").toLowerCase();
  const displayName = String(user.name || "").trim().toLowerCase();

  if (uId && String(post.authorId || "").toLowerCase() === uId) return true;
  if (uName && String(post.authorUsername || post.authorEmail || "").toLowerCase() === uName) return true;
  if (displayName && String(post.author || "").trim().toLowerCase() === displayName) return true;
  return false;
}

// إرجاع المنشورات المسموح للمستخدم رؤيتها (الكاتب لا يرى إلا منشوراته فقط 100%)
function getScopedPostsForCurrentUser() {
  if (!state.currentUser) return [];
  if (canManageAllPosts(state.currentUser)) {
    return state.posts;
  }
  return state.posts.filter((p) => doesPostBelongToUser(p, state.currentUser));
}

// ==================== 5. نظام الدخول المستقل، ضمان حساب الأدمن السيادي، ورمز PIN ====================
async function ensureMasterAdminSeeded() {
  try {
    const masterRef = doc(db, "staff", MASTER_ADMIN_SEED.id);
    const snap = await getDoc(masterRef);
    if (!snap.exists()) {
      await setDoc(masterRef, {
        ...MASTER_ADMIN_SEED,
        createdAt: serverTimestamp()
      });
    }
  } catch (err) {
    console.warn("Master admin seed check notice:", err);
  }
}

function findMatchingStaffAccount(usernameInput, passwordInput = null) {
  const cleanUser = String(usernameInput || "").trim().toLowerCase();
  if (!cleanUser) return null;

  let member = state.staff.find(
    (s) =>
      String(s.username || "").trim().toLowerCase() === cleanUser ||
      String(s.email || "").trim().toLowerCase() === cleanUser
  );

  // ضمان عمل حساب الأدمن السيادي حتى قبل اكتمال مزامنة الجدول الأولية
  if (!member && cleanUser === MASTER_ADMIN_SEED.username.toLowerCase()) {
    member = { ...MASTER_ADMIN_SEED };
  }

  if (!member) return null;
  if (passwordInput !== null && String(member.password || "") !== String(passwordInput)) {
    return null;
  }
  return member;
}

async function handleStandardLoginSubmit(e) {
  e.preventDefault();
  const userInp = document.getElementById("login-username");
  const passInp = document.getElementById("login-password");
  const trustChk = document.getElementById("login-trust-device");
  const errBox = document.getElementById("login-error-box");
  const submitBtn = document.getElementById("login-submit-btn");

  errBox?.classList.add("hidden");
  setButtonLoading(submitBtn, true, "جاري التحقق من الهوية...");

  try {
    await ensureMasterAdminSeeded();

    const username = (userInp?.value || "").trim();
    const password = passInp?.value || "";
    const matched = findMatchingStaffAccount(username, password);

    if (!matched) {
      if (errBox) {
        errBox.textContent = "اسم المستخدم أو كلمة المرور غير صحيحة.";
        errBox.classList.remove("hidden");
      }
      return;
    }

    // التحقق من عدم سحب صلاحية الدخول (مع بقاء اسمه وشارته في الموقع العام)
    if (matched.suspended && !isMasterAdminUser(matched)) {
      if (errBox) {
        errBox.textContent = "تم إيقاف صلاحية النشر والدخول لهذا الحساب من قِبل الإدارة.";
        errBox.classList.remove("hidden");
      }
      return;
    }

    completePortalLogin(matched, Boolean(trustChk?.checked));
  } finally {
    setButtonLoading(submitBtn, false);
  }
}

function completePortalLogin(staffMember, trustThisDevice = true) {
  state.currentUser = staffMember;
  sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify({ userId: staffMember.id, username: staffMember.username }));

  if (trustThisDevice) {
    localStorage.setItem(
      TRUSTED_DEVICE_KEY,
      JSON.stringify({
        userId: staffMember.id,
        username: staffMember.username,
        name: staffMember.name,
        avatar: staffMember.avatar || "",
        pinCode: staffMember.pinCode || "2026"
      })
    );
  }

  document.getElementById("auth-gate-screen")?.classList.add("hidden");
  document.getElementById("portal-app-shell")?.classList.remove("hidden");

  applyPortalIdentityAndPermissions();
  renderAllPortalViews();
  showPortalToast(`مرحباً بك في غرفة العمليات، ${staffMember.name}`);
}

function checkTrustedDeviceOrSessionOnLoad() {
  const activeSessionRaw = sessionStorage.getItem(SESSION_STORAGE_KEY);
  if (activeSessionRaw) {
    try {
      const parsed = JSON.parse(activeSessionRaw);
      const user =
        state.staff.find((s) => s.id === parsed.userId || s.username === parsed.username) ||
        (parsed.username === MASTER_ADMIN_SEED.username ? { ...MASTER_ADMIN_SEED } : null);

      if (user && (!user.suspended || isMasterAdminUser(user))) {
        completePortalLogin(user, false);
        return;
      }
    } catch (_) {}
  }

  const trustedRaw = localStorage.getItem(TRUSTED_DEVICE_KEY);
  if (trustedRaw) {
    try {
      const trusted = JSON.parse(trustedRaw);
      if (trusted && trusted.username) {
        showPinUnlockScreen(trusted);
        return;
      }
    } catch (_) {}
  }

  showStandardLoginForm();
}

function showStandardLoginForm() {
  document.getElementById("standard-login-form")?.classList.remove("hidden");
  document.getElementById("pin-unlock-panel")?.classList.add("hidden");
}

function showPinUnlockScreen(trustedData) {
  state.pinBuffer = "";
  updatePinDotsUI();

  document.getElementById("standard-login-form")?.classList.add("hidden");
  document.getElementById("pin-unlock-panel")?.classList.remove("hidden");
  document.getElementById("pin-error-box")?.classList.add("hidden");

  const nameEl = document.getElementById("pin-user-name");
  if (nameEl) nameEl.textContent = trustedData.name || trustedData.username;

  const avEl = document.getElementById("pin-user-avatar");
  if (avEl) {
    avEl.src =
      trustedData.avatar ||
      `https://ui-avatars.com/api/?name=${encodeURIComponent(trustedData.name || "H")}&background=ef3327&color=fff`;
  }
}

function updatePinDotsUI() {
  const dots = document.querySelectorAll("#pin-dots-display .pin-dot");
  dots.forEach((dot, idx) => {
    dot.classList.toggle("filled", idx < state.pinBuffer.length);
  });
}

function handlePinDigitPress(digit) {
  if (state.pinBuffer.length >= 4) return;
  state.pinBuffer += String(digit);
  updatePinDotsUI();

  if (state.pinBuffer.length === 4) {
    verifyEnteredPinCode();
  }
}

function verifyEnteredPinCode() {
  const errBox = document.getElementById("pin-error-box");
  errBox?.classList.add("hidden");

  try {
    const trustedRaw = localStorage.getItem(TRUSTED_DEVICE_KEY);
    const trusted = trustedRaw ? JSON.parse(trustedRaw) : null;
    if (!trusted) {
      showStandardLoginForm();
      return;
    }

    const liveMember =
      state.staff.find((s) => s.id === trusted.userId || s.username === trusted.username) ||
      (trusted.username === MASTER_ADMIN_SEED.username ? { ...MASTER_ADMIN_SEED } : null);

    if (!liveMember) {
      showStandardLoginForm();
      return;
    }

    if (liveMember.suspended && !isMasterAdminUser(liveMember)) {
      if (errBox) {
        errBox.textContent = "تم إيقاف صلاحية الدخول لهذا الحساب.";
        errBox.classList.remove("hidden");
      }
      state.pinBuffer = "";
      updatePinDotsUI();
      return;
    }

    const expectedPin = String(liveMember.pinCode || trusted.pinCode || "2026").trim();
    if (state.pinBuffer === expectedPin) {
      completePortalLogin(liveMember, true);
    } else {
      if (errBox) {
        errBox.textContent = "رمز PIN غير صحيح، حاول مرة أخرى.";
        errBox.classList.remove("hidden");
      }
      state.pinBuffer = "";
      updatePinDotsUI();
    }
  } catch (_) {
    showStandardLoginForm();
  }
}

function lockPortalToPinScreen() {
  sessionStorage.removeItem(SESSION_STORAGE_KEY);
  document.getElementById("portal-app-shell")?.classList.add("hidden");
  document.getElementById("auth-gate-screen")?.classList.remove("hidden");
  checkTrustedDeviceOrSessionOnLoad();
}

function logoutFromPortalCompletely() {
  sessionStorage.removeItem(SESSION_STORAGE_KEY);
  state.currentUser = null;
  document.getElementById("portal-app-shell")?.classList.add("hidden");
  document.getElementById("auth-gate-screen")?.classList.remove("hidden");
  showStandardLoginForm();
}

// ==================== 6. تطبيق الهوية البصرية والشعار المفرغ والصلاحيات ====================
function applyPortalIdentityAndPermissions() {
  const s = state.settings;
  const siteName =
    s.siteName && s.siteName !== "شبكة البوصلة" && s.siteName !== "نبض اليمن"
      ? s.siteName
      : "حُجرية بريس";
  const brandColor = s.accentColor || "#ef3327";

  document.documentElement.style.setProperty("--brand-red", brandColor);
  document.getElementById("portal-theme-color")?.setAttribute("content", brandColor);

  const authTitle = document.getElementById("auth-site-name");
  if (authTitle) authTitle.textContent = siteName;

  const headerTitle = document.getElementById("header-site-name");
  if (headerTitle) headerTitle.textContent = siteName;

  // الشعار الأبيض المفرغ وخيار إخفاء الاسم النصي
  const hasLogo = Boolean(s.logoUrl && s.logoUrl.trim() !== "");
  const authLogo = document.getElementById("auth-logo-img");
  const headerLogo = document.getElementById("header-logo-img");
  const headerTextBrand = document.getElementById("header-text-brand");

  [authLogo, headerLogo].forEach((img) => {
    if (!img) return;
    if (hasLogo) {
      img.src = s.logoUrl.trim();
      img.classList.remove("hidden");
    } else {
      img.classList.add("hidden");
    }
  });

  if (headerTextBrand) {
    headerTextBrand.classList.toggle("hidden", hasLogo && Boolean(s.hideSiteName));
  }

  // أيقونة المتصفح وتطبيق الويب
  const favUrl = (s.faviconUrl || s.appIconUrl || s.logoUrl || "").trim();
  if (favUrl) {
    const favEl = document.getElementById("portal-favicon");
    if (favEl) favEl.href = favUrl;
    const appleEl = document.getElementById("portal-apple-icon");
    if (appleEl) appleEl.href = favUrl;
  }

  // تحديث بيانات المستخدم الحالي في الهيدر
  const u = state.currentUser;
  if (!u) return;

  const uAv =
    u.avatar ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(u.name || "H")}&background=ef3327&color=fff`;
  const headerAv = document.getElementById("header-user-avatar");
  if (headerAv) headerAv.src = uAv;

  const headerName = document.getElementById("header-user-name");
  if (headerName) headerName.textContent = u.name;

  const isVer = Boolean(u.verified || isMasterAdminUser(u) || u.role === "admin");
  document.getElementById("header-user-verified")?.classList.toggle("hidden", !isVer);

  const roleLabel = document.getElementById("header-user-role-label");
  if (roleLabel) {
    roleLabel.textContent = isMasterAdminUser(u)
      ? "الأدمن الرئيسي السيادي"
      : u.role === "admin"
      ? "مدير تحرير"
      : u.jobTitle || "كاتب وصحفي";
  }

  // إظهار زر القفل السريع إذا كان الجهاز موثوقاً
  const hasTrusted = Boolean(localStorage.getItem(TRUSTED_DEVICE_KEY));
  document.getElementById("lock-pin-btn")?.classList.toggle("hidden", !hasTrusted);

  // إظهار أو إخفاء تبويبات الإدارة حسب الصلاحيات
  document
    .getElementById("nav-tab-admin-staff")
    ?.classList.toggle("hidden", !canManageStaffAndReviews(u));
  document
    .getElementById("nav-tab-admin-settings")
    ?.classList.toggle("hidden", !canManageSovereignSettings(u));

  // تنبيه الكاتب إذا كانت منشوراته تخضع للمراجعة قبل النشر
  const needsReview = Boolean(u.requireReview && !canManageAllPosts(u));
  document.getElementById("writer-review-notice")?.classList.toggle("hidden", !needsReview);
}

// ==================== 7. لوحة المنشورات وإحصائيات المشاهدات الدقيقة لكل منشور ====================
function renderPortalPostsAndStats() {
  if (!state.currentUser) return;

  const scopedPosts = getScopedPostsForCurrentUser();
  const isGlobalView = canManageAllPosts(state.currentUser);

  // 1. حساب إجمالي المشاهدات الفعلية بدقة
  const totalViews = scopedPosts.reduce((sum, p) => sum + Number(p.views || 0), 0);
  const publishedCount = scopedPosts.filter((p) => !p.status || p.status === "published").length;
  const pendingCount = scopedPosts.filter((p) => p.status === "pending").length;
  const videosCount = scopedPosts.filter(
    (p) => (p.videoType && p.videoType !== "none") || (p.videoUrl && String(p.videoUrl).trim() !== "")
  ).length;

  const viewsLabel = document.getElementById("stat-views-label");
  if (viewsLabel) {
    viewsLabel.textContent = isGlobalView
      ? "إجمالي مشاهدات جميع المنشورات"
      : "إجمالي مشاهدات منشوراتي";
  }

  const totalViewsEl = document.getElementById("stat-total-views");
  if (totalViewsEl) totalViewsEl.textContent = totalViews.toLocaleString("ar-YE");

  const pubCountEl = document.getElementById("stat-published-count");
  if (pubCountEl) pubCountEl.textContent = publishedCount.toLocaleString("ar-YE");

  const pendCountEl = document.getElementById("stat-pending-count");
  if (pendCountEl) pendCountEl.textContent = pendingCount.toLocaleString("ar-YE");

  const vidCountEl = document.getElementById("stat-videos-count");
  if (vidCountEl) vidCountEl.textContent = videosCount.toLocaleString("ar-YE");

  // 2. فلترة وبحث المنشورات
  let filtered = [...scopedPosts];

  if (state.postFilter === "published") {
    filtered = filtered.filter((p) => !p.status || p.status === "published");
  } else if (state.postFilter === "pending") {
    filtered = filtered.filter((p) => p.status === "pending");
  } else if (state.postFilter === "breaking") {
    filtered = filtered.filter((p) => Boolean(p.isBreaking));
  } else if (state.postFilter === "video") {
    filtered = filtered.filter(
      (p) => (p.videoType && p.videoType !== "none") || (p.videoUrl && String(p.videoUrl).trim() !== "")
    );
  }

  if (state.postSearchQuery) {
    const q = state.postSearchQuery.toLowerCase();
    filtered = filtered.filter((p) =>
      `${p.title || ""} ${p.summary || ""} ${p.author || ""}`.toLowerCase().includes(q)
    );
  }

  const listEl = document.getElementById("portal-posts-list");
  if (!listEl) return;

  if (!filtered.length) {
    listEl.innerHTML = `
      <div class="empty-workspace-card">
        <span class="material-symbols-rounded empty-icon" translate="no">article</span>
        <h3>لا توجد منشورات في هذا العرض</h3>
        <p>اضغط على زر (+ نشر جديد) في الأعلى لإضافة خبر أو تقرير أو فيديو جديد.</p>
      </div>
    `;
    return;
  }

  const defaultImg = state.settings.defaultPostImageUrl || state.settings.logoUrl || "";
  const canEdit =
    canManageAllPosts(state.currentUser) || state.currentUser.permissions?.canEditOwn !== false;
  const canDelete =
    canManageAllPosts(state.currentUser) || Boolean(state.currentUser.permissions?.canDeleteOwn);

  listEl.innerHTML = filtered
    .map((post) => {
      const thumbUrl = post.imageUrl || defaultImg;
      const isPending = post.status === "pending";
      const viewsNum = Number(post.views || 0).toLocaleString("ar-YE");
      const cats = Array.isArray(post.categories) && post.categories.length
        ? post.categories.map(getCleanCategoryLabel).join(" ، ")
        : getCleanCategoryLabel(post.category || "عام");

      const hasVideo =
        (post.videoType && post.videoType !== "none") ||
        (post.videoUrl && String(post.videoUrl).trim() !== "");

      return `
        <article class="portal-post-row">
          <div class="post-row-main">
            ${
              thumbUrl
                ? `<img src="${escapeHtml(thumbUrl)}" alt="" class="post-row-thumb" loading="lazy">`
                : `<div class="post-row-thumb" style="display:flex;align-items:center;justify-content:center;color:#fff;font-weight:900;">ح</div>`
            }
            <div>
              <h3 class="post-row-title">${escapeHtml(post.title)}</h3>
              <div class="post-row-badges">
                <span class="badge-pill ${isPending ? "badge-pending" : "badge-published"}">
                  ${isPending ? "⏳ قيد المراجعة" : "✓ منشور"}
                </span>
                ${post.isBreaking ? `<span class="badge-pill badge-breaking">عاجل</span>` : ""}
                ${
                  hasVideo
                    ? `<span class="badge-pill badge-video">${
                        post.videoType === "short_vertical" ? "📱 فيديو قصير" : "🎬 فيديو"
                      }</span>`
                    : ""
                }
                <span style="color:var(--text-muted);font-weight:700;">${escapeHtml(cats)}</span>
                <span style="color:var(--text-muted);">• الكاتب: <strong>${escapeHtml(
                  post.author || "هيئة التحرير"
                )}</strong></span>
                <span style="color:var(--text-muted);">• ${formatArabicDateTime(post.createdAt)}</span>
              </div>
            </div>
          </div>

          <div class="post-row-actions">
            <!-- عداد المشاهدات الفعلي والدقيق لهذا المنشور على حدة -->
            <div class="post-views-counter-pill" title="إجمالي المشاهدات الفعلية لهذا المنشور">
              <span class="material-symbols-rounded" translate="no">visibility</span>
              <span>${viewsNum} مشاهدة</span>
            </div>

            ${
              isPending && canManageAllPosts(state.currentUser)
                ? `<button type="button" class="btn-primary-red" data-approve-post="${escapeHtml(
                    post.id
                  )}" style="padding:5px 10px;font-size:0.78rem;">اعتماد ونشر</button>`
                : ""
            }

            ${
              canEdit
                ? `<button type="button" class="btn-outline" data-edit-post="${escapeHtml(
                    post.id
                  )}" style="padding:5px 10px;font-size:0.78rem;">تعديل</button>`
                : ""
            }

            ${
              canDelete
                ? `<button type="button" class="btn-outline" data-delete-post="${escapeHtml(
                    post.id
                  )}" style="padding:5px 10px;font-size:0.78rem;color:#b91c1c;border-color:#fca5a5;">حذف</button>`
                : ""
            }
          </div>
        </article>
      `;
    })
    .join("");

  // ربط أزرار الاعتماد والتعديل والحذف
  listEl.querySelectorAll("[data-approve-post]").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const postId = btn.getAttribute("data-approve-post");
      setButtonLoading(btn, true, "جاري النشر...");
      try {
        await updateDoc(doc(db, "posts", postId), {
          status: "published",
          approvedAt: serverTimestamp()
        });
        showPortalToast("تم اعتماد المنشور ونشره على الموقع العام ✓");
      } finally {
        setButtonLoading(btn, false);
      }
    });
  });

  listEl.querySelectorAll("[data-edit-post]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const postId = btn.getAttribute("data-edit-post");
      if (typeof window.__openEditorForPost === "function") {
        window.__openEditorForPost(postId);
      }
    });
  });

  listEl.querySelectorAll("[data-delete-post]").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const postId = btn.getAttribute("data-delete-post");
      if (!confirm("هل أنت متأكد من حذف هذا المنشور نهائياً؟")) return;
      setButtonLoading(btn, true, "حذف...");
      try {
        await deleteDoc(doc(db, "posts", postId));
        showPortalToast("تم حذف المنشور بنجاح");
      } finally {
        setButtonLoading(btn, false);
      }
    });
  });
}

// ==================== 8. دفتر الملاحظات الشخصي المعزول (Personal Cloud Notebook) ====================
function getMyIsolatedNotes() {
  if (!state.currentUser) return [];
  const myId = String(state.currentUser.id || "").toLowerCase();
  const myUser = String(state.currentUser.username || "").toLowerCase();
  return state.notes.filter(
    (n) =>
      String(n.ownerId || "").toLowerCase() === myId ||
      String(n.ownerUsername || "").toLowerCase() === myUser
  );
}

function renderPersonalNotes() {
  const myNotes = getMyIsolatedNotes();
  const badge = document.getElementById("notes-count-badge");
  if (badge) badge.textContent = String(myNotes.length);

  const grid = document.getElementById("personal-notes-grid");
  if (!grid) return;

  if (!myNotes.length) {
    grid.innerHTML = `
      <div class="empty-workspace-card" style="grid-column:1/-1;">
        <span class="material-symbols-rounded empty-icon" translate="no">edit_note</span>
        <h3>دفتر ملاحظاتك الشخصي فارغ</h3>
        <p>كل ما تكتبه هنا معزول وخاص بك وحدك. اضغط «إضافة ملاحظة جديدة» لتدوين أفكارك ومسوداتك.</p>
      </div>
    `;
    return;
  }

  grid.innerHTML = myNotes
    .map(
      (n) => `
      <div class="note-card" style="display:flex;flex-direction:column;justify-content:space-between;gap:10px;">
        <div>
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;">
            <strong style="font-size:0.95rem;">${escapeHtml(n.title)}</strong>
            <span style="font-size:0.72rem;color:var(--text-muted);">${formatArabicDateTime(
              n.updatedAt || n.createdAt
            )}</span>
          </div>
          <p style="font-size:0.84rem;color:var(--text-body);white-space:pre-line;">${escapeHtml(
            n.body || ""
          )}</p>
        </div>

        <div style="display:flex;gap:6px;flex-wrap:wrap;padding-top:8px;border-top:1px solid var(--border-light);">
          <button type="button" class="btn-primary-red" data-convert-note="${escapeHtml(
            n.id
          )}" style="padding:4px 10px;font-size:0.76rem;">تحويل إلى مقال</button>
          <button type="button" class="btn-outline" data-edit-note="${escapeHtml(
            n.id
          )}" style="padding:4px 10px;font-size:0.76rem;">تعديل</button>
          <button type="button" class="btn-outline" data-delete-note="${escapeHtml(
            n.id
          )}" style="padding:4px 10px;font-size:0.76rem;color:#b91c1c;">حذف</button>
        </div>
      </div>
    `
    )
    .join("");

  grid.querySelectorAll("[data-convert-note]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const note = myNotes.find((item) => item.id === btn.getAttribute("data-convert-note"));
      if (note && typeof window.__openEditorFromNote === "function") {
        window.__openEditorFromNote(note);
      }
    });
  });

  grid.querySelectorAll("[data-edit-note]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const note = myNotes.find((item) => item.id === btn.getAttribute("data-edit-note"));
      if (!note) return;
      document.getElementById("note-edit-id").value = note.id;
      document.getElementById("note-title-input").value = note.title || "";
      document.getElementById("note-body-input").value = note.body || "";
      document.getElementById("note-editor-card")?.classList.remove("hidden");
    });
  });

  grid.querySelectorAll("[data-delete-note]").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const id = btn.getAttribute("data-delete-note");
      if (!confirm("حذف هذه الملاحظة الشخصية؟")) return;
      await deleteDoc(doc(db, "notes", id));
      showPortalToast("تم حذف الملاحظة");
    });
  });
}

async function handleSavePersonalNote(e) {
  e.preventDefault();
  if (!state.currentUser) return;

  const editId = document.getElementById("note-edit-id")?.value || "";
  const title = (document.getElementById("note-title-input")?.value || "").trim();
  const body = (document.getElementById("note-body-input")?.value || "").trim();
  const saveBtn = document.getElementById("save-note-btn");

  if (!title) return;
  setButtonLoading(saveBtn, true, "جاري الحفظ...");

  try {
    const payload = {
      title,
      body,
      ownerId: state.currentUser.id,
      ownerUsername: state.currentUser.username,
      updatedAt: serverTimestamp()
    };

    if (editId) {
      await updateDoc(doc(db, "notes", editId), payload);
    } else {
      await addDoc(collection(db, "notes"), {
        ...payload,
        createdAt: serverTimestamp()
      });
    }

    document.getElementById("note-editor-card")?.classList.add("hidden");
    document.getElementById("note-edit-id").value = "";
    document.getElementById("note-title-input").value = "";
    document.getElementById("note-body-input").value = "";
    showPortalToast("تم حفظ الملاحظة في دفترك الشخصي ✓");
  } finally {
    setButtonLoading(saveBtn, false);
  }
}

// ------------------- نهاية الجزء الأول من محرك البوابة التحريرية الذكية (حُجرية بريس) -------------------
