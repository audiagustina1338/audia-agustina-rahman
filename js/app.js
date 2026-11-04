/**
 * =============================================================================
 * APP.JS - LOGIKA UTAMA WEBSITE PERSONAL PROFILE (EDISI NETFLIX)
 * =============================================================================
 * Mengatur interaksi antarmuka Netflix: barisan kartu horizontal (carousels),
 * pemutar video sinematik kustom, Lightbox 4 sudut rumah, modal rincian biodata,
 * pengalih profil ("Siapa yang menonton?"), dan pencarian dinamis.
 * =============================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  // ---------------------------------------------------------------------------
  // STATE MANAGEMENT
  // ---------------------------------------------------------------------------
  let lightboxIndex = 0;
  let activeLightboxPhotos = [];
  let isVideoPlaying = false;
  let simulatedVideoInterval = null;
  let simulatedTime = 0;
  const simulatedDuration = PERSONAL_DATA.video.durasiDetik || 165; // 02:45
  let isMuted = false;

  // Restore edits from localStorage if matching current profile
  const savedData = localStorage.getItem('netflix_profile_data_v2');
  if (savedData) {
    try {
      const parsed = JSON.parse(savedData);
      if (parsed.profile && parsed.profile.namaLengkap === PERSONAL_DATA.profile.namaLengkap) {
        Object.assign(PERSONAL_DATA.profile, parsed.profile);
        Object.assign(PERSONAL_DATA.biodata, parsed.biodata);
      }
    } catch (e) {
      console.warn('Gagal memulihkan data tersimpan:', e);
    }
  }

  // ---------------------------------------------------------------------------
  // DOM ELEMENTS
  // ---------------------------------------------------------------------------
  const netflixHeader = document.getElementById('netflix-header');
  const userDisplayNames = document.querySelectorAll('.user-display-name');
  const heroBio = document.getElementById('hero-bio');
  const heroMatch = document.getElementById('hero-match');
  const heroBannerImg = document.getElementById('hero-banner-img');
  const btnHeroPlay = document.getElementById('btn-hero-play');
  const btnHeroInfo = document.getElementById('btn-hero-info');
  const btnHeroEdit = document.getElementById('btn-hero-edit');
  const heroSoundToggle = document.getElementById('hero-sound-toggle');
  const heroVolOn = document.getElementById('hero-vol-on');
  const heroVolOff = document.getElementById('hero-vol-off');

  // Sliders & Containers
  const biodataSlider = document.getElementById('biodata-slider');
  const hobiSlider = document.getElementById('hobi-slider');
  const houseGrid = document.getElementById('house-grid');
  const netflixPostsContainer = document.getElementById('netflix-posts-container');
  const desktopNavLinks = document.querySelectorAll('#desktop-nav .netflix-nav-link');

  // Video Elements
  const netflixVideo = document.getElementById('netflix-video');
  const netflixPlayerWrapper = document.getElementById('netflix-player-wrapper');
  const netflixBigPlayBtn = document.getElementById('netflix-big-play-btn');
  const netflixPlayBtn = document.getElementById('netflix-play-btn');
  const nPlayIcon = document.getElementById('n-play-icon');
  const nPauseIcon = document.getElementById('n-pause-icon');
  const netflixSeekContainer = document.getElementById('netflix-seek-container');
  const netflixSeekBar = document.getElementById('netflix-seek-bar');
  const netflixTimeText = document.getElementById('netflix-time-text');
  const netflixRewindBtn = document.getElementById('netflix-rewind-btn');
  const netflixForwardBtn = document.getElementById('netflix-forward-btn');
  const netflixVolBtn = document.getElementById('netflix-vol-btn');
  const nVolIcon = document.getElementById('n-vol-icon');
  const nMuteIcon = document.getElementById('n-mute-icon');
  const netflixVolSlider = document.getElementById('netflix-vol-slider');
  const netflixSpeedSelect = document.getElementById('netflix-speed-select');
  const netflixFullscreenBtn = document.getElementById('netflix-fullscreen-btn');
  const netflixVideoUpload = document.getElementById('netflix-video-upload');

  // Modals
  const netflixDetailModal = document.getElementById('netflix-detail-modal');
  const modalCloseBtn = document.getElementById('modal-close-btn');
  const modalTitle = document.getElementById('modal-title');
  const modalDesc = document.getElementById('modal-desc');
  const modalPlayBtn = document.getElementById('modal-play-btn');
  const modalCopyBtn = document.getElementById('modal-copy-btn');
  const modalEpisodesList = document.getElementById('modal-episodes-list');

  // Lightbox Elements
  const netflixLightbox = document.getElementById('netflix-lightbox');
  const nlImg = document.getElementById('nl-img');
  const nlCounter = document.getElementById('nl-counter');
  const nlCaption = document.getElementById('nl-caption');
  const nlCloseBtn = document.getElementById('nl-close-btn');
  const nlPrevBtn = document.getElementById('nl-prev-btn');
  const nlNextBtn = document.getElementById('nl-next-btn');
  const nlDownload = document.getElementById('nl-download');

  // Profile Switcher Modal
  const profileSwitcherModal = document.getElementById('profile-switcher-modal');
  const btnSwitchProfile = document.getElementById('btn-switch-profile');
  const btnCloseSwitcher = document.getElementById('btn-close-switcher');
  const profilesGrid = document.getElementById('profiles-grid');

  // Edit Profile Modal
  const netflixEditModal = document.getElementById('netflix-edit-modal');
  const btnEditProfileMenu = document.getElementById('btn-edit-profile-menu');
  const btnEditAbout = document.getElementById('btn-edit-about');
  const editCloseX = document.getElementById('edit-close-x');
  const editCancelBtn = document.getElementById('edit-cancel-btn');
  const editSaveBtn = document.getElementById('edit-save-btn');
  const nEditName = document.getElementById('n-edit-name');
  const nEditBio = document.getElementById('n-edit-bio');
  const nEditBirth = document.getElementById('n-edit-birth');
  const nEditGender = document.getElementById('n-edit-gender');
  const nEditAddress = document.getElementById('n-edit-address');
  const nEditOrigin = document.getElementById('n-edit-origin');
  const nEditEducation = document.getElementById('n-edit-education');
  const nEditStatus = document.getElementById('n-edit-status');
  const nEditShortdesc = document.getElementById('n-edit-shortdesc');

  // Toast & Search
  const netflixToast = document.getElementById('netflix-toast');
  const toastText = document.getElementById('toast-text');
  const searchToggleBtn = document.getElementById('search-toggle-btn');
  const netflixSearchInput = document.getElementById('netflix-search-input');
  const btnCopyAllBio = document.getElementById('btn-copy-all-bio');
  const btnCopyLinkMenu = document.getElementById('btn-copy-link-menu');
  const netflixComposerBtn = document.getElementById('netflix-composer-btn');
  const netflixComposerInput = document.getElementById('netflix-composer-input');

  // ---------------------------------------------------------------------------
  // 1. STICKY NAVBAR BACKGROUND TRANSITION ON SCROLL
  // ---------------------------------------------------------------------------
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      netflixHeader.classList.add('scrolled');
    } else {
      netflixHeader.classList.remove('scrolled');
    }
  });

  // ---------------------------------------------------------------------------
  // 2. RENDER SEMUA KONTEN KE TAMPILAN
  // ---------------------------------------------------------------------------
  function renderAll() {
    const { profile, biodata, hobi, galeriRumah, posts, profiles } = PERSONAL_DATA;

    // Headline & Hero Info
    userDisplayNames.forEach(el => el.textContent = profile.namaLengkap);
    if (heroBio) heroBio.textContent = profile.bio;
    if (heroMatch) heroMatch.textContent = profile.matchRate;

    // Render 1: Biodata Carousel (8 Episode Cards Wajib)
    renderBiodataSlider(biodata);

    // Render 2: Top 10 Hobi Carousel
    renderHobiSlider(hobi);

    // Render 3: Galeri 4 Sudut Rumah Wajib
    renderHouseGrid(galeriRumah);

    // Render 4: Linimasa Postingan
    renderPosts(posts);

    // Render 5: Profiles Switcher
    renderProfiles(profiles);

    // About Full Desc
    const aboutFullDesc = document.getElementById('about-full-desc');
    if (aboutFullDesc) aboutFullDesc.textContent = profile.deskripsiLengkap;
  }

  // ---------------------------------------------------------------------------
  // 3. RENDER BIODATA DIRI (8 EPISODE KARTU NETFLIX)
  // ---------------------------------------------------------------------------
  function renderBiodataSlider(biodata) {
    if (!biodataSlider) return;
    biodataSlider.innerHTML = '';

    biodata.episodes.forEach(ep => {
      const card = document.createElement('div');
      card.className = 'netflix-card w-64 sm:w-72 flex-shrink-0 flex flex-col justify-between group';
      card.innerHTML = `
        <div class="relative aspect-[16/9] w-full overflow-hidden bg-[#202020]">
          <img src="assets/images/banner.jpg" alt="${ep.judul}" class="w-full h-full object-cover card-img group-hover:scale-105 transition-transform duration-300 opacity-80">
          <div class="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent"></div>
          
          <!-- Episode Number Pill -->
          <div class="absolute top-2.5 left-2.5 bg-[#E50914] text-white font-black text-[10px] px-2 py-0.5 rounded shadow">
            EPISODE ${ep.ep}
          </div>

          <!-- Play button on hover -->
          <div class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <div class="w-10 h-10 rounded-full bg-white/90 text-black flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform">
              <svg class="w-5 h-5 ml-0.5 fill-black" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
            </div>
          </div>

          <!-- Bottom card title -->
          <div class="absolute bottom-2 left-2.5 right-2.5">
            <span class="text-[10px] text-[#b3b3b3] uppercase tracking-wider block font-semibold">${ep.subjudul}</span>
            <h4 class="text-xs sm:text-sm font-bold text-white truncate">${ep.nilai}</h4>
          </div>
        </div>

        <!-- Red Progress Bar ala Netflix -->
        <div class="w-full bg-[#333333] h-1">
          <div class="red-progress h-full" style="width: ${ep.progress}%;"></div>
        </div>

        <!-- Card Footer -->
        <div class="p-3 bg-[#181818] flex flex-col gap-1 border-t border-white/5">
          <div class="flex items-center justify-between text-[11px]">
            <span class="text-[#46d369] font-bold">99% Cocok</span>
            <span class="text-[#808080]">${ep.durasi}</span>
          </div>
          <p class="text-[11px] text-[#b3b3b3] line-clamp-2 leading-relaxed">${ep.deskripsi}</p>
        </div>
      `;

      card.addEventListener('click', () => {
        openDetailModal(`Episode ${ep.ep}: ${ep.subjudul}`, ep.nilai, ep.deskripsi);
      });

      biodataSlider.appendChild(card);
    });
  }

  // ---------------------------------------------------------------------------
  // 4. RENDER TOP 10 HOBI & MINAT (METALLIC NUMBERS)
  // ---------------------------------------------------------------------------
  function renderHobiSlider(hobbies) {
    if (!hobiSlider) return;
    hobiSlider.innerHTML = '';

    hobbies.forEach(h => {
      const card = document.createElement('div');
      card.className = 'netflix-card w-64 sm:w-72 flex-shrink-0 flex items-end pl-10 pr-2 pt-2 pb-2 relative group';
      card.innerHTML = `
        <!-- Giant Top 10 Number Outline -->
        <span class="top10-number">${h.rank}</span>

        <!-- Card Content Container -->
        <div class="w-full rounded overflow-hidden bg-[#181818] border border-white/10 flex flex-col relative z-10 shadow-lg">
          <div class="relative aspect-[16/9] w-full overflow-hidden">
            <img src="${h.gambar}" alt="${h.judul}" class="w-full h-full object-cover card-img group-hover:scale-105 transition-transform duration-300">
            <div class="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
            
            <div class="absolute top-2 left-2 flex items-center gap-1.5 bg-black/70 px-2 py-0.5 rounded text-xs">
              <span>${h.icon}</span>
              <span class="text-[10px] text-[#46d369] font-bold">${h.match}</span>
            </div>
          </div>

          <div class="p-3 flex flex-col gap-1">
            <h4 class="text-xs sm:text-sm font-bold text-white truncate">${h.judul}</h4>
            <p class="text-[11px] text-[#808080] line-clamp-2">${h.deskripsi}</p>
            <div class="flex flex-wrap gap-1 mt-1">
              ${(h.tags || []).slice(0, 3).map(tag => `<span class="text-[9px] bg-white/10 text-[#b3b3b3] px-1.5 py-0.5 rounded">${tag}</span>`).join('')}
            </div>
          </div>
        </div>
      `;

      card.addEventListener('click', () => {
        openLightbox([{
          src: h.gambar,
          title: `Hobi #${h.rank}: ${h.judul}`,
          caption: h.deskripsi
        }], 0);
      });

      hobiSlider.appendChild(card);
    });
  }

  // ---------------------------------------------------------------------------
  // 5. RENDER GALERI 4 SUDUT RUMAH WAJIB
  // ---------------------------------------------------------------------------
  function renderHouseGrid(housePhotos) {
    if (!houseGrid) return;
    houseGrid.innerHTML = '';

    // Siapkan list foto untuk Lightbox
    activeLightboxPhotos = housePhotos.map(item => ({
      src: item.file,
      title: item.kategori,
      caption: `${item.judul} - ${item.deskripsi}`
    }));

    housePhotos.forEach((item, index) => {
      const card = document.createElement('div');
      card.className = 'netflix-card flex flex-col group rounded-md overflow-hidden bg-[#181818] border border-white/10';
      card.innerHTML = `
        <div class="relative aspect-[16/9] w-full overflow-hidden bg-[#202020]">
          <img src="${item.file}" alt="${item.kategori}" class="w-full h-full object-cover card-img group-hover:scale-105 transition-transform duration-300">
          <div class="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
          
          <!-- Category Badge -->
          <div class="absolute top-2.5 left-2.5 bg-[#E50914] text-white text-[10px] font-black px-2 py-0.5 rounded shadow uppercase">
            ${item.badge}
          </div>

          <div class="absolute bottom-2 left-2.5 right-2.5 flex items-center justify-between">
            <span class="text-[11px] text-[#46d369] font-bold">${item.match}</span>
            <span class="text-[10px] bg-white/20 px-1.5 py-0.5 rounded text-white font-semibold">${item.durasi}</span>
          </div>
        </div>

        <div class="p-3.5 flex flex-col gap-1.5">
          <h4 class="text-sm font-bold text-white group-hover:text-[#E50914] transition-colors">${item.kategori}</h4>
          <span class="text-xs text-[#b3b3b3] font-medium">${item.judul}</span>
          <p class="text-xs text-[#808080] line-clamp-2 leading-relaxed">${item.deskripsi}</p>
          <div class="pt-1.5 flex items-center justify-between border-t border-white/10 text-xs">
            <span class="text-[#E50914] font-semibold text-[11px] group-hover:underline">Buka Cinema Preview</span>
            <svg class="w-4 h-4 text-white group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/></svg>
          </div>
        </div>
      `;

      card.addEventListener('click', () => {
        openLightbox(activeLightboxPhotos, index);
      });

      houseGrid.appendChild(card);
    });
  }

  // ---------------------------------------------------------------------------
  // 6. RENDER LINIMASA POSTINGAN AKTIVITAS
  // ---------------------------------------------------------------------------
  function renderPosts(posts) {
    if (!netflixPostsContainer) return;
    netflixPostsContainer.innerHTML = '';

    posts.forEach(p => {
      const card = document.createElement('article');
      card.className = 'bg-[#181818] border border-white/10 rounded-lg p-4 flex flex-col justify-between hover:border-white/30 transition-all';
      card.innerHTML = `
        <div class="flex flex-col gap-2">
          <div class="flex items-center justify-between text-xs">
            <span class="bg-[#E50914]/20 text-[#E50914] font-bold px-2 py-0.5 rounded text-[10px] uppercase">${p.kategori || 'Episode'}</span>
            <span class="text-[#808080]">${p.tanggal}</span>
          </div>
          <h4 class="text-sm font-bold text-white">${p.judul}</h4>
          <p class="text-xs text-[#b3b3b3] leading-relaxed">${p.isi}</p>
          ${p.media ? `
            <div class="mt-2 rounded overflow-hidden aspect-video bg-black cursor-pointer group" onclick="window.previewSinglePhoto('${p.media}', '${p.judul}')">
              <img src="${p.media}" alt="${p.judul}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300">
            </div>
          ` : ''}
        </div>

        <div class="flex items-center justify-between pt-3 mt-3 border-t border-white/10 text-xs text-[#808080]">
          <button class="post-like-btn hover:text-[#E50914] flex items-center gap-1.5 transition-colors">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"/></svg>
            <span class="like-cnt">${p.likes}</span> Suka
          </button>
          <button class="post-share-btn hover:text-white flex items-center gap-1.5 transition-colors">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"/></svg>
            <span>Bagikan</span>
          </button>
        </div>
      `;

      // Interaksi Like & Share
      const likeBtn = card.querySelector('.post-like-btn');
      const likeCnt = card.querySelector('.like-cnt');
      likeBtn.addEventListener('click', () => {
        p.likes += 1;
        likeCnt.textContent = p.likes;
        likeBtn.classList.add('text-[#E50914]');
        showToast('Menyukai episode linimasa!');
      });

      const shareBtn = card.querySelector('.post-share-btn');
      shareBtn.addEventListener('click', () => {
        navigator.clipboard?.writeText(window.location.href);
        showToast('Tautan postingan berhasil disalin!');
      });

      netflixPostsContainer.appendChild(card);
    });
  }

  window.previewSinglePhoto = (src, title) => {
    openLightbox([{ src, title, caption: 'Dokumentasi Linimasa' }], 0);
  };

  // Composer Postingan Baru
  if (netflixComposerBtn && netflixComposerInput) {
    netflixComposerBtn.addEventListener('click', () => {
      const val = netflixComposerInput.value.trim();
      if (!val) {
        showToast('Silakan tulis cerita Anda terlebih dahulu!');
        netflixComposerInput.focus();
        return;
      }

      const newPost = {
        id: `post-${Date.now()}`,
        tanggal: 'Hari ini',
        judul: 'Aktivitas Baru Personal',
        isi: val,
        kategori: 'Episode Tambahan',
        media: null,
        likes: 1,
        shares: 0
      };

      PERSONAL_DATA.posts.unshift(newPost);
      renderPosts(PERSONAL_DATA.posts);
      netflixComposerInput.value = '';
      showToast('Episode linimasa baru berhasil dirilis!');
    });
  }

  // ---------------------------------------------------------------------------
  // 7. RENDER PROFILES ("SIAPA YANG MENONTON?")
  // ---------------------------------------------------------------------------
  function renderProfiles(profiles) {
    if (!profilesGrid) return;
    profilesGrid.innerHTML = '';

    profiles.forEach(p => {
      const item = document.createElement('div');
      item.className = 'flex flex-col items-center gap-2 cursor-pointer group';
      item.innerHTML = `
        <div class="w-24 h-24 sm:w-28 sm:h-28 rounded-lg overflow-hidden border-2 ${p.active ? 'border-white' : 'border-transparent'} group-hover:border-white transition-all shadow-xl">
          <img src="assets/images/profile.jpg" alt="${p.name}" class="w-full h-full object-cover group-hover:scale-105 transition-transform">
        </div>
        <span class="text-xs sm:text-sm text-[#808080] group-hover:text-white font-medium">${p.name}</span>
      `;

      item.addEventListener('click', () => {
        profiles.forEach(x => x.active = (x.id === p.id));
        profileSwitcherModal.classList.add('hidden');
        profileSwitcherModal.classList.remove('flex');
        showToast(`Beralih profil ke: ${p.name}`);
      });

      profilesGrid.appendChild(item);
    });
  }

  // ---------------------------------------------------------------------------
  // 8. PEMUTAR VIDEO SINEMATIK NETFLIX
  // ---------------------------------------------------------------------------
  function toggleVideo() {
    if (isVideoPlaying) {
      pauseNetflixVideo();
    } else {
      playNetflixVideo();
    }
  }

  function playNetflixVideo() {
    if (!netflixVideo) return;
    const p = netflixVideo.play();
    if (p !== undefined) {
      p.then(() => {
        isVideoPlaying = true;
        updateVideoUI(true);
      }).catch(err => {
        console.info('Mengaktifkan pemutar simulasi video:', err.message);
        startSimulatedPlayback();
      });
    } else {
      startSimulatedPlayback();
    }
  }

  function pauseNetflixVideo() {
    if (netflixVideo) {
      try { netflixVideo.pause(); } catch (e) {}
    }
    clearInterval(simulatedVideoInterval);
    isVideoPlaying = false;
    updateVideoUI(false);
  }

  function updateVideoUI(playing) {
    if (playing) {
      netflixBigPlayBtn.style.display = 'none';
      nPlayIcon.classList.add('hidden');
      nPauseIcon.classList.remove('hidden');
      netflixPlayerWrapper.classList.remove('paused');
    } else {
      netflixBigPlayBtn.style.display = 'flex';
      nPlayIcon.classList.remove('hidden');
      nPauseIcon.classList.add('hidden');
      netflixPlayerWrapper.classList.add('paused');
    }
  }

  function startSimulatedPlayback() {
    isVideoPlaying = true;
    updateVideoUI(true);
    showToast('▶ Memutar video dokumentasi: 02:45');

    clearInterval(simulatedVideoInterval);
    simulatedVideoInterval = setInterval(() => {
      simulatedTime += 1;
      if (simulatedTime > simulatedDuration) {
        simulatedTime = 0;
        pauseNetflixVideo();
        return;
      }
      const percent = (simulatedTime / simulatedDuration) * 100;
      netflixSeekBar.style.width = `${percent}%`;
      netflixTimeText.textContent = `${formatTime(simulatedTime)} / ${formatTime(simulatedDuration)}`;
    }, 1000);
  }

  function formatTime(secs) {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
  }

  if (netflixBigPlayBtn) netflixBigPlayBtn.addEventListener('click', toggleVideo);
  if (netflixPlayBtn) netflixPlayBtn.addEventListener('click', toggleVideo);
  if (btnHeroPlay) {
    btnHeroPlay.addEventListener('click', () => {
      const target = document.getElementById('video-player-section');
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
        playNetflixVideo();
      }
    });
  }

  // Seek bar
  if (netflixSeekContainer) {
    netflixSeekContainer.addEventListener('click', (e) => {
      const rect = netflixSeekContainer.getBoundingClientRect();
      const pos = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
      if (netflixVideo && netflixVideo.duration && !isNaN(netflixVideo.duration)) {
        netflixVideo.currentTime = pos * netflixVideo.duration;
      } else {
        simulatedTime = pos * simulatedDuration;
        netflixSeekBar.style.width = `${pos * 100}%`;
        netflixTimeText.textContent = `${formatTime(simulatedTime)} / ${formatTime(simulatedDuration)}`;
      }
    });
  }

  // Native Video events
  if (netflixVideo) {
    netflixVideo.addEventListener('loadedmetadata', () => {
      if (netflixVideo.duration && !isNaN(netflixVideo.duration)) {
        netflixTimeText.textContent = `00:00 / ${formatTime(netflixVideo.duration)}`;
      }
    });

    netflixVideo.addEventListener('timeupdate', () => {
      if (netflixVideo.duration && !isNaN(netflixVideo.duration)) {
        const percent = (netflixVideo.currentTime / netflixVideo.duration) * 100;
        netflixSeekBar.style.width = `${percent}%`;
        netflixTimeText.textContent = `${formatTime(netflixVideo.currentTime)} / ${formatTime(netflixVideo.duration)}`;
      }
    });
    netflixVideo.addEventListener('ended', () => {
      pauseNetflixVideo();
      netflixSeekBar.style.width = '0%';
    });
  }

  // Rewind & Forward 10s
  if (netflixRewindBtn) {
    netflixRewindBtn.addEventListener('click', () => {
      if (netflixVideo && netflixVideo.duration) {
        netflixVideo.currentTime = Math.max(0, netflixVideo.currentTime - 10);
      } else {
        simulatedTime = Math.max(0, simulatedTime - 10);
      }
      showToast('⏪ Mundur 10 detik');
    });
  }

  if (netflixForwardBtn) {
    netflixForwardBtn.addEventListener('click', () => {
      if (netflixVideo && netflixVideo.duration) {
        netflixVideo.currentTime = Math.min(netflixVideo.duration, netflixVideo.currentTime + 10);
      } else {
        simulatedTime = Math.min(simulatedDuration, simulatedTime + 10);
      }
      showToast('⏩ Maju 10 detik');
    });
  }

  // Volume & Mute
  if (netflixVolSlider) {
    netflixVolSlider.addEventListener('input', (e) => {
      const val = parseFloat(e.target.value);
      if (netflixVideo) {
        netflixVideo.volume = val;
        netflixVideo.muted = (val === 0);
      }
      updateVolUI(val === 0);
    });
  }

  if (netflixVolBtn) {
    netflixVolBtn.addEventListener('click', () => {
      isMuted = !isMuted;
      if (netflixVideo) netflixVideo.muted = isMuted;
      updateVolUI(isMuted);
      if (netflixVolSlider) netflixVolSlider.value = isMuted ? 0 : 1;
    });
  }

  function updateVolUI(muted) {
    if (muted) {
      nVolIcon.classList.add('hidden');
      nMuteIcon.classList.remove('hidden');
    } else {
      nVolIcon.classList.remove('hidden');
      nMuteIcon.classList.add('hidden');
    }
  }

  // Speed
  if (netflixSpeedSelect) {
    netflixSpeedSelect.addEventListener('change', (e) => {
      if (netflixVideo) netflixVideo.playbackRate = parseFloat(e.target.value);
      showToast(`Kecepatan putar: ${e.target.value}x`);
    });
  }

  // Fullscreen
  if (netflixFullscreenBtn) {
    netflixFullscreenBtn.addEventListener('click', () => {
      if (!document.fullscreenElement) {
        if (netflixPlayerWrapper.requestFullscreen) {
          netflixPlayerWrapper.requestFullscreen();
        } else if (netflixPlayerWrapper.webkitRequestFullscreen) {
          netflixPlayerWrapper.webkitRequestFullscreen();
        }
      } else {
        if (document.exitFullscreen) document.exitFullscreen();
      }
    });
  }

  // Video Upload Tester
  if (netflixVideoUpload) {
    netflixVideoUpload.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) {
        const url = URL.createObjectURL(file);
        netflixVideo.src = url;
        netflixVideo.load();
        playNetflixVideo();
        showToast(`Video "${file.name}" berhasil diputar!`);
      }
    });
  }

  // Hero sound toggle
  if (heroSoundToggle) {
    heroSoundToggle.addEventListener('click', () => {
      isMuted = !isMuted;
      if (isMuted) {
        heroVolOn.classList.add('hidden');
        heroVolOff.classList.remove('hidden');
        showToast('Audio latar dinonaktifkan');
      } else {
        heroVolOn.classList.remove('hidden');
        heroVolOff.classList.add('hidden');
        showToast('Audio latar diaktifkan');
      }
    });
  }

  // ---------------------------------------------------------------------------
  // 9. NETFLIX DETAIL MODAL ("SELENGKAPNYA")
  // ---------------------------------------------------------------------------
  function openDetailModal(title, sub, fullText) {
    if (modalTitle) modalTitle.textContent = title;
    if (modalDesc) {
      const summary = (sub || fullText) ? `${sub ? sub + '\n\n' : ''}${fullText || ''}`.trim() : `${PERSONAL_DATA.biodata.namaLengkap} · ${PERSONAL_DATA.biodata.pendidikan} · ${PERSONAL_DATA.biodata.asalDaerah}\nStatus: ${PERSONAL_DATA.biodata.status}\nHobi: Bernyanyi dan Bermain Musik`;
      modalDesc.textContent = summary;
    }

    // Render 8 episodes list
    if (modalEpisodesList) {
      modalEpisodesList.innerHTML = '';
      PERSONAL_DATA.biodata.episodes.forEach(ep => {
        const item = document.createElement('div');
        item.className = 'p-3 rounded bg-[#202020] border border-white/5 flex items-center justify-between text-xs hover:bg-white/10 cursor-pointer transition-colors';
        item.innerHTML = `
          <div class="flex items-center gap-3">
            <span class="font-bold text-[#E50914] text-sm">#${ep.ep}</span>
            <div>
              <h5 class="font-bold text-white">${ep.subjudul}: <span class="text-[#46d369] font-semibold">${ep.nilai}</span></h5>
              <p class="text-[11px] text-[#808080]">${ep.deskripsi}</p>
            </div>
          </div>
          <span class="text-[10px] text-[#808080] font-semibold">${ep.durasi}</span>
        `;
        modalEpisodesList.appendChild(item);
      });
    }

    netflixDetailModal.classList.remove('hidden');
    netflixDetailModal.classList.add('flex');
    document.body.style.overflow = 'hidden';
  }

  function closeDetailModal() {
    netflixDetailModal.classList.add('hidden');
    netflixDetailModal.classList.remove('flex');
    document.body.style.overflow = 'auto';
  }

  if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeDetailModal);
  if (btnHeroInfo) {
    btnHeroInfo.addEventListener('click', () => {
      openDetailModal(
        PERSONAL_DATA.profile.namaLengkap,
        PERSONAL_DATA.profile.bio,
        PERSONAL_DATA.profile.deskripsiLengkap
      );
    });
  }
  if (modalPlayBtn) {
    modalPlayBtn.addEventListener('click', () => {
      closeDetailModal();
      const target = document.getElementById('video-player-section');
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
        playNetflixVideo();
      }
    });
  }
  if (modalCopyBtn) {
    modalCopyBtn.addEventListener('click', () => {
      copyAllBiodataText();
    });
  }

  // ---------------------------------------------------------------------------
  // 10. NETFLIX CINEMA LIGHTBOX (4 SUDUT RUMAH)
  // ---------------------------------------------------------------------------
  function openLightbox(photos, index = 0) {
    activeLightboxPhotos = photos;
    lightboxIndex = index;
    updateLightboxUI();
    netflixLightbox.classList.remove('hidden');
    netflixLightbox.classList.add('flex');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    netflixLightbox.classList.add('hidden');
    netflixLightbox.classList.remove('flex');
    document.body.style.overflow = 'auto';
  }

  function updateLightboxUI() {
    if (!activeLightboxPhotos || activeLightboxPhotos.length === 0) return;
    const cur = activeLightboxPhotos[lightboxIndex];
    nlImg.src = cur.src;
    nlCounter.textContent = `${cur.title} (${lightboxIndex + 1} dari ${activeLightboxPhotos.length})`;
    nlCaption.textContent = cur.caption || '';
    nlDownload.href = cur.src;
    nlDownload.download = (cur.title || 'foto').toLowerCase().replace(/\s+/g, '-') + '.jpg';

    if (activeLightboxPhotos.length <= 1) {
      nlPrevBtn.style.display = 'none';
      nlNextBtn.style.display = 'none';
    } else {
      nlPrevBtn.style.display = 'flex';
      nlNextBtn.style.display = 'flex';
    }
  }

  function nextPhoto() {
    if (activeLightboxPhotos.length <= 1) return;
    lightboxIndex = (lightboxIndex + 1) % activeLightboxPhotos.length;
    updateLightboxUI();
  }

  function prevPhoto() {
    if (activeLightboxPhotos.length <= 1) return;
    lightboxIndex = (lightboxIndex - 1 + activeLightboxPhotos.length) % activeLightboxPhotos.length;
    updateLightboxUI();
  }

  if (nlCloseBtn) nlCloseBtn.addEventListener('click', closeLightbox);
  if (nlNextBtn) nlNextBtn.addEventListener('click', nextPhoto);
  if (nlPrevBtn) nlPrevBtn.addEventListener('click', prevPhoto);

  window.addEventListener('keydown', (e) => {
    if (!netflixLightbox.classList.contains('hidden')) {
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') nextPhoto();
      if (e.key === 'ArrowLeft') prevPhoto();
    }
    if (!netflixDetailModal.classList.contains('hidden')) {
      if (e.key === 'Escape') closeDetailModal();
    }
    if (!profileSwitcherModal.classList.contains('hidden')) {
      if (e.key === 'Escape') {
        profileSwitcherModal.classList.add('hidden');
        profileSwitcherModal.classList.remove('flex');
      }
    }
  });

  // ---------------------------------------------------------------------------
  // 11. PROFILE SWITCHER MODAL ("SIAPA YANG MENONTON?")
  // ---------------------------------------------------------------------------
  if (btnSwitchProfile) {
    btnSwitchProfile.addEventListener('click', () => {
      profileSwitcherModal.classList.remove('hidden');
      profileSwitcherModal.classList.add('flex');
    });
  }
  if (btnCloseSwitcher) {
    btnCloseSwitcher.addEventListener('click', () => {
      profileSwitcherModal.classList.add('hidden');
      profileSwitcherModal.classList.remove('flex');
    });
  }

  // ---------------------------------------------------------------------------
  // 12. MODAL EDIT PROFIL BIODATA INTERAKTIF
  // ---------------------------------------------------------------------------
  function openEditModal() {
    nEditName.value = PERSONAL_DATA.profile.namaLengkap;
    nEditBio.value = PERSONAL_DATA.profile.bio;
    nEditBirth.value = `${PERSONAL_DATA.biodata.tempatLahir}, ${PERSONAL_DATA.biodata.tanggalLahir}`;
    nEditGender.value = PERSONAL_DATA.biodata.jenisKelamin;
    nEditAddress.value = PERSONAL_DATA.biodata.alamat;
    nEditOrigin.value = PERSONAL_DATA.biodata.asalDaerah;
    nEditEducation.value = PERSONAL_DATA.biodata.pendidikan;
    nEditStatus.value = PERSONAL_DATA.biodata.status;
    nEditShortdesc.value = PERSONAL_DATA.biodata.deskripsiSingkat;

    netflixEditModal.classList.remove('hidden');
    netflixEditModal.classList.add('flex');
  }

  function closeEditModal() {
    netflixEditModal.classList.add('hidden');
    netflixEditModal.classList.remove('flex');
  }

  if (btnHeroEdit) btnHeroEdit.addEventListener('click', openEditModal);
  if (btnEditProfileMenu) btnEditProfileMenu.addEventListener('click', openEditModal);
  if (btnEditAbout) btnEditAbout.addEventListener('click', openEditModal);
  if (editCloseX) editCloseX.addEventListener('click', closeEditModal);
  if (editCancelBtn) editCancelBtn.addEventListener('click', closeEditModal);

  if (editSaveBtn) {
    editSaveBtn.addEventListener('click', () => {
      const name = nEditName.value.trim() || PERSONAL_DATA.profile.namaLengkap;
      const bio = nEditBio.value.trim() || PERSONAL_DATA.profile.bio;
      const gender = nEditGender.value.trim() || PERSONAL_DATA.biodata.jenisKelamin;
      const address = nEditAddress.value.trim() || PERSONAL_DATA.biodata.alamat;
      const origin = nEditOrigin.value.trim() || PERSONAL_DATA.biodata.asalDaerah;
      const education = nEditEducation.value.trim() || PERSONAL_DATA.biodata.pendidikan;
      const status = nEditStatus.value.trim() || PERSONAL_DATA.biodata.status;
      const shortdesc = nEditShortdesc.value.trim() || PERSONAL_DATA.biodata.deskripsiSingkat;

      // Update state
      PERSONAL_DATA.profile.namaLengkap = name;
      PERSONAL_DATA.profile.bio = bio;
      PERSONAL_DATA.biodata.namaLengkap = name;
      PERSONAL_DATA.biodata.jenisKelamin = gender;
      PERSONAL_DATA.biodata.alamat = address;
      PERSONAL_DATA.biodata.asalDaerah = origin;
      PERSONAL_DATA.biodata.pendidikan = education;
      PERSONAL_DATA.biodata.status = status;
      PERSONAL_DATA.biodata.deskripsiSingkat = shortdesc;

      // Update episode values
      if (PERSONAL_DATA.biodata.episodes[0]) PERSONAL_DATA.biodata.episodes[0].nilai = name;
      if (PERSONAL_DATA.biodata.episodes[1]) PERSONAL_DATA.biodata.episodes[1].nilai = `${PERSONAL_DATA.biodata.tempatLahir}, ${PERSONAL_DATA.biodata.tanggalLahir}`;
      if (PERSONAL_DATA.biodata.episodes[2]) PERSONAL_DATA.biodata.episodes[2].nilai = gender;
      if (PERSONAL_DATA.biodata.episodes[3]) PERSONAL_DATA.biodata.episodes[3].nilai = address;
      if (PERSONAL_DATA.biodata.episodes[4]) PERSONAL_DATA.biodata.episodes[4].nilai = origin;
      if (PERSONAL_DATA.biodata.episodes[5]) PERSONAL_DATA.biodata.episodes[5].nilai = education;
      if (PERSONAL_DATA.biodata.episodes[6]) PERSONAL_DATA.biodata.episodes[6].nilai = status;

      // Persist to localStorage
      localStorage.setItem('netflix_profile_data_v2', JSON.stringify({
        profile: PERSONAL_DATA.profile,
        biodata: PERSONAL_DATA.biodata
      }));

      renderAll();
      closeEditModal();
      showToast('Biodata & profil berhasil diperbarui!');
    });
  }

  // ---------------------------------------------------------------------------
  // 13. SALIN DATA BIODATA LENGKAP
  // ---------------------------------------------------------------------------
  function copyAllBiodataText() {
    const b = PERSONAL_DATA.biodata;
    const text = `BIODATA DIRI - ${b.namaLengkap}
==================================================
1. Nama Lengkap       : ${b.namaLengkap}
2. Tempat/Tgl Lahir   : ${b.tempatLahir}, ${b.tanggalLahir}
3. Jenis Kelamin      : ${b.jenisKelamin}
4. Alamat             : ${b.alamat}
5. Asal Daerah        : ${b.asalDaerah}
6. Pendidikan         : ${b.pendidikan}
7. Status Personal    : ${b.status}
8. Hobi & Minat       : Bernyanyi dan Bermain Musik
==================================================
Tautan Portofolio: ${window.location.href}`;

    navigator.clipboard?.writeText(text);
    showToast('Seluruh format biodata berhasil disalin!');
  }

  if (btnCopyAllBio) btnCopyAllBio.addEventListener('click', copyAllBiodataText);
  if (btnCopyLinkMenu) {
    btnCopyLinkMenu.addEventListener('click', () => {
      navigator.clipboard?.writeText(window.location.href);
      showToast('Tautan portofolio disalin!');
    });
  }

  // ---------------------------------------------------------------------------
  // 14. PENCARIAN INTERAKTIF
  // ---------------------------------------------------------------------------
  if (searchToggleBtn && netflixSearchInput) {
    searchToggleBtn.addEventListener('click', () => {
      netflixSearchInput.classList.toggle('hidden');
      if (!netflixSearchInput.classList.contains('hidden')) {
        netflixSearchInput.focus();
      }
    });

    netflixSearchInput.addEventListener('input', (e) => {
      const q = e.target.value.toLowerCase().trim();
      if (!q) return;
      // Scroll to closest section matching query
      if (q.includes('rumah') || q.includes('foto')) {
        document.getElementById('galeri-rumah')?.scrollIntoView({ behavior: 'smooth' });
      } else if (q.includes('video') || q.includes('tonton')) {
        document.getElementById('video-player-section')?.scrollIntoView({ behavior: 'smooth' });
      } else if (q.includes('hobi') || q.includes('kegiatan')) {
        document.getElementById('hobi')?.scrollIntoView({ behavior: 'smooth' });
      } else if (q.includes('bio') || q.includes('lahir') || q.includes('pendidikan')) {
        document.getElementById('biodata')?.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }

  // ---------------------------------------------------------------------------
  // 15. TOAST NOTIFICATION HELPER
  // ---------------------------------------------------------------------------
  let toastTimer = null;
  function showToast(msg) {
    if (!netflixToast || !toastText) return;
    toastText.textContent = msg;
    netflixToast.classList.remove('hidden');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      netflixToast.classList.add('hidden');
    }, 2800);
  }

  // Desktop Nav Smooth Scroll
  desktopNavLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const secId = link.getAttribute('data-section');
      const target = document.getElementById(secId);
      if (target) {
        desktopNavLinks.forEach(l => l.classList.remove('active'));
        link.classList.add('active');
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // ---------------------------------------------------------------------------
  // JALANKAN INISIALISASI
  // ---------------------------------------------------------------------------
  renderAll();
});
