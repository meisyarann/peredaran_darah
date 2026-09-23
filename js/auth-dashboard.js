/**
 * AUTHENTICATION & DASHBOARD CONTROLLER - HEMOEXPLORER
 * Kredensial Login:
 * Username : meisyaranny
 * Password : emeeii123
 */

class AuthManager {
  constructor() {
    this.validCredentials = {
      username: 'meisyaranny',
      password: 'emeeii123',
      name: 'Meisya Ranny',
      role: 'Guru Pengajar',
      school: 'SD Kelas VI • IPA Kurikulum Merdeka',
      avatar: '👩‍🏫',
      email: 'meisyaranny@sekolah.id'
    };

    this.storageKey = 'hemoexplorer_auth_user';
    this.studentStorageKey = 'hemoexplorer_student_session';
    
    this.currentUser = this.loadUser();
    this.currentStudent = this.loadStudent();
  }

  // --- 1. MANAJEMEN DATA GURU ---
  loadUser() {
    try {
      const data = localStorage.getItem(this.storageKey);
      return data ? JSON.parse(data) : null;
    } catch (e) {
      return null;
    }
  }

  isLoggedIn() {
    return this.currentUser !== null;
  }

  login(username, password) {
    const cleanUser = (username || '').trim().toLowerCase();
    const cleanPass = (password || '').trim();

    if (cleanUser === this.validCredentials.username.toLowerCase() && cleanPass === this.validCredentials.password) {
      const sessionUser = {
        username: this.validCredentials.username,
        name: this.validCredentials.name,
        role: this.validCredentials.role,
        school: this.validCredentials.school,
        avatar: this.validCredentials.avatar,
        email: this.validCredentials.email,
        loginTime: new Date().toISOString()
      };

      this.currentUser = sessionUser;
      localStorage.setItem(this.storageKey, JSON.stringify(sessionUser));
      this.updateUI();

      if (window.audioMgr) window.audioMgr.playCorrectSound();
      if (window.quizEngine && window.quizEngine.launchConfetti) {
        window.quizEngine.launchConfetti();
      }

      this.closeLoginModal();
      
      // Buka dashboard langsung
      if (window.navigateTo) {
        window.navigateTo('view-dashboard');
      }
      if (window.dashboardMgr) {
        window.dashboardMgr.renderDashboard();
      }

      this.showToast('🎉 Login Guru Berhasil! Selamat datang Ibu ' + sessionUser.name, 'success');
      return { success: true };
    } else {
      if (window.audioMgr) window.audioMgr.playWrongSound();
      return {
        success: false,
        message: 'Username atau password Guru salah! Silakan periksa kembali.'
      };
    }
  }

  logout() {
    if (confirm('Apakah Anda yakin ingin keluar dari Akun Guru?')) {
      if (window.audioMgr) window.audioMgr.playClickSound();
      this.currentUser = null;
      localStorage.removeItem(this.storageKey);
      this.updateUI();

      if (window.navigateTo) {
        window.navigateTo('view-beranda');
      }

      this.showToast('👋 Anda telah keluar dari Akun Guru.', 'info');
    }
  }

  openLoginModal(redirectMessage = null) {
    if (window.audioMgr) window.audioMgr.playClickSound();
    const modal = document.getElementById('auth-login-modal');
    const msgEl = document.getElementById('auth-modal-redirect-msg');
    const errorEl = document.getElementById('auth-error-msg');
    
    if (errorEl) errorEl.style.display = 'none';

    if (msgEl) {
      if (redirectMessage) {
        msgEl.textContent = redirectMessage;
        msgEl.style.display = 'block';
      } else {
        msgEl.style.display = 'none';
      }
    }

    if (modal) {
      modal.style.display = 'flex';
      const userInput = document.getElementById('auth-input-username');
      if (userInput) userInput.focus();
    }
  }

  closeLoginModal() {
    const modal = document.getElementById('auth-login-modal');
    if (modal) modal.style.display = 'none';
  }

  fillDemoCredentials() {
    if (window.audioMgr) window.audioMgr.playClickSound();
    const userInput = document.getElementById('auth-input-username');
    const passInput = document.getElementById('auth-input-password');
    if (userInput) userInput.value = this.validCredentials.username;
    if (passInput) passInput.value = this.validCredentials.password;
  }

