/**
 * student-portal.js — MATRIX FinTech Club Student Portal Controller
 *
 * Manages event discovery, event detail inspection, event joining,
 * session recordings archive, interactive player modal, and
 * student-specific learning activity & time tracking via PortalStore.
 */

(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', function () {
    // --- 1. Session Validation ---
    const currentUser = window.PortalStore ? window.PortalStore.getCurrentUser() : null;

    if (!currentUser || currentUser.role !== 'student') {
      // Redirect unauthenticated user or non-student to login
      window.location.href = 'login.html';
      return;
    }

    const userEmail = currentUser.email;

    // Update Header Identity Badge
    const userEmailDisplay = document.getElementById('userEmailDisplay');
    const userAvatar = document.getElementById('userAvatar');
    if (userEmailDisplay) userEmailDisplay.textContent = userEmail;
    if (userAvatar) userAvatar.textContent = userEmail.charAt(0).toUpperCase();

    // --- 2. DOM References ---
    const eventsGrid = document.getElementById('eventsGrid');
    const joinedEmptyState = document.getElementById('joinedEmptyState');
    const browseEventsBtn = document.getElementById('browseEventsBtn');

    const tabAllEvents = document.getElementById('tabAllEvents');
    const tabJoinedEvents = document.getElementById('tabJoinedEvents');
    const viewHeading = document.getElementById('viewHeading');
    const viewSubtitle = document.getElementById('viewSubtitle');

    const eventDetailModal = document.getElementById('eventDetailModal');
    const closeDetailModalBtn = document.getElementById('closeDetailModalBtn');
    const detailBanner = document.getElementById('detailBanner');
    const detailTypeBadge = document.getElementById('detailTypeBadge');
    const detailTitle = document.getElementById('detailTitle');
    const detailTime = document.getElementById('detailTime');
    const detailVenue = document.getElementById('detailVenue');
    const detailDescription = document.getElementById('detailDescription');
    const detailJoinBtn = document.getElementById('detailJoinBtn');

    // Phase 6H DOM References — Recordings & Activity
    const recordingsGrid = document.getElementById('recordingsGrid');
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

    const activityTotalTime = document.getElementById('activityTotalTime');
    const activityWebsiteTime = document.getElementById('activityWebsiteTime');
    const activityRecordingTime = document.getElementById('activityRecordingTime');
    const activitySessionsCount = document.getElementById('activitySessionsCount');
    const activityEventsCount = document.getElementById('activityEventsCount');

    // --- 3. View State ---
    let currentTab = 'all'; // 'all' | 'joined'
    let activeDetailEventId = null;

    // Phase 6H State — Recordings & Player
    let activeRecording = null;
    let isPlaying = false;
    let currentPlaySec = 0;
    let activeSessionMarkedWatched = false;

    // Phase 6H State — Time Tracking (Student-Isolated)
    let deltaWebSec = 0;
    let deltaRecSec = 0;
    let localActivity = window.PortalStore ? window.PortalStore.getStudentActivity(userEmail) : {
      totalSeconds: 0,
      websiteSeconds: 0,
      recordingSeconds: 0,
      sessionsWatched: 0
    };

    // --- 4. Time Formatting Helpers ---
    function formatHoursMinutes(totalSeconds) {
      const sec = Math.max(0, Math.floor(totalSeconds || 0));
      const hours = Math.floor(sec / 3600);
      const minutes = Math.floor((sec % 3600) / 60);
      const paddedH = String(hours).padStart(2, '0');
      const paddedM = String(minutes).padStart(2, '0');
      return `${paddedH}h ${paddedM}m`;
    }

    function formatTimeCode(seconds) {
      const s = Math.max(0, Math.floor(seconds || 0));
      const m = Math.floor(s / 60);
      const remSec = s % 60;
      return `${String(m).padStart(2, '0')}:${String(remSec).padStart(2, '0')}`;
    }

    // --- 5. Render Student Activity Metrics ---
    function renderActivityMetrics() {
      if (!localActivity) return;

      const currentWeb = localActivity.websiteSeconds + deltaWebSec;
      const currentRec = localActivity.recordingSeconds + deltaRecSec;
      const currentTotal = currentWeb + currentRec;

      if (activityTotalTime) activityTotalTime.textContent = formatHoursMinutes(currentTotal);
      if (activityWebsiteTime) activityWebsiteTime.textContent = formatHoursMinutes(currentWeb);
      if (activityRecordingTime) activityRecordingTime.textContent = formatHoursMinutes(currentRec);

      if (activitySessionsCount) {
        activitySessionsCount.textContent = `${localActivity.sessionsWatched || 0} masterclass sessions reviewed.`;
      }

      if (activityEventsCount && window.PortalStore) {
        const joinedCount = window.PortalStore.getJoinedEventIds(userEmail).length;
        activityEventsCount.textContent = String(joinedCount);
      }
    }

    function flushActivityToStore(incrementSession) {
      if (!window.PortalStore) return;
      if (deltaWebSec === 0 && deltaRecSec === 0 && !incrementSession) return;

      const updated = window.PortalStore.updateStudentActivity(
        userEmail,
        deltaWebSec,
        deltaRecSec,
        incrementSession
      );

      if (updated) {
        localActivity = updated;
        deltaWebSec = 0;
        deltaRecSec = 0;
      }
    }

    // --- 6. Render Event Feed ---
    function renderEvents() {
      if (!window.PortalStore) return;
      const allEvents = window.PortalStore.getEvents(userEmail);

      let displayedEvents = allEvents;
      if (currentTab === 'joined') {
        displayedEvents = allEvents.filter(function (evt) {
          return evt.isJoined;
        });
      }

      // Handle Empty Joined State
      if (currentTab === 'joined' && displayedEvents.length === 0) {
        if (eventsGrid) eventsGrid.style.display = 'none';
        if (joinedEmptyState) joinedEmptyState.style.display = 'block';
        return;
      }

      if (eventsGrid) eventsGrid.style.display = 'grid';
      if (joinedEmptyState) joinedEmptyState.style.display = 'none';

      // Build Cards HTML
      eventsGrid.innerHTML = displayedEvents.map(function (evt, index) {
        const themeClass = index % 2 === 0 ? 'theme-white' : 'theme-black';
        const joinBtnLabel = evt.isJoined ? 'Joined ✓' : 'Join Event →';
        const joinBtnClass = evt.isJoined ? 'btn btn-primary portal-btn-joined' : 'btn btn-primary';

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
                <button type="button" class="text-link view-details-btn" data-id="${evt.id}">
                  View Details →
                </button>
                <button type="button" class="${joinBtnClass} join-event-btn" data-id="${evt.id}">
                  ${joinBtnLabel}
                </button>
              </div>
            </div>
          </div>
        `;
      }).join('');

      renderActivityMetrics();
    }

    // --- 7. Render Session Recordings ---
    function renderRecordings() {
      if (!window.PortalStore || !recordingsGrid) return;
      const recordings = window.PortalStore.getRecordings();

      recordingsGrid.innerHTML = recordings.map(function (rec, index) {
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
              <div class="portal-card-actions">
                <button type="button" class="btn btn-primary watch-recording-btn" data-id="${rec.id}" style="width: 100%; justify-content: center;">
                  Watch Recording <span class="arrow">→</span>
                </button>
              </div>
            </div>
          </div>
        `;
      }).join('');
    }

    // --- 8. Recording Player & Modal Controller ---
    function openRecordingModal(recordingId) {
      if (!window.PortalStore || !recordingModal) return;
      const rec = window.PortalStore.getRecordingById(recordingId);
      if (!rec) return;

      activeRecording = rec;
      isPlaying = false;
      currentPlaySec = 0;
      activeSessionMarkedWatched = false;

      if (recordingTitle) recordingTitle.textContent = rec.title;
      if (recordingTypeBadge) recordingTypeBadge.textContent = rec.type || 'WORKSHOP';
      if (playerCategoryBadge) playerCategoryBadge.textContent = rec.type || 'SESSION';
      if (recordingDate) recordingDate.textContent = '📅 ' + rec.date;
      if (recordingDuration) recordingDuration.textContent = '⏱ ' + rec.duration;
      if (recordingSpeaker) recordingSpeaker.textContent = '🎙 ' + rec.speaker;
      if (recordingDescription) recordingDescription.textContent = rec.description;

      if (playerTotalDuration) playerTotalDuration.textContent = formatTimeCode(rec.durationSec || 3240);
      if (playerCurrentTime) playerCurrentTime.textContent = '00:00';
      if (playerProgressFill) playerProgressFill.style.width = '0%';
      if (playerPlayIcon) playerPlayIcon.textContent = '▶';
      if (playerStateLabel) playerStateLabel.textContent = 'Click to Start Session';

      if (recordingTakeawaysList && Array.isArray(rec.takeaways)) {
        recordingTakeawaysList.innerHTML = rec.takeaways.map(function (item) {
          return `<li>${item}</li>`;
        }).join('');
      }

      recordingModal.classList.add('active');
      recordingModal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    }

    function closeRecordingModal() {
      if (!recordingModal) return;
      pauseRecording();
      recordingModal.classList.remove('active');
      recordingModal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
      activeRecording = null;
      flushActivityToStore(false);
      renderActivityMetrics();
    }

    function togglePlayRecording() {
      if (!activeRecording) return;
      if (isPlaying) {
        pauseRecording();
      } else {
        startPlayRecording();
      }
    }

    function startPlayRecording() {
      isPlaying = true;
      if (playerPlayIcon) playerPlayIcon.textContent = '⏸';
      if (playerStateLabel) playerStateLabel.textContent = 'Streaming Archive Recording...';

      // Increment sessions watched on first active play
      if (!activeSessionMarkedWatched) {
        activeSessionMarkedWatched = true;
        flushActivityToStore(true);
        renderActivityMetrics();
      }
    }

    function pauseRecording() {
      isPlaying = false;
      if (playerPlayIcon) playerPlayIcon.textContent = '▶';
      if (playerStateLabel) playerStateLabel.textContent = 'Session Paused';
    }

    // --- 9. Active Time Tracker Tick Loop ---
    setInterval(function () {
      if (document.hidden) return;

      if (recordingModal && recordingModal.classList.contains('active') && isPlaying && activeRecording) {
        // Track recording watching time
        deltaRecSec += 1;
        currentPlaySec += 1;

        const totalSec = activeRecording.durationSec || 3240;
        if (currentPlaySec >= totalSec) {
          currentPlaySec = totalSec;
          pauseRecording();
          if (playerStateLabel) playerStateLabel.textContent = 'Session Completed';
        }

        const pct = Math.min(100, (currentPlaySec / totalSec) * 100);
        if (playerProgressFill) playerProgressFill.style.width = pct + '%';
        if (playerCurrentTime) playerCurrentTime.textContent = formatTimeCode(currentPlaySec);
      } else {
        // Track general portal browsing time
        deltaWebSec += 1;
      }

      renderActivityMetrics();

      // Periodic persistence every 10 seconds
      if (deltaWebSec + deltaRecSec >= 10) {
        flushActivityToStore(false);
      }
    }, 1000);

    // Save on tab switch / window unload
    document.addEventListener('visibilitychange', function () {
      if (document.hidden) {
        flushActivityToStore(false);
      }
    });

    window.addEventListener('beforeunload', function () {
      flushActivityToStore(false);
    });

    // --- 10. Event Detail Presentation ---
    function openDetailModal(eventId) {
      if (!window.PortalStore || !eventDetailModal) return;
      const evt = window.PortalStore.getEventById(eventId);
      if (!evt) return;

      const isJoined = window.PortalStore.isEventJoined(userEmail, eventId);
      activeDetailEventId = eventId;

      if (detailTitle) detailTitle.textContent = evt.title;
      if (detailTypeBadge) detailTypeBadge.textContent = evt.type || 'EVENT';
      if (detailTime) detailTime.textContent = '📅 ' + evt.time;
      if (detailVenue) detailVenue.textContent = '📍 ' + evt.venue;
      if (detailDescription) detailDescription.textContent = evt.description;

      if (detailBanner) {
        detailBanner.style.background = evt.banner || 'linear-gradient(135deg, #0f172a, #1e293b)';
      }

      if (detailJoinBtn) {
        detailJoinBtn.textContent = isJoined ? 'Joined ✓' : 'Join Event →';
        detailJoinBtn.className = 'btn btn-primary ' + (isJoined ? 'portal-btn-joined' : '');
      }

      eventDetailModal.classList.add('active');
      eventDetailModal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    }

    function closeDetailModal() {
      if (!eventDetailModal) return;
      eventDetailModal.classList.remove('active');
      eventDetailModal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
      activeDetailEventId = null;
    }

    // Detail Modal Event Listeners
    if (closeDetailModalBtn) {
      closeDetailModalBtn.addEventListener('click', closeDetailModal);
    }

    if (eventDetailModal) {
      eventDetailModal.addEventListener('click', function (e) {
        if (e.target === eventDetailModal) {
          closeDetailModal();
        }
      });
    }

    // Recording Modal Event Listeners
    if (closeRecordingModalBtn) {
      closeRecordingModalBtn.addEventListener('click', closeRecordingModal);
    }

    if (recordingModal) {
      recordingModal.addEventListener('click', function (e) {
        if (e.target === recordingModal) {
          closeRecordingModal();
        }
      });
    }

    if (playerPlayBtn) {
      playerPlayBtn.addEventListener('click', togglePlayRecording);
    }

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

    window.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') {
        if (eventDetailModal && eventDetailModal.classList.contains('active')) {
          closeDetailModal();
        }
        if (recordingModal && recordingModal.classList.contains('active')) {
          closeRecordingModal();
        }
      }
    });

    if (detailJoinBtn) {
      detailJoinBtn.addEventListener('click', function () {
        if (!activeDetailEventId || !window.PortalStore) return;
        const isNowJoined = window.PortalStore.toggleJoinEvent(userEmail, activeDetailEventId);

        // Update detail button immediately
        detailJoinBtn.textContent = isNowJoined ? 'Joined ✓' : 'Join Event →';
        detailJoinBtn.className = 'btn btn-primary ' + (isNowJoined ? 'portal-btn-joined' : '');

        // Refresh feed in real-time & update activity count
        renderEvents();
      });
    }

    // --- 11. Feed Event Delegation (Join & View Details) ---
    if (eventsGrid) {
      eventsGrid.addEventListener('click', function (e) {
        // Join Button Click
        const joinBtn = e.target.closest('.join-event-btn');
        if (joinBtn) {
          e.preventDefault();
          const eventId = joinBtn.dataset.id;
          if (eventId && window.PortalStore) {
            window.PortalStore.toggleJoinEvent(userEmail, eventId);
            renderEvents();
          }
          return;
        }

        // View Details Click
        const detailsBtn = e.target.closest('.view-details-btn');
        if (detailsBtn) {
          e.preventDefault();
          const eventId = detailsBtn.dataset.id;
          if (eventId) {
            openDetailModal(eventId);
          }
        }
      });
    }

    // Recordings Grid Delegation (Watch Recording)
    if (recordingsGrid) {
      recordingsGrid.addEventListener('click', function (e) {
        const watchBtn = e.target.closest('.watch-recording-btn, .recording-play-indicator, .recording-banner');
        if (watchBtn) {
          e.preventDefault();
          const card = watchBtn.closest('.recording-card');
          const recordingId = card ? card.dataset.id : (watchBtn.dataset.id || null);
          if (recordingId) {
            openRecordingModal(recordingId);
          }
        }
      });
    }

    // --- 12. Segmented Tab Switcher ---
    function switchTab(targetTab) {
      currentTab = targetTab;

      if (targetTab === 'all') {
        if (tabAllEvents) {
          tabAllEvents.classList.add('active');
          tabAllEvents.setAttribute('aria-selected', 'true');
        }
        if (tabJoinedEvents) {
          tabJoinedEvents.classList.remove('active');
          tabJoinedEvents.setAttribute('aria-selected', 'false');
        }
        if (viewHeading) viewHeading.textContent = 'Upcoming Experiences';
        if (viewSubtitle) viewSubtitle.textContent = 'Discover summits, workshops, hackathons, and quantitative finance sessions.';
      } else {
        if (tabJoinedEvents) {
          tabJoinedEvents.classList.add('active');
          tabJoinedEvents.setAttribute('aria-selected', 'true');
        }
        if (tabAllEvents) {
          tabAllEvents.classList.remove('active');
          tabAllEvents.setAttribute('aria-selected', 'false');
        }
        if (viewHeading) viewHeading.textContent = 'Your Joined Events';
        if (viewSubtitle) viewSubtitle.textContent = 'Events and workshops you have registered to attend.';
      }

      renderEvents();
    }

    if (tabAllEvents) {
      tabAllEvents.addEventListener('click', function () {
        switchTab('all');
      });
    }

    if (tabJoinedEvents) {
      tabJoinedEvents.addEventListener('click', function () {
        switchTab('joined');
      });
    }

    if (browseEventsBtn) {
      browseEventsBtn.addEventListener('click', function () {
        switchTab('all');
      });
    }

    // --- Initial Render ---
    renderEvents();
    renderRecordings();
    renderActivityMetrics();
  });
})();
