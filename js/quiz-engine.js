/**
 * QUIZ ENGINE: LATIHAN MENYUSUN ALUR PEREDARAN DARAH DENGAN ANIMASI ALIRAN DARAH
 * Kurikulum Merdeka - Kelas VI SD
 * Mode:
 * 1. Alur Peredaran Darah Kecil (Pulmonal)
 * 2. Alur Peredaran Darah Besar (Sistemik)
 * 3. Gabungan Alur Utuh (Sirkulasi Ganda Lengkap)
 */

class QuizEngine {
  constructor() {
    this.currentLevel = 'kecil'; // 'kecil', 'besar', 'gabungan'
    this.placedSteps = [];
    this.shuffledCards = [];
    this.currentStepIdx = 0;
    this.score = 100;
    this.mistakes = 0;
    this.isCompleted = false;
    this.studentName = "Siswa Berprestasi";

    this.initElements();
  }

  initElements() {
    this.container = document.getElementById('quiz-question-card');
    this.resultCard = document.getElementById('quiz-result-card');
  }

  startQuiz(level = 'kecil') {
    if (window.audioMgr) window.audioMgr.playClickSound();
    this.currentLevel = level;
    this.placedSteps = [];
    this.currentStepIdx = 0;
    this.score = 100;
    this.mistakes = 0;
    this.isCompleted = false;

    // Update Pill Buttons Active State
    document.querySelectorAll('.quiz-level-pill').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.level === level);
    });

    if (this.container) this.container.style.display = 'block';
    if (this.resultCard) this.resultCard.style.display = 'none';

    this.renderSequenceLab();
  }

  getLevelData() {
    const levelAliases = {
      'mudah': 'kecil',
      'kecil': 'kecil',
      'sedang': 'besar',
      'besar': 'besar',
      'sulit': 'gabungan',
      'gabungan': 'gabungan'
    };
    const key = levelAliases[this.currentLevel] || this.currentLevel || 'kecil';
    return CIRCULATORY_DATA.circulationQuizData[key] || CIRCULATORY_DATA.circulationQuizData.kecil;
  }

  renderSequenceLab() {
    if (!this.container) return;
    const data = this.getLevelData();
    const totalSteps = data.steps.length;

    // Acak kartu organ yang belum terpasang
    if (this.placedSteps.length === 0) {
      this.shuffledCards = [...data.steps].sort(() => Math.random() - 0.5);
    }

    const completedPct = Math.round((this.placedSteps.length / totalSteps) * 100);

    this.container.innerHTML = `
      <!-- LAB TOP INFO BAR -->
      <div class="quiz-top-bar" style="border-bottom: 2px solid var(--border-subtle); padding-bottom: 16px; margin-bottom: 20px;">
        <div>
          <span class="badge-3d-pill" style="position: static; display: inline-flex; margin-bottom: 6px; background: ${data.color}20; color: ${data.color}; border: 1px solid ${data.color}40;">
            ${data.badge}
          </span>
          <h3 style="font-family: var(--font-heading); margin: 4px 0 2px 0; color: var(--text-heading); font-size: 1.4rem;">
            ${data.title}
          </h3>
          <p style="color: var(--text-muted); font-size: 0.88rem; margin: 0;">${data.slogan}</p>
        </div>
        <div style="text-align: right;">
          <div style="font-size: 0.85rem; color: var(--text-muted);">Progres Langkah</div>
          <div style="font-size: 1.3rem; font-weight: 800; color: ${data.color};">
            <span id="seq-step-counter">${this.placedSteps.length}</span> / ${totalSteps}
          </div>
          <div style="font-size: 0.85rem; font-weight: 700; color: var(--sunny-yellow); margin-top: 4px;">
            ⭐ Skor: <span id="seq-score-display">${this.score}</span>
          </div>
        </div>
      </div>

      <!-- PROGRESS TRACK -->
      <div class="quiz-progress-track" style="margin-bottom: 24px;">
        <div id="quiz-progress-fill" class="quiz-progress-fill" style="width: ${completedPct}%; background: linear-gradient(90deg, ${data.color}, #06d6a0);"></div>
      </div>

      <!-- VISUAL CIRCUIT ANIMATION -->
      <div class="sequence-animation-wrapper" style="background: radial-gradient(circle at center, rgba(11, 15, 25, 0.95), rgba(5, 8, 15, 1)); border-radius: 18px; padding: 20px; border: 1.5px solid var(--border-glass); margin-bottom: 25px; box-shadow: inset 0 0 30px rgba(0,0,0,0.5);">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
          <div style="display: flex; align-items: center; gap: 8px;">
            <span class="live-dot-pulse"></span>
            <strong style="color: #ffffff; font-size: 0.95rem;">🔬 Animasi Aliran Sirkulasi Darah:</strong>
          </div>
          <span style="font-size: 0.82rem; color: #94a3b8;">
            ${this.placedSteps.length === totalSteps ? '✨ Sirkulasi Mengalir Sempurna!' : 'Partikel darah akan mengalir saat alur disusun benar'}
          </span>
        </div>
        
        <div id="sequence-circuit-display" class="circuit-container">
          ${this.renderCircuitSVG(data)}
        </div>
      </div>

      <!-- DR. HEMI HINT & FEEDBACK BANNER -->
      <div id="seq-feedback-box" class="quiz-explanation-box is-correct" style="margin-bottom: 22px; ${this.placedSteps.length === 0 ? 'display: block;' : 'display: block;'}">
        <div style="display: flex; align-items: flex-start; gap: 12px;">
          <span style="font-size: 1.8rem; line-height: 1;">🩺</span>
          <div>
            <strong id="seq-feedback-title" style="color: var(--text-heading); font-size: 0.95rem;">
              ${this.placedSteps.length === 0 ? 'Petunjuk Dr. Hemi:' : 'Status Aliran Darah:'}
            </strong>
            <p id="seq-feedback-text" style="margin: 4px 0 0 0; font-size: 0.9rem; color: var(--text-main);">
              ${this.placedSteps.length === 0 ? `Klik kartu organ pertama di bawah untuk memulai ${data.title}.` : data.steps[this.placedSteps.length - 1].desc}
            </p>
          </div>
        </div>
      </div>

      <!-- SEQUENCE DROP SLOTS (TARGET TRACK) -->
      <div style="margin-bottom: 25px;">
        <h4 style="font-family: var(--font-heading); color: var(--text-heading); margin-bottom: 12px; font-size: 1.05rem;">
          📍 Jalur Aliran yang Telah Disusun:
        </h4>
        <div class="sequence-slots-grid ${this.currentLevel === 'gabungan' ? 'grid-10' : 'grid-5'}">
          ${this.renderSlotsHTML(data)}
        </div>
      </div>

      <!-- AVAILABLE ORGAN CARDS (SHUFFLED POOL) -->
      <div id="sequence-cards-section" style="${this.placedSteps.length === totalSteps ? 'display: none;' : 'display: block;'}">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
          <h4 style="font-family: var(--font-heading); color: var(--text-heading); margin: 0; font-size: 1.05rem;">
            🃏 Pilih Organ/Pembuluh Selanjutnya (Langkah ke-${this.placedSteps.length + 1}):
          </h4>
          <span style="font-size: 0.82rem; color: var(--text-muted);">Klik kartu yang tepat</span>
        </div>

        <div class="sequence-cards-pool">
          ${this.renderCardsHTML(data)}
        </div>
      </div>

      <!-- LAB ACTIONS FOOTER -->
      <div style="margin-top: 25px; padding-top: 15px; border-top: 1px solid var(--border-subtle); display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px;">
        <button class="btn-cta-secondary" style="padding: 8px 18px; font-size: 0.9rem;" onclick="window.quizEngine.startQuiz('${this.currentLevel}')">
          🔄 Ulangi Alur Ini
        </button>
        <div style="display: flex; gap: 10px;">
          <button class="btn-audio-speak" style="padding: 8px 18px; font-size: 0.9rem;" onclick="window.quizEngine.speakCurrentHint()">
            <span>🔊 Dengarkan Petunjuk</span>
          </button>
        </div>
      </div>
    `;
  }

  renderSlotsHTML(data) {
    const totalSteps = data.steps.length;
    let html = '';

    for (let i = 0; i < totalSteps; i++) {
      const stepData = data.steps[i];
      const isPlaced = i < this.placedSteps.length;
      const isCurrentTarget = i === this.placedSteps.length;

      if (isPlaced) {
        const placed = this.placedSteps[i];
        html += `
          <div class="seq-slot-card filled animate-fadeIn" style="border-top-color: ${placed.color || '#3a86ff'};">
            <span class="slot-num-badge success">✓ ${i + 1}</span>
            <div class="slot-icon">${placed.icon}</div>
            <div class="slot-title">${placed.name}</div>
            <span class="slot-gas-tag" style="background: ${placed.gas.includes('Merah') || placed.gas.includes('O₂') ? 'rgba(239, 68, 68, 0.15)' : 'rgba(58, 134, 255, 0.15)'}; color: ${placed.gas.includes('Merah') || placed.gas.includes('O₂') ? '#ef4444' : '#3a86ff'};">
              ${placed.gas}
            </span>
          </div>
        `;
      } else if (isCurrentTarget) {
        html += `
          <div class="seq-slot-card active-target animate-pulse">
            <span class="slot-num-badge active">${i + 1}</span>
            <div class="slot-icon" style="opacity: 0.5;">❓</div>
            <div class="slot-title" style="color: var(--text-muted); font-size: 0.88rem;">Langkah ke-${i + 1}</div>
            <span style="font-size: 0.75rem; color: var(--cardiac-blue); font-weight: 600;">🎯 Pilih kartu di bawah</span>
          </div>
        `;
      } else {
        html += `
          <div class="seq-slot-card empty">
            <span class="slot-num-badge">${i + 1}</span>
            <div class="slot-icon" style="opacity: 0.25;">🔒</div>
            <div class="slot-title" style="color: var(--text-muted); font-size: 0.88rem;">Terkunci</div>
            <span style="font-size: 0.72rem; color: var(--text-muted);">Langkah ${i + 1}</span>
          </div>
        `;
      }

      // Add arrow separator between slots
      if (i < totalSteps - 1) {
        html += `<div class="slot-arrow-divider ${isPlaced ? 'active' : ''}">➔</div>`;
      }
    }

    return html;
  }

  renderCardsHTML(data) {
    const remainingCards = this.shuffledCards.filter(c => !this.placedSteps.some(p => p.id === c.id));

    return remainingCards.map(c => `
      <button class="sequence-card-btn animate-card" onclick="window.quizEngine.handleCardSelect('${c.id}', this)">
        <span class="card-icon-pill">${c.icon}</span>
        <div class="card-info">
          <strong class="card-title">${c.name}</strong>
          <span class="card-gas-badge">${c.gas}</span>
        </div>
      </button>
    `).join('');
  }

  renderCircuitSVG(data) {
    const total = data.steps.length;
    const progress = this.placedSteps.length;
    const isDone = progress === total;

    // Circuit layout nodes
    return `
      <div class="circuit-nodes-flow">
        ${data.steps.map((step, idx) => {
          const isPassed = idx < progress;
          const isCurrent = idx === progress;
          return `
            <div class="circuit-node-item ${isPassed ? 'passed' : ''} ${isCurrent ? 'current' : ''}">
              <div class="node-circle" style="${isPassed ? `background: ${step.gas.includes('Merah') || step.gas.includes('O₂') ? '#ef4444' : '#3a86ff'}; box-shadow: 0 0 16px ${step.gas.includes('Merah') || step.gas.includes('O₂') ? '#ef4444' : '#3a86ff'}; color: #fff;` : ''}">
                ${step.icon}
                ${isPassed ? '<span class="node-check">✓</span>' : ''}
              </div>
              <div class="node-label">${step.name}</div>
            </div>
            ${idx < total - 1 ? `
              <div class="circuit-track ${isPassed ? 'active-flow' : ''}">
                <div class="blood-particle ${isPassed ? 'flowing' : ''}" style="${isPassed && step.gas.includes('Merah') ? 'background: #ef4444; box-shadow: 0 0 10px #ef4444;' : 'background: #3a86ff; box-shadow: 0 0 10px #3a86ff;'}"></div>
              </div>
            ` : ''}
          `;
        }).join('')}
        ${isDone ? `
          <div class="circuit-loop-track active-flow">
            <span style="font-size: 0.8rem; color: #22c55e; font-weight: 700; margin-left: 8px;">🔄 Siklus Lengkap Berputar</span>
          </div>
        ` : ''}
      </div>
    `;
  }

  handleCardSelect(cardId, buttonEl) {
    if (this.isCompleted) return;
    const data = this.getLevelData();
    const expectedStep = data.steps[this.placedSteps.length];

    if (cardId === expectedStep.id) {
      // ✅ JAWABAN BENAR
      if (window.audioMgr) window.audioMgr.playCorrectSound();
      this.placedSteps.push(expectedStep);

      // Cek apakah selesai
      if (this.placedSteps.length === data.steps.length) {
        this.completeSequence();
      } else {
        this.renderSequenceLab();
      }
    } else {
      // ❌ JAWABAN SALAH
      if (window.audioMgr) window.audioMgr.playWrongSound();
      this.mistakes++;
      this.score = Math.max(50, this.score - 10);

      // Efek tombol bergetar merah
      if (buttonEl) {
        buttonEl.classList.add('shake-error');
        setTimeout(() => buttonEl.classList.remove('shake-error'), 600);
      }

      // Update feedback box dengan pesan Dr. Hemi
      const titleEl = document.getElementById('seq-feedback-title');
      const textEl = document.getElementById('seq-feedback-text');
      const boxEl = document.getElementById('seq-feedback-box');
      const scoreEl = document.getElementById('seq-score-display');

      if (scoreEl) scoreEl.textContent = this.score;

      if (boxEl) {
        boxEl.className = 'quiz-explanation-box is-wrong animate-fadeIn';
      }
      if (titleEl) {
        titleEl.textContent = `❌ Belum Tepat untuk Langkah ke-${this.placedSteps.length + 1}!`;
      }
      if (textEl) {
        textEl.innerHTML = `<strong>Petunjuk:</strong> ${expectedStep.hint}`;
      }
    }
  }

  completeSequence() {
    this.isCompleted = true;
    const data = this.getLevelData();

    // Re-render UI to show 100% circuit loop
    this.renderSequenceLab();

    // Fanfare & Confetti
    if (window.audioMgr) window.audioMgr.playFanfareSound();
    this.launchConfetti();

    // Simpan progres ke LocalStorage
    this.saveProgress(this.currentLevel, this.score, 100);

    // Tampilkan Kartu Sukses setelah jeda singkat
    setTimeout(() => {
      if (this.container) this.container.style.display = 'none';
      if (this.resultCard) this.resultCard.style.display = 'block';

      const scoreVal = document.getElementById('result-final-score');
      const scorePct = document.getElementById('result-final-pct');
      const badgeMsg = document.getElementById('result-badge-msg');
      const starContainer = document.getElementById('result-stars');

      if (scoreVal) scoreVal.textContent = this.score;
      if (scorePct) scorePct.textContent = '100%';

      if (starContainer) starContainer.innerHTML = '⭐⭐⭐';
      if (badgeMsg) {
        badgeMsg.innerHTML = `
          🎉 <strong>Hebat Sekali!</strong> Kamu telah berhasil menyusun <strong>${data.title}</strong> dengan sempurna!
        `;
      }

      // Tentukan tombol navigasi berikutnya
      const nextLevelMap = {
        'kecil': { next: 'besar', label: 'Lanjut ke Alur Darah Besar ➔' },
        'besar': { next: 'gabungan', label: 'Lanjut ke Gabungan Alur Utuh ➔' },
        'gabungan': { next: 'kecil', label: 'Ulangi Latihan Alur ➔' }
      };

      const nextInfo = nextLevelMap[this.currentLevel];
      const nextBtnContainer = document.getElementById('result-action-buttons');
      if (nextBtnContainer) {
        nextBtnContainer.innerHTML = `
          <button class="btn-cta-main" style="background: linear-gradient(135deg, #06d6a0, #059669);" onclick="window.quizEngine.generateCertificate()">
            📜 Klaim Sertifikat Digital Resmi
          </button>
          <button class="btn-cta-main" onclick="window.quizEngine.startQuiz('${nextInfo.next}')">
            <span>${nextInfo.label}</span>
          </button>
          <button class="btn-cta-secondary" onclick="window.quizEngine.startQuiz('${this.currentLevel}')">
            🔄 Ulangi Latihan Ini
          </button>
        `;
      }
    }, 1200);
  }

  speakCurrentHint() {
    const data = this.getLevelData();
    const expectedStep = data.steps[this.placedSteps.length];
    if (expectedStep && window.audioMgr) {
      window.audioMgr.speakText(`Petunjuk langkah ke ${this.placedSteps.length + 1}. ${expectedStep.hint}`);
    }
  }

  saveProgress(level, score, percentage) {
    try {
      const existing = JSON.parse(localStorage.getItem('hematology_quiz_progress') || '{}');
      existing[level] = {
        score: score,
        percentage: percentage,
        date: new Date().toLocaleDateString('id-ID')
      };
      localStorage.setItem('hematology_quiz_progress', JSON.stringify(existing));

      // Rekam nilai ke Buku Nilai Siswa di Dashboard Guru
      if (window.authMgr && typeof window.authMgr.updateStudentScore === 'function') {
        const studentName = window.authMgr.currentStudent ? window.authMgr.currentStudent.name : (this.studentName || 'Meisya Ranny');
        window.authMgr.updateStudentScore(studentName, {
          level: level,
          score: score,
          percentage: percentage
        });
      }

      if (window.updateDashboardStats) window.updateDashboardStats();
    } catch (e) {
      console.error('Gagal menyimpan progres kuis:', e);
    }
  }

  // --- GENERATOR SERTIFIKAT KELULUSAN RESMI DI CANVAS ---
  generateCertificate(nameInput = null) {
    let studentName = nameInput;
    let className = 'Kelas VI SD';

    if (window.authMgr && window.authMgr.currentStudent) {
      if (!studentName) studentName = window.authMgr.currentStudent.name;
      if (window.authMgr.currentStudent.className) className = window.authMgr.currentStudent.className;
    }

    if (!studentName) {
      studentName = prompt("Masukkan Nama Lengkap Siswa untuk Sertifikat:", this.studentName) || "Siswa Teladan SD";
    }

    this.studentName = studentName;

    const canvas = document.createElement('canvas');
    canvas.width = 1200;
    canvas.height = 800;
    const ctx = canvas.getContext('2d');

    // Background Gradient Colorful Elegan
    const grad = ctx.createLinearGradient(0, 0, 1200, 800);
    grad.addColorStop(0, '#f8fafc');
    grad.addColorStop(0.5, '#e0f2fe');
    grad.addColorStop(1, '#ffe4e6');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 1200, 800);

    // Border Ganda Mewah
    ctx.strokeStyle = '#e63946';
    ctx.lineWidth = 14;
    ctx.strokeRect(30, 30, 1140, 740);

    ctx.strokeStyle = '#3a86ff';
    ctx.lineWidth = 4;
    ctx.strokeRect(50, 50, 1100, 700);

    // Corner Ornaments
    ctx.fillStyle = '#ffbe0b';
    ctx.beginPath();
    ctx.arc(50, 50, 25, 0, Math.PI * 2);
    ctx.arc(1150, 50, 25, 0, Math.PI * 2);
    ctx.arc(50, 750, 25, 0, Math.PI * 2);
    ctx.arc(1150, 750, 25, 0, Math.PI * 2);
    ctx.fill();

    // Header Judul
    ctx.textAlign = 'center';
    ctx.fillStyle = '#1e293b';
    ctx.font = 'bold 32px "Poppins", "Outfit", sans-serif';
    ctx.fillText('SERTIFIKAT KELULUSAN & PENGHARGAAN', 600, 135);

    ctx.fillStyle = '#64748b';
    ctx.font = '16px "Poppins", sans-serif';
    ctx.fillText('MEDIA PEMBELAJARAN INTERAKTIF SISTEM PEREDARAN DARAH MANUSIA', 600, 170);

    // Garis Aksen Emas
    ctx.strokeStyle = '#fbbf24';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(250, 205);
    ctx.lineTo(950, 205);
    ctx.stroke();

    // Teks Diberikan Kepada
    ctx.fillStyle = '#475569';
    ctx.font = 'italic 22px "Poppins", serif';
    ctx.fillText('Diberikan dengan bangga kepada:', 600, 260);

    // Nama Siswa
    ctx.fillStyle = '#d90429';
    ctx.font = 'bold 44px "Poppins", "Outfit", sans-serif';
    ctx.fillText(studentName.toUpperCase(), 600, 320);

    // Kelas Siswa
    ctx.fillStyle = '#2563eb';
    ctx.font = 'bold 20px "Poppins", sans-serif';
    ctx.fillText(`( ${className} )`, 600, 360);

    // Deskripsi Prestasi
    ctx.fillStyle = '#334155';
    ctx.font = '22px "Poppins", sans-serif';
    const levelLabelMap = {
      'kecil': 'LATIHAN ALUR PEREDARAN DARAH KECIL',
      'besar': 'LATIHAN ALUR PEREDARAN DARAH BESAR',
      'gabungan': 'GABUNGAN ALUR UTUH SIRKULASI GANDA'
    };
    const currentLabel = levelLabelMap[this.currentLevel] || 'LATIHAN ALUR SIRKULASI DARAH';

    ctx.fillText(`Telah berhasil menyelesaikan dan menyusun ${currentLabel}`, 600, 415);
    ctx.fillText(`dengan Perolehan Skor Prestasi: ${this.score} / 100 Poin (Tuntas 100%)`, 600, 455);

    // Badge Logo
    ctx.fillStyle = '#ff0054';
    ctx.font = '55px "Poppins", sans-serif';
    ctx.fillText('❤️ 🩸 🫁 🔬', 600, 530);

    // Tanggal & Tanda Tangan
    ctx.textAlign = 'left';
    ctx.fillStyle = '#64748b';
    ctx.font = '18px "Poppins", sans-serif';
    const today = new Date().toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' });
    ctx.fillText(`Diterbitkan pada: ${today}`, 120, 680);
    ctx.fillText('Status: Terverifikasi Digital', 120, 710);

    ctx.textAlign = 'right';
    ctx.fillStyle = '#1e293b';
    ctx.font = 'bold 20px "Poppins", sans-serif';
    ctx.fillText('Dr. Hemi & Tim Pengembang MTP', 1080, 680);
    ctx.font = '16px "Poppins", sans-serif';
    ctx.fillStyle = '#64748b';
    ctx.fillText('Instruktur Multimedia Interaktif SD', 1080, 710);

    // Tampilkan di Modal Sertifikat
    const modal = document.getElementById('certificate-modal');
    const imgPreview = document.getElementById('certificate-image-preview');
    const downloadBtn = document.getElementById('btn-download-cert');

    if (imgPreview && modal) {
      const dataUrl = canvas.toDataURL('image/png');
      imgPreview.src = dataUrl;
      modal.style.display = 'flex';

      if (downloadBtn) {
        downloadBtn.onclick = () => {
          const a = document.createElement('a');
          a.download = `Sertifikat_${studentName.replace(/\s+/g, '_')}_Alur_Peredaran_Darah.png`;
          a.href = dataUrl;
          a.click();
        };
      }
    }
  }

  // --- EFEK KONFETI PERAYAAN 🎉 ---
  launchConfetti() {
    const confettiContainer = document.getElementById('confetti-canvas-container');
    if (!confettiContainer) return;

    confettiContainer.innerHTML = '';
    const canvas = document.createElement('canvas');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = '9999';
    confettiContainer.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    const pieces = [];
    const colors = ['#ff0054', '#3a86ff', '#ffbe0b', '#06d6a0', '#8338ec', '#fb5607'];

    for (let i = 0; i < 160; i++) {
      pieces.push({
        x: Math.random() * canvas.width,
        y: Math.random() * -canvas.height,
        w: Math.random() * 12 + 6,
        h: Math.random() * 8 + 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        vy: Math.random() * 4 + 3,
        vx: (Math.random() - 0.5) * 3,
        rot: Math.random() * 360,
        vrot: (Math.random() - 0.5) * 10
      });
    }

    let frame = 0;
    const update = () => {
      frame++;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      pieces.forEach(p => {
        p.y += p.vy;
        p.x += p.vx;
        p.rot += p.vrot;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rot * Math.PI) / 180);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        ctx.restore();
      });

      if (frame < 180) {
        requestAnimationFrame(update);
      } else {
        confettiContainer.innerHTML = '';
      }
    };
    update();
  }
}

// Inisialisasi Quiz Engine
window.quizEngine = new QuizEngine();
