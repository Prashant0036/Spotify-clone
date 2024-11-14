var folder = "favourites";

var currentSongIndex = 0;

// var URL =`http://127.0.0.1:5500/Songs/${folder}/`;
var audio = new Audio();

// functions start //
async function playlistLogic() {
  let playlistCards = document.querySelectorAll(".playlistCard");
  var allSongsTitle;
  playlistCards.forEach((playlistCard) => {
    playlistCard.addEventListener("click", () => {
      let getSongCall = async () => {
        folder = playlistCard.childNodes[3].getAttribute("id");
        allSongsTitle = await getSongsName(folder);
        return allSongsTitle;
      };
      
      (async () => {
        allSongsTitle = await getSongCall();

        let songsBox = document.querySelector(".songsBox");
        songsBox.innerHTML = "";
        fill_song_in_playlist_and_play(allSongsTitle);
        prev_pause_next_buttons(folder, false);
        document.querySelector("#playBtn").src = "SVGs/play.svg";
      })();
    });
  });
}

// Format Time Function
function formatTime(seconds) {
  if (isNaN(seconds)) return "00:00";
  seconds = Math.round(seconds);
  let minutes = Math.floor(seconds / 60);
  let remainingSeconds = seconds % 60;

  // Pad seconds with a leading zero if it's less than 10
  remainingSeconds =
    remainingSeconds < 10 ? "0" + remainingSeconds : remainingSeconds;
  // Pad minutes with a leading zero if it's less than 10
  minutes = minutes < 10 ? "0" + minutes : remainingSeconds;

  return `${minutes} : ${remainingSeconds}`;
}

// For Green Circle Animation //
function green_Circle_Animation_on_playlistCard() {
  let playlistCards = document.querySelectorAll(".playlistCard");

  // console.log(playlistCard);
  playlistCards.forEach((playlistCard) => {
    // get green circle of that playlistCard
    let greenCircle = playlistCard.querySelector(".greenCircle");

    playlistCard.addEventListener("pointerover", () => {
      greenCircle.style.opacity = 1;
      greenCircle.style.bottom = "90px";
    });

    playlistCard.addEventListener("pointerout", () => {
      greenCircle.style.opacity = 0;
      greenCircle.style.bottom = "70px";
    });
  });
}

// Get Song URL function //

async function getSongsURL(folder) {
  let URL = `Songs/${folder}/`;
  console.log(URL);
  let response = await fetch(URL);
  console.log(response);
  pageHTML_in_text = await response.text();
  // console.log(pageHTML_in_text);
  // Now we've to extract song URL from this pageHTML_in_text
  // for that copy this text in to HTML of a div, so that we can target particular tag of it.
  let div = document.createElement("div");
  div.innerHTML = pageHTML_in_text;
  // console.log(div);
  let all_anchor_tags = div.getElementsByTagName("a");
  // console.log(all_anchor_tags);
  let songsURL = [];

  // Extract songs URL from anchor tags and PUSH them in songsURL Array
  for (let i = 0; i < all_anchor_tags.length; i++) {
    let a = all_anchor_tags[i];

    if (a.getAttribute("href").endsWith(".mp3")) {
      songsURL.push(a.getAttribute("href"));
    }

    // console.log(all_anchor_tags[3].getAttribute("href"));
  }
  // console.log(songsURL);
// console.log(songsURL);
// console.log(songsURL[1]);
// audio.src=songsURL[1];
// audio.play()
  return songsURL;
}

// Get Song Name Function //
async function getSongsName(folder) {
  let URL = `Songs/${folder}/`;
  let response = await fetch(URL);
  pageHTML_in_text = await response.text();
  // console.log(pageHTML_in_text);
  // Now we've to extract song name from this pageHTML_in_text
  // for that copy this text in to HTML of a div, so that we can target particular tag of it.
  let div = document.createElement("div");
  div.innerHTML = pageHTML_in_text;
  // console.log(div);

  all_anchor_tags = div.getElementsByTagName("a");
  // console.log("anchor");
  // console.log(all_anchor_tags);

  let songsTitle = [];

  // Extract songs title from anchor tags and PUSH them in songsTitle Array
  for (let i = 0; i < all_anchor_tags.length; i++) {
    let a = all_anchor_tags[i];
    // console.log(a.title);
    if (a.textContent.endsWith(".mp3")) {
      songsTitle.push(a.textContent);
    }
  }
  // console.log("all song title :"+songsTitle);

  return songsTitle;
}

