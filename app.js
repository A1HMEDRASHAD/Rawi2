<!DOCTYPE html>
<html lang="ar" dir="rtl" data-theme="dark" translate="yes">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0">
  <title>بوصلة السياسة اليمنية | شبكة البوصلة</title>
  <meta id="meta-desc" name="description" content="منصة إخبارية وتحليلية ترصد كواليس السياسة والتقنية والثقافة">

  <!-- وسوم المشاركة الاجتماعية (Open Graph & Twitter) بدون أي روابط قديمة -->
  <meta id="og-title" property="og:title" content="بوصلة السياسة اليمنية | شبكة البوصلة">
  <meta id="og-desc" property="og:description" content="منصة إخبارية وتحليلية ترصد كواليس السياسة والتقنية والثقافة">
  <meta property="og:type" content="website">
  <meta id="og-image" property="og:image" content="">
  <meta name="twitter:card" content="summary_large_image">
  <meta id="twitter-image" name="twitter:image" content="">

  <!-- أيقونة الموقع الديناميكية (تُجلب حصرياً من غرفة العمليات) -->
  <link id="dynamic-favicon" rel="icon" href="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7">
  <link id="apple-favicon" rel="apple-touch-icon" href="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7">

  <!-- الخطوط العربية الرسمية وأيقونات جوجل -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800;900&family=Tajawal:wght@400;500;700;800&display=swap" rel="stylesheet">
  <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@24,500,1,0" rel="stylesheet">

  <!-- ملف التصميم الزجاجي المتجاوب -->
  <link rel="stylesheet" href="./style.css">
