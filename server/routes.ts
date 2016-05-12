
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
const refscriptBaseDir = path.join(__dirname       , '/../refscript');   
const refscriptTestDir = path.join(refscriptBaseDir, '/tests');    
const refscriptBin     = path.join(refscriptBaseDir, '/.stack-work/dist/x86_64-linux/Cabal-1.22.5.0/build/rsc/rsc');



export function verify(req: express.Request, res: express.Response) {

    // Generate temporary filenames
    let vardir = "/var/tmp";
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
    
    // Fire command
    exec(cmd, function (error, stdout, stderr) {        
        res.sendFile(logfile);
    });

}

interface FileTree {
    name: string;
    children?: FileTree[]
}



export function fileList(req: express.Request, res: express.Response): void {
    let refscriptTestDirDepth = refscriptTestDir.split('/').length;
    let queryDir = path.join(refscriptTestDir, '**/*.ts');

    glob(queryDir, (er: any, files: string[]) => {
        if (er) {
            console.log(er);
        }

        function groupOnPref(fs: string[][]): FileTree[] {
            let result: FileTree[] = [];
            let groups = _.groupBy(fs, xs => xs[0]);
            for (let k in groups) {
                // Keep this sanity check ...
                if (k !== '' && k !== 'undefined') {                
                    let fss = groups[k].filter(_fs => _fs.length > 0).map(_fs => _fs.slice(1));
                    let gfs = groupOnPref(fss);
                    if (gfs.length > 0) {
                        result.push({ name: k, children: gfs });
                    } else {                    
                        result.push({ name: k });
                    }
                }
            }            
            return result;
        }

        function trimBaseDir(fs: string[][], n: number) {
            return fs.map(f => f.slice(n));
        }

        let fss = trimBaseDir(files.map(f => f.split('/')), refscriptTestDirDepth);
        let fileTree = groupOnPref(fss);

        res.json(JSON.stringify(fileTree));

    });

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