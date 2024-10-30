const audioPlayer = document.getElementById('audioPlayerFirst');
const audio2 = document.getElementById('audioPlayerSecond');

function playFirstAudio() {
    console.log(audioPlayer)
    audioPlayer.play().then(() => {
        console.log("First audio is playing");
    }).catch(error => {
        console.error("Error playing first audio:", error);
    });

}

function playSecondAudio() {
    console.log(audioPlayer)
    audio2.play().then(() => {
        console.log("Second audio is playing");
    }).catch(error => {
        console.error("Error playing second audio:", error);
    });


    // // 移除事件监听器以防止重复播放
    // window.removeEventListener('click', playSecondAudio);
}

// 监听第一个音频播放结束事件
audioPlayer.addEventListener('ended', function() {
    console.log("First audio ended");
    playSecondAudio();
});

// 在用户点击页面时开始播放第一个音频
window.addEventListener('click', function() {
    console.log("dd")
    playFirstAudio();
    // 只需要执行一次
    window.removeEventListener('click', arguments.callee);
});


// 函数用于播放音频
// function playAudio() {
//     const audioPlayer = document.getElementById('audioPlayer');
//     audioPlayer.play().then(() => {
//         console.log("Audio is playing");
//     }).catch(error => {
//         console.error("Error playing audio:", error);
//     });
//
//     // 移除事件监听器以防止重复播放
//     window.removeEventListener('click', playAudio);
// }
//
// // 添加事件监听器到整个窗口
// window.addEventListener('click', playAudio);