</head>
<body>

  <!-- 1. الترويسة الزجاجية العلوية (بدون زر ترجمة وبدون شعار قديم) -->
  <header class="site-header glass-surface">
    <div class="container header-inner">
      <div class="header-right">
        <button type="button" id="open-sidebar-btn" class="icon-btn" aria-label="القائمة الجانبية">
          <span class="material-symbols-rounded" translate="no">menu</span>
        </button>

        <a href="./" id="home-brand-link" class="brand-link">
          <img id="custom-logo-img" class="brand-logo" src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7" alt="شعار المنصة" style="opacity:0;">
          <div id="brand-text-wrap" class="brand-text hidden">
            <span id="ui-site-name" class="brand-title">بوصلة السياسة اليمنية</span>
            <span id="ui-network-name" class="brand-subtitle">شبكة البوصلة</span>
          </div>
        </a>
      </div>

      <div class="header-left">
        <button type="button" id="search-toggle-btn" class="icon-btn" aria-label="البحث الذكي">
          <span class="material-symbols-rounded" translate="no">search</span>
        </button>
        <button type="button" id="theme-toggle-btn" class="icon-btn" aria-label="تبديل المظهر">
          <span id="theme-icon" class="material-symbols-rounded" translate="no">light_mode</span>
        </button>
      </div>
    </div>

    <!-- درج البحث الفوري الذكي -->
    <div id="search-drawer" class="search-drawer hidden">
      <div class="container search-drawer-inner">
        <span class="material-symbols-rounded search-icon" translate="no">manage_search</span>
        <input type="search" id="global-search-input" placeholder="ابحث بذكاء في العناوين، الملخصات، الكتّاب، أو الوسوم..." autocomplete="off">
        <span id="search-count-badge" class="search-badge hidden">0</span>
        <button type="button" id="close-search-btn" class="icon-btn sm-btn" aria-label="إغلاق البحث">
          <span class="material-symbols-rounded" translate="no">close</span>
        </button>
      </div>
    </div>

    <!-- شريط الأقسام الرئيسي والفرعي -->
    <nav class="categories-bar" aria-label="أقسام الموقع">
      <div class="container">
        <div id="categories-nav-list" class="categories-scroll"></div>
        <div id="subcategories-bar" class="subcategories-scroll hidden"></div>
      </div>
    </nav>
  </header>

  <!-- 2. شريط الأخبار العاجلة الدوّار الذكي -->
  <section id="breaking-ticker-wrap" class="breaking-wrap hidden" aria-label="أخبار عاجلة">
    <div class="container breaking-inner glass-surface">
      <div class="breaking-badge">
        <span class="pulse-dot"></span>
        <span id="ui-breaking-label">عاجل</span>
      </div>
      <div id="breaking-list" class="breaking-content"></div>
      <div class="breaking-controls" translate="no">
        <span id="breaking-counter" class="breaking-counter">1/1</span>
        <button type="button" id="breaking-prev-btn" class="ticker-nav-btn" aria-label="الخبر السابق">
          <span class="material-symbols-rounded">chevron_right</span>
        </button>
        <button type="button" id="breaking-next-btn" class="ticker-nav-btn" aria-label="الخبر التالي">
          <span class="material-symbols-rounded">chevron_left</span>
        </button>
      </div>
    </div>
  </section>

  <!-- 3. مساحة الإعلانات والراعي الرسمي العلوية -->
  <div class="container">
    <div id="ad-slot-top" class="ad-slot-wrapper"></div>
  </div>

  <!-- 4. المحتوى الرئيسي للموقع (الأقسام والأوضاع الـ 4) -->
  <main class="container main-content">

    <!-- (أ) واجهة الصفحة الرئيسية وتدفق الأخبار -->
    <section id="view-home" class="view-section">
      <div id="hero-section" class="hero-section"></div>

      <div class="home-layout-grid">
        <!-- العمود الرئيسي للمقالات -->
        <div class="feed-column">
          <div class="section-header">
            <h2 id="feed-heading" class="section-title">أحدث التحليلات والتقارير</h2>
            <div class="section-line"></div>
          </div>

          <div id="posts-grid" class="posts-grid">
            <div id="loading-skeleton" class="skeleton-card glass-surface">
              <div class="spinner-ring"></div>
              <span>جاري تحميل المواد الصحفية...</span>
            </div>
          </div>
        </div>

        <!-- العمود الجانبي للأكثر قراءة -->
        <aside class="sidebar-column">
          <div class="trending-widget glass-surface">
            <div class="widget-header">
              <span class="material-symbols-rounded trend-icon" translate="no">local_fire_department</span>
              <h3 id="ui-trending-heading">الأكثر قراءة في البوصلة</h3>
            </div>
            <div id="trending-list" class="trending-list"></div>
          </div>
        </aside>
      </div>
    </section>

    <!-- (ب) واجهة قراءة المقال الكامل والوسائط -->
    <section id="view-article" class="view-section hidden">
      <article class="article-container glass-surface">
        <div class="article-top-bar">
          <button type="button" id="back-to-home-btn" class="back-pill-btn">
            <span id="back-arrow-icon" class="material-symbols-rounded" translate="no">arrow_forward</span>
            <span id="ui-back-btn-text">العودة للأخبار</span>
          </button>
          <div id="art-badges" class="article-badges"></div>
        </div>

        <h1 id="art-title" class="article-main-title"></h1>
        <p id="art-summary" class="article-lead-summary"></p>

        <div class="article-meta-bar">
          <button type="button" id="art-author-btn" class="author-meta-trigger">
            <img id="art-author-avatar" src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7" alt="صورة الكاتب" class="author-avatar-sm">
            <div class="author-meta-text">
              <div class="author-name-row">
                <span id="art-author" class="author-name"></span>
                <span id="art-author-verified" class="verified-badge hidden" translate="no" title="صحفي موثق">verified</span>
              </div>
              <span id="art-date" class="article-date"></span>
            </div>
          </button>

          <div class="views-pill" title="عدد القراءات">
            <span class="material-symbols-rounded" translate="no">visibility</span>
            <span id="art-views">0</span>
          </div>
        </div>

        <!-- مشغل الفيديو / البودكاست / الصورة البارزة -->
        <div id="art-media-slot" class="article-media-slot"></div>

        <!-- نص المقال -->
        <div id="art-body" class="article-content-body"></div>

        <!-- الوسوم -->
        <div id="art-tags" class="article-tags-wrap"></div>

        <!-- شريط المشاركة الاجتماعية -->
        <div class="share-box glass-surface">
          <span id="ui-share-label" class="share-title">مشاركة المادة:</span>
          <div class="share-buttons">
            <button type="button" id="share-wa" class="share-btn wa-btn">WhatsApp</button>
            <button type="button" id="share-tg" class="share-btn tg-btn">Telegram</button>
            <button type="button" id="share-x" class="share-btn x-btn">X</button>
            <button type="button" id="share-copy" class="share-btn copy-btn">
              <span class="material-symbols-rounded" translate="no">content_copy</span>
              <span id="ui-copy-link-label">نسخ الرابط</span>
            </button>
          </div>
        </div>
      </article>

      <!-- موضوعات ذات صلة -->
      <div class="related-section">
        <div class="section-header">
          <h3 id="ui-related-heading" class="section-title">موضوعات ذات صلة</h3>
          <div class="section-line"></div>
        </div>
        <div id="related-grid" class="posts-grid"></div>
      </div>
    </section>

    <!-- (ج) واجهة الملف الشخصي للصحفي / الكاتب الموثق -->
    <section id="view-author" class="view-section hidden">
      <div class="author-profile-card glass-surface">
        <button type="button" id="author-back-btn" class="back-pill-btn">
          <span class="material-symbols-rounded" translate="no">arrow_forward</span>
          <span id="ui-author-back-text">العودة للرئيسية</span>
        </button>

        <div class="author-profile-header">
          <img id="profile-author-avatar" src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7" alt="صورة الكاتب" class="author-avatar-lg">
          <div class="author-profile-info">
            <div class="author-name-row">
              <h1 id="profile-author-name" class="author-profile-name"></h1>
              <span id="profile-author-verified" class="verified-badge hidden" translate="no" title="صحفي موثق">verified</span>
            </div>
            <span id="ui-author-badge" class="badge-pill">قلم في شبكة البوصلة</span>
            <p id="profile-author-job" class="author-job-title"></p>
            <p id="profile-author-bio" class="author-bio-text"></p>
            <div class="author-stats-row">
              <span id="profile-author-count" class="author-post-count"></span>
              <div id="profile-author-socials" class="social-links-row"></div>
            </div>
          </div>
        </div>
      </div>

      <div id="author-posts-grid" class="posts-grid" style="margin-top: 24px;"></div>
    </section>

    <!-- (د) واجهة الصفحات القانونية الثابتة (من نحن / سياسة الخصوصية) -->
    <section id="view-static" class="view-section hidden">
      <div class="static-page-card glass-surface">
        <div class="article-top-bar">
          <button type="button" id="static-back-btn" class="back-pill-btn">
            <span class="material-symbols-rounded" translate="no">arrow_forward</span>
            <span id="ui-static-back-text">العودة للرئيسية</span>
          </button>
          <span id="static-page-badge" class="badge-pill">شبكة البوصلة</span>
        </div>
        <h1 id="static-page-title" class="article-main-title"></h1>
        <div id="static-page-body" class="article-content-body"></div>
      </div>
    </section>

  </main>

  <!-- 5. القائمة الجانبية المنزلقة (Sidebar Drawer) -->
  <div id="sidebar-backdrop" class="sidebar-backdrop hidden"></div>
  <aside id="sidebar-drawer" class="sidebar-drawer glass-surface" aria-label="القائمة الجانبية">
    <div class="sidebar-header">
      <img id="sidebar-logo-img" class="sidebar-logo" src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7" alt="شعار القائمة" style="opacity:0;">
      <button type="button" id="close-sidebar-btn" class="icon-btn sm-btn" aria-label="إغلاق القائمة">
        <span class="material-symbols-rounded" translate="no">close</span>
      </button>
    </div>
    <ul id="sidebar-menu-list" class="sidebar-menu-list"></ul>
    <div class="sidebar-footer">
      <div id="sidebar-social-links" class="social-links-row"></div>
    </div>
  </aside>

  <!-- 6. التذييل الرسمي (Footer) -->
  <footer class="site-footer glass-surface">
    <div class="container footer-inner">
      <div class="footer-brand-col">
        <img id="footer-logo-img" class="footer-logo" src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7" alt="شعار التذييل" style="opacity:0;">
        <h3 id="footer-site-name" class="footer-title">بوصلة السياسة اليمنية</h3>
        <p id="footer-site-desc" class="footer-desc">منصة إخبارية وتحليلية ترصد كواليس السياسة والتقنية والثقافة</p>
        <div id="footer-social-links" class="social-links-row"></div>
      </div>

      <div class="footer-links-col">
        <div class="footer-legal-links">
          <button type="button" id="ui-footer-about" class="footer-link-btn" onclick="window.openStaticPage('about')">من نحن</button>
          <button type="button" id="ui-footer-privacy" class="footer-link-btn" onclick="window.openStaticPage('privacy')">سياسة الخصوصية</button>
        </div>
        <p id="ui-copyright-text" class="copyright-text">© جميع الحقوق محفوظة — <b id="footer-network-copy">شبكة البوصلة</b></p>
      </div>
    </div>
  </footer>

  <!-- 7. شريط التنقل الزجاجي العائم للهواتف (Floating Glass Bottom Bar) -->
  <nav id="mobile-bottom-nav" class="mobile-bottom-nav glass-surface" aria-label="التنقل السريع">
    <div id="mob-nav-indicator" class="mob-nav-indicator"></div>
    <button type="button" class="mob-nav-btn active" data-action="home">
      <span class="material-symbols-rounded" translate="no">home</span>
      <span id="ui-mob-home">الرئيسية</span>
    </button>
    <button type="button" class="mob-nav-btn" data-action="trending">
      <span class="material-symbols-rounded" translate="no">local_fire_department</span>
      <span id="ui-mob-trending">الأكثر قراءة</span>
    </button>
    <button type="button" class="mob-nav-btn" data-action="search">
      <span class="material-symbols-rounded" translate="no">search</span>
      <span id="ui-mob-search">البحث</span>
    </button>
    <button type="button" class="mob-nav-btn" data-action="theme">
      <span class="material-symbols-rounded" translate="no">contrast</span>
      <span id="ui-mob-theme">المظهر</span>
    </button>
  </nav>

  <!-- 8. إشعار النظام المنبثق (Toast) -->
  <div id="public-toast" class="public-toast hidden" role="status" aria-live="polite"></div>

  <!-- 9. المحرك البرمجي للموقع العام -->
  <script type="module" src="./app.js"></script>
