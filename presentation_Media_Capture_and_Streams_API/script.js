// Media Capture and Streams API (Media Stream) code example
//Presentation CART351
//Date 23rd Septemeber 2023

//This program displays a video interface and downloads a recording of the video 


/*

REFERENCES USED:

1.  https://developer.mozilla.org/en-US/docs/Web/API/Media_Capture_and_Streams_API
2. https://developer.mozilla.org/en-US/docs/Web/API/MediaRecorder
3. https://developer.mozilla.org/en-US/docs/Web/API/Blob
4. https://developer.mozilla.org/en-US/docs/Web/API/URL/createObjectURL_static
5. https://developer.mozilla.org/en-US/docs/Web/API/MediaStream_Recording_API

*/
window.addEventListener('load', startup, false)

//stores the HTML element 
const video = document.getElementById('video1')

function startup() {
  let constraints = {
    audio: true,
    video: true
  }

  //navigator.mediaDevices.getUserMedia(constraints) returns a promise 
  //requesting a video and (if any) requirements for each track.

  navigator.mediaDevices.getUserMedia(constraints)
    //promise is resolved
    .then((stream) => {
      video.srcObject = stream;

      video.play();

      const recordedChunks = [];

      console.log(stream);

      const options = { mimeType: "video/webm; codecs=vp9" };

      //instantizes a new MediaRecoder object 
      const mediaRecorder = new MediaRecorder(stream, options);

      document.getElementById("btnStart").addEventListener('click', () => mediaRecorder.start() )
      document.getElementById('btnStop').addEventListener('click', () => { mediaRecorder.stop(); })

       // handles dataavailable event: fires a piece a data periodically to the browser
        mediaRecorder.ondataavailable = handleDataAvailable;

      function handleDataAvailable(event) {
        //keeping track of the video data 
        console.log("data-available");

        if (event.data.size > 0) {

          recordedChunks.push(event.data);
          console.log(recordedChunks);
          download();

        }

      }

      function download() {
        //stores video data and outputs a webm video file to download 

        //turns a video into a file that js can read
        const blob = new Blob(recordedChunks, {
          type: "video/webm",
        });

        //return a string containing the URL
        const url = URL.createObjectURL(blob);

        //creates an achor HTML elemnt 
        const a = document.createElement("a");

        document.body.appendChild(a);
        a.style = "display: none";

        //stores url in the anchor tag
        a.href = url;
        //
        a.download = "test.webm";

        //simulates a mouse click on an anchor element
        a.click();

        //stops removes file from browser 
        window.URL.revokeObjectURL(url);
      }
    })


    //promise is rejected
    .catch((err) => {
      console.error(`An error occurred: ${err}`);
    });

}

