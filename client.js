const { RequestWebpageURL, registerWebpageData, checkBlocks } = require("./ethereum");
const readline = require("readline");
const urlRegex = require("url-regex");

const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout,
	terminal: false
});

const main = () => {
	rl.question("USO: [MODO (0=Registrar URL, 1=Consultar Log de Eventos)]\n", (modo) => {
		if (modo == 0)
			requestURL();
    	else if (modo == 1)
			checkData();
  	});
};

const requestURL = () => {
	let url = "";

	rl.question("USO: [URL (Formato completo)]\n", (answer) => {
		if (urlRegex({exact:true, strict:true}).test(answer))
			url = answer;

		if (url)
		{
			rl.question("USO: [Nº VERSIÓN (0=Solo Hash de la web, 1=Algunos datos adicionales)]\n", (version) => {
				if (version == 0 || version == 1)
				{
					RequestWebpageURL(url, version);

					registerWebpageData((error, result) => {
						console.log("URL registrada con éxito");
						console.log(result.args);
					});
				}
			});
		}
  	});
};

const checkData = () => {
	checkBlocks();
};

module.exports = main;