// play function
let play = (songName, songURL, byDefaultPlay = false) => {
  let seekBarPlayButton = document.querySelector("#playBtn");
  let songNameSeekBar = document.querySelector(".songNameSeekBar");
  let seekBarSongTimer = document.querySelector(".songTimer");


  audio.src = songURL; // audio function m URL pass kar diya, agr by default play nhi ho rha to song play kar diya
  // otherwise tab play karna h jab user button click karega, phir default play = false ho jayega kyonki function call
  // button k click par hoga but audio function m same URL pass ho rakha hoga
  if (byDefaultPlay == false) {
    audio.play();
    seekBarPlayButton.src = "SVGs/pause.svg";
  }

  // Also fill that song name in seekBar songName Section
  songNameSeekBar.textContent = songName;
  seekBarSongTimer.textContent = "00:00 / 00:00";

  // Note : if byDefaultPlay is true it means song will remain paused
  // but audio.src will be changed
};

function fill_song_in_playlist_and_play(allSongsTitle) {
  // play first song by default
  let firstSongName = allSongsTitle[0];
  // console.log(firstSongName);
  let firstSongURL =  "/Songs/" + folder + "/" + allSongsTitle[0].replaceAll(" ", "%20");
  play(firstSongName, firstSongURL, (byDefaultPlay = true));

  for (let songIndex in allSongsTitle) {
    let songName = allSongsTitle[songIndex];

    // Use song title and make card for every song in Your Library section
    let songCardHTML = `<div class="songBox">
<img src="SVGs/music.svg" >
<div class="songInfo">
<p class="songName">${songName}
</p>
<p class="singer">Prashant</p>
</div>
<p>Play Now</p>
<img src="SVGs/play.svg">
</div>`;
    // now get it's parent element to append this HTML in to it again and again
    let songsBox = document.querySelector(".songsBox");
    songsBox.innerHTML += songCardHTML;
  }
  //play Song when click on song box

  let allSongBoxes = document.querySelectorAll(".songBox");
  for (let songBox of allSongBoxes) {
    songBox.addEventListener("click", () => {
      // console.log(songBox);
      // click karne par, we got div[song box] of particular song, now get song name of that box
      let songName = songBox.querySelector(".songName").textContent;
      // console.log(songName);

      // now play song with song name
      // for that make URL from song Name
      let songURL = "/Songs/" + folder + "/" + songName.replaceAll(" ", "%20");
      // console.log(songURL);
      // now play song with URL
      // use Audio function
      // let audio = new Audio(); make it global and on every click change the given URL through audio.src;
      // play audio
      play(songName, songURL);
    });
  }

  // Now update the song timing on the seek bar, jab tak song chalta rhe timer update hota rhe
  audio.addEventListener("timeupdate", () => {
    // console.log(audio.currentTime,audio.duration);

    let seekBarSongTimer = document.querySelector(".songTimer");

    // if(audio.duration===NaN) audio.duration="00:00"; // taaki NaN na show ho screen par

    seekBarSongTimer.innerHTML = `<span>${formatTime(
      audio.currentTime
    )} </span> /  <span>${formatTime(audio.duration)} </span>`;

    // Move the seek circle also

    // get seek bar Cricle
    let seekBarCircle = document.querySelector(".seekCircle");
    seekBarCircle.style.left = ` ${Math.floor(
      (audio.currentTime / audio.duration) * 100
    )}%`;
  });

  // Now update the seek bar position on mouse click
  let seekBar = document.querySelector(".seekBar");
  seekBar.addEventListener("click", (e) => {
    // basically we've to calculate that jaha click hua a vo pure width ka kitne % h
    let rect = e.target.getBoundingClientRect();

    // Calculate click position relative to the seek bar
    const clickX = e.clientX - rect.left;

    // Calculate the width of the seek bar
    const totalWidth = seekBar.offsetWidth;

    // Calculate the percentage
    const percentage = ((clickX / totalWidth) * 100).toFixed(2);
    //  console.log(percentage);
    document.querySelector(".seekCircle").style.left = `${percentage}%`;
    // Now update the audio time
    audio.currentTime = audio.duration * (percentage / 100);
    // if seek Bar k 50 % par click kari h to song k current time ko total duration ka 50% kar do
  });
}

function hamburger_menu() {
  let hamburger = document.querySelector(".hamburger");
  let flag = "not clicked";
  hamburger.addEventListener("click", () => {
    let leftMenu = document.querySelector(".left");
    if (flag == "not clicked") {
      leftMenu.classList.add("show");
      hamburger.src = "SVGs/cut.svg";
      flag = "clicked";
    } else {
      leftMenu.classList.remove("show");
      hamburger.src = "SVGs/hamburger.svg";
      flag = "not clicked";
    }
  });
}

