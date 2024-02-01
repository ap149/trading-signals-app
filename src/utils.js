import { fromUnixTime, getYear, getMonth, getDate, startOfDay, format} from "date-fns";

const getTimeFromUTC = (utc, startOfDay=true) => {
  return fromUnixTime(utc)
}

const getChartTime = (date) => {
  return {
    "year": getYear(date),
    "month": getMonth(date),
    "day": getDate(date)
  }
}
const getChartTimeFromUTC = (utc) => {
  const date = startOfDay(fromUnixTime(utc))
  console.log(date)
  return {
    "year": getYear(date),
    "month": getMonth(date) + 1,
    "day": getDate(date)
  }
}

const getDateString = (utc) => {
  return format(getTimeFromUTC(utc), "eee, d MMM y")
}
export {
  getTimeFromUTC,
  getChartTimeFromUTC,
  getDateString
}