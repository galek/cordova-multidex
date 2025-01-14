module.exports = (ctx) => {
    const fs = require('fs'),
        path = require('path'),
        xml = require('cordova-common').xmlHelpers;

    const manifestSubPaths = ['platforms/android/AndroidManifest.xml', 'platforms/android/app/src/main/AndroidManifest.xml'];
    let manifestPath = null;
    
    for (let i = 0, len = manifestSubPaths.length; i < len; i++) {
        const candidatePath = path.join(ctx.opts.projectRoot, manifestSubPaths[i]);
        if (fs.existsSync(candidatePath)) {
            manifestPath = candidatePath;
            break;
        }
    }
    if (manifestPath === null) {
        throw new Error('AndroidManifest.xml not found');
    }

    const doc = xml.parseElementtreeSync(manifestPath);
    if (doc.getroot().tag !== 'manifest') {
        throw new Error(manifestPath + ' has incorrect root node name (expected "manifest")');
    }

    //adds the tools namespace to the root node
    // doc.getroot().attrib['xmlns:tools'] = 'http://schemas.android.com/tools';
    //add tools:replace in the application node
    doc.getroot().find('./application').attrib['android:name'] = 'android.support.multidex.MultiDexApplication';

    //write the manifest file
    fs.writeFileSync(manifestPath, doc.write({indent: 4}), 'utf-8');
};
