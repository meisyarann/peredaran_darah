/**
 * SETTINGS MANAGER - PENGATURAN TEMA, AKSESIBILITAS, & AUDIO
 */

class SettingsManager {
  constructor() {
    this.theme = localStorage.getItem('hematology_theme') || 'light';
    this.fontSize = localStorage.getItem('hematology_fontsize') || 'medium';
    this.bgmMuted = localStorage.getItem('hematology_bgm_muted') === 'true';
    this.sfxMuted = localStorage.getItem('hematology_sfx_muted') === 'true';

    this.init();
  }

  init() {
    this.applyTheme(this.theme);
    this.applyFontSize(this.fontSize);

    // Sync input controls jika ada di DOM
    const themeSelect = document.getElementById('setting-theme-select');
    const fontSelect = document.getElementById('setting-font-select');
    const bgmToggle = document.getElementById('setting-bgm-toggle');
    const sfxToggle = document.getElementById('setting-sfx-toggle');

    if (themeSelect) themeSelect.value = this.theme;
    if (fontSelect) fontSelect.value = this.fontSize;
    if (bgmToggle) bgmToggle.checked = !this.bgmMuted;
    if (sfxToggle) sfxToggle.checked = !this.sfxMuted;

    if (window.audioMgr) {
      window.audioMgr.bgmMuted = this.bgmMuted;
      window.audioMgr.sfxMuted = this.sfxMuted;
    }
  }

  setTheme(themeName) {
    this.theme = themeName;
    localStorage.setItem('hematology_theme', themeName);
    this.applyTheme(themeName);
    if (window.audioMgr) window.audioMgr.playClickSound();
  }

  applyTheme(themeName) {
    const root = document.documentElement;
    if (themeName === 'dark') {
      root.classList.add('dark-theme');
      root.classList.remove('light-theme');
    } else {
      root.classList.add('light-theme');
      root.classList.remove('dark-theme');
    }
  }

  toggleTheme() {
    const nextTheme = this.theme === 'light' ? 'dark' : 'light';
    this.setTheme(nextTheme);
    return nextTheme;
  }

  setFontSize(sizeName) {
    this.fontSize = sizeName;
    localStorage.setItem('hematology_fontsize', sizeName);
    this.applyFontSize(sizeName);
    if (window.audioMgr) window.audioMgr.playClickSound();
  }

  applyFontSize(sizeName) {
    const root = document.documentElement;
    root.classList.remove('font-small', 'font-medium', 'font-large');
    root.classList.add(`font-${sizeName}`);
  }

  setBGM(enabled) {
    this.bgmMuted = !enabled;
    localStorage.setItem('hematology_bgm_muted', this.bgmMuted);
    if (window.audioMgr) {
      window.audioMgr.bgmMuted = this.bgmMuted;
      if (enabled) {
        window.audioMgr.startBGM();
      } else {
        window.audioMgr.stopBGM();
      }
    }
  }

  setSFX(enabled) {
    this.sfxMuted = !enabled;
    localStorage.setItem('hematology_sfx_muted', this.sfxMuted);
    if (window.audioMgr) {
      window.audioMgr.sfxMuted = this.sfxMuted;
    }
  }

  resetProgress() {
    if (confirm("Apakah kamu yakin ingin mereset seluruh skor kuis dan progres belajar?")) {
      localStorage.removeItem('hematology_quiz_progress');
      localStorage.removeItem('hematology_pbl_progress');
      alert("Progres belajarmu telah berhasil direset!");
      if (window.updateDashboardStats) window.updateDashboardStats();
    }
  }
}

// Inisialisasi Settings Manager
window.settingsMgr = new SettingsManager();