</body>
</html>
// ============================================================================
// شبكة البوصلة الإخبارية — محرك الموقع العام (النسخة النهائية المؤمّنة) — الجزء (2/2)
// ============================================================================

// 8. جلب دليل الصحفيين والتوثيق (Staff Profiles & Verified Badges)
async function fetchStaffDirectory() {
  try {
    const snap = await getDocs(collection(db, "staff"));
    const map = {};
    snap.docs.forEach((d) => {
      const data = d.data();
      const emailKey = d.id.toLowerCase().trim();
      map[emailKey] = { email: emailKey, ...data };
      if (data.name) map[data.name.trim()] = { email: emailKey, ...data };
      if (data.displayName) map[data.displayName.trim()] = { email: emailKey, ...data };
    });
    staffDirectory = map;
  } catch (err) {
    console.warn("Staff directory fetch notice:", err);
  }
}

function getAuthorMeta(post) {
  const emailKey = (post.authorEmail || "").toLowerCase().trim();
  const nameKey = (post.author || "").trim();
  const staff = staffDirectory[emailKey] || staffDirectory[nameKey] || {};

  const isSovereign =
    emailKey === "a1hmedrashad@gmail.com" ||
    emailKey === "rawialshamal@gmail.com";

  const verified = isSovereign || Boolean(staff.verified) || Boolean(post.authorVerified);
  const avatarUrl = sanitizeUrl(
    staff.avatarUrl || post.authorAvatar || siteSettings.faviconUrl || siteSettings.logoUrl,
    BLANK_AVATAR_SVG
  );
  const bio = staff.bio || post.authorBio || "";
  const jobTitle = staff.jobTitle || post.authorJobTitle || "";
  const socialX = sanitizeUrl(staff.socialX, "");
  const socialFb = sanitizeUrl(staff.socialFb, "");

  return { verified, avatarUrl, bio, jobTitle, socialX, socialFb };
}

