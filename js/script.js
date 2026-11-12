(function ($) {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!reduceMotion && $.fn.sakura) {
    $(".sakura-falling").sakura({
      fallSpeed: 2.2,
      maxSize: 14,
      minSize: 8,
      delay: 400
    });
  }
})(jQuery);

(function () {
  var audio = document.getElementById("my_audio");
  var musicBtn = document.getElementById("music-btn");
  var video = document.getElementById("invite-video");
  var watchBtn = document.getElementById("watch-btn");
  var label = musicBtn.querySelector(".music-label");
  var songStarted = false;

  function setMusicUi(playing) {
    musicBtn.setAttribute("aria-pressed", playing ? "true" : "false");
    label.textContent = playing ? "Pause song" : "Play song";
  }

  function playSong() {
    if (!video.paused && !video.muted) {
      video.muted = true;
    }
    var pending = audio.play();
    if (pending && pending.then) {
      pending.then(function () {
        setMusicUi(true);
      }).catch(function () {
        setMusicUi(false);
      });
    } else {
      setMusicUi(!audio.paused);
    }
  }

  function pauseSong() {
    audio.pause();
    setMusicUi(false);
  }

  document.addEventListener("pointerdown", function (event) {
    if (event.target.closest("#music-btn, #watch-btn, video, a, button")) {
      return;
    }
    if (!songStarted) {
      songStarted = true;
      playSong();
    }
  });

  musicBtn.addEventListener("click", function () {
    songStarted = true;
    if (audio.paused) {
      playSong();
    } else {
      pauseSong();
    }
  });

  function filmHasSound() {
    return !video.muted && !video.paused;
  }

  video.addEventListener("play", function () {
    if (filmHasSound()) {
      pauseSong();
    }
  });

  video.addEventListener("volumechange", function () {
    if (!video.muted) {
      video.loop = false;
      pauseSong();
      if (video.paused) {
        video.play();
      }
    } else {
      video.loop = true;
    }
  });

  watchBtn.addEventListener("click", function () {
    songStarted = true;
    pauseSong();
    video.scrollIntoView({ behavior: "smooth", block: "center" });
    video.loop = false;
    video.muted = false;
    video.currentTime = 0;
    var pending = video.play();
    if (pending && pending.catch) {
      pending.catch(function () {
        video.muted = true;
        video.play();
      });
    }
  });

  var weddingAt = new Date("2026-11-25T17:00:00+05:30").getTime();
  var timeEl = document.getElementById("time");

  function renderCountdown() {
    var distance = weddingAt - Date.now();
    if (distance <= 0) {
      timeEl.innerHTML = '<p class="end-msg">Bless the married couple for a happy life!</p>';
      return;
    }

    var days = Math.floor(distance / 86400000);
    var hours = Math.floor((distance % 86400000) / 3600000);
    var minutes = Math.floor((distance % 3600000) / 60000);
    var seconds = Math.floor((distance % 60000) / 1000);

    timeEl.innerHTML =
      '<div class="container">' +
      '<div class="days block">' + days + "<small>Days</small></div>" +
      '<div class="hours block">' + hours + "<small>Hours</small></div>" +
      '<div class="minutes block">' + minutes + "<small>Minutes</small></div>" +
      '<div class="seconds block">' + seconds + "<small>Seconds</small></div>" +
      "</div>";
  }

  renderCountdown();
  window.setInterval(renderCountdown, 1000);

  var now = Date.now();
  var markedNext = false;
  document.querySelectorAll(".event").forEach(function (card) {
    var when = new Date(card.getAttribute("data-when")).getTime();
    if (when < now) {
      card.classList.add("is-past");
      return;
    }
    if (!markedNext) {
      card.classList.add("is-next");
      markedNext = true;
    }
  });
})();