let get_current_song_index = (allSongsURL) => {
  let i = 0;
  for (let songURL of allSongsURL) {
    if (audio.src.includes(songURL)) {
      return i;
    }
    i++;
  }
};

// this
async function prev_pause_next_buttons(folder, callByMain) {
  let prev = document.querySelector("#previousBtn");
  let seekBarPlayButton = document.querySelector("#playBtn");
  let next = document.querySelector("#nextBtn");

  allSongsName = await getSongsName(folder);
  allSongsURL = await getSongsURL(folder);

  let previousBtnFunction = () => {
    // get current song index in playlist
    currentSongIndex = get_current_song_index(allSongsURL);

    currentSongIndex--;

    // if prev button is pressed on 1st song then play last song
    if (currentSongIndex == -1) currentSongIndex = allSongsURL.length - 1;

    play(allSongsName[currentSongIndex], allSongsURL[currentSongIndex]);
  };
  let nextBtnFunction = () => {
    // get current song index in playlist
    currentSongIndex = get_current_song_index(allSongsURL);

    currentSongIndex++;

    // if next button is pressed on last song then play first song
    if (currentSongIndex == allSongsURL.length) currentSongIndex = 0;

    play(allSongsName[currentSongIndex], allSongsURL[currentSongIndex]);
  };

  let pauseBtnFunction = () => {
    // agar audio paused h to play button clicked ho to audio play ho jaaye

    // also change pause image of songCard and SeekBar
    if (audio.paused) {
      // if paused h and agr koi click kare to song play ho jana chahiye and pause wala svg aa jana chahiye to pause
      // songBox.querySelectorAll("img")[1].src="SVGs/play.svg";
      seekBarPlayButton.src = "SVGs/pause.svg";
      audio.play();
    } else {
      // if playing h and agr koi click kare to song pause ho jana chahiye and play wala svg aa jana chahiye to play
      // songBox.querySelectorAll("img")[1].src="SVGs/pause.svg";
      seekBarPlayButton.src = "SVGs/play.svg";
      audio.pause();
    }
  };

  if (callByMain === false) {
    prev.removeEventListener("click", previousBtnFunction);
    next.removeEventListener("click", nextBtnFunction);
    seekBarPlayButton.removeEventListener("click", pauseBtnFunction);
    return;
  }

  // eventListener on previous button
  prev.addEventListener("click", previousBtnFunction);

  // eventListener on next button
  next.addEventListener("click", nextBtnFunction);

  // seek bar k play button ko click karne par audio play ho jaaye and pause ko
  // click karne par pause ho jaaye
  seekBarPlayButton.addEventListener("click", pauseBtnFunction);

  // also space press karne par bhi same kaam ho
  document.addEventListener("keydown", (e) => {
    if (e.key === " ") {
      pauseBtnFunction();
    }
  });
}

function volumeControl() {
  let volumeSeekBar = document.querySelector(".volumeSeekBar");

  volumeSeekBar.addEventListener("input", () => {
    // console.log("clicked");
    // get value from volume Seek Bar
    let volumeValue = volumeSeekBar.value;
    // set volume value to audio
    // console.log(volumeValue);
    audio.volume = volumeValue / 100;
  });

  // for mute the song using icon
  let volumeIcon = document.querySelector(".songVolume img");
  let flag = "notClicked";
  volumeIcon.addEventListener("click", () => {
    if (flag === "notClicked") {
      audio.muted = true;
      volumeSeekBar.value = 0;
      flag = "clicked";
      volumeIcon.src = "SVGs/mute.svg";
    } else {
      audio.muted = false;
      volumeSeekBar.value = 50;
      flag = "notClicked";
      volumeIcon.src = "SVGs/volume.svg";
    }
  });
}

let main = async () => {
  let allSongsTitle = await getSongsName((folder = "favourites"));
  // console.log(allSongsTitle);

  let allSongsURL = await getSongsURL((folder = "favourites"));
  // console.log(allSongsURL);

  // For Test play first song
  // var audio = new Audio(allSongsURL[0]);
  // audio.play();
  // audio.pause();
  // audio.play();

  // Another way to play song
  // var audio =new Audio();
  // audio.src = allSongsURL[0];
  // audio.src = allSongsURL[3];
  // audio.play();

  fill_song_in_playlist_and_play(allSongsTitle);

  // green circle
  green_Circle_Animation_on_playlistCard();

  // for hamburger menu
  hamburger_menu();

  // for Previous Next Buttons

  prev_pause_next_buttons(folder, true);

  // for volume control
  volumeControl();

  // playList Logic
  playlistLogic();
};

main();