// 9. جلب وعرض الرعايات والإعلانات الذكية (مع حماية النقرات والظهور)
async function fetchAds() {
  try {
    const snap = await getDocs(collection(db, "ads"));
    activeAds = snap.docs
      .map((d) => ({ id: d.id, ...d.data() }))
      .filter((a) => a.active !== false);
  } catch (err) {
    console.warn("Ads fetch notice:", err);
  }
}

function getAdForPlacement(placementKey) {
  const matching = activeAds.filter(
    (a) => a.placement === placementKey || a.placement === "all"
  );
  if (matching.length === 0) return null;
  return matching[Math.floor(Math.random() * matching.length)];
}

async function trackAdImpression(adId) {
  if (!adId || hasSessionRecord(SESSION_ADS_KEY, `view_${adId}`)) return;
  addSessionRecord(SESSION_ADS_KEY, `view_${adId}`);
  try {
    await updateDoc(doc(db, "ads", adId), { views: increment(1) });
  } catch (e) {}
}

window.handleAdClick = async (adId) => {
  if (!adId || hasSessionRecord(SESSION_ADS_KEY, `click_${adId}`)) return;
  addSessionRecord(SESSION_ADS_KEY, `click_${adId}`);
  try {
    await updateDoc(doc(db, "ads", adId), { clicks: increment(1) });
  } catch (e) {}
};

