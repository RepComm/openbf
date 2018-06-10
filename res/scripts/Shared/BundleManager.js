
const fs = require("fs");
const path = require("path");

class BundleManager {
    constructor (game) {
        this.loadedBundles = [];
        this.game = game;
    }

    onBundleImport (err, bundleInstance) {
        console.log("Successfully imported bundle", bundleInstance);
        this.game.loadedBundles.push(bundleInstance);
    }

    importBundleFromJson (bundlesPath, bundleFolderResolved, bundleFolder, file) {
        let json, bundleClass, bundleInstance;

        try {
            json = JSON.parse(
                fs.readFileSync(
                    path.join(bundleFolderResolved,file),
                    "utf8"
                )
            );
        } catch (err) {
            console.log("Couldn't read package.json, skipping", err);
        }

        if (json.name) {
            if (json.main) {
                try {
                    let mainFile = path.resolve(path.join(bundlesPath, bundleFolder, json.main));

                    bundleClass = require(mainFile);

                    bundleInstance = new bundleClass(this.game, json.name, json.displayName);

                    this.loadedBundles.push(bundleInstance);
                } catch(err) {
                    console.log("Couldn't load the bundle", err);
                }
            }
        }
    }

    importBundles (bundlesPath, callback) {
        let resolvedBundlePath = path.resolve(bundlesPath);
        //Try to get the dir with all the bundles in it
        fs.readdirSync(resolvedBundlePath).forEach(bundleFolder => {            
            //Make sure bundleFolder is actually a folder, not a file

            let stats;
            let bundleFolderResolved = path.join(resolvedBundlePath, bundleFolder);
            try {
                stats = fs.statSync(bundleFolderResolved);
                if (stats.isDirectory()) {
                    fs.readdirSync(bundleFolderResolved).forEach(file => {
                        if (file == "package.json") {
                            this.importBundleFromJson(bundlesPath, bundleFolderResolved, bundleFolder, file);
                        }
                    });
                }
            } catch (err) {
                console.log("Couldn't read", bundleFolder, "skipping", err);
            }
            
            callback(this.loadedBundles);
        });
    }
}

module.exports = BundleManager;