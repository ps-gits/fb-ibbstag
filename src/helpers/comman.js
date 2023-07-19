function convertMicrosoftJsonDate(dateString) {
    const timestamp = parseInt(dateString.match(/\d+/)[0]);
    const offset = parseInt(dateString.match(/\+\d+/)[0]);
    const date = new Date(timestamp - offset);
    return date.toISOString();
}
  
module.exports = {
    convertMicrosoftJsonDate
};