  togglePasswordVisibility() {
    const passInput = document.getElementById('auth-input-password');
    const toggleBtn = document.getElementById('auth-toggle-pass-btn');
    if (!passInput) return;

    if (passInput.type === 'password') {
      passInput.type = 'text';
      if (toggleBtn) toggleBtn.textContent = '🙈';
    } else {
      passInput.type = 'password';
      if (toggleBtn) toggleBtn.textContent = '👁️';
    }
  }

  handleAuthButtonClick() {
    if (this.isLoggedIn()) {
      if (window.navigateTo) window.navigateTo('view-dashboard');
    } else {
      this.openLoginModal();
    }
  }

  // --- 2. MANAJEMEN DATA SISWA (LANGSUNG NAMA & KELAS) ---
  loadStudent() {
    try {
      const data = localStorage.getItem(this.studentStorageKey);
      if (data) {
        const student = JSON.parse(data);
        if (window.quizEngine) {
          window.quizEngine.studentName = student.name;
        }
        return student;
      }
      return null;
    } catch (e) {
      return null;
    }
  }

  saveStudent(name, className) {
    if (!name || !name.trim()) return false;
    const student = {
      name: name.trim(),
      className: (className || 'Kelas VI-A').trim(),
      avatar: '🎒',
      joinedAt: new Date().toISOString()
    };

    this.currentStudent = student;
    localStorage.setItem(this.studentStorageKey, JSON.stringify(student));

    if (window.quizEngine) {
      window.quizEngine.studentName = student.name;
    }

    this.updateUI();
    this.closeStudentModal();

    if (window.audioMgr) window.audioMgr.playCorrectSound();
    this.showToast(`✨ Selamat datang, ${student.name} (${student.className})! Selamat belajar!`, 'success');
    return true;
  }

  openStudentModal() {
    if (window.audioMgr) window.audioMgr.playClickSound();
    const modal = document.getElementById('student-entry-modal');
    if (modal) {
      modal.style.display = 'flex';
      const nameInput = document.getElementById('student-input-name');
      const classInput = document.getElementById('student-input-class');
      if (nameInput && this.currentStudent) {
        nameInput.value = this.currentStudent.name;
      }
      if (classInput && this.currentStudent && this.currentStudent.className) {
        classInput.value = this.currentStudent.className;
      }
      if (nameInput) nameInput.focus();
    }
  }

  closeStudentModal() {
    const modal = document.getElementById('student-entry-modal');
    if (modal) modal.style.display = 'none';
  }

  handleStudentButtonClick() {
    this.openStudentModal();
  }

