/**
 * login.js — MATRIX FinTech Club Portal Authentication Controller
 *
 * Manages Student and Admin login modes, smooth transitions,
 * input validation, session persistence, and registration modal triggers.
 */

(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', function () {
    // --- DOM Elements ---
    const studentCard = document.getElementById('studentLoginCard');
    const adminCard = document.getElementById('adminLoginCard');

    const studentForm = document.getElementById('studentLoginForm');
    const adminForm = document.getElementById('adminLoginForm');

    const studentEmailInput = document.getElementById('studentEmailInput');
    const adminIdInput = document.getElementById('adminIdInput');

    const studentEmailError = document.getElementById('studentEmailError');
    const adminIdError = document.getElementById('adminIdError');

    const switchToAdminBtn = document.getElementById('switchToAdminBtn');
    const switchToStudentBtn = document.getElementById('switchToStudentBtn');

    const triggerJoinUsModal = document.getElementById('triggerJoinUsModal');
    const joinModalBackdrop = document.getElementById('joinModalBackdrop');
    const closeJoinModalBtn = document.getElementById('closeJoinModalBtn');
    const closeSuccessBtn = document.getElementById('closeSuccessBtn');
    const joinSpreadsheetForm = document.getElementById('joinSpreadsheetForm');
    const joinSuccessState = document.getElementById('joinSuccessState');

    // Email validation helper
    function isValidEmail(email) {
      const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return re.test(email);
    }

    // Set and clear field errors
    function setFieldError(errorElement, inputElement, message) {
      if (errorElement) errorElement.textContent = message;
      if (inputElement) inputElement.classList.add('portal-input-error');
    }

    function clearFieldError(errorElement, inputElement) {
      if (errorElement) errorElement.textContent = '';
      if (inputElement) inputElement.classList.remove('portal-input-error');
    }

    // Clear error on typing
    if (studentEmailInput) {
      studentEmailInput.addEventListener('input', function () {
        clearFieldError(studentEmailError, studentEmailInput);
      });
    }

    if (adminIdInput) {
      adminIdInput.addEventListener('input', function () {
        clearFieldError(adminIdError, adminIdInput);
      });
    }

    // --- Mode Switching Transitions ---
    function switchMode(hideCard, showCard, focusInput) {
      if (!hideCard || !showCard) return;

      // Exit transition
      hideCard.classList.remove('card-active');
      hideCard.classList.add('card-exit');

      setTimeout(function () {
        hideCard.style.display = 'none';
        hideCard.classList.remove('card-exit');

        // Enter transition
        showCard.style.display = 'block';
        showCard.classList.add('card-enter');

        // Trigger reflow for transition
        void showCard.offsetWidth;

        showCard.classList.remove('card-enter');
        showCard.classList.add('card-active');

        if (focusInput) {
          focusInput.focus();
        }
      }, 200);
    }

    if (switchToAdminBtn) {
      switchToAdminBtn.addEventListener('click', function (e) {
        e.preventDefault();
        clearFieldError(studentEmailError, studentEmailInput);
        switchMode(studentCard, adminCard, adminIdInput);
      });
    }

    if (switchToStudentBtn) {
      switchToStudentBtn.addEventListener('click', function (e) {
        e.preventDefault();
        clearFieldError(adminIdError, adminIdInput);
        switchMode(adminCard, studentCard, studentEmailInput);
      });
    }

    // --- Student Login Handler ---
    if (studentForm) {
      studentForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const email = studentEmailInput ? studentEmailInput.value.trim() : '';

        if (!email) {
          setFieldError(studentEmailError, studentEmailInput, 'Please enter your registered email id.');
          if (studentEmailInput) studentEmailInput.focus();
          return;
        }

        if (!isValidEmail(email)) {
          setFieldError(studentEmailError, studentEmailInput, 'Please enter a valid email address (e.g. your.name@gmail.com).');
          if (studentEmailInput) studentEmailInput.focus();
          return;
        }

        clearFieldError(studentEmailError, studentEmailInput);

        // Store mock session in portal-store
        if (window.PortalStore && typeof window.PortalStore.setCurrentUser === 'function') {
          window.PortalStore.setCurrentUser({
            role: 'student',
            email: email
          });
        }

        const submitBtn = document.getElementById('studentLoginBtn');
        if (submitBtn) {
          submitBtn.disabled = true;
          submitBtn.innerHTML = 'SIGNING IN <span class="arrow">→</span>';
        }

        // Navigate to student portal
        window.location.href = 'student-portal.html';
      });
    }

    // --- Admin Login Handler ---
    if (adminForm) {
      adminForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const adminId = adminIdInput ? adminIdInput.value.trim() : '';

        if (!adminId) {
          setFieldError(adminIdError, adminIdInput, 'Please enter your administrator identifier or email.');
          if (adminIdInput) adminIdInput.focus();
          return;
        }

        clearFieldError(adminIdError, adminIdInput);

        // Store mock admin session in portal-store
        if (window.PortalStore && typeof window.PortalStore.setCurrentUser === 'function') {
          window.PortalStore.setCurrentUser({
            role: 'admin',
            email: adminId
          });
        }

        const submitBtn = document.getElementById('adminLoginBtn');
        if (submitBtn) {
          submitBtn.disabled = true;
          submitBtn.innerHTML = 'ACCESSING PORTAL <span class="arrow">→</span>';
        }

        // Navigate to admin portal
        window.location.href = 'admin-portal.html';
      });
    }

    // --- Registration Modal Integration ---
    function openRegistrationModal(e) {
      if (e) e.preventDefault();
      if (!joinModalBackdrop) return;
      joinModalBackdrop.classList.add('active');
      joinModalBackdrop.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
      if (joinSuccessState) joinSuccessState.style.display = 'none';
      if (joinSpreadsheetForm) joinSpreadsheetForm.style.display = 'block';
    }

    function closeRegistrationModal() {
      if (!joinModalBackdrop) return;
      joinModalBackdrop.classList.remove('active');
      joinModalBackdrop.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }

    if (triggerJoinUsModal) {
      triggerJoinUsModal.addEventListener('click', openRegistrationModal);
    }

    if (closeJoinModalBtn) {
      closeJoinModalBtn.addEventListener('click', closeRegistrationModal);
    }

    if (closeSuccessBtn) {
      closeSuccessBtn.addEventListener('click', closeRegistrationModal);
    }

    if (joinModalBackdrop) {
      joinModalBackdrop.addEventListener('click', function (e) {
        if (e.target === joinModalBackdrop) {
          closeRegistrationModal();
        }
      });
    }

    window.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && joinModalBackdrop && joinModalBackdrop.classList.contains('active')) {
        closeRegistrationModal();
      }
    });

    if (joinSpreadsheetForm) {
      joinSpreadsheetForm.addEventListener('submit', function (e) {
        e.preventDefault();

        // Extract complete canonical Join Us form fields
        const memberData = {
          name: document.getElementById('studentName') ? document.getElementById('studentName').value : '',
          regNumber: document.getElementById('regNumber') ? document.getElementById('regNumber').value : '',
          rollNumber: document.getElementById('rollNumber') ? document.getElementById('rollNumber').value : '',
          school: document.getElementById('studentSchool') ? document.getElementById('studentSchool').value : '',
          department: document.getElementById('studentDept') ? document.getElementById('studentDept').value : '',
          section: document.getElementById('studentSection') ? document.getElementById('studentSection').value : '',
          currentYear: document.getElementById('currentYear') ? document.getElementById('currentYear').value : '',
          contactNumber: document.getElementById('contactNumber') ? document.getElementById('contactNumber').value : '',
          gmail: document.getElementById('regModalEmail') ? document.getElementById('regModalEmail').value : '',
          interestedDomain: document.getElementById('interestedDomain') ? document.getElementById('interestedDomain').value : ''
        };

        if (window.PortalStore && typeof window.PortalStore.saveMember === 'function') {
          window.PortalStore.saveMember(memberData);
        }

        // Set student session immediately upon successful registration
        if (window.PortalStore && typeof window.PortalStore.setCurrentUser === 'function') {
          window.PortalStore.setCurrentUser({
            role: 'student',
            email: memberData.gmail
          });
        }

        const submitBtn = joinSpreadsheetForm.querySelector('.join-submit-btn');
        if (submitBtn) {
          submitBtn.disabled = true;
          submitBtn.innerHTML = 'REGISTERING & ACCESSING PORTAL <span class="arrow">→</span>';
        }

        setTimeout(function () {
          // Direct redirect to student portal (Dashboard) without second login
          window.location.href = 'student-portal.html';
        }, 400);
      });
    }

  });
})();
