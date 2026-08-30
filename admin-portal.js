/**
 * admin-portal.js — MATRIX FinTech Club Admin Portal Controller
 *
 * Manages administrative event listing, event detail inspection, registered student resolution,
 * event creation, event editing, All Members directory, and Member Profile Editing via PortalStore.
 */

(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', function () {
    // --- 1. Admin Session Validation ---
    const currentUser = window.PortalStore ? window.PortalStore.getCurrentUser() : null;

    if (!currentUser || currentUser.role !== 'admin') {
      // Redirect unauthenticated user or non-admin to login page
      window.location.href = 'login.html';
      return;
    }

    const adminEmail = currentUser.email;

    // Update Header Identity Badge
    const adminEmailDisplay = document.getElementById('adminEmailDisplay');
    const adminAvatar = document.getElementById('adminAvatar');
    if (adminEmailDisplay) adminEmailDisplay.textContent = adminEmail;
    if (adminAvatar) adminAvatar.textContent = adminEmail.charAt(0).toUpperCase();

    // --- 2. DOM References ---
    const adminEventsContainer = document.getElementById('adminEventsContainer');
    const adminEmptyState = document.getElementById('adminEmptyState');
    const headerCreateEventBtn = document.getElementById('headerCreateEventBtn');
    const emptyCreateEventBtn = document.getElementById('emptyCreateEventBtn');

    // Create & Edit Shared Event Form Modal
    const eventFormModal = document.getElementById('eventFormModal');
    const closeFormModalBtn = document.getElementById('closeFormModalBtn');
    const modalFormBadge = document.getElementById('modalFormBadge');
    const modalFormTitle = document.getElementById('modalFormTitle');
    const modalFormSubtitle = document.getElementById('modalFormSubtitle');
    const adminEventForm = document.getElementById('adminEventForm');
    const editingEventId = document.getElementById('editingEventId');

    const eventTitle = document.getElementById('eventTitle');
    const eventType = document.getElementById('eventType');
    const eventTime = document.getElementById('eventTime');
    const eventVenue = document.getElementById('eventVenue');
    const eventBanner = document.getElementById('eventBanner');
    const eventDescription = document.getElementById('eventDescription');

    const adminFormError = document.getElementById('adminFormError');
    const eventSubmitBtn = document.getElementById('eventSubmitBtn');

    // Overlaid Admin Event Detail & Registered Students Modal
    const adminEventDetailModal = document.getElementById('adminEventDetailModal');
    const closeAdminDetailModalBtn = document.getElementById('closeAdminDetailModalBtn');
    const adminDetailBanner = document.getElementById('adminDetailBanner');
    const adminDetailTypeBadge = document.getElementById('adminDetailTypeBadge');
    const adminDetailTitle = document.getElementById('adminDetailTitle');
    const adminDetailTime = document.getElementById('adminDetailTime');
    const adminDetailVenue = document.getElementById('adminDetailVenue');
    const adminDetailDescription = document.getElementById('adminDetailDescription');
    const adminDetailEditBtn = document.getElementById('adminDetailEditBtn');
    const adminDetailStudentsBtn = document.getElementById('adminDetailStudentsBtn');
    const registeredStudentsCount = document.getElementById('registeredStudentsCount');
    const registeredStudentsPanel = document.getElementById('registeredStudentsPanel');
    const registeredCountBadge = document.getElementById('registeredCountBadge');
    const registeredStudentsList = document.getElementById('registeredStudentsList');
    const registeredStudentsEmptyState = document.getElementById('registeredStudentsEmptyState');

    // Edit Member Profile Modal References
    const memberFormModal = document.getElementById('memberFormModal');
    const closeMemberModalBtn = document.getElementById('closeMemberModalBtn');
    const adminMemberForm = document.getElementById('adminMemberForm');
    const editingMemberEmail = document.getElementById('editingMemberEmail');

    const editMemberName = document.getElementById('editMemberName');
    const editMemberGmail = document.getElementById('editMemberGmail');
    const editMemberRegNumber = document.getElementById('editMemberRegNumber');
    const editMemberRollNumber = document.getElementById('editMemberRollNumber');
    const editMemberSchool = document.getElementById('editMemberSchool');
    const editMemberDept = document.getElementById('editMemberDept');
    const editMemberSection = document.getElementById('editMemberSection');
    const editMemberCurrentYear = document.getElementById('editMemberCurrentYear');
    const editMemberContact = document.getElementById('editMemberContact');
    const editMemberInterestedDomain = document.getElementById('editMemberInterestedDomain');
    const adminMemberFormError = document.getElementById('adminMemberFormError');

    // --- Admin Session Recordings References ---
    const uploadSessionBtn = document.getElementById('uploadSessionBtn');
    const emptyUploadSessionBtn = document.getElementById('emptyUploadSessionBtn');
    const adminRecordingsGrid = document.getElementById('adminRecordingsGrid');
    const adminRecordingsEmptyState = document.getElementById('adminRecordingsEmptyState');

    // Upload & Edit Session Form Modal References
    const sessionFormModal = document.getElementById('sessionFormModal');
    const closeSessionModalBtn = document.getElementById('closeSessionModalBtn');
    const sessionModalBadge = document.getElementById('sessionModalBadge');
    const sessionModalTitle = document.getElementById('sessionModalTitle');
    const sessionModalSubtitle = document.getElementById('sessionModalSubtitle');
    const adminSessionForm = document.getElementById('adminSessionForm');
    const editingSessionId = document.getElementById('editingSessionId');

    const sessionTitle = document.getElementById('sessionTitle');
    const sessionType = document.getElementById('sessionType');
    const sessionDuration = document.getElementById('sessionDuration');
    const sessionDate = document.getElementById('sessionDate');
    const sessionSpeaker = document.getElementById('sessionSpeaker');
    const sessionVideoUrl = document.getElementById('sessionVideoUrl');
    const sessionDescription = document.getElementById('sessionDescription');
    const sessionTakeaways = document.getElementById('sessionTakeaways');
    const sessionFormError = document.getElementById('sessionFormError');
    const sessionSubmitBtn = document.getElementById('sessionSubmitBtn');

    // Recording Preview Player Modal References
    const recordingModal = document.getElementById('recordingModal');
    const closeRecordingModalBtn = document.getElementById('closeRecordingModalBtn');
    const playerPlayBtn = document.getElementById('playerPlayBtn');
    const playerPlayIcon = document.getElementById('playerPlayIcon');
    const playerStateLabel = document.getElementById('playerStateLabel');
    const playerProgressWrap = document.getElementById('playerProgressWrap');
    const playerProgressFill = document.getElementById('playerProgressFill');
    const playerCurrentTime = document.getElementById('playerCurrentTime');
    const playerTotalDuration = document.getElementById('playerTotalDuration');
    const playerCategoryBadge = document.getElementById('playerCategoryBadge');

    const recordingTypeBadge = document.getElementById('recordingTypeBadge');
    const recordingDate = document.getElementById('recordingDate');
    const recordingDuration = document.getElementById('recordingDuration');
    const recordingTitle = document.getElementById('recordingTitle');
    const recordingSpeaker = document.getElementById('recordingSpeaker');
    const recordingDescription = document.getElementById('recordingDescription');
    const recordingTakeawaysList = document.getElementById('recordingTakeawaysList');

    // Admin Activity Metrics Display Elements
    const adminTotalTime = document.getElementById('adminTotalTime');
    const adminWebsiteTime = document.getElementById('adminWebsiteTime');
    const adminRecordingTime = document.getElementById('adminRecordingTime');
    const adminSessionsCount = document.getElementById('adminSessionsCount');
    const adminEventsPublishedCount = document.getElementById('adminEventsPublishedCount');

    let activeAdminDetailEventId = null;
    let currentAdminTab = 'events'; // 'events' | 'members'
    let activeRecording = null;
    let isPlaying = false;
    let currentPlaySec = 0;

    // --- Admin Activity Heartbeat State ---
    let adminActivity = window.PortalStore ? window.PortalStore.getStudentActivity(adminEmail) : null;
    let deltaWebSec = 0;
    let deltaRecSec = 0;

    function formatDuration(totalSeconds) {
      const sec = Math.max(0, Number(totalSeconds) || 0);
      const hrs = Math.floor(sec / 3600);
      const mins = Math.floor((sec % 3600) / 60);
      const paddedHrs = String(hrs).padStart(2, '0');
      const paddedMins = String(mins).padStart(2, '0');
      return `${paddedHrs}h ${paddedMins}m`;
    }

    function formatTimeCode(totalSeconds) {
      const sec = Math.max(0, Number(totalSeconds) || 0);
      const mins = Math.floor(sec / 60);
      const remSec = Math.floor(sec % 60);
      return `${String(mins).padStart(2, '0')}:${String(remSec).padStart(2, '0')}`;
    }

    function renderAdminActivityMetrics() {
      if (!adminActivity) return;
      const currentTotalSec = (adminActivity.totalSeconds || 0) + deltaWebSec + deltaRecSec;
      const currentWebSec = (adminActivity.websiteSeconds || 0) + deltaWebSec;
      const currentRecSec = (adminActivity.recordingSeconds || 0) + deltaRecSec;
      const sessionsCount = (adminActivity.sessionsWatched || 0);
      const publishedCount = window.PortalStore ? (window.PortalStore.getEvents() || []).length : 0;

      if (adminTotalTime) adminTotalTime.textContent = formatDuration(currentTotalSec);
      if (adminWebsiteTime) adminWebsiteTime.textContent = formatDuration(currentWebSec);
      if (adminRecordingTime) adminRecordingTime.textContent = formatDuration(currentRecSec);
      if (adminSessionsCount) adminSessionsCount.textContent = `${sessionsCount} masterclass sessions reviewed.`;
      if (adminEventsPublishedCount) adminEventsPublishedCount.textContent = `${publishedCount}`;
    }

    function flushAdminActivityToStore() {
      if (deltaWebSec === 0 && deltaRecSec === 0) return;
      if (window.PortalStore && typeof window.PortalStore.updateStudentActivity === 'function') {
        adminActivity = window.PortalStore.updateStudentActivity(adminEmail, deltaWebSec, deltaRecSec, false);
        deltaWebSec = 0;
        deltaRecSec = 0;
      }
    }

    // Active Heartbeat Timer (1s)
    setInterval(function () {
      if (document.hidden) return;

      if (isPlaying) {
        deltaRecSec += 1;
        currentPlaySec += 1;
        const totalSec = activeRecording ? (activeRecording.durationSec || 3240) : 3240;
        if (currentPlaySec >= totalSec) {
          currentPlaySec = totalSec;
          isPlaying = false;
          if (playerPlayIcon) playerPlayIcon.textContent = '▶';
          if (playerStateLabel) playerStateLabel.textContent = 'Session Preview Completed';
        }
        if (playerCurrentTime) playerCurrentTime.textContent = formatTimeCode(currentPlaySec);
        if (playerProgressFill) playerProgressFill.style.width = ((currentPlaySec / totalSec) * 100) + '%';
      } else {
        deltaWebSec += 1;
      }

      renderAdminActivityMetrics();

      if (deltaWebSec + deltaRecSec >= 10) {
        flushAdminActivityToStore();
      }
    }, 1000);

    document.addEventListener('visibilitychange', function () {
      if (document.hidden) {
        flushAdminActivityToStore();
      }
    });

    window.addEventListener('beforeunload', function () {
      flushAdminActivityToStore();
    });

    // --- 3. Render Admin Event Management Feed ---
    function renderAdminEvents() {
      if (!window.PortalStore || !adminEventsContainer) return;
      const events = window.PortalStore.getEvents();

      if (!events || events.length === 0) {
        adminEventsContainer.style.display = 'none';
        if (adminEmptyState) adminEmptyState.style.display = 'block';
        return;
      }

      adminEventsContainer.style.display = 'grid';
      if (adminEmptyState) adminEmptyState.style.display = 'none';

      adminEventsContainer.innerHTML = events.map(function (evt, index) {
        const themeClass = index % 2 === 0 ? 'theme-white' : 'theme-black';

        return `
          <div class="event-card reveal-up revealed ${themeClass}" data-id="${evt.id}">
            <div class="portal-card-banner" style="background: ${evt.banner || 'linear-gradient(135deg, #0f172a, #1e293b)'};">
              <span class="event-category">${evt.type || 'Event'}</span>
            </div>
            <div class="event-body">
              <h3 class="event-name">${evt.title}</h3>
              <div class="event-meta">
                <span>📅 ${evt.time}</span>
                <span>📍 ${evt.venue}</span>
              </div>
              <p class="event-desc">${evt.description}</p>
              <div class="portal-card-actions">
                <button type="button" class="text-link view-admin-details-btn" data-id="${evt.id}">
                  View Details →
                </button>
                <button type="button" class="btn btn-secondary edit-event-btn" data-id="${evt.id}">
                  Edit Event →
                </button>
              </div>
            </div>
          </div>
        `;
      }).join('');
    }

    // --- 4. Edit Member Profile Modal Logic ---
    function openEditMemberForm(email) {
      if (!window.PortalStore || !adminMemberForm || !memberFormModal) return;
      const stu = window.PortalStore.getMemberByEmail(email);
      if (!stu) return;

      if (editingMemberEmail) editingMemberEmail.value = email;
      if (editMemberName) editMemberName.value = stu.name || '';
      if (editMemberGmail) editMemberGmail.value = stu.gmail || stu.email || email;
      if (editMemberRegNumber) editMemberRegNumber.value = stu.regNumber || '';
      if (editMemberRollNumber) editMemberRollNumber.value = stu.rollNumber || '';
      if (editMemberSchool) editMemberSchool.value = stu.school || '';
      if (editMemberDept) editMemberDept.value = stu.department || '';
      if (editMemberSection) editMemberSection.value = stu.section || '';
      if (editMemberCurrentYear) editMemberCurrentYear.value = stu.currentYear || '1st Year';
      if (editMemberContact) editMemberContact.value = stu.contactNumber || '';
      if (editMemberInterestedDomain) editMemberInterestedDomain.value = stu.interestedDomain || 'Quantitative Finance & Algo';
      if (adminMemberFormError) adminMemberFormError.textContent = '';

      memberFormModal.classList.add('active');
      memberFormModal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
      if (editMemberName) editMemberName.focus();
    }

    function closeMemberModal() {
      if (!memberFormModal) return;
      memberFormModal.classList.remove('active');
      memberFormModal.setAttribute('aria-hidden', 'true');
      if (!activeAdminDetailEventId) {
        document.body.style.overflow = '';
      }
      if (editingMemberEmail) editingMemberEmail.value = '';
      if (adminMemberFormError) adminMemberFormError.textContent = '';
    }

    if (closeMemberModalBtn) {
      closeMemberModalBtn.addEventListener('click', closeMemberModal);
    }

    if (memberFormModal) {
      memberFormModal.addEventListener('click', function (e) {
        if (e.target === memberFormModal) {
          closeMemberModal();
        }
      });
    }

    if (adminMemberForm) {
      adminMemberForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const email = editingMemberEmail ? editingMemberEmail.value.trim() : '';
        const name = editMemberName ? editMemberName.value.trim() : '';
        const regNumber = editMemberRegNumber ? editMemberRegNumber.value.trim() : '';
        const rollNumber = editMemberRollNumber ? editMemberRollNumber.value.trim() : '';
        const school = editMemberSchool ? editMemberSchool.value.trim() : '';
        const department = editMemberDept ? editMemberDept.value.trim() : '';
        const section = editMemberSection ? editMemberSection.value.trim() : '';
        const currentYear = editMemberCurrentYear ? editMemberCurrentYear.value.trim() : '';
        const contactNumber = editMemberContact ? editMemberContact.value.trim() : '';
        const interestedDomain = editMemberInterestedDomain ? editMemberInterestedDomain.value.trim() : '';

        if (!name || !regNumber || !rollNumber || !school || !department || !section || !contactNumber) {
          if (adminMemberFormError) adminMemberFormError.textContent = 'Please fill in all required fields.';
          return;
        }

        if (adminMemberFormError) adminMemberFormError.textContent = '';

        window.PortalStore.saveMember({
          gmail: email,
          name: name,
          regNumber: regNumber,
          rollNumber: rollNumber,
          school: school,
          department: department,
          section: section,
          currentYear: currentYear,
          contactNumber: contactNumber,
          interestedDomain: interestedDomain
        });

        closeMemberModal();
        if (activeAdminDetailEventId) {
          renderRegisteredStudents(activeAdminDetailEventId);
        }
      });
    }

    // --- 7. Admin Event Details & Registered Students Presentation ---
    function openAdminDetailModal(eventId) {
      if (!window.PortalStore || !adminEventDetailModal) return;
      const evt = window.PortalStore.getEventById(eventId);
      if (!evt) return;

      activeAdminDetailEventId = eventId;
      const registeredStudents = window.PortalStore.getRegisteredStudentsForEvent(eventId);

      if (adminDetailTitle) adminDetailTitle.textContent = evt.title;
      if (adminDetailTypeBadge) adminDetailTypeBadge.textContent = evt.type || 'EVENT';
      if (adminDetailTime) adminDetailTime.textContent = '📅 ' + evt.time;
      if (adminDetailVenue) adminDetailVenue.textContent = '📍 ' + evt.venue;
      if (adminDetailDescription) adminDetailDescription.textContent = evt.description;

      if (adminDetailBanner) {
        adminDetailBanner.style.background = evt.banner || 'linear-gradient(135deg, #0f172a, #1e293b)';
      }

      if (registeredStudentsCount) {
        registeredStudentsCount.textContent = registeredStudents.length;
      }

      // Hide students panel initially until toggled by button
      if (registeredStudentsPanel) {
        registeredStudentsPanel.style.display = 'none';
      }

      adminEventDetailModal.classList.add('active');
      adminEventDetailModal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    }

    function closeAdminDetailModal() {
      if (!adminEventDetailModal) return;
      adminEventDetailModal.classList.remove('active');
      adminEventDetailModal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
      activeAdminDetailEventId = null;
    }

    function renderRegisteredStudents(eventId) {
      if (!window.PortalStore || !registeredStudentsList) return;
      const students = window.PortalStore.getRegisteredStudentsForEvent(eventId);

      if (registeredCountBadge) {
        registeredCountBadge.textContent = students.length + (students.length === 1 ? ' Student' : ' Students');
      }

      if (!students || students.length === 0) {
        registeredStudentsList.innerHTML = '';
        if (registeredStudentsEmptyState) registeredStudentsEmptyState.style.display = 'block';
        return;
      }

      if (registeredStudentsEmptyState) registeredStudentsEmptyState.style.display = 'none';

      registeredStudentsList.innerHTML = students.map(function (stu) {
        return `
          <div class="portal-student-card">
            <div class="portal-student-card-header">
              <div class="portal-student-identity">
                <h4 class="portal-student-name">${stu.name || 'Club Member'}</h4>
                <span class="portal-student-email">${stu.gmail || stu.email}</span>
              </div>
              <span class="event-category" style="background: #f1f5f9; color: #0f172a; border: 1px solid #cbd5e1;">
                ${stu.interestedDomain || 'General Domain'}
              </span>
            </div>
            
            <div class="portal-student-details-grid">
              <div class="portal-student-field">
                <span class="field-label">Registration Number</span>
                <span class="field-val">${stu.regNumber || 'N/A'}</span>
              </div>
              <div class="portal-student-field">
                <span class="field-label">Roll Number</span>
                <span class="field-val">${stu.rollNumber || 'N/A'}</span>
              </div>
              <div class="portal-student-field">
                <span class="field-label">School</span>
                <span class="field-val">${stu.school || 'N/A'}</span>
              </div>
              <div class="portal-student-field">
                <span class="field-label">Department & Section</span>
                <span class="field-val">${stu.department || 'N/A'} (${stu.section || 'N/A'})</span>
              </div>
              <div class="portal-student-field">
                <span class="field-label">Current Academic Year</span>
                <span class="field-val">${stu.currentYear || 'N/A'}</span>
              </div>
              <div class="portal-student-field">
                <span class="field-label">Contact Number</span>
                <span class="field-val">${stu.contactNumber || 'N/A'}</span>
              </div>
            </div>

            <div class="portal-card-actions" style="margin-top: 14px; padding-top: 12px; border-top: 1px solid var(--border);">
              <button type="button" class="btn btn-secondary edit-member-btn" data-email="${stu.gmail || stu.email}" style="padding: 6px 14px; font-size: 12px;">
                Edit Member Details →
              </button>
            </div>
          </div>
        `;
      }).join('');
    }

    // Detail Modal Event Listeners
    if (closeAdminDetailModalBtn) {
      closeAdminDetailModalBtn.addEventListener('click', closeAdminDetailModal);
    }

    if (adminEventDetailModal) {
      adminEventDetailModal.addEventListener('click', function (e) {
        if (e.target === adminEventDetailModal) {
          closeAdminDetailModal();
        }
      });
    }

    if (adminDetailEditBtn) {
      adminDetailEditBtn.addEventListener('click', function () {
        if (!activeAdminDetailEventId) return;
        const targetId = activeAdminDetailEventId;
        closeAdminDetailModal();
        openEditForm(targetId);
      });
    }

    if (adminDetailStudentsBtn) {
      adminDetailStudentsBtn.addEventListener('click', function () {
        if (!activeAdminDetailEventId || !registeredStudentsPanel) return;
        const isHidden = registeredStudentsPanel.style.display === 'none';

        if (isHidden) {
          registeredStudentsPanel.style.display = 'block';
          renderRegisteredStudents(activeAdminDetailEventId);
        } else {
          registeredStudentsPanel.style.display = 'none';
        }
      });
    }

    // --- 8. Modal Form Open / Close Handlers (Create & Edit Event) ---
    function openCreateForm() {
      if (!adminEventForm || !eventFormModal) return;
      adminEventForm.reset();
      if (editingEventId) editingEventId.value = '';

      if (modalFormBadge) modalFormBadge.textContent = 'NEW EVENT CONFIGURATION';
      if (modalFormTitle) modalFormTitle.textContent = 'Create New Event';
      if (modalFormSubtitle) modalFormSubtitle.textContent = 'Fill out the details below to publish a new club experience.';
      if (eventSubmitBtn) eventSubmitBtn.innerHTML = 'PUBLISH EVENT <span class="arrow">→</span>';
      if (adminFormError) adminFormError.textContent = '';

      eventFormModal.classList.add('active');
      eventFormModal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
      if (eventTitle) eventTitle.focus();
    }

    function openEditForm(eventId) {
      if (!window.PortalStore || !adminEventForm || !eventFormModal) return;
      const evt = window.PortalStore.getEventById(eventId);
      if (!evt) return;

      if (editingEventId) editingEventId.value = eventId;
      if (eventTitle) eventTitle.value = evt.title || '';
      if (eventType) eventType.value = evt.type || '';
      if (eventTime) eventTime.value = evt.time || '';
      if (eventVenue) eventVenue.value = evt.venue || '';
      if (eventBanner) eventBanner.value = evt.banner || 'linear-gradient(135deg, #0f172a, #1e293b)';
      if (eventDescription) eventDescription.value = evt.description || '';

      if (modalFormBadge) modalFormBadge.textContent = 'EDIT EVENT CONFIGURATION';
      if (modalFormTitle) modalFormTitle.textContent = 'Edit Event Details';
      if (modalFormSubtitle) modalFormSubtitle.textContent = 'Modify event details and save changes to update the live store.';
      if (eventSubmitBtn) eventSubmitBtn.innerHTML = 'SAVE CHANGES <span class="arrow">→</span>';
      if (adminFormError) adminFormError.textContent = '';

      eventFormModal.classList.add('active');
      eventFormModal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
      if (eventTitle) eventTitle.focus();
    }

    function closeFormModal() {
      if (!eventFormModal) return;
      eventFormModal.classList.remove('active');
      eventFormModal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
      if (editingEventId) editingEventId.value = '';
      if (adminFormError) adminFormError.textContent = '';
    }

    // --- 9. Form Submission Handler (Create & Edit Event) ---
    if (adminEventForm) {
      adminEventForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const title = eventTitle ? eventTitle.value.trim() : '';
        const type = eventType ? eventType.value.trim() : '';
        const time = eventTime ? eventTime.value.trim() : '';
        const venue = eventVenue ? eventVenue.value.trim() : '';
        const banner = eventBanner ? eventBanner.value.trim() : 'linear-gradient(135deg, #0f172a, #1e293b)';
        const description = eventDescription ? eventDescription.value.trim() : '';
        const targetId = editingEventId ? editingEventId.value.trim() : '';

        // Inline Field Validation
        if (!title || !type || !time || !venue || !description) {
          if (adminFormError) adminFormError.textContent = 'Please fill in all required fields before submitting.';
          return;
        }

        if (adminFormError) adminFormError.textContent = '';

        try {
          if (targetId) {
            // Update Flow
            window.PortalStore.updateEvent(targetId, {
              title: title,
              type: type,
              time: time,
              venue: venue,
              banner: banner,
              description: description
            });
          } else {
            // Create Flow
            window.PortalStore.createEvent({
              title: title,
              type: type,
              time: time,
              venue: venue,
              banner: banner,
              description: description,
              createdBy: adminEmail
            });
          }

          closeFormModal();
          renderAdminEvents();
        } catch (err) {
          if (adminFormError) adminFormError.textContent = err.message || 'An error occurred while saving the event.';
        }
      });
    }

    // --- 10. Admin Session Recordings Controller ---
    function renderAdminRecordings() {
      if (!window.PortalStore || !adminRecordingsGrid) return;
      const recordings = window.PortalStore.getRecordings();

      if (!recordings || recordings.length === 0) {
        adminRecordingsGrid.innerHTML = '';
        if (adminRecordingsEmptyState) adminRecordingsEmptyState.style.display = 'block';
        return;
      }

      if (adminRecordingsEmptyState) adminRecordingsEmptyState.style.display = 'none';

      adminRecordingsGrid.innerHTML = recordings.map(function (rec, index) {
        const themeClass = index % 2 === 0 ? 'theme-white' : 'theme-black';
        return `
          <div class="recording-card ${themeClass}" data-id="${rec.id}">
            <div class="recording-banner" style="background: ${rec.banner || 'linear-gradient(135deg, #090d16, #1e293b)'};">
              <div class="recording-banner-top">
                <span class="event-category">${rec.type}</span>
                <span class="recording-duration-badge">⏱ ${rec.duration}</span>
              </div>
              <div class="recording-play-indicator">▶</div>
            </div>
            <div class="event-body">
              <h3 class="event-name" style="font-size: 17px; margin-bottom: 4px;">${rec.title}</h3>
              <div class="recording-speaker-tag">${rec.speaker}</div>
              <div class="event-meta" style="margin-bottom: 10px;">
                <span>📅 ${rec.date}</span>
                <span>⏱ ${rec.duration}</span>
              </div>
              <p class="event-desc" style="margin-bottom: 16px;">${rec.description}</p>
              <div class="portal-card-actions" style="display: flex; gap: 8px; flex-wrap: wrap;">
                <button type="button" class="btn btn-primary preview-session-btn" data-id="${rec.id}" style="flex: 1; justify-content: center; padding: 8px 12px; font-size: 12.5px;">
                  Preview Player ▶
                </button>
                <button type="button" class="btn btn-secondary edit-session-btn" data-id="${rec.id}" style="padding: 8px 12px; font-size: 12.5px;">
                  Edit
                </button>
                <button type="button" class="btn btn-secondary delete-session-btn" data-id="${rec.id}" style="padding: 8px 12px; font-size: 12.5px; color: #ef4444; border-color: #fca5a5;">
                  Delete
                </button>
              </div>
            </div>
          </div>
        `;
      }).join('');
    }

    function openCreateSessionModal() {
      if (!sessionFormModal) return;
      if (adminSessionForm) adminSessionForm.reset();
      if (editingSessionId) editingSessionId.value = '';
      if (sessionModalBadge) sessionModalBadge.textContent = 'SESSION CREATION';
      if (sessionModalTitle) sessionModalTitle.textContent = 'Upload Session Recording';
      if (sessionModalSubtitle) sessionModalSubtitle.textContent = 'Publish a new masterclass or workshop recording for club members.';
      if (sessionSubmitBtn) sessionSubmitBtn.innerHTML = 'PUBLISH SESSION <span class="arrow">→</span>';
      if (sessionFormError) sessionFormError.textContent = '';

      sessionFormModal.classList.add('active');
      sessionFormModal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    }

    function openEditSessionModal(recordingId) {
      if (!window.PortalStore || !sessionFormModal) return;
      const rec = window.PortalStore.getRecordingById(recordingId);
      if (!rec) return;

      if (editingSessionId) editingSessionId.value = rec.id;
      if (sessionTitle) sessionTitle.value = rec.title || '';
      if (sessionType) sessionType.value = rec.type || 'Quantitative Finance';
      if (sessionDuration) sessionDuration.value = rec.duration || '';
      if (sessionDate) sessionDate.value = rec.date || '';
      if (sessionSpeaker) sessionSpeaker.value = rec.speaker || '';
      if (sessionVideoUrl) sessionVideoUrl.value = rec.videoUrl || '';
      if (sessionDescription) sessionDescription.value = rec.description || '';
      if (sessionTakeaways) sessionTakeaways.value = (rec.takeaways || []).join('\n');

      if (sessionModalBadge) sessionModalBadge.textContent = 'EDIT SESSION';
      if (sessionModalTitle) sessionModalTitle.textContent = 'Edit Session Recording';
      if (sessionModalSubtitle) sessionModalSubtitle.textContent = 'Update masterclass details, synopsis, or video link.';
      if (sessionSubmitBtn) sessionSubmitBtn.innerHTML = 'SAVE SESSION CHANGES <span class="arrow">→</span>';
      if (sessionFormError) sessionFormError.textContent = '';

      sessionFormModal.classList.add('active');
      sessionFormModal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    }

    function closeSessionModal() {
      if (!sessionFormModal) return;
      sessionFormModal.classList.remove('active');
      sessionFormModal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }

    if (adminSessionForm) {
      adminSessionForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const title = sessionTitle ? sessionTitle.value.trim() : '';
        const type = sessionType ? sessionType.value.trim() : '';
        const duration = sessionDuration ? sessionDuration.value.trim() : '';
        const date = sessionDate ? sessionDate.value.trim() : '';
        const speaker = sessionSpeaker ? sessionSpeaker.value.trim() : '';
        const videoUrl = sessionVideoUrl ? sessionVideoUrl.value.trim() : '';
        const description = sessionDescription ? sessionDescription.value.trim() : '';
        const takeawaysRaw = sessionTakeaways ? sessionTakeaways.value.trim() : '';
        const targetId = editingSessionId ? editingSessionId.value.trim() : '';

        if (!title || !type || !duration || !date || !speaker || !description) {
          if (sessionFormError) sessionFormError.textContent = 'Please fill in all required fields.';
          return;
        }

        if (sessionFormError) sessionFormError.textContent = '';

        const takeaways = takeawaysRaw.split('\n').map(t => t.trim()).filter(Boolean);

        if (targetId) {
          // Update Flow
          window.PortalStore.updateRecording(targetId, {
            title: title,
            type: type,
            duration: duration,
            date: date,
            speaker: speaker,
            videoUrl: videoUrl,
            description: description,
            takeaways: takeaways
          });
        } else {
          // Create Flow
          window.PortalStore.saveRecording({
            title: title,
            type: type,
            duration: duration,
            date: date,
            speaker: speaker,
            videoUrl: videoUrl,
            description: description,
            takeaways: takeaways
          });
        }

        closeSessionModal();
        renderAdminRecordings();
      });
    }

    // --- 11. Admin Recording Preview Player Controller ---
    function openAdminRecordingModal(recordingId) {
      if (!window.PortalStore || !recordingModal) return;
      const rec = window.PortalStore.getRecordingById(recordingId);
      if (!rec) return;

      activeRecording = rec;
      isPlaying = false;
      currentPlaySec = 0;

      if (recordingTitle) recordingTitle.textContent = rec.title;
      if (recordingTypeBadge) recordingTypeBadge.textContent = rec.type || 'WORKSHOP';
      if (playerCategoryBadge) playerCategoryBadge.textContent = rec.type || 'SESSION';
      if (recordingDate) recordingDate.textContent = '📅 ' + rec.date;
      if (recordingDuration) recordingDuration.textContent = '⏱ ' + rec.duration;
      if (recordingSpeaker) recordingSpeaker.textContent = '🎙 ' + rec.speaker;
      if (recordingDescription) recordingDescription.textContent = rec.description;

      if (playerCurrentTime) playerCurrentTime.textContent = '00:00';
      if (playerTotalDuration) playerTotalDuration.textContent = formatTimeCode(rec.durationSec || 3240);
      if (playerProgressFill) playerProgressFill.style.width = '0%';
      if (playerPlayIcon) playerPlayIcon.textContent = '▶';
      if (playerStateLabel) playerStateLabel.textContent = 'Click to Preview Session';

      if (recordingTakeawaysList) {
        const takeaways = rec.takeaways || [];
        if (takeaways.length > 0) {
          recordingTakeawaysList.innerHTML = takeaways.map(t => `<li><span class="bullet">✦</span> ${t}</li>`).join('');
        } else {
          recordingTakeawaysList.innerHTML = '<li><span class="bullet">✦</span> Comprehensive quantitative analysis and practical demonstrations.</li>';
        }
      }

      recordingModal.classList.add('active');
      recordingModal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    }

    function closeRecordingModal() {
      if (!recordingModal) return;
      recordingModal.classList.remove('active');
      recordingModal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
      isPlaying = false;
      if (playerPlayIcon) playerPlayIcon.textContent = '▶';
      if (playerStateLabel) playerStateLabel.textContent = 'Click to Preview Session';
      flushAdminActivityToStore();
    }

    function togglePlayRecording() {
      if (!activeRecording) return;
      isPlaying = !isPlaying;

      if (isPlaying) {
        if (playerPlayIcon) playerPlayIcon.textContent = '❚❚';
        if (playerStateLabel) playerStateLabel.textContent = 'Playing Masterclass Stream...';
      } else {
        if (playerPlayIcon) playerPlayIcon.textContent = '▶';
        if (playerStateLabel) playerStateLabel.textContent = 'Paused';
      }
    }

    // --- 12. Event Listeners & Delegations ---
    if (headerCreateEventBtn) headerCreateEventBtn.addEventListener('click', openCreateForm);
    if (emptyCreateEventBtn) emptyCreateEventBtn.addEventListener('click', openCreateForm);
    if (closeFormModalBtn) closeFormModalBtn.addEventListener('click', closeFormModal);

    if (uploadSessionBtn) uploadSessionBtn.addEventListener('click', openCreateSessionModal);
    if (emptyUploadSessionBtn) emptyUploadSessionBtn.addEventListener('click', openCreateSessionModal);
    if (closeSessionModalBtn) closeSessionModalBtn.addEventListener('click', closeSessionModal);

    if (closeRecordingModalBtn) closeRecordingModalBtn.addEventListener('click', closeRecordingModal);
    if (playerPlayBtn) playerPlayBtn.addEventListener('click', togglePlayRecording);

    if (playerProgressWrap) {
      playerProgressWrap.addEventListener('click', function (e) {
        if (!activeRecording) return;
        const rect = playerProgressWrap.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const ratio = Math.max(0, Math.min(1, clickX / rect.width));
        const totalSec = activeRecording.durationSec || 3240;
        currentPlaySec = Math.floor(ratio * totalSec);
        if (playerProgressFill) playerProgressFill.style.width = (ratio * 100) + '%';
        if (playerCurrentTime) playerCurrentTime.textContent = formatTimeCode(currentPlaySec);
      });
    }

    if (sessionFormModal) {
      sessionFormModal.addEventListener('click', function (e) {
        if (e.target === sessionFormModal) {
          closeSessionModal();
        }
      });
    }

    if (recordingModal) {
      recordingModal.addEventListener('click', function (e) {
        if (e.target === recordingModal) {
          closeRecordingModal();
        }
      });
    }

    if (eventFormModal) {
      eventFormModal.addEventListener('click', function (e) {
        if (e.target === eventFormModal) {
          closeFormModal();
        }
      });
    }

    window.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') {
        if (eventFormModal && eventFormModal.classList.contains('active')) {
          closeFormModal();
        } else if (adminEventDetailModal && adminEventDetailModal.classList.contains('active')) {
          closeAdminDetailModal();
        } else if (memberFormModal && memberFormModal.classList.contains('active')) {
          closeMemberModal();
        } else if (sessionFormModal && sessionFormModal.classList.contains('active')) {
          closeSessionModal();
        } else if (recordingModal && recordingModal.classList.contains('active')) {
          closeRecordingModal();
        }
      }
    });

    // Delegation for Event Card Actions (View Details & Edit Event)
    if (adminEventsContainer) {
      adminEventsContainer.addEventListener('click', function (e) {
        const editBtn = e.target.closest('.edit-event-btn');
        if (editBtn) {
          e.stopPropagation();
          e.preventDefault();
          const eventId = editBtn.dataset.id;
          if (eventId) {
            openEditForm(eventId);
          }
          return;
        }

        const detailsBtn = e.target.closest('.view-admin-details-btn');
        if (detailsBtn) {
          e.stopPropagation();
          e.preventDefault();
          const eventId = detailsBtn.dataset.id;
          if (eventId) {
            openAdminDetailModal(eventId);
          }
          return;
        }

        const card = e.target.closest('.event-card');
        if (card) {
          const eventId = card.dataset.id;
          if (eventId) {
            openAdminDetailModal(eventId);
          }
        }
      });
    }

    // Delegation for Session Recordings Card Actions (Preview, Edit, Delete)
    if (adminRecordingsGrid) {
      adminRecordingsGrid.addEventListener('click', function (e) {
        const previewBtn = e.target.closest('.preview-session-btn');
        if (previewBtn) {
          e.stopPropagation();
          e.preventDefault();
          const recId = previewBtn.dataset.id;
          if (recId) openAdminRecordingModal(recId);
          return;
        }

        const editBtn = e.target.closest('.edit-session-btn');
        if (editBtn) {
          e.stopPropagation();
          e.preventDefault();
          const recId = editBtn.dataset.id;
          if (recId) openEditSessionModal(recId);
          return;
        }

        const deleteBtn = e.target.closest('.delete-session-btn');
        if (deleteBtn) {
          e.stopPropagation();
          e.preventDefault();
          const recId = deleteBtn.dataset.id;
          if (recId) {
            const confirmDelete = window.confirm('Are you sure you want to delete this session recording?');
            if (confirmDelete) {
              window.PortalStore.deleteRecording(recId);
              renderAdminRecordings();
            }
          }
          return;
        }

        const card = e.target.closest('.recording-card');
        if (card) {
          const recId = card.dataset.id;
          if (recId) openAdminRecordingModal(recId);
        }
      });
    }

    // Delegation for Member Profile Edit Button Click across All Members view & Registered Students list
    document.addEventListener('click', function (e) {
      const editMemBtn = e.target.closest('.edit-member-btn');
      if (editMemBtn) {
        e.stopPropagation();
        e.preventDefault();
        const email = editMemBtn.dataset.email;
        if (email) {
          openEditMemberForm(email);
        }
      }
    });

    // Initial Render
    renderAdminEvents();
    renderAdminRecordings();
    renderAdminActivityMetrics();
  });
})();
