// esse script só pode ser executado pelo padeiro...

// Retorna o conteúdo de texto de uma camada de texto (TextLayer).
function getTextLayerContent(aLayer) {
	// Retorna vazio se a camada for nula ou não for do tipo TextLayer
	if (aLayer == null || !(aLayer instanceof TextLayer)) return '';

	return aLayer
		.property('ADBE Text Properties') // Obtém a propriedade de texto
		.property('ADBE Text Document') // Obtém o documento de texto
		.value.toString() // Converte o valor para string
		.trim(); // Remove espaços em branco no início e no fim
}

for (var t = 0; t < newCompsArray.length; t++) {
	var nameContent = getTextLayerContent(newCompsArray[t].layer(2)).split(/\s+X\s+/i);
	var flagContent = newCompsArray[t].layer(4).name.split(/\s+X\s+/i);

	try {
		newCompsArray[t].layer(2).property('ADBE Text Properties').property('ADBE Text Document').setValue(nameContent[0].replace(/_/, '\n'));
		newCompsArray[t].layer(3).property('ADBE Text Properties').property('ADBE Text Document').setValue(nameContent[1].replace(/_/, '\n'));
		newCompsArray[t].layer(4).name = flagContent[0];
		newCompsArray[t].layer(5).name = flagContent[1];

		//
	} catch (err) {}
}

// Busca e define a comp das bandeiras
var iNum = app.project.numItems;
var flagTempComp;

for (var i = 1; i <= iNum; i++) {
	var flagComp = app.project.item(i);

	if (!(flagComp instanceof CompItem)) continue;
	if (!flagComp.comment.match(/^EXPORTAR/)) continue;
	if (flagComp.name != 'CONFRONTO BANDEIRA') continue;
	flagTempComp = flagComp;

	break;
}

var outputPathArray = templateData.outputPath;
var flagItem = app.project.renderQueue.items.add(flagTempComp);

flagItem.applyTemplate('Best Settings');

for (var o = 0; o < outputPathArray.length; o++) {
	if (o > 0) flagItem.outputModules.add();

	var outputModule = flagItem.outputModule(o + 1);
	var outputFolder = new Folder(outputPathArray[o]);

	// Cria os arquivos de saída
	try {
		var outputFile = new File(outputPathArray[o] + '/[compName].[fileextension]');

		outputModule.file = outputFile;
		outputModule.applyTemplate(padOutputTemplate);
		newOutputsArray.push(outputModule);
	} catch (err) {
		alert(lol + '#PAD_020 - ' + err.message); // Mensagem de erro
	}
}

// var outputPathArray = templateData.outputPath;
// // Redefine o arquivo de saída para cada módulo de saída.
// for (var t = 0; t < newOutputsArray.length; t++) {
// 	var o = t % outputPathArray.length;
// 	var comp = newCompsArray[t];
// 	var pathIncrement = getTextLayerContent(
// 		comp.layer(7),
// 	).replaceSpecialCharacters();
// 	var newPath = outputPathArray[o] + '/' + pathIncrement;
// 	var newFolder = new Folder(newPath);

// 	if (!newFolder.exists) newPath = outputPathArray[o];

// 	var newOutputFile = new File(newPath + '/[compName].[fileextension]'); // -> PATROCINADORES FUT 2024_11-06 a 16-06
// 	newOutputsArray[t].file = newOutputFile;
// }