function buildSmartAdHTML(ad, domWrapperId) {
  if (!ad) return "";
  trackAdImpression(ad.id);

  const thumb = sanitizeUrl(
    ad.imageUrl || siteSettings.logoUrl || siteSettings.faviconUrl,
    BLANK_SURFACE_SVG
  );
  const safeTarget = sanitizeUrl(ad.targetUrl, "#");
  const safeTitle = escapeHTML(ad.title || "إعلان ممول");
  const safeSponsor = escapeHTML(ad.sponsorName || "شريك البوصلة");
  const safeAdId = escapeHTML(ad.id);
  const safeDomId = escapeHTML(domWrapperId);

  if (ad.adStyle === "banner") {
    return `
      <div class="leaderboard-ad-banner" id="${safeDomId}">
        <button type="button" class="glass-ad-close leaderboard-close-float" onclick="document.getElementById('${safeDomId}')?.remove()">
          <span class="material-symbols-rounded" translate="no" style="font-size:16px;">close</span>
        </button>
        <a href="${escapeHTML(safeTarget)}" target="_blank" rel="noopener sponsored" class="leaderboard-ad-link" onclick="window.handleAdClick('${safeAdId}')">
          <img src="${escapeHTML(thumb)}" alt="${safeTitle}" class="leaderboard-ad-img" loading="lazy">
          <div class="leaderboard-ad-bar">
            <span><strong style="color:var(--sponsor-gold)">✨ رعاية وإعلان</strong> • ${safeTitle}</span>
            <span>الراعي الرسمي: ${safeSponsor} ↗</span>
          </div>
        </a>
      </div>
    `;
  }

  return `
    <div class="glass-ad-banner" id="${safeDomId}">
      <a href="${escapeHTML(safeTarget)}" target="_blank" rel="noopener sponsored" class="glass-ad-clickable" onclick="window.handleAdClick('${safeAdId}')">
        <img src="${escapeHTML(thumb)}" alt="${safeSponsor}" class="glass-ad-thumb" loading="lazy">
        <div>
          <span class="glass-ad-tag">✨ رعاية وإعلان</span>
          <div class="glass-ad-title">${safeTitle}</div>
          <div class="glass-ad-sponsor">الراعي الرسمي: ${safeSponsor}</div>
        </div>
      </a>
      <button type="button" class="glass-ad-close" onclick="document.getElementById('${safeDomId}')?.remove()">
        <span class="material-symbols-rounded" translate="no" style="font-size:16px;">close</span>
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
    const safeLink = sanitizeUrl(siteSettings.customAdLink, "#");
    topSlot.innerHTML = `
      <div class="glass-ad-banner" id="ad-dom-fallback">
        <a href="${escapeHTML(safeLink)}" target="_blank" rel="noopener" class="glass-ad-clickable">
          <div>
            <span class="glass-ad-tag">✨ رعاية وإعلان</span>
            <div class="glass-ad-title">${escapeHTML(siteSettings.customAdText)}</div>
          </div>
        </a>
        <button type="button" class="glass-ad-close" onclick="document.getElementById('ad-dom-fallback')?.remove()">
          <span class="material-symbols-rounded" translate="no" style="font-size:16px;">close</span>
        </button>
      </div>
    `;
  } else {
    topSlot.innerHTML = "";
  }
}

// 10. جلب المنشورات + شريط الأخبار العاجلة الدوّار
async function fetchPublishedPosts() {
  try {
    const snap = await getDocs(collection(db, "posts"));
    publishedPosts = snap.docs
      .map((d) => ({ id: d.id, ...d.data() }))
      .filter((p) => p.status === "published")
      .sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));

    renderBreakingTicker();
    renderTrendingSidebar();
  } catch (err) {
    console.error("Posts fetch error:", err);
  } finally {
    $("loading-skeleton")?.remove();
  }
}

function getPostCatName(post) {
  const catObj = categories.find((c) => c.slug === post.category);
  if (catObj) return catObj.name;
  return post.categoryName || post.category || "عام";
}

function renderBreakingTicker() {
  const wrap = $("breaking-ticker-wrap");
  if (!wrap) return;

  breakingNewsList = publishedPosts.filter((p) => p.isBreaking);
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

  const safeId = escapeHTML(currentPost.id);
  const safeTitle = escapeHTML(currentPost.title || "");

  listEl.innerHTML = `
    <a class="breaking-item" onclick="window.openArticle('${safeId}')">
      ⚡ ${safeTitle}
    </a>
  `;
}

function stepBreakingNews(direction = 1) {
  if (breakingNewsList.length <= 1) return;
  breakingCurrentIndex =
    (breakingCurrentIndex + direction + breakingNewsList.length) %
    breakingNewsList.length;
  renderCurrentBreakingItem();

  if (breakingIntervalId) {
    clearInterval(breakingIntervalId);
    breakingIntervalId = setInterval(() => stepBreakingNews(1), 6000);
  }
}

// 11. عرض الصفحة الرئيسية والبطاقات الذكية والأكثر قراءة
function renderHomeFeed() {
  const heroContainer = $("hero-section");
  const gridContainer = $("posts-grid");
  const feedHeading = $("feed-heading");
  const countBadge = $("search-count-badge");
  if (!gridContainer) return;

  $("loading-skeleton")?.remove();

  const filtered = publishedPosts.filter((post) => {
    if (selectedCategory !== "all" && post.category !== selectedCategory) return false;
    if (selectedSubcategory !== "all" && post.subcategory !== selectedSubcategory) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const haystack = [
        post.title,
        post.summary,
        post.content,
        post.author,
        post.categoryName,
        ...(Array.isArray(post.tags) ? post.tags : [])
      ]
        .join(" ")
        .toLowerCase();
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
    gridContainer.innerHTML = `
      <div class="skeleton-card glass-surface">
        <span>لا توجد مواد صحفية منشورة في هذا القسم حالياً.</span>
      </div>
    `;
    return;
  }

  const catObj = categories.find((c) => c.slug === selectedCategory);
  if (feedHeading) {
    feedHeading.textContent = searchQuery
      ? `نتائج البحث الذكي عن: "${searchQuery}" (${filtered.length})`
      : selectedCategory === "all"
      ? "أحدث التحليلات والتقارير"
      : catObj?.name || "الأخبار";
  }

  const featuredPost = filtered.find((p) => p.isFeatured) || filtered[0];
  const remainingPosts = filtered.filter((p) => p.id !== featuredPost.id);

  if (heroContainer) {
    if (!searchQuery && featuredPost) {
      const heroImg = sanitizeUrl(
        featuredPost.imageUrl || siteSettings.ogImageUrl || siteSettings.logoUrl,
        BLANK_SURFACE_SVG
      );
      const authorMeta = getAuthorMeta(featuredPost);
      const safeId = escapeHTML(featuredPost.id);
      const safeTitle = escapeHTML(featuredPost.title || "");
      const safeSummary = escapeHTML(featuredPost.summary || "");
      const safeAuthor = escapeHTML(featuredPost.author || "هيئة التحرير");
      const safeCat = escapeHTML(getPostCatName(featuredPost));

      heroContainer.innerHTML = `
        <div class="hero-card glass-surface" onclick="window.openArticle('${safeId}')">
          <div class="hero-img-wrap">
            <img src="${escapeHTML(heroImg)}" alt="${safeTitle}" loading="eager">
          </div>
          <div class="hero-content">
            <div class="article-badges">
              <span class="badge-pill">${safeCat}</span>
            </div>
            <h2 class="hero-title">${safeTitle}</h2>
            <p class="hero-summary">${safeSummary}</p>
            <div class="card-footer">
              <span class="card-author-wrap">
                <img src="${escapeHTML(authorMeta.avatarUrl)}" alt="" class="card-author-avatar">
                <span>${safeAuthor}</span>
                ${authorMeta.verified ? `<span class="verified-badge" translate="no" title="صحفي موثق">verified</span>` : ""}
              </span>
              <span>${escapeHTML(formatDate(featuredPost.createdAt))}</span>
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
  const img = sanitizeUrl(
    post.imageUrl || siteSettings.ogImageUrl || siteSettings.logoUrl,
    BLANK_SURFACE_SVG
  );
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

  const safeId = escapeHTML(post.id);
  const safeTitle = escapeHTML(post.title || "");
  const safeSummary = escapeHTML(post.summary || "");
  const safeAuthor = escapeHTML(post.author || "هيئة التحرير");
  const safeCat = escapeHTML(getPostCatName(post));

  return `
    <article class="news-card glass-surface" onclick="window.openArticle('${safeId}')">
      <div class="card-thumb-wrap">
        <img src="${escapeHTML(img)}" alt="${safeTitle}" loading="lazy">
        <span class="card-cat-float">${safeCat}</span>
        ${overlayIcon}
      </div>
      <div class="card-body">
        <h3 class="card-title">${safeTitle}</h3>
        <p class="card-excerpt">${safeSummary}</p>
        <div class="card-footer">
          <span class="card-author-wrap">
            <img src="${escapeHTML(authorMeta.avatarUrl)}" alt="" class="card-author-avatar">
            <span>${safeAuthor}</span>
            ${authorMeta.verified ? `<span class="verified-badge" translate="no" title="صحفي موثق">verified</span>` : ""}
          </span>
          <span>${escapeHTML(formatDate(post.createdAt))}</span>
        </div>
      </div>
    </article>
  `;
}

