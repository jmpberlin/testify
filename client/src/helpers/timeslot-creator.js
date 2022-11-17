export const createTimeslotArrayForDateSecond = (arrFromDb) => {
  return 'scrab';
};

let timeslotArray = [
  { id: 1, start_time: '2022-11-17T08:05:00+01:00', taken: true },
  { id: 2, start_time: '2022-11-17T08:30:00+01:00', taken: true },
  { id: 3, start_time: '2022-11-17T08:50:00+01:00', taken: true },
];

export const createTimeslotArrayForDate = (arrFromDb) => {
  //   console.log(arrFromDb);
  let resultArr = [];

  let oldDateObj = new Date(arrFromDb[0].start_time);
  let newDateObj = new Date(oldDateObj);
  newDateObj.setHours(8, 0, 0);

  for (let i = 0; i < 10; i++) {
    let resultObj = { id: i, taken: false };
    newDateObj = addMinutes(newDateObj, 5 * i);
    // console.log('this is the new dateObj:', newDateObj);
    // console.log('this is the old dateObj:', oldDateObj);
    // console.log('this is 5 * i', 5 * i);
    if (arrFromDb.length > 0) {
      let newDateObjHours = newDateObj.getHours();
      let newDateObjMinutes = newDateObj.getMinutes();
      let dbHours = new Date(arrFromDb[0].start_time).getHours();
      let dbMinutes = new Date(arrFromDb[0].start_time).getMinutes();
      // console.log('newDateObjHours:', newDateObjHours);
      // console.log('newDateObjMinutes', newDateObjMinutes);
      // console.log('dbHours:', dbHours);
      // console.log('dbMinutes:', dbMinutes);
      if (newDateObjHours === dbHours && newDateObjMinutes === dbMinutes) {
        //   console.log('SCRABEDIBUUUUU');
        //   console.log(oldDateObj);
        //   console.log(newDateObj);
        arrFromDb.shift();
        if (arrFromDb.length > 0) {
          oldDateObj = new Date(arrFromDb[0].start_time);
        }
        continue;
      } else {
        resultObj.start_time = newDateObj.toISOString();
        resultArr.push(resultObj);
      }
    } else {
      resultObj.start_time = newDateObj.toISOString();
      resultArr.push(newDateObj);
    }
  }
  console.log('this is the result array: ', resultArr);
  return resultArr;
};

function addMinutes(date, minutes) {
  return new Date(date.getTime() + minutes * 60000);
}
console.log(new Date('2022-04-30 12:20:00+02'));
// console.log(createTimeslotArrayForDateSecond(timeslotArray));
