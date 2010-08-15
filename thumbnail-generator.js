/**
 * Keine Gewaehr, keine Garantie, Benutzung auf eigene Gefahr
 * Lizenz: Creative Commons BY-NC 2.0
 * Author: Andreas Levers, www.96dpi.de
 * Getestet unter Mac OS X 10.6.4 mit Photoshop CS5
 * http://github.com/96dpi/Thumbnail-Generator
 **/

var settingDlg = new Window ('dialog', 'Thumbnail Generator', [200, 200, 495, 375]);

function userSettings() {
	settingDlg.prefixLbl = settingDlg.add('statictext', [10,10,60,30], 'Prefix');
	settingDlg.prefix = settingDlg.add('edittext', [75,10,285,30], '');
	settingDlg.suffixLbl = settingDlg.add('statictext', [10,35,60,55], 'Suffix');
	settingDlg.suffix = settingDlg.add('edittext', [75,35,285,55], '-thumb');
	settingDlg.thumbnWidthLbl = settingDlg.add('statictext', [10,60,60,80], 'Breite');
	settingDlg.thumbWidthSetting = settingDlg.add('edittext', [75,60,285,80], '75');
	settingDlg.thumbHeightLbl = settingDlg.add('statictext', [10,85,60,105], 'Höhe');
	settingDlg.thumbHeightSetting = settingDlg.add('edittext', [75,85,285,105], '75');
	settingDlg.qualityLbl = settingDlg.add('statictext', [10,110,60,130], 'Qualität');
	settingDlg.quality = settingDlg.add ('slider', [75,110,285,130],75,0,100);
	settingDlg.ok = settingDlg.add('button', [10,140,195,165],'Ordner wählen', { name:'ok' });
	settingDlg.cancel = settingDlg.add('button', [205,140,285,165],'Abbrechen', { name:'cancel' });
	return settingDlg.show();
}


function selectFilesFrom(srcFolder) {
	var selectedFiles = [];
	var folderContent = Folder(srcFolder).getFiles('*.jpg');
	for (entry in folderContent) {
		var file = folderContent[entry];
		if (file.hidden) {
			continue;
		}
		selectedFiles.push(file);
	}
	return selectedFiles;
}


function batchProcessSelection(selection, destination) {
	for (entry in selection) {
		var file = selection[entry];
		var image = app.load(file);
		var srcImg = app.activeDocument;
		var width = srcImg.width;
		var height = srcImg.height;
		var srcAspectRatio = width / height;
		var tgtAspectRatio = thumbWidth / thumbHeight;

		if (srcAspectRatio >= tgtAspectRatio) {
			width = width / srcAspectRatio * tgtAspectRatio;
			width = Math.round(width);
		} else {
			height = height / tgtAspectRatio *  srcAspectRatio;
			height = Math.round(height);
		}

		srcImg.resizeCanvas(width, height, AnchorPosition.MIDDLECENTER);
		srcImg.resizeImage(UnitValue(thumbWidth,"px"), null, null, ResampleMethod.BICUBIC);

		var tgtName = thumbPrefix + srcImg.name;
		if(tgtName.indexOf('.') != -1) {
			var dot = tgtName.lastIndexOf('.');
			tgtName = tgtName.substring(0, dot) + thumbSuffix + tgtName.substr(dot);
		} else {
			tgtName = tgtName + thumbSuffix;
		}

		var exportOpts = new ExportOptionsSaveForWeb();
		exportOpts.quality = thumbQuality;
		exportOpts.format = SaveDocumentType.JPEG;
		exportOpts.optimized = true;
		srcImg.exportDocument(File(destination.fullName + '/' + tgtName), ExportType.SAVEFORWEB, exportOpts);
		srcImg.close(SaveOptions.DONOTSAVECHANGES);
	}
}


if (1 == userSettings()) {
	with (settingDlg) {
		var thumbQuality = parseInt(quality.value);
		var thumbWidth   = Math.abs(parseInt(thumbWidthSetting.text));
		var thumbHeight  = Math.abs(parseInt(thumbHeightSetting.text));
		var thumbSuffix  = suffix.text;
		var thumbPrefix  = prefix.text;
	}
	var selectedFiles = selectFilesFrom(Folder.selectDialog('Quellverzeichnis wählen'));
	if (selectedFiles.length == 0) {
		alert('Keine JPEG-Dateien gefunden.');
	} else {
		batchProcessSelection(selectedFiles, Folder.selectDialog('Zielverzeichnis wählen'));
	}
}