function renderTrendingSidebar() {
  const listEl = $("trending-list");
  if (!listEl) return;

  const sorted = [...publishedPosts]
    .sort((a, b) => (Number(b.views) || 0) - (Number(a.views) || 0))
    .slice(0, 5);

  if (sorted.length === 0) {
    listEl.innerHTML = `<div style="color:var(--text-secondary);font-size:0.85rem;">لا توجد بيانات قراءة حالياً.</div>`;
    return;
  }

  listEl.innerHTML = sorted
    .map(
      (p, idx) => `
      <div class="trend-item" onclick="window.openArticle('${escapeHTML(p.id)}')">
        <span class="trend-rank" translate="no">${idx + 1}</span>
        <div>
          <div class="trend-title">${escapeHTML(p.title || "")}</div>
          <div class="trend-views">${Number(p.views) || 0} قراءة</div>
        </div>
      </div>
    `
    )
    .join("");
}

// 12. فتح قراءة المقال الكامل وتنسيق النصوص بأمان (Safe Markdown Parser)
function extractYouTubeEmbedUrl(url) {
  if (!url || typeof url !== "string") return null;
  const regExp = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?|shorts)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i;
  const match = url.match(regExp);
  return match && match[1] ? `https://www.youtube.com/embed/${match[1]}?rel=0` : null;
}

function formatSafeParagraph(rawLine) {
  const trimmed = rawLine.trim();
  if (!trimmed) return "";
  if (trimmed === "---") return `<hr>`;

  let safe = escapeHTML(trimmed);

  // تحويل التنسيقات والروابط بعد تعقيم النص ضد حقن الأكواد
  safe = safe
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.*?)\*/g, "<em>$1</em>")
    .replace(/\[(.*?)\]\((.*?)\)/g, (_, label, rawHref) => {
      const cleanHref = sanitizeUrl(rawHref, "");
      if (!cleanHref) return label;
      return `<a href="${escapeHTML(cleanHref)}" target="_blank" rel="noopener" style="color:var(--accent);font-weight:700;">${label}</a>`;
    });

  if (safe.startsWith("### ")) return `<h3>${safe.slice(4)}</h3>`;
  if (safe.startsWith("## ")) return `<h2>${safe.slice(3)}</h2>`;
  if (safe.startsWith("&gt; ")) return `<blockquote>${safe.slice(5)}</blockquote>`;
  if (safe.startsWith("- ")) return `<p>• ${safe.slice(2)}</p>`;
  return `<p>${safe}</p>`;
}

