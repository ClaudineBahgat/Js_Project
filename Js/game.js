// L O A D   E V E N T
//______________________

window.addEventListener("load", function () {
  //S E L E C T I O  N S
  //.......
  let birdImages = ["images/white.gif", "images/blue.gif", "images/black.gif"];
  let nameObj = document.querySelector("h2[name=username]");
  let wlcomeName = document.querySelector("#playerName");
  let timeSpan = document.querySelector(".timeCount");
  let bombObj = document.createElement("img");
  let goBtn = document.querySelector(".go");
  let bombArr = [];
  let birdArr = [];
  let killed = 0;
  let score = 0;

  // D I S P L A Y   P O P  U P
  nameObj.innerHTML = localStorage.getItem("User");
  wlcomeName.innerHTML = localStorage.getItem("User");
  document.querySelector(".popup").style.display = "block";
  this.document.querySelector(".closeup").style.display = "none";
  // S T A R T   B U T T O N   E V E N T
  goBtn.addEventListener("click", function () {
    document.querySelector(".popup").style.display = "none";

    // B A C K  G R O U N D  S O U N D
    let bgSound = new sound("sounds/bg2.mp3", true);
    //let killSound = new sound("sounds/kill.mp3", false);
    let bombSound = new sound("sounds/Explosion.mp3", false);
    bgSound.play();

    // G E N E R A T I N G   B I R D S   I N T E R V A L

    let birdId = setInterval(() => {
      let birds = new Bird(
        birdImages[Math.floor(Math.random() * (3 - 0) + 0)],
        Math.floor(Math.random() * (300 - 100) + 100)
      );
      birdArr.push(birds);
    }, 1000);

    // F L Y I N G   B I R D S   I N T E R V A L
    let flyId = setInterval(() => {
      birdArr.forEach((bird) => {
        bird.moveRight();
      }, 50);
    });

    //G E N E R A T E   B O M B S   I N T E R V A L

    let bombId = window.setInterval(() => {
      let bombObj = document.createElement("img");
      bombObj.src = "images/bomb.png";
      bombObj.classList.add("bom");
      document.querySelector("body").append(bombObj);
      bombObj.style.width = "130px";
      bombObj.style.left =
      Math.floor(Math.random() * (window.innerWidth - bombObj.width)) + "px";
      bombObj.style.top = "0px";
      bombArr.push(bombObj);
    }, 1000);

    //F A L L I N G   B O M B S   I N T E R V A L
    let fallId = setInterval(() => {
      bombArr.forEach((bombObj) => {
        falldownBomb(bombObj);

        //C L I C K   O N   B O M B   E V E N T
        bombObj.addEventListener("click", function () {
          bombObj.src = "images/boo.png";
          bombSound.play();
          let windowBirds = document.querySelectorAll(".bird");
          let bLeft = parseInt(bombObj.style.left) - 100;
          let btop = parseInt(bombObj.style.top) - 100;
          let bRight = parseInt(bombObj.style.left + bombObj.width + 100);
          let bBottom = parseInt(bombObj.style.top + bombObj.height + 100);

          windowBirds.forEach((birdIndex) => {
            if (
              parseInt(birdIndex.style.left) > bLeft - 100 &&
              parseInt(birdIndex.style.left) < bRight + 100 &&
              parseInt(birdIndex.style.top) > btop - 100 &&
              parseInt(birdIndex.style.top) < bBottom + 100
            ) {
              countResult(birdIndex);
              //killSound.play();
              killed++;
              let killSpan = document.querySelector(".killCount");
              killSpan.innerText = `${killed}`;
              let scoreSpan = document.querySelector(".playerScore");
              scoreSpan.innerText = `${score}`;
              birdIndex.remove();
            }
          });
        });
      });
    }, 50);

    // T I M E   I N T E R V A L
    const timer = () => {
      let time = 60;
      let timeId = setInterval(() => {
        time -= 1;
        timeSpan.innerText = `${time}`;
        if (time == 0) {
          clearInterval(timeId);
          clearInterval(bombId);
          clearInterval(fallId);
          clearInterval(birdId);
          clearInterval(flyId);
          bgSound.stop();
          let birdArray = document.querySelectorAll(".bird");
          let bombArray = document.querySelectorAll(".bom");
          birdArray.forEach((birdy) => {
            birdy.remove();
          });
          bombArray.forEach((bombb) => {
            bombb.remove();
          });
          localStorage.setItem("finalscore", score.toLocaleString());
          let lastScore = localStorage.getItem("finalscore");
          localStorage.setItem("lastDate", new Date().toLocaleString("en-US"));
          let date = localStorage.getItem("lastDate");
          document.querySelector(
            "#lastVisit"
          ).innerText = `Last Visit : ${date}`;
          if (score >= 50) {
            document.querySelector(".closeup2").style.display = "block";
            let winSound = new sound("sounds/win.mp3", false);
            winSound.play();
            console.log("win");
            document
              .querySelector(".Again2")
              .addEventListener("click", function () {
                document.querySelector(".closeup2").style.display = "none";
                score = 0;
                document.querySelector(".playerScore").innerText = 0;
                document.querySelector(".killCount").innerText = 0;
                document.querySelector(".timeCount").innerText = 60;
                if (lastScore != null) {
                  document.querySelector(
                    "#lastscore"
                  ).innerText = `Last score : ${lastScore}`;
                } else {
                  document.querySelector("#lastscore").innerText = `0`;
                }
                document.querySelector(".popup").style.display = "block";
              });
          } else {
            document.querySelector(".closeup").style.display = "block";
            let loseSound = new sound("sounds/lose1.mp3", false);
            loseSound.play();
            console.log("fail");
            document.querySelector(".Again1").addEventListener("click", function () {
              document.querySelector(".closeup").style.display = "none";
              score = 0;
              document.querySelector(".playerScore").innerText = 0;
              document.querySelector(".killCount").innerText = 0;
              document.querySelector(".timeCount").innerText = 60;
              if (lastScore != null) {
                document.querySelector(
                  "#lastscore"
                ).innerText = `Last Score : ${lastScore}`;
              } else {
                document.querySelector("#lastscore").innerText = `0`;
              }
              document.querySelector(".popup").style.display = "block";
            });
          }
        }
      }, 1000);
    };
    // C A L L I N G  T H E   T I M E   F U N C T I O N
    timer();

    // C A L C U L A T E  T H E  S C O R E
    const countResult = (wbirds) => {
      if (wbirds.src == "http://127.0.0.1:5500/images/blue.gif") {
        score -= 10;
      }
      if (wbirds.src == "http://127.0.0.1:5500/images/black.gif") {
        score += 10;
      }
      if (wbirds.src == "http://127.0.0.1:5500/images/white.gif") {
        score += 5;
      }
    };
  });

  // C L O S E   P O P  U P  B U T T O N
  document.querySelector("#x1").addEventListener("click", function () {
    document.querySelector(".popup").style.display = "none";
  });
});
//....................................................................................
// F U N C T I O N S
// ___________________
//             C L A S S  B I R D
//         ___________________________
class Bird {
  constructor(src, birdTop) {
    let birdObj = document.createElement("img");
    this.bird = birdObj;
    this.bird.src = src;
    this.bird.classList.add("bird");
    this.bird.style.top = birdTop + "px";
    this.bird.style.left = "0px";
    document.querySelector("body").append(this.bird);
  }
  moveRight() {
    let birdLeft = parseInt(this.bird.style.left);
    let windowWidth = window.innerWidth - parseInt(this.bird.width);
    if (birdLeft < parseInt(windowWidth)) {
      this.bird.style.left = birdLeft + 2 + "px";
    } else {
      this.bird.remove();
    }
  }
}
//____________________________________________________________________________________

//     B O M B S
//  F A L L I N G   B O B M S:
// __________________________________

const falldownBomb = (bombObj) => {
  let bombTop = parseInt(bombObj.style.top);
  let bombSize = parseInt(bombObj.style.width);

  if (bombTop < window.innerHeight - bombSize) {
    bombObj.style.top = bombTop + 8 + "px";
  } else {
    bombObj.remove();
  }
};
//  S O U N D  C L A S S
class sound {
  constructor(src, flag) {
    this.sound = document.createElement("audio");
    this.sound.src = src;
    this.sound.setAttribute("preload", "auto");
    this.sound.setAttribute("controls", "none");
    this.sound.loop = flag;
    this.sound.style.display = "none";
    document.body.appendChild(this.sound);
  }
  play = function () {
    this.sound.play();
  };
  stop = function () {
    this.sound.pause();
  };
}
