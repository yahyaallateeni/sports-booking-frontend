
(function () {

  'use strict';



  function setupMobileMenu() {

    const toggle = document.querySelector('[data-menu-toggle]');

    const nav = document.querySelector('.nav-links');



    if (!toggle || !nav) return;



    toggle.addEventListener('click', function () {

      nav.classList.toggle('open');

    });

  }



  function setupAutoYear() {

    const yearEls = document.querySelectorAll('[data-current-year]');

    if (!yearEls.length) return;



    const year = new Date().getFullYear();

    yearEls.forEach((el) => {

      el.textContent = String(year);

    });

  }



  function getStoredUser() {

    const localUser = localStorage.getItem('currentUser');

    const sessionUser = sessionStorage.getItem('currentUser');

    const rawUser = localUser || sessionUser;



    if (!rawUser) return null;



    try {

      return JSON.parse(rawUser);

    } catch {

      return null;

    }

  }



  function isAuthenticated() {

    return (

      localStorage.getItem('isAuthenticated') === 'true' ||

      sessionStorage.getItem('isAuthenticated') === 'true'

    );

  }



  function logout() {

    localStorage.removeItem('accessToken');

    localStorage.removeItem('refreshToken');

    localStorage.removeItem('currentUser');

    localStorage.removeItem('isAuthenticated');

    localStorage.removeItem('registeredUserId');

    localStorage.removeItem('registeredAccountType');



    sessionStorage.removeItem('accessToken');

    sessionStorage.removeItem('refreshToken');

    sessionStorage.removeItem('currentUser');

    sessionStorage.removeItem('isAuthenticated');



    window.location.href = '/login/';

  }



  function getLinksForRole(accountType, loggedIn) {

    if (!loggedIn) {

      return [

        { href: '/', label: 'الرئيسية' },

        { href: '/venues/', label: 'الملاعب' },

        { href: '/booking/', label: 'الحجز' }

      ];

    }



    if (accountType === 'ADMIN') {

      return [

        { href: '/', label: 'الرئيسية' },

        { href: '/admin/', label: 'لوحة الأدمن' },

        { href: '/admin/bookings/', label: 'الحجوزات' },

        { href: '/venues/', label: 'الملاعب' },

        { href: '/profile/', label: 'حسابي' }

      ];

    }



    if (accountType === 'OWNER') {

      return [

        { href: '/', label: 'الرئيسية' },

        { href: '/owner/', label: 'لوحة المالك' },

        { href: '/owner/venues-management/', label: 'إدارة الملاعب' },

        { href: '/owner/bookings/', label: 'حجوزات ملاعبي' },

        { href: '/profile/', label: 'حسابي' }

      ];

    }



    return [

      { href: '/', label: 'الرئيسية' },

      { href: '/venues/', label: 'الملاعب' },

      { href: '/booking/', label: 'الحجز' },

      { href: '/customer/bookings/', label: 'حجوزاتي' },

      { href: '/profile/', label: 'حسابي' }

    ];

  }



  function isActiveLink(href) {

    const path = window.location.pathname;



    if (href === '/') {

      return path === '/';

    }



    return path === href || path.startsWith(href);

  }



  function setupRoleNavigation() {

    const nav = document.querySelector('.nav-links');

    const navActions = document.querySelector('.nav-actions');



    const user = getStoredUser();

    const loggedIn = Boolean(user) && isAuthenticated();

    const accountType = String(user?.accountType || 'CUSTOMER').toUpperCase();



    if (nav) {

      const links = getLinksForRole(accountType, loggedIn);



      nav.innerHTML = links

        .map((link) => {

          const activeClass = isActiveLink(link.href) ? ' active' : '';

          return `<a class="nav-link${activeClass}" href="${link.href}">${link.label}</a>`;

        })

        .join('');

    }



    if (navActions) {

      if (loggedIn) {

        navActions.innerHTML = `

          <a class="btn btn-secondary" href="/profile/">حسابي</a>

          <button id="logout-btn" class="btn btn-primary" type="button">تسجيل الخروج</button>

        `;



        const logoutBtn = document.getElementById('logout-btn');

        if (logoutBtn) {

          logoutBtn.addEventListener('click', logout);

        }



        return;

      }



      navActions.innerHTML = `

        <a class="btn btn-secondary" href="/login/">الدخول</a>

        <a class="btn btn-primary" href="/register/">إنشاء حساب</a>

      `;

    }

  }



  document.addEventListener('DOMContentLoaded', function () {

    setupMobileMenu();

    setupAutoYear();

    setupRoleNavigation();

  });

})();

