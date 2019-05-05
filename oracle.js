require("dotenv").config();

const rp = require("request-promise");
const cheerio = require("cheerio");
const crypto = require("crypto");

const { requestWebpage, RegisterWebpageMetadata } = require("./ethereum");

var url = "";
var data = {};

const obtainData = (option) => {

	const options = {
		uri: url,
		transform: function (body) {
			return cheerio.load(body);
		},
		encoding: "latin1"
	};

	rp(options)
	.then(($) => {
		data.sha256 = crypto.createHash("sha256").update($.html()).digest("hex");

		if (option == 1)
			data.titulo = $('title').text();
	})
	.then(sendData)
	.then(RegisterWebpageMetadata)
	.catch(error);
};

const ListenRequests = () => {
  	requestWebpage((error, result) => {
    	url = result.args.url;
		obtainData(result.args.option);
  	});
};

const sendData = () => {
  	return new Promise((resolve, reject) => {
    	let timestamp, content;
    	try {
      		timestamp = new Date();
			timestamp = timestamp.getUTCDate() + "/" + (timestamp.getUTCMonth() + 1) + "/" + timestamp.getUTCFullYear() + " " + 
			timestamp.getUTCHours() + ":" + timestamp.getUTCMinutes() + ":" + timestamp.getUTCSeconds() + " UTC";

      		content = Buffer.from(JSON.stringify(data)).toString("base64");
    	} catch(error) {
      		reject(error);
      		return;
    	}
    	resolve({ timestamp, url, content });
  	});
};

const error = (error) => {
  	console.error(error);
};

module.exports = ListenRequests;