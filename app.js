window.addEventListener('DOMContentLoaded', () => {
    const audioPlayer = document.getElementById('audio-player');

    const songs = document.querySelectorAll('.song');
    const playPauseBtn = document.getElementById('play-pause-btn');
    const progressBar = document.querySelector('.progress-bar');
    const progressContainer = document.getElementById('progress-container');
    const currentTimeElement = document.querySelector('.current-time');
    const totalDurationElement = document.querySelector('.total-duration');
    const nextBtn = document.querySelector('.fa-step-forward');
    const prevBtn = document.querySelector('.fa-step-backward');
    const shuffleBtn = document.getElementById('shuffle-btn');
    const repeatBtn = document.getElementById('repeat-btn');
    const volumeSlider = document.querySelector('.volume-slider');

    let currentSongIndex = 0;
    let isShuffle = false;
    let repeatMode = false;

    function formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
    }

    function playSongByIndex(index) {
        currentSongIndex = index;
        const song = songs[index];

        const songTitle = song.getAttribute('data-title');
        const artist = song.getAttribute('data-artist');
        const image = song.getAttribute('data-image');
        const songSrc = song.getAttribute('data-src');

        audioPlayer.src = songSrc;
        audioPlayer.play();

        // Update UI
        document.querySelector('.player-left img').src = image;
        document.querySelector('.player-left h4').textContent = songTitle;
        document.querySelector('.player-left p').textContent = artist;

        playPauseBtn.classList.replace('fa-play', 'fa-pause');

        // Highlight currently playing card
        songs.forEach(c => c.classList.remove('playing'));
        song.classList.add('playing');
    }

    songs.forEach((song, index) => {
        song.addEventListener('click', () => {
            playSongByIndex(index);
        });
    });

    playPauseBtn.addEventListener('click', () => {
        if (!audioPlayer.src) return;
        if (audioPlayer.paused) {
            audioPlayer.play();
            playPauseBtn.classList.replace('fa-play', 'fa-pause');
        } else {
            audioPlayer.pause();
            playPauseBtn.classList.replace('fa-pause', 'fa-play');
        }
    });

    audioPlayer.addEventListener('timeupdate', () => {
        const current = audioPlayer.currentTime;
        const duration = audioPlayer.duration;

        if (!isNaN(duration)) {
            const percent = (current / duration) * 100;
            progressBar.value = percent;
            currentTimeElement.textContent = formatTime(current);
            totalDurationElement.textContent = formatTime(duration);
        }
    });

    progressContainer.addEventListener('click', (e) => {
        const width = progressContainer.clientWidth;
        const clickX = e.offsetX;
        const duration = audioPlayer.duration;

        if (!isNaN(duration)) {
            audioPlayer.currentTime = (clickX / width) * duration;
        }
    });

    progressBar.addEventListener('input', () => {
        const duration = audioPlayer.duration;
        if (!isNaN(duration)) {
            audioPlayer.currentTime = (progressBar.value / 100) * duration;
        }
    });

    volumeSlider.addEventListener('input', () => {
        audioPlayer.volume = volumeSlider.value / 100;
    });

    nextBtn.addEventListener('click', () => {
        if (isShuffle) {
            playRandomSong();
        } else {
            currentSongIndex = (currentSongIndex + 1) % songs.length;
            playSongByIndex(currentSongIndex);
        }
    });

    prevBtn.addEventListener('click', () => {
        if (isShuffle) {
            playRandomSong();
        } else {
            currentSongIndex = (currentSongIndex - 1 + songs.length) % songs.length;
            playSongByIndex(currentSongIndex);
        }
    });

    shuffleBtn.addEventListener('click', () => {
        isShuffle = !isShuffle;
        shuffleBtn.classList.toggle('active');
    });

    repeatBtn.addEventListener('click', () => {
        repeatMode = !repeatMode;
        repeatBtn.classList.toggle('active');
    });

    function playRandomSong() {
        let randomIndex;
        do {
            randomIndex = Math.floor(Math.random() * songs.length);
        } while (randomIndex === currentSongIndex);
        playSongByIndex(randomIndex);
    }

    audioPlayer.addEventListener('ended', () => {
        if (repeatMode) {
            audioPlayer.currentTime = 0;
            audioPlayer.play();
        } else {
            nextBtn.click(); // Auto-play next song
        }
    });
});
