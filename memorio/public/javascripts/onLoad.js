if(getCookie("highScore") == undefined){
  // Cookie is stored for 5 years
  setCookie("highScore", 0, 1825)
}

serverInfo = JSON.parse(getResponse(window.location.protocol + "//" + window.location.host + "/publicserverdata"));

document.getElementById("personal-best").innerHTML = getCookie("highScore");
document.getElementById("brains-improved").innerHTML = serverInfo.gamesInitialized;
document.getElementById("top-score").innerHTML = serverInfo.highScore;