  // --- 3. SINKRONISASI UI ---
  updateUI() {
    const authBtn = document.getElementById('btn-auth-trigger');
    const studentBtn = document.getElementById('btn-student-trigger');
    const homeLoginCard = document.getElementById('home-auth-shortcut-card');

    // UI Tombol Siswa
    if (studentBtn) {
      if (this.currentStudent) {
        studentBtn.innerHTML = `
          <span class="auth-btn-avatar">🎒</span>
          <span class="auth-btn-name">${this.currentStudent.name} (${this.currentStudent.className})</span>
        `;
        studentBtn.title = `Profil Siswa: ${this.currentStudent.name} • Klik untuk ubah`;
        studentBtn.classList.add('has-student');
      } else {
        studentBtn.innerHTML = `
          <span>🎒 Masuk Siswa</span>
        `;
        studentBtn.title = 'Klik untuk memasukkan Nama & Kelas Siswa';
        studentBtn.classList.remove('has-student');
      }
    }

    // UI Tombol Guru
    if (authBtn) {
      if (this.isLoggedIn()) {
        authBtn.innerHTML = `
          <span class="auth-btn-avatar">${this.currentUser.avatar}</span>
          <span class="auth-btn-name">${this.currentUser.name} (Guru)</span>
          <span class="auth-btn-status-dot online"></span>
        `;
        authBtn.title = 'Buka Dashboard Guru ' + this.currentUser.name;
        authBtn.classList.add('logged-in');
      } else {
        authBtn.innerHTML = `
          <svg class="nav-svg-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect width="18" height="11" x="3" y="11" rx="2" ry="2"/>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
          </svg>
          <span>👩‍🏫 Login Guru</span>
        `;
        authBtn.title = 'Login khusus Pengajar / Guru (Akses Dashboard)';
        authBtn.classList.remove('logged-in');
      }
    }

    // UI Banner di Beranda
    if (homeLoginCard) {
      if (this.isLoggedIn()) {
        homeLoginCard.innerHTML = `
          <div class="shortcut-logged-banner">
            <div class="shortcut-info">
              <span class="user-badge-pulse">✨ Sesi Guru Aktif</span>
              <h3>Selamat Datang, Ibu ${this.currentUser.name}!</h3>
              <p>Kelola analitik siswa, buku nilai kelas VI, dan cetak sertifikat resmi di Dashboard Pengajar.</p>
            </div>
            <div class="shortcut-action">
              <button class="btn-cta-main" onclick="navigateTo('view-dashboard')">
                <span>🚀 Buka Dashboard Guru</span>
              </button>
            </div>
          </div>
        `;
      } else if (this.currentStudent) {
        homeLoginCard.innerHTML = `
          <div class="shortcut-logged-banner" style="background: linear-gradient(135deg, rgba(58, 134, 255, 0.1), rgba(6, 214, 160, 0.12)); border-color: rgba(58, 134, 255, 0.3);">
            <div class="shortcut-info">
              <span class="user-badge-pulse" style="background: rgba(58, 134, 255, 0.15); color: #3a86ff;">🎒 Siswa Aktif</span>
              <h3>Halo, ${this.currentStudent.name} (${this.currentStudent.className})!</h3>
              <p>Kamu sudah siap belajar! Raih skor tertinggi di kuis dan selesaikan tantangan investigasi PBL.</p>
            </div>
            <div class="shortcut-action" style="display: flex; gap: 10px; flex-wrap: wrap;">
              <button class="btn-cta-main" onclick="navigateTo('view-kuis')">
                <span>🏆 Mulai Kuis Prestasi</span>
              </button>
              <button class="btn-cta-secondary" onclick="window.authMgr.openStudentModal()" style="font-size: 0.88rem;">
                ✏️ Ubah Nama
              </button>
            </div>
          </div>
        `;
      } else {
        homeLoginCard.innerHTML = `
          <div class="shortcut-login-banner">
            <div class="shortcut-info">
              <span class="badge-tag-red">🎒 Untuk Siswa & Guru</span>
              <h3>Mulai Belajar Sistem Peredaran Darah</h3>
              <p><strong>Siswa:</strong> Masukkan nama & kelasmu untuk mencatat progres dan sertifikat. <br><strong>Guru:</strong> Login untuk mengakses Dashboard Analitik & Rekap Nilai.</p>
            </div>
            <div class="shortcut-action" style="display: flex; gap: 10px; flex-wrap: wrap;">
              <button class="btn-cta-main" style="background: linear-gradient(135deg, #3a86ff, #2563eb);" onclick="window.authMgr.openStudentModal()">
                <span>🎒 Masuk Siswa</span>
              </button>
              <button class="btn-cta-secondary" onclick="window.authMgr.openLoginModal()">
                <span>👩‍🏫 Login Guru</span>
              </button>
            </div>
          </div>
        `;
      }
    }
  }

  showToast(message, type = 'info') {
    let toast = document.getElementById('app-global-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'app-global-toast';
      toast.className = 'app-toast-container';
      document.body.appendChild(toast);
    }

    const toastItem = document.createElement('div');
    toastItem.className = `toast-item toast-${type} animate-slideDown`;
    toastItem.innerHTML = `
      <div class="toast-content">
        <span>${message}</span>
      </div>
    `;

    toast.appendChild(toastItem);
    setTimeout(() => {
      toastItem.classList.add('fade-out');
      setTimeout(() => toastItem.remove(), 400);
    }, 3500);
  }
}

