// Get the time different from ms to days
// from timeB to timeA (timeA > timeB)

function getTimeDiff(timeA,timeB) {
    let s = timeA -timeB
    var ms = s % 1000;
    s = (s - ms) / 1000;
    if(s === 0 ) {
        return ms + ' milliseconds ago'
    }
    var secs = s % 60;
    s = (s - secs) / 60;
    if(s === 0 ) {
        return s + ' seconds ago'
    }
    var mins = s % 60;
    s = (s - mins)/60;
    if(s === 0 ) {
        return mins+ ' minutes ago'
    }
    var hrs = s % 24;
    var tmp  = (s-hrs)/24;
    if(tmp === 0 ) {
        return hrs + ' hours ago'
    }
    var day= (s- hrs)/24;

    return day + ' days ago'
   
  }

export default getTimeDiff