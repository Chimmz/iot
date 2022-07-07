import {subDays} from 'date-fns'

function getDynamicDataForWaterCards(incidents, type) {
  // incidents = incidents.length > 0 ? incidents : [];
  const endDate = new Date();

  var DynamicData = {};

  var PreviousDate = endDate.getFullYear() + "-" + (endDate.getMonth() + 1) + "-" + endDate.getDate();
  // This is to filter the Only today incidents
  var newDate = new Date(PreviousDate);
  // subtract one day and added the hours reset to 23:59:59. So that it will pick up from
  // today date 0:0:0
  newDate = subDays(newDate,1)
  newDate.setHours(23, 59, 59);
  //Fetch the today incidents only
  var TodayRecord = incidents.filter((item) => item.displayName === type && item.incidentStatus==="Open" &&
                    new Date(item.startTime) > newDate);
  // Used to sort the data using the startTime.
  const values = Object.values(TodayRecord);
  values.sort((a, b) => new Date(b.startTime) - new Date(a.startTime));
  const SortedRecord = [...values];

  var CorrectedTime = "";
  for (var i = 0; i < SortedRecord.length; i++) {
    var Data = SortedRecord[i];
    // required to split the timeonly
    const [number, period] = SortedRecord[i]["startTime"].split("T");
    // this is used to split the hours to change from 24 to 12 hrs
    const [hours, minutes, seconds] = period.split(":");
    if (hours >= 13) {
      const Updatehours = hours - 12;
      CorrectedTime = Updatehours + ":" + minutes + " " + "PM";
    } else {
      CorrectedTime = hours + ":" + minutes + " " + "AM";
    }
    // Addd all the data inside it to make as dict.
    DynamicData[i] = {
      time: CorrectedTime,
      floorName: Data["floorName"],
      SensorName: Data["sensorName"],
      description: Data["description"],
    };
  }
  return { TodayRecord, DynamicData };
}

export default getDynamicDataForWaterCards;
