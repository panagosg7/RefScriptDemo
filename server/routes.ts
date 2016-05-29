
import * as express         from 'express';
import * as path            from 'path';
import * as child_process   from 'child_process';
import * as fs              from 'fs';
import * as glob            from 'glob';
import * as _               from 'underscore';

let exec = child_process.exec;


/**
 * Set 'refscript' test path
 */
const refscriptBaseDir = path.join(__dirname, '/../refscript');
const refscriptTestDir = path.join(refscriptBaseDir, '/tests');
const refscriptDemoDir = path.join(refscriptTestDir, '/demo');
const refscriptBin = path.join(refscriptBaseDir, '/.stack-work/dist/x86_64-linux/Cabal-1.22.5.0/build/rsc/rsc');

export function verify(req: express.Request, res: express.Response) {

    // Generate temporary filenames
    let vardir = path.resolve('./tmp');
    if (!fs.existsSync(vardir)) {
        fs.mkdirSync(vardir);
    }

    let time = new Date().getTime().toString();
    let tsrc = path.join(vardir, time + '.ts');
    let logfile = path.join(vardir, time + '.log');
    let program = req.body.program;

    // Store file temporarily    
    fs.writeFile(tsrc, program, err => {
        if (err) {
            return console.log(err);
        }
        console.log("Saved file: " + tsrc);
    });

    // Form command
    let cmd = [refscriptBin, '--dumpjson', tsrc, '>', '/dev/null', '2>', logfile].join(' ');

    console.log(cmd);

    // Fire command
    exec(cmd, function (error, stdout, stderr) {
        res.sendFile(logfile);
    });

}

// function groupOnPref(fs: string[][]): FileTree[] {
//     let result: FileTree[] = [];
//     let groups = _.groupBy(fs, xs => xs[0]);
//     for (let k in groups) {
//         // Keep this sanity check ...
//         if (k !== '' && k !== 'undefined') {                
//             let fss = groups[k].filter(_fs => _fs.length > 0).map(_fs => _fs.slice(1));
//             let gfs = groupOnPref(fss);
//             if (gfs.length > 0) {
//                 result.push({ name: k, children: gfs });
//             } else {                    
//                 result.push({ name: k });
//             }
//         }
//     }            
//     return result;
// }

export const getDemoFiles = getFiles(refscriptDemoDir);
export const getAllFiles  = getFiles(refscriptTestDir);

function getFiles(dir: string) {
    return (req: express.Request, res: express.Response) => {
        glob(path.join(dir, '**/*.ts'), (err: any, fullPaths: string[]) => {
            if (err) console.log(err);
            let relativePaths = fullPaths.map(f => path.relative(dir, f));
            res.json(JSON.stringify(relativePaths));
        });
    }
}

export function loadTest(req: express.Request, res: express.Response): void {
    let filePath = path.join(refscriptTestDir, req.body.name);

    fs.exists(filePath, exists => {
        if (exists) {
            res.sendFile(path.join(refscriptTestDir, req.body.name));
        } else {
            res.send('// File ' + req.body.name + ' does not exist.');
        }
    });
}   
