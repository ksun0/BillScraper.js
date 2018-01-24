var request = require('request');
var parseXml = require('xml2js').parseString;

/**
 * Returns the data for the given bill as JSON
 * @param {string} billName - The name of bill (i.e. "BILLSTATUS-115sres99")
 * @return {object} - JSON result
 */

module.exports = function(billName){
  if(typeof billName != "string") throw new TypeError("'billName' needs to be a String");
  if(!/^BILLSTATUS-115(sres|sjres|sconres|s|hres|hr|hjres|hconres)[0-9]+$/i.test(billName)) throw new TypeError("'billName' needs to be a valid bill name");

  var requestUrl = "https://www.gpo.gov/fdsys/bulkdata/BILLSTATUS/115/" + billName.replace("BILLSTATUS-115", "").replace(/[0-9]+/g, "") + "/" + billName + ".xml";

  request(requestUrl, function (err, res, xml) { //Access the XML file from the GPO
    if(err) throw err;
    if(xml.indexOf("<title>Content Unavailable</title>") != -1) throw new TypeError("'billName' needs to be an actual bill");

    parseXml(xml, function (error, json) {
      if(err) throw err;
      return json.billStatus.bill;
    });
  });

};