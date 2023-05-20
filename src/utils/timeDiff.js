// Get the time different from ms to days
// from timeB to timeA (timeA > timeB)

function getTimeDiff(timeA,timeB) {
    let s = timeA -timeB
    var ms = s % 1000;
    s = (s - ms) / 1000;
    var secs = s % 60;
    s = (s - secs) / 60;
    if(s === 0 ) {
        return s + ' seconds'
    }
    var mins = s % 60;
    s = (s - mins)/60;
    if(s === 0 ) {
        return mins+ ' minutes'
    }
    var hrs = s % 24;
    var tmp  = (s-hrs)/24;
    if(tmp === 0 ) {
        return hrs + ' hours'
    }
    var day= (s- hrs)/24;

    return day + ' days'
   
  }
//   function showTime() {
//     let time = new Date();
//     let output = time.toLocaleTimeString("en-US",{hour12: false});
//     const arr = output.split(":");
//     arr[0] = (arr[0] == 24) ? 0:arr[0];
//     if(parseInt(arr[2]) % 60  == 0 && parseInt(arr[0]) % 24 == 0  && parseInt(arr[1]) == 0){
//       document.location.href = "Heart.html";
//     }
//     displayTime.innerText = `${pad(arr[0])}:${arr[1]}:${arr[2]}`;
//     setTimeout(showTime, 1000);
//   }   
  
//   showTime();
  
  
  // const getDaysLeft = (date_1, date_2) =>{
  //   let difference = date_1.getTime() - date_2.getTime();
  //   let TotalDays = Math.ceil(difference / (1000 * 3600 * 24));
  //   return TotalDays;
  // }
  
export default getTimeDiff