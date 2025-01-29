// 打开视频模态框的函数
function openVideo(videoId) {
    var modal = document.getElementById(videoId);
    if (modal) {
        modal.style.display = "block";
    }
}

// 关闭视频模态框的函数
function closeVideo(videoId) {
    var modal = document.getElementById(videoId);
    if (modal) {
        modal.style.display = "none";
    }
}
