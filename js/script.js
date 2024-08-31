console.log("Script Is Running..");
let currentSong = new Audio();
// async function main() {
//     let a= await fetch("http://127.0.0.1:5500/Songs/");
//     let response= await a.text();
//     console.log(response);
// }
// main();

async function getSongs() {
    try {
        // Fetch the directory listing page
        let response = await fetch("Songs/");

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        // Get the text content from the response
        let text = await response.text();

        //Create a DOM parser to parse the HTML text
        let parser = new DOMParser();
        let doc = parser.parseFromString(text, 'text/html');

        // Example: Extract all links from the directory listing
        let links = doc.querySelectorAll('ul#files li a');
        let songUrl = [];
        let songName = [];
        links.forEach(link => {
            if (link.href.endsWith(".mp3")) {
                songUrl.push(link.href);
                songName.push(link.title)
            }
        });
        // console.log(songName)
        return [songUrl, songName];
    } catch (error) {
        console.error("Fetch error: ", error);
    }
}

function convertSecondsToMinSec(seconds) {
    // Calculate the number of minutes
    const minutes = Math.floor(seconds / 60);
    // Calculate the remaining seconds and round it to an integer
    const remainingSeconds = Math.floor(seconds % 60);

    // Format minutes and seconds to ensure two digits
    const formattedMinutes = minutes.toString().padStart(2, '0');
    const formattedSeconds = remainingSeconds.toString().padStart(2, '0');

    // Return the result in the "MM:SS" format
    return `${formattedMinutes}:${formattedSeconds}`;
}

const playMusic = (track, pause = false) => {
    currentSong.src = "/Songs/" + track
    // let audio=new Audio("/Songs/"+track)
    if (!pause) {
        currentSong.play()
        play.src = "img/paused.svg";
    }
    document.querySelector(".songInfo").innerHTML = track;
    document.querySelector(".songTime").innerHTML = "00:00 / 00:00";
}

async function main() {
    let [songs, songname] = await getSongs();
    playMusic(songname[0], true);
    console.log(songs);

    let songul = document.querySelector(".songList").getElementsByTagName("ul")[0]
    for (const song of songname) {
        songul.innerHTML = songul.innerHTML +
            `<li>
                            <img class="" src="img/music.svg" alt="">
                            <div class="info">
                                <div>${song}</div>
                                <div>Rafiuddin</div>
                            </div>
                            <div class="playNow">
                                <span>Play Now</span>
                                <img src="img/play.svg" alt="">
                            </div>
                        </li> `
    }

    // var audio=new Audio(songs[0]);
    // audio.play()

    // Playing Song When User Click On Play Button 

    // document.getElementById('play').addEventListener('click', () => {
    //     var audio = new Audio(songs[0]);
    //     audio.play()
    // });


    // Attacch Event Listner to Each Song ..
    Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", element => {
            console.log(e.querySelector(".info").firstElementChild.innerHTML)
            playMusic(e.querySelector(".info").firstElementChild.innerHTML)
        })

    })

    //Attach Eventlistner To play next And Privious buttons..
    play.addEventListener("click", () => {
        if (currentSong.paused) {
            currentSong.play()
            play.src = "img/paused.svg"
        }
        else {
            currentSong.pause()
            play.src = "img/play.svg"
        }
    })

    // Updating Time On Playbar................
    currentSong.addEventListener("timeupdate", () => {
        // console.log(currentSong.currentTime,currentSong.duration)
        document.querySelector(".songTime").innerHTML = `${convertSecondsToMinSec(currentSong.currentTime)}/${convertSecondsToMinSec(currentSong.duration)}`
        document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%";
        if (currentSong.currentTime == currentSong.duration) {
            document.querySelector(".songTime").innerHTML = "Thanks"
        }
    })

    //adding event Lister to seekbar.

    document.querySelector(".seekbar").addEventListener("click", (e) => {
        // Using getBoundingClientRect() To Find The Length And Where User Click With OFFSETX...
        // console.log(e.offsetX/e.target.getBoundingClientRect().width)
        let persent = (e.offsetX / e.target.getBoundingClientRect().width) * 100
        document.querySelector(".circle").style.left = persent + "%";
        currentSong.currentTime = (currentSong.duration * persent) / 100;
    })

    //Adding Event Lister to Hamburger Icon To Open Sidebar
    document.querySelector(".hamburger").addEventListener("click", () => {
        document.querySelector(".left").style.left = "0";
    })

    //Adding Event Lister to Close Icon To CLose Sidebar
    document.querySelector(".closeIcon").addEventListener("click", () => {
        document.querySelector(".left").style.left = "-110%";
    })

    // adding Eveny Listner To Previous And Next btuuon......   

    previous.addEventListener("click", () => {
        // Checking Which Song Is Curretly Playing..
        // console.log(currentSong.src)
        // console.log(songs)
        // Finding Current Song Index In Songs Array With indexOf Method..
        let index = songs.indexOf(currentSong.src)
        console.log(index)
        if ((index - 1) >= 0) {
            playMusic(songname[index - 1])
            console.log(index - 1)
        }
        else {
            console.log("There IS No More SOng")
        }

    })

    //Addding Eventlistner To NExt Button.......
    next.addEventListener("click", () => {
        // currentSong.pause()
        // Checking Which Song Is Curretly Playing..
        // console.log(currentSong.src)
        // console.log(songs)
        // Finding Current Song Index In Songs Array With indexOf Method..
        let index = songs.indexOf(currentSong.src)
        console.log(index)
        if (index + 1 !== -1 && index + 1 < songs.length - 1) {
            // Play the next song
            playMusic(songname[index + 1]);
        } else {
            // Disable the button if no more songs are available
            console.log('No More Songs');
        }
    })

    // add Event To Input Tage ...
    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", (e) => {
        // console.log(e.target.value)
        currentSong.volume = parseInt(e.target.value) / 100;
        if (e.target.value == 0) {
            vol.src = "mute.svg";
        }
        else {
            vol.src = "volum.svg";
        }
    })

    // add event to card

    Array.from(document.getElementsByClassName("card")).forEach((e)=>{
        e.addEventListener("click",(item)=>{
            console.log(currentSong.src)
            // item.currentTarget.getElementsByTagName("h2")[0].innerHTML=currentSong.src.split("/Songs/")[1].replace(/%20/g, ' ');
            playMusic(songname[0]);
            console.log(item.currentTarget)
        })
    })

}

main()
