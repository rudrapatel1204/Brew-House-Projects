/**
 * ====================================================================
 * SPOTIFY-STYLE FLOATING BIRTHDAY MUSIC PLAYER
 * Features:
 * - HTML5 Audio playback (custom MP3/WAV)
 * - Built-in procedural Web Audio API dreamy piano/chime synthesizer fallback
 * - Play/Pause, Progress Bar seek, Elapsed & Total Time
 * - Volume control, Mute toggle, Animated audio visualizer bars
 * ====================================================================
 */

class BirthdayMusicPlayer {
  constructor(config) {
    this.config = config.music;
    this.audioEl = document.getElementById('birthday-audio');
    this.playBtn = document.getElementById('music-play-btn');
    this.playIcon = document.getElementById('music-play-icon');
    this.pauseIcon = document.getElementById('music-pause-icon');
    this.progressBar = document.getElementById('music-progress-bar');
    this.progressFill = document.getElementById('music-progress-fill');
    this.timeCurrent = document.getElementById('music-time-current');
    this.timeDuration = document.getElementById('music-time-duration');
    this.volumeBtn = document.getElementById('music-volume-btn');
    this.playerContainer = document.getElementById('spotify-player');

    this.isPlaying = false;
    this.isMuted = false;
    this.useSynth = false;
    this.synthContext = null;
    this.synthInterval = null;

    this.init();
  }

  init() {
    if (!this.playerContainer) return;

    // Load initial info from config
    const titleEl = document.getElementById('music-title');
    const artistEl = document.getElementById('music-artist');
    const albumArtEl = document.getElementById('music-album-art');

    if (titleEl) titleEl.textContent = this.config.trackTitle;
    if (artistEl) artistEl.textContent = this.config.artist;
    if (albumArtEl) albumArtEl.src = this.config.albumArt;

    if (this.audioEl) {
      this.audioEl.src = this.config.audioFile;
      this.audioEl.volume = this.config.initialVolume || 0.75;

      this.audioEl.addEventListener('timeupdate', () => this.updateProgress());
      this.audioEl.addEventListener('loadedmetadata', () => {
        if (this.timeDuration) {
          this.timeDuration.textContent = this.formatTime(this.audioEl.duration);
        }
      });
      this.audioEl.addEventListener('ended', () => {
        this.audioEl.currentTime = 0;
        this.audioEl.play().catch(() => {});
      });
      this.audioEl.addEventListener('error', () => {
        console.warn('Audio file error, falling back to Web Audio synth');
        this.useSynth = true;
      });
    }

    this.bindEvents();
  }

  bindEvents() {
    if (this.playBtn) {
      this.playBtn.addEventListener('click', () => this.togglePlay());
    }

    if (this.progressBar) {
      this.progressBar.addEventListener('click', (e) => this.seekAudio(e));
    }

    if (this.volumeBtn) {
      this.volumeBtn.addEventListener('click', () => this.toggleMute());
    }
  }

  togglePlay() {
    if (this.isPlaying) {
      this.pause();
    } else {
      this.play();
    }
  }

  play() {
    this.isPlaying = true;
    if (this.playerContainer) this.playerContainer.classList.add('music-playing');
    if (this.playIcon) this.playIcon.classList.add('hidden');
    if (this.pauseIcon) this.pauseIcon.classList.remove('hidden');

    if (this.audioEl && !this.useSynth) {
      const playPromise = this.audioEl.play();
      if (playPromise !== undefined) {
        playPromise.catch((err) => {
          console.warn('HTML5 Audio playback prevented, starting procedural synthesizer:', err);
          this.startSynthesizer();
        });
      }
    } else {
      this.startSynthesizer();
    }
  }

  pause() {
    this.isPlaying = false;
    if (this.playerContainer) this.playerContainer.classList.remove('music-playing');
    if (this.playIcon) this.playIcon.classList.remove('hidden');
    if (this.pauseIcon) this.pauseIcon.classList.add('hidden');

    if (this.audioEl) {
      this.audioEl.pause();
    }
    this.stopSynthesizer();
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    if (this.audioEl) {
      this.audioEl.muted = this.isMuted;
    }
    if (this.synthGain) {
      this.synthGain.gain.value = this.isMuted ? 0 : 0.2;
    }
    if (this.volumeBtn) {
      this.volumeBtn.style.opacity = this.isMuted ? '0.4' : '1';
    }
  }

  seekAudio(e) {
    if (!this.audioEl || !this.audioEl.duration) return;
    const rect = this.progressBar.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    this.audioEl.currentTime = pos * this.audioEl.duration;
  }

  updateProgress() {
    if (!this.audioEl || !this.audioEl.duration) return;
    const current = this.audioEl.currentTime;
    const duration = this.audioEl.duration;
    const percent = (current / duration) * 100;

    if (this.progressFill) this.progressFill.style.width = `${percent}%`;
    if (this.timeCurrent) this.timeCurrent.textContent = this.formatTime(current);
    if (this.timeDuration && !isNaN(duration)) {
      this.timeDuration.textContent = this.formatTime(duration);
    }
  }

  formatTime(secs) {
    if (isNaN(secs)) return '0:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  }

  // Procedural Web Audio API Synthesizer (Tender Lofi Piano / Music Box)
  startSynthesizer() {
    try {
      if (!this.synthContext) {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        this.synthContext = new AudioContext();
      }

      if (this.synthContext.state === 'suspended') {
        this.synthContext.resume();
      }

      this.synthGain = this.synthContext.createGain();
      this.synthGain.gain.value = this.isMuted ? 0 : 0.22;
      this.synthGain.connect(this.synthContext.destination);

      // Chords: Fmaj7 -> Cmaj7 -> Dm7 -> Bbmaj7 (tender dreamy loop)
      const chordNotes = [
        [349.23, 440.0, 523.25, 659.25], // Fmaj7
        [261.63, 329.63, 392.0, 493.88], // Cmaj7
        [293.66, 349.23, 440.0, 523.25], // Dm7
        [233.08, 293.66, 349.23, 440.0], // Bbmaj7
      ];

      let chordStep = 0;
      let arpeggioStep = 0;

      // Play soft notes continuously
      this.synthInterval = setInterval(() => {
        if (!this.isPlaying || !this.synthContext) return;
        const currentChord = chordNotes[chordStep];
        const freq = currentChord[arpeggioStep % currentChord.length];

        this.playSoftNote(freq);

        arpeggioStep++;
        if (arpeggioStep % 4 === 0) {
          chordStep = (chordStep + 1) % chordNotes.length;
        }
      }, 550);
    } catch (e) {
      console.warn('Web Audio synthesis error:', e);
    }
  }

  playSoftNote(frequency) {
    if (!this.synthContext || !this.synthGain) return;
    const osc = this.synthContext.createOscillator();
    const noteGain = this.synthContext.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(frequency, this.synthContext.currentTime);

    const now = this.synthContext.currentTime;
    noteGain.gain.setValueAtTime(0.001, now);
    noteGain.gain.exponentialRampToValueAtTime(0.3, now + 0.08);
    noteGain.gain.exponentialRampToValueAtTime(0.0001, now + 1.4);

    osc.connect(noteGain);
    noteGain.connect(this.synthGain);

    osc.start(now);
    osc.stop(now + 1.5);
  }

  stopSynthesizer() {
    if (this.synthInterval) {
      clearInterval(this.synthInterval);
      this.synthInterval = null;
    }
  }
}

window.BirthdayMusicPlayer = BirthdayMusicPlayer;