// -------------------------------------------------------------
// DASHBOARD MANAGER - PENGELOLA KONTEN & STATISTIK DASHBOARD
// -------------------------------------------------------------
class DashboardManager {
  constructor() {
    this.currentTab = 'tab-overview';
    this.sampleStudents = [
      { id: 'SIS-01', name: 'Meisya Ranny', mudah: 100, sedang: 100, sulit: 90, pbl: '3 Kasus Tuntas', status: 'Sangat Memuaskan', notes: 'Pemahaman anatomi jantung & sirkulasi sangat tinggi' },
      { id: 'SIS-02', name: 'Ahmad Fauzan', mudah: 90, sedang: 80, sulit: 70, pbl: '2 Kasus Tuntas', status: 'Tuntas', notes: 'Perlu latihan rute peredaran darah besar' },
      { id: 'SIS-03', name: 'Siti Rahmawati', mudah: 100, sedang: 90, sulit: 80, pbl: '3 Kasus Tuntas', status: 'Sangat Memuaskan', notes: 'Sangat aktif pada simulasi mikroskop virtual' },
      { id: 'SIS-04', name: 'Budi Santoso', mudah: 80, sedang: 70, sulit: 60, pbl: '2 Kasus Tuntas', status: 'Tuntas', notes: 'Mampu menjelaskan fungsi hemoglobin dengan baik' },
      { id: 'SIS-05', name: 'Cantika Putri', mudah: 100, sedang: 100, sulit: 100, pbl: '3 Kasus Tuntas', status: 'Sempurna ⭐', notes: 'Skor sempurna di semua kuis dan asesmen PBL' },
      { id: 'SIS-06', name: 'Dewi Lestari', mudah: 90, sedang: 80, sulit: 70, pbl: '3 Kasus Tuntas', status: 'Tuntas', notes: 'Refleksi studi kasus anemia sangat mendalam' },
      { id: 'SIS-07', name: 'Farhan Pratama', mudah: 70, sedang: 60, sulit: 50, pbl: '1 Kasus Tuntas', status: 'Perlu Bimbingan', notes: 'Perlu remedial perbedaan arteri dan vena' },
      { id: 'SIS-08', name: 'Gita Anggraini', mudah: 90, sedang: 90, sulit: 80, pbl: '3 Kasus Tuntas', status: 'Tuntas', notes: 'Kalkulator denyut nadi diuji dengan baik' }
    ];
  }

  init() {
    this.renderDashboard();
  }

  switchTab(tabId) {
    if (window.audioMgr) window.audioMgr.playClickSound();
    this.currentTab = tabId;

    document.querySelectorAll('.dash-nav-tab-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.dashTab === tabId);
    });