window.openArticle = async (postId, pushHistory = true) => {
  const post = publishedPosts.find((p) => p.id === postId);
  if (!post) return;

  if (pushHistory) {
    window.history.pushState({ postId }, "", `?post=${encodeURIComponent(postId)}`);
  }

  const displayTitle = post.title || "";
  const displaySummary = post.summary || "";
  const displayBodyRaw = post.content || "";
  const displayAuthor = post.author || "هيئة التحرير";
  const displaySiteName = siteSettings.siteName || "بوصلة السياسة اليمنية";

  document.title = `${displayTitle} | ${displaySiteName}`;
  $("og-title")?.setAttribute("content", displayTitle);
  $("og-desc")?.setAttribute("content", displaySummary);

  const shareImage = sanitizeUrl(
    post.imageUrl || siteSettings.ogImageUrl || siteSettings.faviconUrl || siteSettings.logoUrl,
    ""
  );
  if (shareImage) {
    $("og-image")?.setAttribute("content", shareImage);
    $("twitter-image")?.setAttribute("content", shareImage);
  }

  const isFirstSessionView = !hasSessionRecord(SESSION_VIEWS_KEY, post.id);
  const currentViewsCount = (Number(post.views) || 0) + (isFirstSessionView ? 1 : 0);

  setHtml(
    "art-badges",
    `
      <span class="badge-pill">${escapeHTML(getPostCatName(post))}</span>
      ${post.subcategory ? `<span class="badge-pill">${escapeHTML(post.subcategory)}</span>` : ""}
    `
  );
  setText("art-title", displayTitle);
  setText("art-summary", displaySummary);
  setText("art-author", displayAuthor);
  setText("art-date", formatDate(post.createdAt));
  setText("art-views", currentViewsCount);

  const authorMeta = getAuthorMeta(post);
  if ($("art-author-avatar")) $("art-author-avatar").src = authorMeta.avatarUrl;
  $("art-author-verified")?.classList.toggle("hidden", !authorMeta.verified);

  const authorBtn = $("art-author-btn");
  if (authorBtn) {
    authorBtn.onclick = () => window.openAuthorProfile(displayAuthor, post.authorEmail || "");
  }

  const mediaSlot = $("art-media-slot");
  const type = post.postType || "article";
  const coverImg = sanitizeUrl(
    post.imageUrl || siteSettings.ogImageUrl || siteSettings.logoUrl,
    BLANK_SURFACE_SVG
  );

  if (mediaSlot) {
    if ((type === "video" || type === "infographic") && post.videoUrl) {
      const embedUrl = extractYouTubeEmbedUrl(post.videoUrl);
      if (embedUrl) {
        mediaSlot.innerHTML = `
          <div class="video-embed-wrap">
            <iframe src="${escapeHTML(embedUrl)}" title="${escapeHTML(displayTitle)}" allowfullscreen allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"></iframe>
          </div>
        `;
      } else {
        mediaSlot.innerHTML = `<figure class="article-figure"><img src="${escapeHTML(coverImg)}" alt="${escapeHTML(displayTitle)}"></figure>`;
      }
    } else if (type === "podcast" && post.podcastUrl) {
      const safePodUrl = sanitizeUrl(post.podcastUrl, "#");
      const safePlatform = escapeHTML(post.podcastPlatform || "Podcast");
      const safeDuration = post.podcastDuration ? `(${escapeHTML(post.podcastDuration)})` : "";

      mediaSlot.innerHTML = `
        <div class="podcast-player-box">
          <div class="podcast-info-side">
            <img src="${escapeHTML(coverImg)}" alt="${escapeHTML(displayTitle)}" class="podcast-cover">
            <div>
              <span class="badge-pill">🎙️ ${safePlatform}</span>
              <h3 style="margin-top:6px;">حلقة بودكاست صوتية ${safeDuration}</h3>
            </div>
          </div>
          <a href="${escapeHTML(safePodUrl)}" target="_blank" rel="noopener" class="podcast-listen-btn">
            <span class="material-symbols-rounded" translate="no">headphones</span>
            <span>استمع للحلقة كاملة عبر ${safePlatform}</span>
          </a>
        </div>
      `;
    } else if (post.imageUrl) {
      const safePostImg = sanitizeUrl(post.imageUrl, BLANK_SURFACE_SVG);
      mediaSlot.innerHTML = `<figure class="article-figure"><img src="${escapeHTML(safePostImg)}" alt="${escapeHTML(displayTitle)}"></figure>`;
    } else {
      mediaSlot.innerHTML = "";
    }
  }

  const paragraphs = displayBodyRaw
    .split("\n")
    .map(formatSafeParagraph)
    .filter(Boolean);

  const inArticleAd = getAdForPlacement("in_article");
  if (inArticleAd && paragraphs.length >= 2) {
    paragraphs.splice(
      2,
      0,
      `<div class="ad-slot-wrapper">${buildSmartAdHTML(inArticleAd, "ad-dom-in-article")}</div>`
    );
  }

  setHtml("art-body", paragraphs.join(""));
  setHtml(
    "art-tags",
    (Array.isArray(post.tags) ? post.tags : [])
      .map((tag) => `<span class="tag-chip">#${escapeHTML(tag)}</span>`)
      .join("")
  );

  const shareUrl = window.location.href;
  const shareTitle = `${displayTitle} - ${displaySiteName}`;

  if ($("share-wa")) {
    $("share-wa").onclick = () =>
      window.open(`https://wa.me/?text=${encodeURIComponent(shareTitle + "\n" + shareUrl)}`, "_blank");
  }
  if ($("share-x")) {
    $("share-x").onclick = () =>
      window.open(
        `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareTitle)}&url=${encodeURIComponent(shareUrl)}`,
        "_blank"
      );
  }
  if ($("share-tg")) {
    $("share-tg").onclick = () =>
      window.open(
        `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareTitle)}`,
        "_blank"
      );
  }
  if ($("share-copy")) {
    $("share-copy").onclick = async () => {
      try {
        await navigator.clipboard.writeText(shareUrl);
        showPublicToast("تم نسخ رابط المادة بنجاح");
      } catch (e) {
        showPublicToast("تعذر نسخ الرابط تلقائياً");
      }
    };
  }

  const related = publishedPosts
    .filter((p) => p.id !== post.id && p.category === post.category)
    .slice(0, 3);
  setHtml("related-grid", related.map(createCardHTML).join(""));

  showView("view-article");
  window.scrollTo({ top: 0, behavior: "smooth" });

  if (isFirstSessionView) {
    addSessionRecord(SESSION_VIEWS_KEY, post.id);
    post.views = currentViewsCount;
    try {
      await updateDoc(doc(db, "posts", post.id), { views: increment(1) });
    } catch (e) {}
  }
};

