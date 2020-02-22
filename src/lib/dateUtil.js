function getDate(datestr) {
  var temp = datestr.split("-");
  var date = new Date(temp[0], temp[1] - 1, temp[2]);
  return date;
}

function getBetweenDateStr(start, end) {
  var startTime = getDate(start);
  var endTime = getDate(end);
  var date_all = [],
    i = 0;
  while ((endTime.getTime() - startTime.getTime()) >= 0) {
    var year = startTime.getFullYear();
    var month = (startTime.getMonth() + 1).toString().length == 1 ? "0" + (startTime.getMonth() + 1).toString() : (startTime.getMonth() + 1).toString();
    var day = startTime.getDate().toString().length == 1 ? "0" + startTime.getDate() : startTime.getDate();
    date_all[i] = year + "-" + month + "-" + day;
    startTime.setDate(startTime.getDate() + 1);
    i += 1;
  }
  return date_all
};

export {
  getBetweenDateStr
}