    document.querySelectorAll('.dash-tab-pane').forEach(pane => {
      pane.classList.toggle('active', pane.id === tabId);
    });
  }

  getQuizProgress() {
    try {
      return JSON.parse(localStorage.getItem('hematology_quiz_progress') || '{}');
    } catch (e) {
      return {};
    }
  }

  getPblProgress() {
    try {
      return JSON.parse(localStorage.getItem('hematology_pbl_progress') || '{}');
    } catch (e) {
      return {};
    }
  }

  renderDashboard() {
    const user = window.authMgr ? window.authMgr.currentUser : null;
    const profileContainer = document.getElementById('dash-profile-header');
    if (!profileContainer) return;

    if (!user) {
      profileContainer.innerHTML = `
        <div class="dash-locked-alert">
          <div class="lock-icon">🔒</div>
          <div class="lock-text">
            <h3>Akses Terbatas: Silakan Login Terlebih Dahulu</h3>
            <p>Halaman Dashboard khusus untuk akun <strong>Meisya Ranny</strong> (username: <code>meisyaranny</code>, password: <code>emeeii123</code>).</p>
          </div>
          <button class="btn-cta-main" onclick="window.authMgr.openLoginModal()">
            <span>🔑 Masuk Sekarang</span>
          </button>
        </div>
      `;
      document.getElementById('dash-main-content-wrap')?.style.setProperty('display', 'none');
      return;
    }

    document.getElementById('dash-main-content-wrap')?.style.setProperty('display', 'block');

    const quizProg = this.getQuizProgress();
    const pblProg = this.getPblProgress();

    // Hitung rata-rata skor
    let totalScore = 0;
    let completedCount = 0;
    if (quizProg.mudah) { totalScore += Number(quizProg.mudah.score); completedCount++; }
    if (quizProg.sedang) { totalScore += Number(quizProg.sedang.score); completedCount++; }
    if (quizProg.sulit) { totalScore += Number(quizProg.sulit.score); completedCount++; }
    const avgScore = completedCount > 0 ? Math.round(totalScore / completedCount) : 0;

    // Hitung PBL selesai
    const pblCount = Object.keys(pblProg).length;

    // Header Profile
    profileContainer.innerHTML = `
      <div class="dash-user-hero">
        <div class="user-hero-avatar-wrap">
          <div class="user-hero-avatar">${user.avatar}</div>
          <div class="user-online-badge">ONLINE</div>
        </div>
        <div class="user-hero-details">
          <div class="user-role-pill">⭐ ${user.role}</div>
          <h2>${user.name}</h2>
          <p class="user-school-txt">🏫 ${user.school} • ID: <code>${user.username}</code></p>
          <div class="user-last-login">
            <span>🕒 Sesi Masuk: ${new Date(user.loginTime).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} WIB</span>
            <span>•</span>
            <span class="user-status-ok">Sistem Terverifikasi</span>
          </div>
        </div>
        <div class="user-hero-actions">
          <button class="btn-cta-main" onclick="window.dashboardMgr.printTranscript()">
            <span>🖨️ Cetak Rapor Belajar</span>
          </button>
          <button class="btn-cta-secondary btn-logout" onclick="window.authMgr.logout()">
            <span>🚪 Keluar</span>
          </button>
        </div>
      </div>
    `;

    // KPI Cards
    const kpiWrap = document.getElementById('dash-kpi-grid');
    if (kpiWrap) {
      kpiWrap.innerHTML = `
        <div class="dash-kpi-card card-kpi-1">
          <div class="kpi-icon-badge">🏆</div>
          <div class="kpi-info">
            <span class="kpi-label">Rata-Rata Nilai Kuis</span>
            <h3 class="kpi-value">${completedCount > 0 ? avgScore : '100'} <small>/ 100</small></h3>
            <span class="kpi-subtext">${completedCount > 0 ? `${completedCount} Level Diselesaikan` : 'Siap Menempuh Kuis'}</span>
          </div>
        </div>

        <div class="dash-kpi-card card-kpi-2">
          <div class="kpi-icon-badge">🧪</div>
          <div class="kpi-info">
            <span class="kpi-label">Investigasi PBL</span>
            <h3 class="kpi-value">${pblCount > 0 ? pblCount : '3'} <small>/ 3 Kasus</small></h3>
            <span class="kpi-subtext">Studi Kasus Dokter Cilik</span>
          </div>
        </div>

        <div class="dash-kpi-card card-kpi-3">
          <div class="kpi-icon-badge">🎖️</div>
          <div class="kpi-info">
            <span class="kpi-label">Lencana Prestasi</span>
            <h3 class="kpi-value">5 <small>Lencana</small></h3>
            <span class="kpi-subtext">Dokter Cilik Teladan</span>
          </div>
        </div>

        <div class="dash-kpi-card card-kpi-4">
          <div class="kpi-icon-badge">⚡</div>
          <div class="kpi-info">
            <span class="kpi-label">Status Kelulusan</span>
            <h3 class="kpi-value" style="color: var(--emerald-green); font-size: 1.5rem;">LULUS LENGKAP</h3>
            <span class="kpi-subtext">Predikat: Sangat Baik</span>
          </div>
        </div>
      `;
    }

    // Render Tab 1: Quiz Overview
    this.renderQuizTab(quizProg);

    // Render Tab 2: PBL Portfolio
    this.renderPblTab(pblProg);

    // Render Tab 3: Student Roster
    this.renderStudentRosterTab();
  }

  renderQuizTab(quizProg) {
    const container = document.getElementById('dash-quiz-cards-wrap');
    if (!container) return;

    const levels = [
      { id: 'mudah', name: 'Tingkat Mudah', questions: '10 Soal Konsep Dasar', color: '#06d6a0', icon: '🟢' },
      { id: 'sedang', name: 'Tingkat Sedang', questions: '10 Soal Analisis Rute', color: '#ffbe0b', icon: '🟡' },
      { id: 'sulit', name: 'Tingkat Sulit', questions: '10 Soal Gangguan Klinis', color: '#ff0054', icon: '🔴' }
    ];

    container.innerHTML = levels.map(lvl => {
      const data = quizProg[lvl.id] || { score: 100, percentage: 100, date: new Date().toLocaleDateString('id-ID') };
      const hasTaken = quizProg[lvl.id] !== undefined;

      return `
        <div class="dash-quiz-item-card" style="border-top-color: ${lvl.color}">
          <div class="dash-quiz-head">
            <div class="dash-quiz-icon">${lvl.icon}</div>
            <div>
              <h4>${lvl.name}</h4>
              <p class="dash-quiz-sub">${lvl.questions}</p>
            </div>
            <span class="dash-status-pill ${hasTaken ? 'done' : 'ready'}">
              ${hasTaken ? '✅ Tuntas' : '⭐ Nilai Default: 100'}
            </span>
          </div>

          <div class="dash-quiz-stats-row">
            <div class="dash-score-stat">
              <span class="score-num" style="color: ${lvl.color}">${data.score}</span>
              <span class="score-unit">Poin</span>
            </div>
            <div class="dash-score-stat">
              <span class="score-num" style="color: var(--cardiac-blue)">${data.percentage}%</span>
              <span class="score-unit">Akurasi</span>
            </div>
            <div class="dash-score-stat">
              <span class="score-num" style="font-size: 1rem; color: var(--text-muted); margin-top: 8px;">${data.date || 'Hari Ini'}</span>
              <span class="score-unit">Tanggal</span>
            </div>
          </div>

          <div class="dash-quiz-actions">
            <button class="btn-cta-main" style="padding: 10px 16px; font-size: 0.88rem;" onclick="navigateTo('view-quiz'); window.quizEngine.startQuiz('${lvl.id}')">
              <span>▶️ Kerjakan Kuis</span>
            </button>
            <button class="btn-cta-secondary" style="padding: 10px 16px; font-size: 0.88rem;" onclick="window.dashboardMgr.claimCert('${lvl.name}')">
              <span>📜 Klaim Sertifikat</span>
            </button>
          </div>
        </div>
      `;
    }).join('');
  }

  renderPblTab(pblProg) {
    const container = document.getElementById('dash-pbl-portfolio-wrap');
    if (!container) return;

    const cases = [
      { id: 0, title: 'Kasus 1: Hidung Berdarah Saat Upacara', badge: '🩸 Trombosit & Pembekuan', icon: '🚨', score: 100 },
      { id: 1, title: 'Kasus 2: Wajah Pucat & Cepat Lelah', badge: '🩺 Eritrosit & Anemia', icon: '😴', score: 95 },
      { id: 2, title: 'Kasus 3: Jantung Berdebar & Nadi Cepat', badge: '💓 Sirkulasi & Olahraga', icon: '🏃', score: 100 }
    ];

    container.innerHTML = cases.map(c => `
      <div class="dash-pbl-item-card">
        <div class="dash-pbl-header">
          <div class="dash-pbl-icon">${c.icon}</div>
          <div>
            <h4>${c.title}</h4>
            <span class="section-badge" style="margin-bottom: 0; padding: 4px 10px; font-size: 0.75rem;">${c.badge}</span>
          </div>
          <div class="pbl-card-score">
            <span class="score-val">${c.score}</span>
            <span class="score-max">/ 100</span>
          </div>
        </div>

        <div class="dash-pbl-steps-flow">
          <div class="step-chip completed">1. Orientasi ✅</div>
          <div class="step-chip completed">2. Organisasi ✅</div>
          <div class="step-chip completed">3. Virtual Lab ✅</div>
          <div class="step-chip completed">4. Solusi ✅</div>
          <div class="step-chip completed">5. Refleksi ✅</div>
        </div>

        <div class="dash-pbl-footer-actions">
          <button class="btn-cta-secondary" style="padding: 8px 16px; font-size: 0.85rem;" onclick="navigateTo('view-pbl'); window.pblManager.loadCase(${c.id});">
            <span>🔍 Buka Kasus</span>
          </button>
          <button class="btn-cta-main" style="padding: 8px 16px; font-size: 0.85rem;" onclick="window.pblManager.loadCase(${c.id}); window.pblManager.downloadPBLReport(${c.score});">
            <span>📄 Cetak Laporan PBL</span>
          </button>
        </div>
      </div>
    `).join('');
  }

  renderStudentRosterTab() {
    const tableBody = document.getElementById('dash-students-table-body');
    if (!tableBody) return;

    tableBody.innerHTML = this.sampleStudents.map((s, idx) => `
      <tr>
        <td><strong>${idx + 1}</strong></td>
        <td>
          <div class="student-cell-profile">
            <span class="student-avatar-circle">${s.name.charAt(0)}</span>
            <div>
              <strong>${s.name}</strong>
              <small class="student-id-txt">${s.id}</small>
            </div>
          </div>
        </td>
        <td><span class="badge-table-score score-green">${s.mudah}</span></td>
        <td><span class="badge-table-score score-yellow">${s.sedang}</span></td>
        <td><span class="badge-table-score score-red">${s.sulit}</span></td>
        <td><span class="badge-table-pbl">${s.pbl}</span></td>
        <td>
          <span class="badge-status-tuntas">${s.status}</span>
        </td>
        <td class="student-notes-cell">
          <span title="${s.notes}">${s.notes}</span>
        </td>
      </tr>
    `).join('');
  }

  filterStudents(query) {
    const q = (query || '').toLowerCase();
    const rows = document.querySelectorAll('#dash-students-table-body tr');
    rows.forEach(r => {
      const text = r.textContent.toLowerCase();
      r.style.display = text.includes(q) ? '' : 'none';
    });
  }

  exportStudentsCSV() {
    if (window.audioMgr) window.audioMgr.playClickSound();
    let csv = 'No,ID Siswa,Nama Lengkap,Kuis Mudah,Kuis Sedang,Kuis Sulit,Asesmen PBL,Status,Catatan Guru\n';
    this.sampleStudents.forEach((s, i) => {
      csv += `"${i + 1}","${s.id}","${s.name}","${s.mudah}","${s.sedang}","${s.sulit}","${s.pbl}","${s.status}","${s.notes}"\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `Rekap_Nilai_Sistem_Peredaran_Darah_Kelas_VI_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    window.authMgr.showToast('📥 Berhasil mengekspor data rekap nilai siswa (CSV)!', 'success');
  }

  claimCert(levelTitle) {
    const user = window.authMgr ? window.authMgr.currentUser : null;
    const name = user ? user.name : 'Meisya Ranny';
    if (window.quizEngine) {
      window.quizEngine.generateCertificate(name);
    }
  }

  printTranscript() {
    if (window.audioMgr) window.audioMgr.playClickSound();
    const user = window.authMgr ? window.authMgr.currentUser : { name: 'Meisya Ranny', school: 'SD Kelas VI' };
    const today = new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    const printWin = window.open('', '_blank');

    printWin.document.write(`
      <!DOCTYPE html>
      <html lang="id">
      <head>
        <meta charset="UTF-8">
        <title>Rapor Capaian Pembelajaran - ${user.name}</title>
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #1e293b; padding: 40px; margin: 0; }
          .header { text-align: center; border-bottom: 3px double #e2e8f0; padding-bottom: 20px; margin-bottom: 25px; }
          .header h1 { font-size: 20px; color: #d90429; margin: 0 0 6px 0; text-transform: uppercase; }
          .header p { margin: 2px 0; font-size: 13px; color: #64748b; }
          .info-table { width: 100%; border-collapse: collapse; margin-bottom: 25px; font-size: 14px; }
          .info-table td { padding: 6px 12px; }
          .info-table tr:nth-child(even) { background-color: #f8fafc; }
          .score-table { width: 100%; border-collapse: collapse; margin-bottom: 30px; font-size: 14px; }
          .score-table th, .score-table td { border: 1px solid #cbd5e1; padding: 10px 14px; text-align: left; }
          .score-table th { background: #f1f5f9; color: #0f172a; font-weight: bold; }
          .badge { display: inline-block; padding: 3px 8px; border-radius: 4px; font-weight: bold; font-size: 12px; }
          .badge-tuntas { background: #dcfce7; color: #15803d; }
          .footer-sign { display: flex; justify-content: space-between; margin-top: 60px; font-size: 14px; }
          .sign-box { text-align: center; width: 220px; }
          .sign-space { height: 70px; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>RAPOR PRESTASI PEMBELAJARAN INTERAKTIF</h1>
          <p><strong>Topik: Sistem Peredaran Darah Manusia • Kelas VI Sekolah Dasar</strong></p>
          <p>Media Berbasis Digital 3D Simulation & Problem-Based Learning (HemoExplorer)</p>
        </div>

        <table class="info-table">
          <tr>
            <td width="25%"><strong>Nama Siswa / Pengguna</strong></td>
            <td width="2%">:</td>
            <td><strong>${user.name}</strong></td>
            <td width="20%"><strong>Tanggal Cetak</strong></td>
            <td width="2%">:</td>
            <td>${today}</td>
          </tr>
          <tr>
            <td><strong>Username Akun</strong></td>
            <td>:</td>
            <td><code>${user.username}</code></td>
            <td><strong>Status Kelulusan</strong></td>
            <td>:</td>
            <td><strong style="color: #15803d;">LULUS SANGAT BAIK ⭐</strong></td>
          </tr>
          <tr>
            <td><strong>Jenjang & Kelas</strong></td>
            <td>:</td>
            <td>${user.school}</td>
            <td><strong>Predikat Akhir</strong></td>
            <td>:</td>
            <td>Dokter Cilik Teladan (A+)</td>
          </tr>
        </table>

        <h3 style="font-size: 16px; margin-bottom: 10px; color: #0f172a;">A. Rekapitulasi Nilai Kuis 3 Tingkat</h3>
        <table class="score-table">
          <thead>
            <tr>
              <th width="8%">No</th>
              <th>Komponen Uji Kompetensi</th>
              <th width="20%">Capaian Nilai</th>
              <th width="20%">Tingkat Akurasi</th>
              <th width="20%">Status</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>1</td>
              <td>Kuis Tingkat Mudah (Anatomi & Komponen)</td>
              <td><strong>100 / 100</strong></td>
              <td>100%</td>
              <td><span class="badge badge-tuntas">Tuntas Sempurna</span></td>
            </tr>
            <tr>
              <td>2</td>
              <td>Kuis Tingkat Sedang (Sirkulasi Darah Besar & Kecil)</td>
              <td><strong>100 / 100</strong></td>
              <td>100%</td>
              <td><span class="badge badge-tuntas">Tuntas Sempurna</span></td>
            </tr>
            <tr>
              <td>3</td>
              <td>Kuis Tingkat Sulit (Analisis Gangguan & Penyakit)</td>
              <td><strong>95 / 100</strong></td>
              <td>95%</td>
              <td><span class="badge badge-tuntas">Tuntas Sangat Baik</span></td>
            </tr>
          </tbody>
        </table>

        <h3 style="font-size: 16px; margin-bottom: 10px; color: #0f172a;">B. Rekapitulasi Portofolio Problem-Based Learning (PBL)</h3>
        <table class="score-table">
          <thead>
            <tr>
              <th width="8%">No</th>
              <th>Studi Kasus Penyelidikan</th>
              <th width="25%">Fokus Saintifik</th>
              <th width="18%">Skor Investigasi</th>
              <th width="18%">Status Sintaks</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>1</td>
              <td>Kasus 1: Hidung Berdarah Saat Upacara</td>
              <td>Trombosit & Pembekuan Darah</td>
              <td><strong>100 / 100</strong></td>
              <td><span class="badge badge-tuntas">5 Tahap Selesai</span></td>
            </tr>
            <tr>
              <td>2</td>
              <td>Kasus 2: Wajah Pucat & Cepat Lelah</td>
              <td>Eritrosit & Penanganan Anemia</td>
              <td><strong>95 / 100</strong></td>
              <td><span class="badge badge-tuntas">5 Tahap Selesai</span></td>
            </tr>
            <tr>
              <td>3</td>
              <td>Kasus 3: Jantung Berdebar Saat Olahraga</td>
              <td>Frekuensi Nadi & Sirkulasi</td>
              <td><strong>100 / 100</strong></td>
              <td><span class="badge badge-tuntas">5 Tahap Selesai</span></td>
            </tr>
          </tbody>
        </table>

        <div class="footer-sign">
          <div class="sign-box">
            <p>Mengetahui,<br>Kepala Sekolah / Instruktur</p>
            <div class="sign-space"></div>
            <p><strong>( Dr. Hemi, M.Pd. )</strong><br><small>NIP. 19850612 201001 1 008</small></p>
          </div>

          <div class="sign-box">
            <p>Siswa / Peserta Didik,<br>&nbsp;</p>
            <div class="sign-space"></div>
            <p><strong>( ${user.name} )</strong><br><small>ID: ${user.username}</small></p>
          </div>
        </div>
      </body>
      </html>
    `);

    printWin.document.close();
    printWin.focus();
    setTimeout(() => {
      printWin.print();
    }, 600);
  }
}

// Inisialisasi Instance Global
window.authMgr = new AuthManager();
window.dashboardMgr = new DashboardManager();
