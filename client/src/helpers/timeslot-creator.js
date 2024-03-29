export const createTimeslotArrayForDate = (taken, date) => {
  let resultArr = [];
  let oldDateObj = date;
  let newDateObj = new Date(oldDateObj);
  newDateObj.setHours(7, 55, 0);

  for (let i = 0; i < 121; i++) {
    let resultObj = { id: i, taken: false };
    newDateObj = addMinutes(newDateObj, 5);

    if (taken.length > 0) {
      let newDateObjHours = newDateObj.getHours();
      let newDateObjMinutes = newDateObj.getMinutes();
      let dbHours = new Date(taken[0].start_time).getHours();
      let dbMinutes = new Date(taken[0].start_time).getMinutes();
      //   console.log('this is newDateObjHours: ', newDateObjHours);
      //   console.log('this is newDateObjMinutes: ', newDateObjMinutes);
      //   console.log('this is dbMinutes: ', dbMinutes);
      //   console.log('this is dbHours: ', dbHours);
      if (newDateObjHours === dbHours && newDateObjMinutes === dbMinutes) {
        taken.shift();
        continue;
      } else {
        resultObj.start_time = newDateObj.toISOString();
        resultArr.push(resultObj);
      }
    } else {
      resultObj.start_time = newDateObj.toISOString();
      resultArr.push(resultObj);
    }
  }
  return resultArr;
};

function addMinutes(date, minutes) {
  return new Date(date.getTime() + minutes * 60000);
}
