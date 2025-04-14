const fileInput = document.getElementById('fileInput');
const audio = document.getElementById('audio');
const songTitle = document.getElementById('song-title');
const playBtn = document.getElementById('play');
const pauseBtn = document.getElementById('pause');
const stopBtn = document.getElementById('stop');

fileInput.addEventListener('change', function () {
  const file = this.files[0];
  if (file) {
    const url = URL.createObjectURL(file);
    audio.src = url;
    songTitle.textContent = 'Canción: ' + file.name;
    audio.style.display = 'block';
  }
});

playBtn.addEventListener('click', () => {
  audio.play();
});

pauseBtn.addEventListener('click', () => {
  audio.pause();
});

stopBtn.addEventListener('click', () => {
  audio.pause();
  audio.currentTime = 0;
});
