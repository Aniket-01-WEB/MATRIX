/**
 * portal-store.js — MATRIX FinTech Club Portal Shared State Store
 *
 * Lightweight frontend-only persistence and state management using localStorage.
 * Handles event CRUD, student registrations, member profiles, and mock session management.
 * Consumes and adapts existing seed data from the MATRIX website.
 */

(function (window) {
  'use strict';

  // Storage Keys
  const KEYS = {
    EVENTS: 'matrix_events',
    CURRENT_USER: 'matrix_current_user',
    REGISTRATIONS: 'matrix_student_registrations',
    MEMBERS: 'matrix_members',
    RECORDINGS: 'matrix_recordings',
    ACTIVITY: 'matrix_student_activity'
  };

  // Seed online session recordings
  const SEED_RECORDINGS = [
    {
      id: 'rec-1',
      title: 'High-Frequency Order Book Dynamics & L2 Data',
      type: 'Algo Workshop',
      date: 'Feb 10, 2026',
      duration: '54m',
      durationSec: 3240,
      speaker: 'Dr. Vikram Sethi • Quant Research Lead',
      banner: 'linear-gradient(135deg, #090d16, #1e293b)',
      description: 'An in-depth technical analysis of Level 2 market data, matching engines, order queue positioning, and execution slippage reduction.',
      takeaways: [
        'Level 2 limit order book matching mechanics and queue priority models.',
        'Python order execution simulation codebase and slippage backtesting framework.',
        'Market impact cost analysis for algorithmic high-frequency strategies.'
      ]
    },
    {
      id: 'rec-2',
      title: 'Automated Market Maker (AMM) Invariant Mechanics',
      type: 'DeFi Engineering',
      date: 'Jan 28, 2026',
      duration: '1h 12m',
      durationSec: 4320,
      speaker: 'Elena Rostova • Protocol Architect',
      banner: 'linear-gradient(135deg, #0f172a, #334155)',
      description: 'Mathematical derivation of constant product formulas, concentrated liquidity curves, impermanent loss hedging, and arbitrage loops.',
      takeaways: [
        'Derivation of xy=k invariant curve mechanics and concentrated liquidity ticks.',
        'Impermanent loss hedging strategies using perpetual futures.',
        'MEV arbitrage sandwich attack simulation and private RPC routing.'
      ]
    },
    {
      id: 'rec-3',
      title: 'Machine Learning for Volatility Surface Forecasting',
      type: 'Quant Research',
      date: 'Jan 15, 2026',
      duration: '48m',
      durationSec: 2880,
      speaker: 'Arjun Nambiar • Senior Quantitative Strategist',
      banner: 'linear-gradient(135deg, #1e293b, #475569)',
      description: 'Applying transformer architectures and stochastic volatility models to reconstruct implied volatility smiles across multi-asset option chains.',
      takeaways: [
        'SVI and Heston stochastic volatility parameter calibration.',
        'Temporal convolutional networks for cross-asset volatility skew prediction.',
        'Real-time delta and vega risk hedging in high-kurtosis market regimes.'
      ]
    },
    {
      id: 'rec-4',
      title: 'Decentralized Credit Risk & Zero-Knowledge Proofs',
      type: 'Web3 & Security',
      date: 'Dec 18, 2025',
      duration: '1h 05m',
      durationSec: 3900,
      speaker: 'Sarah Lin • Cryptography Fellow',
      banner: 'linear-gradient(135deg, #0a0a0a, #1e293b)',
      description: 'Exploring non-collateralized on-chain lending protocols through zk-SNARK private identity verification and cryptographic solvency attestation.',
      takeaways: [
        'zk-SNARK circuit construction using Circom and snarkjs.',
        'Private credit scoring algorithms utilizing verified off-chain cash flows.',
        'Smart contract risk mitigation and liquidation cascade safeguards.'
      ]
    }
  ];

  // Seed student activity data per student
  const SEED_ACTIVITY = {
    'student@matrix.club': {
      totalSeconds: 16320, // 4h 32m
      websiteSeconds: 9960, // 2h 46m
      recordingSeconds: 6360, // 1h 46m
      sessionsWatched: 2,
      lastActive: Date.now()
    },
    'alice@matrix.club': {
      totalSeconds: 9480, // 2h 38m
      websiteSeconds: 6240, // 1h 44m
      recordingSeconds: 3240, // 54m
      sessionsWatched: 1,
      lastActive: Date.now()
    },
    'priya.patel@gmail.com': {
      totalSeconds: 5400, // 1h 30m
      websiteSeconds: 5400,
      recordingSeconds: 0,
      sessionsWatched: 0,
      lastActive: Date.now()
    },
    'aditya.verma@gmail.com': {
      totalSeconds: 12600, // 3h 30m
      websiteSeconds: 8280,
      recordingSeconds: 4320,
      sessionsWatched: 1,
      lastActive: Date.now()
    }
  };

  // Seed events adapted from existing website EVENTS array
  const SEED_EVENTS = [
    {
      id: 'evt-1',
      title: 'MATRIX FinTech Summit 2026',
      type: 'Summit',
      banner: 'linear-gradient(135deg, #0f172a, #1e293b)',
      time: 'Mar 15, 2026 • 10:00 AM',
      venue: 'Main Auditorium',
      description: 'Flagship summit uniting global industry founders, investors, and student innovators exploring the future of global finance.',
      createdBy: 'admin@matrix.club',
      createdAt: 1773550800000
    },
    {
      id: 'evt-2',
      title: 'Quantitative Trading Masterclass',
      type: 'Workshop',
      banner: 'linear-gradient(135deg, #1e293b, #334155)',
      time: 'Feb 22, 2026 • 2:00 PM',
      venue: 'Lab 301',
      description: 'Deep dive into systematic market analysis, high-frequency execution, and algorithmic trading strategies.',
      createdBy: 'admin@matrix.club',
      createdAt: 1771768800000
    },
    {
      id: 'evt-3',
      title: 'AI × Finance National Hackathon',
      type: 'Hackathon',
      banner: 'linear-gradient(135deg, #334155, #475569)',
      time: 'Apr 5, 2026 • 9:00 AM',
      venue: 'Tech Center',
      description: '48-hour national hackathon challenging student developers to build AI-powered credit, risk, and trading bots.',
      createdBy: 'admin@matrix.club',
      createdAt: 1775360400000
    },
    {
      id: 'evt-4',
      title: 'Algorithmic Market Making Lab',
      type: 'Lab',
      banner: 'linear-gradient(135deg, #475569, #64748b)',
      time: 'Apr 20, 2026 • 4:00 PM',
      venue: 'Innovation Hub',
      description: 'Hands-on session building order book simulation engines and liquidity management protocols.',
      createdBy: 'admin@matrix.club',
      createdAt: 1776657600000
    },
    {
      id: 'evt-5',
      title: 'DeFi & Tokenomics Symposium',
      type: 'Symposium',
      banner: 'linear-gradient(135deg, #0f172a, #334155)',
      time: 'May 2, 2026 • 11:00 AM',
      venue: 'Auditorium B',
      description: 'Panel discussion featuring blockchain architects on automated market makers, ZK proofs, and liquidity pools.',
      createdBy: 'admin@matrix.club',
      createdAt: 1777694400000
    },
    {
      id: 'evt-6',
      title: 'Venture Pitching & Angel Sandbox',
      type: 'Session',
      banner: 'linear-gradient(135deg, #1e293b, #475569)',
      time: 'May 18, 2026 • 3:00 PM',
      venue: 'Venture Hub',
      description: 'Pitch session where student fintech startups present MVPs directly to institutional angel investors.',
      createdBy: 'admin@matrix.club',
      createdAt: 1779078000000
    }
  ];

  // Canonical Seed Member Profiles matching existing Join Us form schema
  const SEED_MEMBERS = {
    'student@matrix.club': {
      name: 'Rahul Sharma',
      regNumber: '2024REG1092',
      rollNumber: '24CS084',
      school: 'School of Computer Science & Engineering',
      department: 'Computer Science & Engineering',
      section: 'CSE-B',
      currentYear: '2nd Year',
      contactNumber: '+91 98765 43210',
      gmail: 'student@matrix.club',
      interestedDomain: 'Quantitative Finance & Algo',
      joinedClubAt: 1768800000000
    },
    'alice@matrix.club': {
      name: 'Alice Vance',
      regNumber: '2024REG2045',
      rollNumber: '24AI012',
      school: 'School of Artificial Intelligence',
      department: 'AI & Data Science',
      section: 'AI-A',
      currentYear: '3rd Year',
      contactNumber: '+91 98123 56789',
      gmail: 'alice@matrix.club',
      interestedDomain: 'AI & Machine Learning',
      joinedClubAt: 1769000000000
    },
    'priya.patel@gmail.com': {
      name: 'Priya Patel',
      regNumber: '2024REG3102',
      rollNumber: '24FT033',
      school: 'School of Financial Technology',
      department: 'FinTech & Analytics',
      section: 'FT-A',
      currentYear: '2nd Year',
      contactNumber: '+91 97654 32109',
      gmail: 'priya.patel@gmail.com',
      interestedDomain: 'Trading & Financial Markets',
      joinedClubAt: 1769200000000
    },
    'aditya.verma@gmail.com': {
      name: 'Aditya Verma',
      regNumber: '2023REG4019',
      rollNumber: '23BC007',
      school: 'School of Computing',
      department: 'Blockchain & Security',
      section: 'BC-A',
      currentYear: '3rd Year',
      contactNumber: '+91 99887 76655',
      gmail: 'aditya.verma@gmail.com',
      interestedDomain: 'Blockchain & Crypto Web3',
      joinedClubAt: 1769400000000
    }
  };

  // Default seed registrations per student email
  const SEED_REGISTRATIONS = {
    'student@matrix.club': ['evt-1', 'evt-2'],
    'alice@matrix.club': ['evt-1', 'evt-3'],
    'priya.patel@gmail.com': ['evt-1', 'evt-5'],
    'aditya.verma@gmail.com': ['evt-2', 'evt-4']
  };

  // Helper for safe localStorage access
  function safeGetStorage(key, fallback) {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : fallback;
    } catch (err) {
      console.warn(`[PortalStore] Error reading key "${key}":`, err);
      return fallback;
    }
  }

  function safeSetStorage(key, value) {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (err) {
      console.warn(`[PortalStore] Error writing key "${key}":`, err);
      return false;
    }
  }

  // Core Store Controller
  const PortalStore = {
    KEYS,

    /**
     * Initialize store: seeds default events, members, registrations, recordings, and activity if empty
     */
    init: function () {
      const existingEvents = safeGetStorage(KEYS.EVENTS, null);
      if (!existingEvents || !Array.isArray(existingEvents) || existingEvents.length === 0) {
        safeSetStorage(KEYS.EVENTS, SEED_EVENTS);
      }

      const existingRegs = safeGetStorage(KEYS.REGISTRATIONS, null);
      if (!existingRegs || typeof existingRegs !== 'object' || Object.keys(existingRegs).length === 0) {
        safeSetStorage(KEYS.REGISTRATIONS, SEED_REGISTRATIONS);
      }

      const existingMembers = safeGetStorage(KEYS.MEMBERS, null);
      if (!existingMembers || typeof existingMembers !== 'object' || Object.keys(existingMembers).length === 0) {
        safeSetStorage(KEYS.MEMBERS, SEED_MEMBERS);
      }

      const existingRecordings = safeGetStorage(KEYS.RECORDINGS, null);
      if (!existingRecordings || !Array.isArray(existingRecordings) || existingRecordings.length === 0) {
        safeSetStorage(KEYS.RECORDINGS, SEED_RECORDINGS);
      }

      const existingActivity = safeGetStorage(KEYS.ACTIVITY, null);
      if (!existingActivity || typeof existingActivity !== 'object' || Object.keys(existingActivity).length === 0) {
        safeSetStorage(KEYS.ACTIVITY, SEED_ACTIVITY);
      }
    },

    // --- EVENTS CRUD ---

    /**
     * Retrieve all events stored in localStorage.
     * Optionally attaches `isJoined` flag if a student Email is provided.
     */
    getEvents: function (studentEmail) {
      this.init();
      const events = safeGetStorage(KEYS.EVENTS, SEED_EVENTS);
      if (!studentEmail) {
        return events;
      }
      const joinedIds = this.getJoinedEventIds(studentEmail);
      return events.map(function (evt) {
        return Object.assign({}, evt, {
          isJoined: joinedIds.indexOf(evt.id) !== -1
        });
      });
    },

    /**
     * Retrieve a single event by ID.
     */
    getEventById: function (id) {
      const events = this.getEvents();
      for (let i = 0; i < events.length; i++) {
        if (events[i].id === id) {
          return events[i];
        }
      }
      return null;
    },

    /**
     * Create a new event.
     * Validates required properties: title, time, venue, description, type.
     */
    createEvent: function (eventData) {
      if (!eventData || !eventData.title || !eventData.time || !eventData.venue || !eventData.description) {
        throw new Error('Event Title, Time, Venue, and Description are required.');
      }

      const events = this.getEvents();
      const newEvent = {
        id: 'evt-' + Date.now() + '-' + Math.floor(Math.random() * 1000),
        title: String(eventData.title).trim(),
        type: eventData.type ? String(eventData.type).trim() : 'Event',
        banner: eventData.banner ? String(eventData.banner).trim() : 'linear-gradient(135deg, #0f172a, #1e293b)',
        time: String(eventData.time).trim(),
        venue: String(eventData.venue).trim(),
        description: String(eventData.description).trim(),
        createdBy: eventData.createdBy || 'admin@matrix.club',
        createdAt: Date.now()
      };

      events.unshift(newEvent);
      safeSetStorage(KEYS.EVENTS, events);
      return newEvent;
    },

    /**
     * Update an existing event by ID.
     */
    updateEvent: function (id, updatedFields) {
      if (!id) throw new Error('Event ID is required for updates.');
      const events = this.getEvents();
      let updatedEvent = null;

      for (let i = 0; i < events.length; i++) {
        if (events[i].id === id) {
          events[i] = Object.assign({}, events[i], updatedFields, {
            id: id // Ensure ID cannot be overwritten
          });
          updatedEvent = events[i];
          break;
        }
      }

      if (!updatedEvent) {
        throw new Error('Event with ID "' + id + '" not found.');
      }

      safeSetStorage(KEYS.EVENTS, events);
      return updatedEvent;
    },

    // --- CANONICAL CLUB MEMBER PROFILES ---

    /**
     * Retrieve map of all canonical club members
     */
    getMembersMap: function () {
      this.init();
      return safeGetStorage(KEYS.MEMBERS, SEED_MEMBERS);
    },

    /**
     * Retrieve single member profile by email
     */
    getMemberByEmail: function (email) {
      if (!email) return null;
      const membersMap = this.getMembersMap();
      const emailKey = String(email).trim().toLowerCase();
      if (membersMap[emailKey]) {
        return membersMap[emailKey];
      }
      // Return synthesized profile if not already in store
      const namePart = emailKey.split('@')[0].replace(/[\._]/g, ' ').replace(/\b\w/g, function (l) { return l.toUpperCase(); });
      const synthesized = {
        name: namePart || 'Club Member',
        regNumber: '2024REG1001',
        rollNumber: '24STU01',
        school: 'School of Computer Science & Engineering',
        department: 'FinTech & Analytics',
        section: 'SEC-A',
        currentYear: '2nd Year',
        contactNumber: '+91 98765 00000',
        gmail: emailKey,
        interestedDomain: 'Quantitative Finance & Algo'
      };
      membersMap[emailKey] = synthesized;
      safeSetStorage(KEYS.MEMBERS, membersMap);
      return synthesized;
    },

    /**
     * Save or update canonical club member profile from Join Us form submission
     */
    saveMember: function (memberData) {
      if (!memberData || (!memberData.gmail && !memberData.email)) return null;
      const emailKey = String(memberData.gmail || memberData.email).trim().toLowerCase();

      const membersMap = this.getMembersMap();
      const existing = membersMap[emailKey] || {};

      const updatedMember = Object.assign({}, existing, {
        name: memberData.name ? String(memberData.name).trim() : (existing.name || 'Member'),
        regNumber: memberData.regNumber ? String(memberData.regNumber).trim() : (existing.regNumber || 'N/A'),
        rollNumber: memberData.rollNumber ? String(memberData.rollNumber).trim() : (existing.rollNumber || 'N/A'),
        school: memberData.school ? String(memberData.school).trim() : (existing.school || 'N/A'),
        department: memberData.department ? String(memberData.department).trim() : (existing.department || 'N/A'),
        section: memberData.section ? String(memberData.section).trim() : (existing.section || 'N/A'),
        currentYear: memberData.currentYear ? String(memberData.currentYear).trim() : (existing.currentYear || 'N/A'),
        contactNumber: memberData.contactNumber ? String(memberData.contactNumber).trim() : (existing.contactNumber || 'N/A'),
        gmail: emailKey,
        interestedDomain: memberData.interestedDomain ? String(memberData.interestedDomain).trim() : (existing.interestedDomain || 'Quantitative Finance'),
        updatedAt: Date.now()
      });

      membersMap[emailKey] = updatedMember;
      safeSetStorage(KEYS.MEMBERS, membersMap);
      return updatedMember;
    },

    // --- STUDENT REGISTRATIONS ---

    /**
     * Retrieve array of joined event IDs for a specific student email.
     */
    getJoinedEventIds: function (studentEmail) {
      if (!studentEmail) return [];
      this.init();
      const regs = safeGetStorage(KEYS.REGISTRATIONS, SEED_REGISTRATIONS);
      const emailKey = String(studentEmail).trim().toLowerCase();
      return Array.isArray(regs[emailKey]) ? regs[emailKey] : [];
    },

    /**
     * Check whether a student has joined a specific event.
     */
    isEventJoined: function (studentEmail, eventId) {
      const joinedIds = this.getJoinedEventIds(studentEmail);
      return joinedIds.indexOf(eventId) !== -1;
    },

    /**
     * Toggle join status of an event for a student.
     * Returns true if joined, false if unjoined.
     */
    toggleJoinEvent: function (studentEmail, eventId) {
      if (!studentEmail || !eventId) return false;
      this.init();
      const regs = safeGetStorage(KEYS.REGISTRATIONS, SEED_REGISTRATIONS);
      const emailKey = String(studentEmail).trim().toLowerCase();
      let joinedIds = Array.isArray(regs[emailKey]) ? regs[emailKey].slice() : [];

      const existingIndex = joinedIds.indexOf(eventId);
      let isNowJoined = false;

      if (existingIndex !== -1) {
        joinedIds.splice(existingIndex, 1);
        isNowJoined = false;
      } else {
        joinedIds.push(eventId);
        isNowJoined = true;
      }

      regs[emailKey] = joinedIds;
      safeSetStorage(KEYS.REGISTRATIONS, regs);
      return isNowJoined;
    },

    /**
     * Retrieve array of full event objects joined by a student.
     */
    getJoinedEvents: function (studentEmail) {
      if (!studentEmail) return [];
      const joinedIds = this.getJoinedEventIds(studentEmail);
      const events = this.getEvents(studentEmail);
      return events.filter(function (evt) {
        return joinedIds.indexOf(evt.id) !== -1;
      });
    },

    /**
     * Retrieve array of full student member profile objects registered for a specific eventId.
     * Conceptually:
     *   eventId -> matrix_student_registrations (reverse lookup) -> array of student emails -> resolve from matrix_members
     */
    getRegisteredStudentsForEvent: function (eventId) {
      if (!eventId) return [];
      this.init();
      const regs = safeGetStorage(KEYS.REGISTRATIONS, SEED_REGISTRATIONS);
      const membersMap = this.getMembersMap();

      const registeredStudents = [];
      const seenEmails = {};

      Object.keys(regs).forEach(function (emailKey) {
        const joinedIds = Array.isArray(regs[emailKey]) ? regs[emailKey] : [];
        if (joinedIds.indexOf(eventId) !== -1 && !seenEmails[emailKey]) {
          seenEmails[emailKey] = true;
          const profile = membersMap[emailKey] || {
            name: emailKey.split('@')[0].replace(/[\._]/g, ' ').replace(/\b\w/g, function (l) { return l.toUpperCase(); }),
            regNumber: '2024REG' + (1000 + Math.floor(Math.random() * 8000)),
            rollNumber: '24STU' + (10 + Math.floor(Math.random() * 80)),
            school: 'School of Computer Science & Engineering',
            department: 'FinTech & Analytics',
            section: 'SEC-A',
            currentYear: '2nd Year',
            contactNumber: '+91 98765 00000',
            gmail: emailKey,
            interestedDomain: 'Quantitative Finance & Algo'
          };
          registeredStudents.push(profile);
        }
      });

      return registeredStudents;
    },

    // --- SESSION RECORDINGS & STUDENT ACTIVITY ---

    /**
     * Retrieve all online session recordings.
     */
    getRecordings: function () {
      this.init();
      return safeGetStorage(KEYS.RECORDINGS, SEED_RECORDINGS);
    },

    /**
     * Retrieve a single recording by ID.
     */
    getRecordingById: function (id) {
      const recordings = this.getRecordings();
      for (let i = 0; i < recordings.length; i++) {
        if (recordings[i].id === id) {
          return recordings[i];
        }
      }
      return null;
    },

    /**
     * Save a new recording / session masterclass.
     */
    saveRecording: function (recordingData) {
      if (!recordingData || !recordingData.title) return null;
      this.init();
      const recordings = this.getRecordings();
      const newId = 'rec-' + Date.now();

      const newRec = {
        id: newId,
        title: String(recordingData.title).trim(),
        type: String(recordingData.type || 'Workshop').trim(),
        date: String(recordingData.date || 'Recent').trim(),
        duration: String(recordingData.duration || '45m').trim(),
        durationSec: Number(recordingData.durationSec) || 2700,
        speaker: String(recordingData.speaker || 'MATRIX Technical Committee').trim(),
        banner: recordingData.banner || 'linear-gradient(135deg, #090d16, #1e293b)',
        videoUrl: recordingData.videoUrl || '',
        description: String(recordingData.description || '').trim(),
        takeaways: Array.isArray(recordingData.takeaways)
          ? recordingData.takeaways
          : (recordingData.takeaways ? String(recordingData.takeaways).split('\n').map(t => t.trim()).filter(Boolean) : [])
      };

      recordings.unshift(newRec);
      safeSetStorage(KEYS.RECORDINGS, recordings);
      return newRec;
    },

    /**
     * Update an existing recording / session masterclass.
     */
    updateRecording: function (recordingId, updatedData) {
      if (!recordingId || !updatedData) return null;
      this.init();
      const recordings = this.getRecordings();
      const index = recordings.findIndex(r => r.id === recordingId);
      if (index === -1) return null;

      const existing = recordings[index];
      recordings[index] = {
        ...existing,
        title: updatedData.title ? String(updatedData.title).trim() : existing.title,
        type: updatedData.type ? String(updatedData.type).trim() : existing.type,
        date: updatedData.date ? String(updatedData.date).trim() : existing.date,
        duration: updatedData.duration ? String(updatedData.duration).trim() : existing.duration,
        durationSec: Number(updatedData.durationSec) || existing.durationSec || 2700,
        speaker: updatedData.speaker ? String(updatedData.speaker).trim() : existing.speaker,
        banner: updatedData.banner || existing.banner,
        videoUrl: updatedData.videoUrl !== undefined ? updatedData.videoUrl : (existing.videoUrl || ''),
        description: updatedData.description !== undefined ? String(updatedData.description).trim() : existing.description,
        takeaways: Array.isArray(updatedData.takeaways)
          ? updatedData.takeaways
          : (updatedData.takeaways ? String(updatedData.takeaways).split('\n').map(t => t.trim()).filter(Boolean) : existing.takeaways)
      };

      safeSetStorage(KEYS.RECORDINGS, recordings);
      return recordings[index];
    },

    /**
     * Delete an existing recording / session masterclass.
     */
    deleteRecording: function (recordingId) {
      if (!recordingId) return false;
      this.init();
      const recordings = this.getRecordings();
      const filtered = recordings.filter(r => r.id !== recordingId);
      safeSetStorage(KEYS.RECORDINGS, filtered);
      return true;
    },

    /**
     * Retrieve activity object for a specific student.
     * Guaranteed student-specific isolation.
     */
    getStudentActivity: function (studentEmail) {
      if (!studentEmail) {
        return {
          totalSeconds: 0,
          websiteSeconds: 0,
          recordingSeconds: 0,
          sessionsWatched: 0,
          lastActive: Date.now()
        };
      }
      this.init();
      const activityMap = safeGetStorage(KEYS.ACTIVITY, SEED_ACTIVITY);
      const emailKey = String(studentEmail).trim().toLowerCase();

      if (!activityMap[emailKey]) {
        activityMap[emailKey] = {
          totalSeconds: 0,
          websiteSeconds: 0,
          recordingSeconds: 0,
          sessionsWatched: 0,
          lastActive: Date.now()
        };
        safeSetStorage(KEYS.ACTIVITY, activityMap);
      }

      return activityMap[emailKey];
    },

    /**
     * Update active time and learning metrics for a student.
     */
    updateStudentActivity: function (studentEmail, deltaWebsiteSec, deltaRecordingSec, incrementSessionsWatched) {
      if (!studentEmail) return null;
      this.init();
      const activityMap = safeGetStorage(KEYS.ACTIVITY, SEED_ACTIVITY);
      const emailKey = String(studentEmail).trim().toLowerCase();

      const existing = activityMap[emailKey] || {
        totalSeconds: 0,
        websiteSeconds: 0,
        recordingSeconds: 0,
        sessionsWatched: 0,
        lastActive: Date.now()
      };

      const webSec = Math.max(0, Number(deltaWebsiteSec) || 0);
      const recSec = Math.max(0, Number(deltaRecordingSec) || 0);
      const incWatched = incrementSessionsWatched ? 1 : 0;

      const newWeb = Math.round(existing.websiteSeconds + webSec);
      const newRec = Math.round(existing.recordingSeconds + recSec);

      const updated = {
        websiteSeconds: newWeb,
        recordingSeconds: newRec,
        totalSeconds: newWeb + newRec,
        sessionsWatched: existing.sessionsWatched + incWatched,
        lastActive: Date.now()
      };

      activityMap[emailKey] = updated;
      safeSetStorage(KEYS.ACTIVITY, activityMap);
      return updated;
    },

    // --- MOCK SESSION / USER MANAGEMENT ---

    /**
     * Retrieve active mock user session object.
     */
    getCurrentUser: function () {
      return safeGetStorage(KEYS.CURRENT_USER, null);
    },

    /**
     * Set active mock user session object.
     */
    setCurrentUser: function (userObj) {
      if (!userObj) {
        return this.clearCurrentUser();
      }
      const session = {
        role: userObj.role || 'student',
        email: String(userObj.email || '').trim().toLowerCase(),
        loginTime: Date.now()
      };
      safeSetStorage(KEYS.CURRENT_USER, session);
      return session;
    },

    /**
     * Clear active mock user session.
     */
    clearCurrentUser: function () {
      try {
        window.localStorage.removeItem(KEYS.CURRENT_USER);
      } catch (err) {
        console.warn('[PortalStore] Error clearing current user:', err);
      }
    },

    /**
     * Resolve role-aware dashboard destination URL.
     * Returns:
     * - 'student-portal.html' for students
     * - 'admin-portal.html' for administrators
     * - 'login.html' for unauthenticated / logged-out users
     */
    getDashboardUrl: function () {
      const user = this.getCurrentUser();
      if (!user || !user.role) {
        return 'login.html';
      }
      if (user.role === 'student') {
        return 'student-portal.html';
      }
      if (user.role === 'admin') {
        return 'admin-portal.html';
      }
      return 'login.html';
    },

    /**
     * Navigate directly to the role-aware dashboard.
     */
    navigateToDashboard: function () {
      window.location.href = this.getDashboardUrl();
    },

    /**
     * Reset store back to default seed data (useful for testing/reset).
     */
    resetStore: function () {
      safeSetStorage(KEYS.EVENTS, SEED_EVENTS);
      safeSetStorage(KEYS.MEMBERS, SEED_MEMBERS);
      safeSetStorage(KEYS.REGISTRATIONS, SEED_REGISTRATIONS);
      safeSetStorage(KEYS.RECORDINGS, SEED_RECORDINGS);
      safeSetStorage(KEYS.ACTIVITY, SEED_ACTIVITY);
      this.clearCurrentUser();
    }
  };

  // Auto-initialize store on script load
  PortalStore.init();

  // Export to window
  window.PortalStore = PortalStore;

  // Global listener for role-aware Dashboard links and mobile nav toggle across pages
  if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', function () {
      const navToggle = document.getElementById('navToggle');
      const mobileMenu = document.getElementById('mobileMenu');
      if (navToggle && mobileMenu) {
        let open = false;
        navToggle.addEventListener('click', function (e) {
          e.preventDefault();
          open = !open;
          mobileMenu.classList.toggle('open', open);
          navToggle.classList.toggle('active', open);
          document.body.style.overflow = open ? 'hidden' : '';
        });

        mobileMenu.querySelectorAll('a').forEach(function (a) {
          a.addEventListener('click', function () {
            open = false;
            mobileMenu.classList.remove('open');
            navToggle.classList.remove('active');
            document.body.style.overflow = '';
          });
        });
      }
    });

    document.addEventListener('click', function (e) {
      const signOutTarget = e.target.closest('.nav-signout-btn, #navSignOutBtn, #mobileSignOutBtn');
      if (signOutTarget) {
        e.preventDefault();
        PortalStore.clearCurrentUser();
        window.location.href = 'login.html';
        return;
      }

      const target = e.target.closest('.nav-dashboard-link, .nav-dashboard-btn, #navDashboardLink, #navDashboardBtn, #mobileNavDashboardLink');
      if (target) {
        e.preventDefault();
        window.location.href = PortalStore.getDashboardUrl();
      }
    });
  }

})(typeof window !== 'undefined' ? window : this);
