function playAudio(audioId, sectionId, type) {
  // Pause and reset all audio elements
  const audios = document.querySelectorAll('audio');
  audios.forEach(audio => {
    audio.pause();
    audio.currentTime = 0;
  });

  // Play the selected audio
  const audio = document.getElementById(audioId);
  // (Optional) load the audio if not already loaded
  audio.load();
  audio.play();

  // Remove active highlight from all sections
  document.querySelectorAll('.section').forEach(section => {
    section.classList.remove('active');
  });
  document.getElementById('section-' + sectionId).classList.add('active');

  // Update the central image based on the selected section
  const centerImage = document.getElementById('center-image');
  centerImage.style.backgroundImage = `url('images/section${sectionId}-image.jpg')`;

  // Update the symbol icon based on the type (song vs. audiobook)
  const symbol = document.getElementById('symbol-' + sectionId);
  if (type === 'song') {
    symbol.classList.remove('audio-note');
    symbol.classList.add('music-note');
  } else if (type === 'audiobook') {
    symbol.classList.remove('music-note');
    symbol.classList.add('audio-note');
  }
}