// 13. صفحة الملف الشخصي للكاتب / الصحفي الموثق (Author Profile View)
window.openAuthorProfile = async (authorName, authorEmail = "") => {
  const samplePost =
    publishedPosts.find(
      (p) =>
        (authorEmail && (p.authorEmail || "").toLowerCase() === authorEmail.toLowerCase()) ||
        p.author === authorName
    ) || { author: authorName, authorEmail };

  const meta = getAuthorMeta(samplePost);
  const authorPosts = publishedPosts.filter(
    (p) =>
      (authorEmail && (p.authorEmail || "").toLowerCase() === authorEmail.toLowerCase()) ||
      (p.author || "هيئة التحرير") === authorName
  );

  if ($("profile-author-avatar")) $("profile-author-avatar").src = meta.avatarUrl;
  setText("profile-author-name", authorName);
  $("profile-author-verified")?.classList.toggle("hidden", !meta.verified);
  setText("profile-author-job", meta.jobTitle || "");
  setText("profile-author-bio", meta.bio || "");
  setText("profile-author-count", `إجمالي المواد المنشورة: ${authorPosts.length}`);

  const socialHtml = [];
  if (meta.socialX) {
    socialHtml.push(`<a href="${escapeHTML(meta.socialX)}" target="_blank" rel="noopener" class="social-pill">X / Twitter</a>`);
  }
  if (meta.socialFb) {
    socialHtml.push(`<a href="${escapeHTML(meta.socialFb)}" target="_blank" rel="noopener" class="social-pill">الرابط الشخصي</a>`);
  }
  setHtml("profile-author-socials", socialHtml.join(""));

  setHtml("author-posts-grid", authorPosts.map(createCardHTML).join(""));
  showView("view-author");
  window.scrollTo({ top: 0, behavior: "smooth" });
};

// 14. فتح الصفحات القانونية الثابتة ("من نحن" و"سياسة الخصوصية")
window.openStaticPage = async (pageType) => {
  closeSidebarDrawer();
  window.history.pushState({ pageType }, "", `?page=${encodeURIComponent(pageType)}`);

  const displayNetName = siteSettings.networkName || "شبكة البوصلة";
  setText("static-page-badge", displayNetName);

  const isAbout = pageType === "about";
  const title = isAbout ? "من نحن" : "سياسة الخصوصية";
  const rawContent = isAbout
    ? siteSettings.aboutContent || `## من نحن\n\n${siteSettings.siteDesc || ""}`
    : siteSettings.privacyContent || `## سياسة الخصوصية\n\n${siteSettings.siteDesc || ""}`;

  setText("static-page-title", title);

  const html = rawContent
    .split("\n")
    .map(formatSafeParagraph)
    .filter(Boolean)
    .join("");

  const safeEmail = (siteSettings.contactEmail || "").trim();
  const safePhone = (siteSettings.contactPhone || "").trim();

  const contactBlock =
    safeEmail || safePhone
      ? `
    <hr>
    <h3>للتواصل والإعلانات الرسمية</h3>
    ${
      safeEmail
        ? `<p>📧 البريد الإلكتروني: <a href="mailto:${escapeHTML(safeEmail)}" style="color:var(--accent);font-weight:700;">${escapeHTML(safeEmail)}</a></p>`
        : ""
    }
    ${
      safePhone
        ? `<p>📞 واتساب / هاتف: <strong dir="ltr">${escapeHTML(safePhone)}</strong></p>`
        : ""
    }
  `
      : "";

  setHtml("static-page-body", html + contactBlock);
  showView("view-static");
  window.scrollTo({ top: 0, behavior: "smooth" });
};

// 15. التوجيه، الإشعارات، والتشغيل الرئيسي المعزول ضد الأخطاء
function showView(viewId) {
  document.querySelectorAll(".view-section").forEach((v) => v.classList.add("hidden"));
  $(viewId)?.classList.remove("hidden");
}

function formatDate(ts) {
  if (!ts || !ts.seconds) return "الآن";
  try {
    const d = new Date(ts.seconds * 1000);
    return d.toLocaleDateString("ar-YE", {
      year: "numeric",
      month: "short",
      day: "numeric"
    });
  } catch (e) {
    return "الآن";
  }
}

function showPublicToast(msg) {
  const toast = $("public-toast");
  if (!toast) return;
  toast.textContent = msg;
  toast.classList.remove("hidden");
  clearTimeout(window._boslaToastTimer);
  window._boslaToastTimer = setTimeout(() => toast.classList.add("hidden"), 3500);
}

async function handleUrlRouting() {
  const params = new URLSearchParams(window.location.search);
  const postId = params.get("post");
  const pageId = params.get("page");

  if (postId && publishedPosts.some((p) => p.id === postId)) {
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

  // استخدام allSettled يضمن استمرار الموقع حتى لو تأخر أحد الأقسام الفرعية
  await Promise.allSettled([
    fetchSettings(),
    fetchCategories(),
    fetchStaffDirectory(),
    fetchAds(),
    fetchPublishedPosts()
  ]);

  applyIdentitySettings();
  renderCategoriesNav();
  renderSidebarMenu();
  renderTopBannerAd();
  await handleUrlRouting();
  setTimeout(updateMobileNavPill, 150);
}

initPublicSite();
