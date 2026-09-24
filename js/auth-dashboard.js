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

  loginAsTeacherFromPortal() {
    if (window.audioMgr) window.audioMgr.playClickSound();
    const userInput = document.getElementById('portal-teacher-username');
    const passInput = document.getElementById('portal-teacher-password');

    const username = userInput ? userInput.value : '';
    const password = passInput ? passInput.value : '';

    const res = this.login(username, password);
    if (!res.success) {
      alert(res.message);
      if (passInput) passInput.focus();
    }
  }

  loginAsStudentFromPortal() {
    if (window.audioMgr) window.audioMgr.playClickSound();
    const nameInput = document.getElementById('portal-student-name');
    const classInput = document.getElementById('portal-student-class');
    const avatarInput = document.getElementById('portal-student-avatar');

    const name = nameInput ? nameInput.value : '';
    const className = classInput ? classInput.value : 'Kelas VI-A';
    const avatar = avatarInput ? avatarInput.value : '🎒';

    if (!name || !name.trim()) {
      alert('Silakan masukkan nama lengkap siswa terlebih dahulu!');
      if (nameInput) nameInput.focus();
      return;
    }

    this.saveStudent(name, className, avatar);

    if (window.navigateTo) {
      window.navigateTo('view-beranda');
    }
  }

  fillPortalTeacherDemo() {
    if (window.audioMgr) window.audioMgr.playClickSound();
    const userInput = document.getElementById('portal-teacher-username');
    const passInput = document.getElementById('portal-teacher-password');
    if (userInput) userInput.value = this.validCredentials.username;
    if (passInput) passInput.value = this.validCredentials.password;
    this.showToast('⚡ Kredensial Guru terisi otomatis!', 'info');
  }

  togglePortalPasswordVisibility() {
    const passInput = document.getElementById('portal-teacher-password');
    if (!passInput) return;
    passInput.type = passInput.type === 'password' ? 'text' : 'password';
  }

  handleAuthButtonClick() {
    if (this.isLoggedIn()) {
      if (window.navigateTo) window.navigateTo('view-dashboard');
    } else {
      if (window.navigateTo) window.navigateTo('view-portal');
      else this.openLoginModal();
    }
  }

  // --- 2. MANAJEMEN DATA SISWA (PENDAFTARAN & REKAPITULASI PENILAIAN) ---
  getDefaultRoster() {
    return [
      { id: 'SIS-01', name: 'Meisya Ranny', className: 'Kelas VI-A', avatar: '👩‍🎓', mudah: 100, sedang: 100, sulit: 90, pbl: '3 Kasus Tuntas', pblScore: 100, status: 'Sangat Memuaskan', notes: 'Pemahaman anatomi jantung & sirkulasi sangat tinggi', joinedAt: new Date().toISOString(), loginTime: new Date(Date.now() - 3600000).toISOString(), lastActive: new Date().toISOString() },
      { id: 'SIS-02', name: 'Ahmad Fauzan', className: 'Kelas VI-A', avatar: '👦', mudah: 90, sedang: 80, sulit: 70, pbl: '2 Kasus Tuntas', pblScore: 85, status: 'Tuntas', notes: 'Perlu latihan rute peredaran darah besar', joinedAt: new Date().toISOString(), loginTime: new Date(Date.now() - 7200000).toISOString(), lastActive: new Date().toISOString() },
      { id: 'SIS-03', name: 'Siti Rahmawati', className: 'Kelas VI-A', avatar: '👧', mudah: 100, sedang: 90, sulit: 80, pbl: '3 Kasus Tuntas', pblScore: 95, status: 'Sangat Memuaskan', notes: 'Sangat aktif pada simulasi mikroskop virtual', joinedAt: new Date().toISOString(), loginTime: new Date(Date.now() - 10800000).toISOString(), lastActive: new Date().toISOString() },
      { id: 'SIS-04', name: 'Budi Santoso', className: 'Kelas VI-A', avatar: '👦', mudah: 80, sedang: 70, sulit: 60, pbl: '2 Kasus Tuntas', pblScore: 75, status: 'Tuntas', notes: 'Mampu menjelaskan fungsi hemoglobin dengan baik', joinedAt: new Date().toISOString(), loginTime: new Date(Date.now() - 14400000).toISOString(), lastActive: new Date().toISOString() },
      { id: 'SIS-05', name: 'Cantika Putri', className: 'Kelas VI-A', avatar: '👧', mudah: 100, sedang: 100, sulit: 100, pbl: '3 Kasus Tuntas', pblScore: 100, status: 'Sempurna ⭐', notes: 'Skor sempurna di semua kuis dan asesmen PBL', joinedAt: new Date().toISOString(), loginTime: new Date(Date.now() - 18000000).toISOString(), lastActive: new Date().toISOString() },
      { id: 'SIS-06', name: 'Dewi Lestari', className: 'Kelas VI-A', avatar: '👧', mudah: 90, sedang: 80, sulit: 70, pbl: '3 Kasus Tuntas', pblScore: 90, status: 'Tuntas', notes: 'Refleksi studi kasus anemia sangat mendalam', joinedAt: new Date().toISOString(), loginTime: new Date(Date.now() - 21600000).toISOString(), lastActive: new Date().toISOString() },
      { id: 'SIS-07', name: 'Farhan Pratama', className: 'Kelas VI-B', avatar: '👦', mudah: 70, sedang: 60, sulit: 50, pbl: '1 Kasus Tuntas', pblScore: 65, status: 'Perlu Bimbingan', notes: 'Perlu remedial perbedaan arteri dan vena', joinedAt: new Date().toISOString(), loginTime: new Date(Date.now() - 25200000).toISOString(), lastActive: new Date().toISOString() },
      { id: 'SIS-08', name: 'Gita Anggraini', className: 'Kelas VI-B', avatar: '👧', mudah: 90, sedang: 90, sulit: 80, pbl: '3 Kasus Tuntas', pblScore: 90, status: 'Tuntas', notes: 'Kalkulator denyut nadi diuji dengan baik', joinedAt: new Date().toISOString(), loginTime: new Date(Date.now() - 28800000).toISOString(), lastActive: new Date().toISOString() }
    ];
  }

  getRoster() {
    try {
      const data = localStorage.getItem('hemoexplorer_students_roster');
      if (data) {
        const parsed = JSON.parse(data);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
      const initial = this.getDefaultRoster();
      localStorage.setItem('hemoexplorer_students_roster', JSON.stringify(initial));
      return initial;
    } catch (e) {
      return this.getDefaultRoster();
    }
  }

  saveRoster(roster) {
    try {
      localStorage.setItem('hemoexplorer_students_roster', JSON.stringify(roster));
    } catch (e) {}
  }

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

  saveStudent(name, className, avatar = '🎒') {
    if (!name || !name.trim()) return false;
    const cleanName = name.trim();
    const cleanClass = (className || 'Kelas VI-A').trim();
    const nowIso = new Date().toISOString();

    const roster = this.getRoster();
    let student = roster.find(s => s.name.toLowerCase() === cleanName.toLowerCase());

    if (student) {
      // Perbarui info siswa jika sudah terdaftar
      student.className = cleanClass;
      if (avatar) student.avatar = avatar;
      student.loginTime = nowIso;
      student.lastActive = nowIso;
      // Geser siswa aktif ke urutan paling atas
      roster.splice(roster.indexOf(student), 1);
      roster.unshift(student);
    } else {
      // Daftarkan sebagai siswa baru di Buku Nilai Guru
      const nextNum = roster.length + 1;
      const nextId = `SIS-${String(nextNum).padStart(2, '0')}`;
      student = {
        id: nextId,
        name: cleanName,
        className: cleanClass,
        avatar: avatar || '🎒',
        mudah: '-',
        sedang: '-',
        sulit: '-',
        pbl: '0 Kasus',
        pblScore: 0,
        status: '🟢 Baru Login (Belum Mengerjakan)',
        notes: 'Siswa baru login ke sistem',
        joinedAt: nowIso,
        loginTime: nowIso,
        lastActive: nowIso
      };
      roster.unshift(student);
    }

    this.saveRoster(roster);

    const sessionStudent = {
      id: student.id,
      name: student.name,
      className: student.className,
      avatar: student.avatar || '🎒',
      loginTime: student.loginTime,
      joinedAt: student.joinedAt || nowIso
    };

    this.currentStudent = sessionStudent;
    localStorage.setItem(this.studentStorageKey, JSON.stringify(sessionStudent));

    if (window.quizEngine) {
      window.quizEngine.studentName = sessionStudent.name;
    }

    this.updateUI();
    this.closeStudentModal();

    if (window.updateDashboardStats) window.updateDashboardStats();
    if (window.dashboardMgr) window.dashboardMgr.renderDashboard();

    if (window.audioMgr) window.audioMgr.playCorrectSound();
    this.showToast(`✨ Selamat datang, ${sessionStudent.name} (${sessionStudent.className})! Data penilaianmu telah terhubung ke Buku Nilai Guru.`, 'success');
    return true;
  }

  // Rekam update nilai asesmen siswa ke Buku Nilai terpusat
  updateStudentScore(studentNameOrId, updates = {}) {
    try {
      const roster = this.getRoster();
      let targetName = (studentNameOrId || (this.currentStudent ? this.currentStudent.name : 'Meisya Ranny')).trim();
      let student = roster.find(s => s.name.toLowerCase() === targetName.toLowerCase() || s.id === studentNameOrId);

      if (!student) {
        const nextId = `SIS-${String(roster.length + 1).padStart(2, '0')}`;
        student = {
          id: nextId,
          name: targetName,
          className: this.currentStudent ? this.currentStudent.className : 'Kelas VI-A',
          mudah: '-',
          sedang: '-',
          sulit: '-',
          pbl: '0 Kasus',
          pblScore: 0,
          status: 'Sedang Belajar ⏳',
          notes: 'Mengerjakan asesmen mandiri',
          joinedAt: new Date().toISOString(),
          lastActive: new Date().toISOString()
        };
        roster.unshift(student);
      }

      // 1. Update Kuis Berdasarkan Level
      if (updates.level !== undefined && updates.score !== undefined) {
        const levelMap = {
          'mudah': 'mudah',
          'kecil': 'mudah',
          'sedang': 'sedang',
          'besar': 'sedang',
          'sulit': 'sulit',
          'gabungan': 'sulit'
        };
        const mappedLevel = levelMap[updates.level] || 'mudah';
        student[mappedLevel] = Number(updates.score);
      }

      // 2. Update PBL
      if (updates.pblCount !== undefined || updates.pbl !== undefined) {
        const count = updates.pblCount !== undefined ? updates.pblCount : (parseInt(updates.pbl) || 1);
        student.pbl = `${count} Kasus Tuntas`;
      }
      if (updates.pblScore !== undefined) {
        student.pblScore = Number(updates.pblScore);
      }
      if (updates.pblRefleksi && updates.pblRefleksi.trim()) {
        student.notes = `Refleksi: "${updates.pblRefleksi.trim()}"`;
      }

      // 3. Kalkulasi Otomatis Status Kelulusan
      const scores = [];
      if (typeof student.mudah === 'number') scores.push(student.mudah);
      if (typeof student.sedang === 'number') scores.push(student.sedang);
      if (typeof student.sulit === 'number') scores.push(student.sulit);

      if (scores.length > 0) {
        const avg = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
        if (scores.length === 3) {
          if (avg >= 95) student.status = 'Sempurna ⭐';
          else if (avg >= 85) student.status = 'Sangat Memuaskan';
          else if (avg >= 70) student.status = 'Tuntas';
          else student.status = 'Perlu Bimbingan';
        } else {
          student.status = `Tuntas (${scores.length}/3 Kuis)`;
        }

        if (!updates.pblRefleksi) {
          if (avg >= 90) student.notes = 'Pemahaman anatomi jantung & sirkulasi darah sangat tinggi';
          else if (avg >= 75) student.notes = 'Memahami konsep dasar peredaran darah dengan baik';
          else student.notes = 'Perlu pendalaman materi dan bimbingan guru';
        }
      }

      student.lastActive = new Date().toISOString();
      this.saveRoster(roster);

      // Sinkronkan ke Dashboard Guru
      if (window.dashboardMgr) {
        window.dashboardMgr.renderStudentRosterTab();
      }
    } catch (e) {
      console.error('Gagal memperbarui nilai siswa:', e);
    }
  }

  deleteStudent(studentId) {
    if (confirm('Apakah Anda yakin ingin menghapus data siswa ini dari Buku Nilai?')) {
      let roster = this.getRoster();
      roster = roster.filter(s => s.id !== studentId);
      this.saveRoster(roster);
      if (window.dashboardMgr) {
        window.dashboardMgr.renderStudentRosterTab();
      }
      this.showToast('🗑️ Data siswa berhasil dihapus dari Buku Nilai.', 'info');
    }
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
              <button class="btn-cta-main" onclick="navigateTo('view-quiz')">
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
    this.currentFilter = 'all';
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

    if (tabId === 'tab-students') {
      this.renderStudentRosterTab();
    }
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

    const roster = window.authMgr ? window.authMgr.getRoster() : [];
    const quizProg = this.getQuizProgress();
    const pblProg = this.getPblProgress();

    // Hitung rata-rata skor kelas dari data riil
    let totalScore = 0;
    let completedCount = 0;
    roster.forEach(s => {
      if (typeof s.mudah === 'number') { totalScore += s.mudah; completedCount++; }
      if (typeof s.sedang === 'number') { totalScore += s.sedang; completedCount++; }
      if (typeof s.sulit === 'number') { totalScore += s.sulit; completedCount++; }
    });
    const avgClassScore = completedCount > 0 ? Math.round(totalScore / completedCount) : 92;

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
            <span class="kpi-label">Rata-Rata Nilai Kelas</span>
            <h3 class="kpi-value">${avgClassScore} <small>/ 100</small></h3>
            <span class="kpi-subtext">${roster.length} Siswa Terdaftar</span>
          </div>
        </div>

        <div class="dash-kpi-card card-kpi-2">
          <div class="kpi-icon-badge">👥</div>
          <div class="kpi-info">
            <span class="kpi-label">Siswa Menyelesaikan PBL</span>
            <h3 class="kpi-value">${roster.filter(s => s.pbl && !s.pbl.startsWith('0')).length} <small>/ ${roster.length}</small></h3>
            <span class="kpi-subtext">Studi Kasus Dokter Cilik</span>
          </div>
        </div>

        <div class="dash-kpi-card card-kpi-3">
          <div class="kpi-icon-badge">🎮</div>
          <div class="kpi-info">
            <span class="kpi-label">Game HemoArcade</span>
            <h3 class="kpi-value">${parseInt(localStorage.getItem('hemo_game_high_score') || '0', 10)} <small>Poin</small></h3>
            <span class="kpi-subtext">Pahlawan Sirkulasi Darah</span>
          </div>
        </div>

        <div class="dash-kpi-card card-kpi-4">
          <div class="kpi-icon-badge">⚡</div>
          <div class="kpi-info">
            <span class="kpi-label">Ketuntasan Kelas</span>
            <h3 class="kpi-value" style="color: var(--emerald-green); font-size: 1.4rem;">
              ${Math.round((roster.filter(s => s.status && (s.status.includes('Tuntas') || s.status.includes('Sangat') || s.status.includes('Sempurna'))).length / Math.max(1, roster.length)) * 100)}%
            </h3>
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
      { id: 'mudah', altId: 'kecil', name: 'Tingkat Mudah (Alur Kecil)', questions: '5 Organ Sirkulasi Pulmonal', color: '#06d6a0', icon: '🟢' },
      { id: 'sedang', altId: 'besar', name: 'Tingkat Sedang (Alur Besar)', questions: '5 Organ Sirkulasi Sistemik', color: '#ffbe0b', icon: '🟡' },
      { id: 'sulit', altId: 'gabungan', name: 'Tingkat Sulit (Gabungan Lengkap)', questions: '10 Organ Sirkulasi Ganda', color: '#ff0054', icon: '🔴' }
    ];

    container.innerHTML = levels.map(lvl => {
      const data = quizProg[lvl.id] || quizProg[lvl.altId] || { score: 100, percentage: 100, date: new Date().toLocaleDateString('id-ID') };
      const hasTaken = quizProg[lvl.id] !== undefined || quizProg[lvl.altId] !== undefined;

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
            <button class="btn-cta-main" style="padding: 10px 16px; font-size: 0.88rem;" onclick="navigateTo('view-quiz'); window.quizEngine.startQuiz('${lvl.altId}')">
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
      { id: 0, title: 'Kasus 1: Hidung Berdarah Saat Upacara', badge: '🩸 Trombosit & Pembekuan', icon: '🚨', score: pblProg.case_0 ? pblProg.case_0.score : 100 },
      { id: 1, title: 'Kasus 2: Wajah Pucat & Cepat Lelah', badge: '🩺 Eritrosit & Anemia', icon: '😴', score: pblProg.case_1 ? pblProg.case_1.score : 95 },
      { id: 2, title: 'Kasus 3: Jantung Berdebar & Nadi Cepat', badge: '💓 Sirkulasi & Olahraga', icon: '🏃', score: pblProg.case_2 ? pblProg.case_2.score : 100 }
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

    let roster = window.authMgr ? window.authMgr.getRoster() : [];
    const currentStudentName = window.authMgr && window.authMgr.currentStudent ? window.authMgr.currentStudent.name.toLowerCase() : '';

    // Terapkan Filter Kategori
    if (this.currentFilter === 'online') {
      roster = roster.filter(s => currentStudentName && s.name.toLowerCase() === currentStudentName);
    } else if (this.currentFilter === 'done') {
      roster = roster.filter(s => typeof s.mudah === 'number' || typeof s.sedang === 'number' || typeof s.sulit === 'number' || (s.pbl && !s.pbl.startsWith('0')));
    } else if (this.currentFilter === 'pending') {
      roster = roster.filter(s => (s.mudah === '-' || s.mudah === undefined) && (s.sedang === '-' || s.sedang === undefined) && (s.sulit === '-' || s.sulit === undefined) && (!s.pbl || s.pbl.startsWith('0')));
    }

    if (roster.length === 0) {
      tableBody.innerHTML = `
        <tr>
          <td colspan="9" style="text-align: center; padding: 36px 20px; color: var(--text-muted);">
            <div style="font-size: 2rem; margin-bottom: 8px;">📭</div>
            <strong style="color: var(--text-heading); font-size: 1.05rem;">Tidak ada data siswa untuk filter ini</strong>
            <p style="margin: 4px 0 0 0; font-size: 0.88rem;">Siswa yang login dari halaman utama akan otomatis tercatat dan muncul di sini.</p>
          </td>
        </tr>
      `;
      return;
    }

    const formatLoginTime = (isoString) => {
      if (!isoString) return 'Hari ini';
      try {
        const d = new Date(isoString);
        return d.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB';
      } catch (e) {
        return 'Hari ini';
      }
    };

    tableBody.innerHTML = roster.map((s, idx) => {
      const isCurrentActive = currentStudentName && s.name.toLowerCase() === currentStudentName;

      const formatScoreBadge = (score) => {
        if (score === '-' || score === undefined || score === null) {
          return `<span class="badge-table-score score-muted" style="background: rgba(148, 163, 184, 0.15); color: var(--text-muted); font-weight: normal;">Belum</span>`;
        }
        const num = Number(score);
        if (num >= 85) return `<span class="badge-table-score score-green">${num}</span>`;
        if (num >= 70) return `<span class="badge-table-score score-yellow">${num}</span>`;
        return `<span class="badge-table-score score-red">${num}</span>`;
      };

      // Hitung Berapa Kuis yang Sudah Dikerjakan
      let quizDoneCount = 0;
      if (typeof s.mudah === 'number') quizDoneCount++;
      if (typeof s.sedang === 'number') quizDoneCount++;
      if (typeof s.sulit === 'number') quizDoneCount++;

      const isPblDone = s.pbl && !s.pbl.startsWith('0');

      let progressBadge = '';
      if (quizDoneCount === 3 && isPblDone) {
        progressBadge = `<span class="badge-status-tuntas" style="background: rgba(6, 214, 160, 0.22); color: #059669; font-weight: 800;">⭐ Lulus Lengkap</span>`;
      } else if (quizDoneCount === 3) {
        progressBadge = `<span class="badge-status-tuntas" style="background: rgba(6, 214, 160, 0.18); color: #059669;">✅ 3/3 Kuis Tuntas</span>`;
      } else if (quizDoneCount > 0) {
        progressBadge = `<span class="badge-status-tuntas" style="background: rgba(255, 190, 11, 0.2); color: #b45309;">📝 Mengerjakan (${quizDoneCount}/3)</span>`;
      } else {
        progressBadge = `<span class="badge-status-tuntas" style="background: rgba(58, 134, 255, 0.15); color: #2563eb;">🟢 Login (Belum Kuis)</span>`;
      }

      return `
        <tr class="${isCurrentActive ? 'active-student-row' : ''}">
          <td><strong>${idx + 1}</strong></td>
          <td>
            <div class="student-cell-profile">
              <span class="student-avatar-circle" style="${isCurrentActive ? 'background: linear-gradient(135deg, #06d6a0, #3a86ff); box-shadow: 0 0 10px rgba(6,214,160,0.5);' : ''}">
                ${s.avatar || s.name.charAt(0)}
              </span>
              <div>
                <div style="display: flex; align-items: center; gap: 6px;">
                  <strong style="color: var(--text-heading); font-size: 0.95rem;">${s.name}</strong>
                  ${isCurrentActive ? `<span class="badge-tag-online">ONLINE</span>` : ''}
                </div>
                <small class="student-id-txt">${s.id} • ${s.className || 'Kelas VI-A'}</small>
              </div>
            </div>
          </td>
          <td>
            <div style="display: flex; flex-direction: column; gap: 2px;">
              <span style="font-size: 0.82rem; font-weight: 700; color: ${isCurrentActive ? '#059669' : 'var(--text-main)'};">
                ${isCurrentActive ? '🟢 Sedang Aktif' : '🕒 Terakhir Masuk'}
              </span>
              <small style="color: var(--text-muted); font-size: 0.78rem;">${formatLoginTime(s.loginTime || s.lastActive)}</small>
            </div>
          </td>
          <td>${formatScoreBadge(s.mudah)}</td>
          <td>${formatScoreBadge(s.sedang)}</td>
          <td>${formatScoreBadge(s.sulit)}</td>
          <td><span class="badge-table-pbl">${s.pbl || '0 Kasus'}</span></td>
          <td>${progressBadge}</td>
          <td class="student-notes-cell">
            <div style="display: flex; justify-content: space-between; align-items: center; gap: 8px;">
              <span title="${s.notes || '-'}" style="max-width: 140px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${s.notes || '-'}</span>
              <div style="display: flex; gap: 4px; flex-shrink: 0;">
                <button title="Cetak Rapor Siswa Ini" onclick="window.dashboardMgr.printSingleStudent('${s.id}')" class="btn-table-action" style="background: var(--bg-surface); border: 1px solid var(--border-subtle); border-radius: 6px; padding: 4px 8px; cursor: pointer; font-size: 0.85rem;" onmouseover="this.style.borderColor='var(--cardiac-blue)'" onmouseout="this.style.borderColor='var(--border-subtle)'">🖨️</button>
                <button title="Hapus Siswa" onclick="window.authMgr.deleteStudent('${s.id}')" class="btn-table-action" style="background: var(--bg-surface); border: 1px solid rgba(255,0,84,0.3); color: var(--primary-red); border-radius: 6px; padding: 4px 8px; cursor: pointer; font-size: 0.85rem;" onmouseover="this.style.background='rgba(255,0,84,0.1)'" onmouseout="this.style.background='var(--bg-surface)'">🗑️</button>
              </div>
            </div>
          </td>
        </tr>
      `;
    }).join('');
  }

  setFilter(filterType) {
    if (window.audioMgr) window.audioMgr.playClickSound();
    this.currentFilter = filterType;

    document.querySelectorAll('.dash-filter-pill').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.filter === filterType);
    });

    this.renderStudentRosterTab();
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
    const roster = window.authMgr ? window.authMgr.getRoster() : [];
    let csv = 'No,ID Siswa,Nama Lengkap,Kelas,Kuis Mudah,Kuis Sedang,Kuis Sulit,Asesmen PBL,Status,Catatan Guru\n';
    roster.forEach((s, i) => {
      const mudahVal = s.mudah !== undefined ? s.mudah : '-';
      const sedangVal = s.sedang !== undefined ? s.sedang : '-';
      const sulitVal = s.sulit !== undefined ? s.sulit : '-';
      const pblVal = s.pbl || '0 Kasus';
      const notesClean = (s.notes || '-').replace(/"/g, '""');
      csv += `"${i + 1}","${s.id}","${s.name}","${s.className || 'Kelas VI-A'}","${mudahVal}","${sedangVal}","${sulitVal}","${pblVal}","${s.status}","${notesClean}"\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `Buku_Nilai_Sistem_Peredaran_Darah_Kelas_VI_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    window.authMgr.showToast('📥 Berhasil mengekspor data Buku Nilai Siswa (CSV)!', 'success');
  }

  claimCert(levelTitle) {
    const student = window.authMgr && window.authMgr.currentStudent ? window.authMgr.currentStudent : (window.authMgr ? window.authMgr.currentUser : null);
    const name = student ? student.name : 'Meisya Ranny';
    if (window.quizEngine) {
      window.quizEngine.generateCertificate(name);
    }
  }

  printSingleStudent(studentId) {
    const roster = window.authMgr ? window.authMgr.getRoster() : [];
    const student = roster.find(s => s.id === studentId);
    if (student) {
      this.printTranscript(student);
    }
  }

  printTranscript(studentTarget = null) {
    if (window.audioMgr) window.audioMgr.playClickSound();
    let target = studentTarget;
    if (!target) {
      target = (window.authMgr && window.authMgr.currentStudent) ? window.authMgr.currentStudent : (window.authMgr ? window.authMgr.currentUser : { name: 'Meisya Ranny', school: 'SD Kelas VI' });
    }

    const roster = window.authMgr ? window.authMgr.getRoster() : [];
    const studentData = roster.find(s => s.name.toLowerCase() === target.name.toLowerCase()) || target;

    const today = new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    const printWin = window.open('', '_blank');

    const mudahScore = studentData.mudah !== undefined && studentData.mudah !== '-' ? studentData.mudah : 100;
    const sedangScore = studentData.sedang !== undefined && studentData.sedang !== '-' ? studentData.sedang : 100;
    const sulitScore = studentData.sulit !== undefined && studentData.sulit !== '-' ? studentData.sulit : 95;

    printWin.document.write(`
      <!DOCTYPE html>
      <html lang="id">
      <head>
        <meta charset="UTF-8">
        <title>Rapor Capaian Pembelajaran - ${studentData.name}</title>
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
            <td><strong>${studentData.name}</strong></td>
            <td width="20%"><strong>Tanggal Cetak</strong></td>
            <td width="2%">:</td>
            <td>${today}</td>
          </tr>
          <tr>
            <td><strong>ID / NIS Siswa</strong></td>
            <td>:</td>
            <td><code>${studentData.id || 'SIS-01'}</code></td>
            <td><strong>Status Kelulusan</strong></td>
            <td>:</td>
            <td><strong style="color: #15803d;">${studentData.status || 'LULUS SANGAT BAIK ⭐'}</strong></td>
          </tr>
          <tr>
            <td><strong>Jenjang & Kelas</strong></td>
            <td>:</td>
            <td>${studentData.className || 'SD Kelas VI • IPA Kurikulum Merdeka'}</td>
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
              <td>Kuis Tingkat Mudah (Peredaran Darah Kecil)</td>
              <td><strong>${mudahScore} / 100</strong></td>
              <td>${mudahScore}%</td>
              <td><span class="badge badge-tuntas">Tuntas Sempurna</span></td>
            </tr>
            <tr>
              <td>2</td>
              <td>Kuis Tingkat Sedang (Peredaran Darah Besar)</td>
              <td><strong>${sedangScore} / 100</strong></td>
              <td>${sedangScore}%</td>
              <td><span class="badge badge-tuntas">Tuntas Sempurna</span></td>
            </tr>
            <tr>
              <td>3</td>
              <td>Kuis Tingkat Sulit (Gabungan Alur Utuh)</td>
              <td><strong>${sulitScore} / 100</strong></td>
              <td>${sulitScore}%</td>
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
            <p>Mengetahui,<br>Guru Pengampu IPA</p>
            <div class="sign-space"></div>
            <p><strong>( Meisya Ranny, S.Pd. )</strong><br><small>NIP. 19920815 201802 2 004</small></p>
          </div>

          <div class="sign-box">
            <p>Siswa / Peserta Didik,<br>&nbsp;</p>
            <div class="sign-space"></div>
            <p><strong>( ${studentData.name} )</strong><br><small>ID: ${studentData.id || 'SIS-01'}</small></p>
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

