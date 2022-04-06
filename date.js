// jshint esversion:6

const today = new Date()
const weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]

exports.getDate = function() {
    return weekdays[today.getDay()] + ", " + months[today.getMonth()] + " " + today.getDate()
}

exports.getDay = function() {
    return weekdays[today.getDay()]
}