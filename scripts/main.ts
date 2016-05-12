import {javascriptRun,readFile} from "./utils";

import ace = require('ace/ace');
import {Range as AceRange} from 'ace/range';
import {AutoComplete} from './AutoComplete';
import lang = require("ace/lib/lang");
import {EditorPosition} from 'EditorPosition';
import {CompletionService} from './CompletionService';
import {deferredCall} from "ace/lib/lang";

import _ = require('underscore');
import Vue = require('vue');


export function defaultFormatCodeOptions(): ts.FormatCodeOptions {
    return {
        IndentSize: 4,
        TabSize: 4,
        NewLineCharacter: "\n",
        ConvertTabsToSpaces: true,
        InsertSpaceAfterCommaDelimiter: true,
        InsertSpaceAfterSemicolonInForStatements: true,
        InsertSpaceBeforeAndAfterBinaryOperators: true,
        InsertSpaceAfterKeywordsInControlFlowStatements: true,
        InsertSpaceAfterFunctionKeywordForAnonymousFunctions: false,
        InsertSpaceAfterOpeningAndBeforeClosingNonemptyParenthesis: false,
        PlaceOpenBraceOnNewLineForFunctions: false,
        PlaceOpenBraceOnNewLineForControlBlocks: false,
    };
}

let aceEditorPosition = null;
let editor:AceAjax.Editor = null;
// let outputEditor:AceAjax.Editor = null;
let docUpdateCount = 0;

let selectFileName = "";

let syncStop = false; //for stop sync on loadfile
let autoComplete = null;
let refMarkers = [];
let errorMarkers = [];
let rscMarkers = [];

// Start updating latest
import {getTSProject} from "./lib/ace/mode/typescript/tsProject";
let tsProject = getTSProject();

function loadLibFiles(){

    let libFiles = ["typescripts/lib.d.ts"];

    // Load files here
    libFiles.forEach(function(libname){
        readFile(libname, function(content){
            tsProject.languageServiceHost.addScript(libname, content);
        });
    });

    // Load files in the worker
    workerOnCreate(function(){//TODO use worker init event
        libFiles.forEach(function(libname){
            readFile(libname, function(content){
                let params = {
                    data: {
                        name:libname,
                        content:content
                    }
                };
                editor.getSession().$worker.emit("addLibrary", params );
            });
        });
    }, 100);
}

function loadFile(filename) {
    readFile(filename, function(content){
        selectFileName = filename;
        syncStop = true;
        let data = content.replace(/\r\n?/g,"\n");
        editor.setValue(data);
        editor.moveCursorTo(0, 0);
        tsProject.languageServiceHost.addScript(filename, editor.getSession().getDocument().getValue());
        syncStop = false;
    });
}

function startAutoComplete(editor){
    if (autoComplete.isActive() == false){
        autoComplete.setScriptName(selectFileName);
        autoComplete.active();
    }
}

function onUpdateDocument(e: AceAjax.EditorChangeEvent) {
    if (selectFileName) {
        if (!syncStop) {
            syncTypeScriptServiceContent(selectFileName, e);
            updateMarker(e);
        }
    }
}

// TODO check column
function updateMarker(data:AceAjax.EditorChangeEvent){
    let action = data.action;
    let start = aceEditorPosition.getPositionChars(data.start);
    let end = aceEditorPosition.getPositionChars(data.end);
    let newText = editor.getSession().getTextRange(new AceRange(data.start.row, data.start.column, data.end.row, data.end.column));

    let markers = editor.getSession().getMarkers(true);
    let line_count = 0;
    let isNewLine = editor.getSession().getDocument().isNewLine;

    if(action == "insert"){
        if(isNewLine(newText)){
            line_count = 1;
        }
    }else if (action == "remove") {
        if(isNewLine(newText)){
            line_count = -1;
        }
    }

    if(line_count != 0){

        let markerUpdate = function(id){
            let marker = markers[id];
            let row = data.start.row;

            if(line_count > 0){
                row = +1;
            }

            if(marker && marker.range.start.row > row ){
                marker.range.start.row += line_count ;
                marker.range.end.row += line_count ;
            }
        };

        errorMarkers.forEach(markerUpdate);
        rscMarkers.forEach(markerUpdate);               // RSC
        refMarkers.forEach(markerUpdate);
        (<any>editor).onChangeFrontMarker();
    }

}

//sync LanguageService content and ace editor content
function syncTypeScriptServiceContent(script, data:AceAjax.EditorChangeEvent){

    let action = data.action;
    let start = aceEditorPosition.getPositionChars(data.start);
    let end = aceEditorPosition.getPositionChars(data.end);
    let newText = editor.getSession().getTextRange(new AceRange(data.start.row, data.start.column, data.end.row, data.end.column));
    if(action == "insert"){
        editLanguageService(script, start,start,newText);
    }else if (action == "remove") {
        editLanguageService(script, start,end,"");
    }
    else{
        console.error('unknown action:',action)
    }
};


function editLanguageService(name, minChar,limChar,newText){
    tsProject.languageServiceHost.editScript(name, minChar, limChar, newText);
}

function onChangeCursor(e){
    if(!syncStop){
        try{
            deferredShowOccurrences.schedule(200);
        }catch (ex){
            //TODO
        }
    }
};

function languageServiceIndent(){
    let cursor = editor.getCursorPosition();
    let lineNumber = cursor.row;

    let text  = editor.session.getLine(lineNumber);
    let matches = text.match(/^[\t ]*/);
    let preIndent = 0;
    let wordLen = 0;

    if(matches){
        wordLen = matches[0].length;
        for(let i = 0; i < matches[0].length; i++){
            let elm = matches[0].charAt(i);
            let spaceLen = (elm == " ") ? 1: editor.session.getTabSize();
            preIndent += spaceLen;
        };
    }

    let smartIndent = tsProject.languageService.getIndentationAtPosition(selectFileName, lineNumber, defaultFormatCodeOptions());

    if(preIndent > smartIndent){
        editor.indent();
    }else{
        let indent = smartIndent - preIndent;

        if(indent > 0){
            editor.getSelection().moveCursorLineStart();
            editor.commands.exec("inserttext", editor, {text:" ", times:indent});
        }

        if( cursor.column > wordLen){
            cursor.column += indent;
        }else{
            cursor.column = indent + wordLen;
        }

        editor.getSelection().moveCursorToPosition(cursor);
    }
}

function refactor(){
    let references = tsProject.languageService.getOccurrencesAtPosition(selectFileName, aceEditorPosition.getCurrentCharPosition());

    references.forEach(function(ref){
        let getpos = aceEditorPosition.getAcePositionFromChars;
        let start = getpos(ref.textSpan.start);
        let end = getpos(ref.textSpan.start + ref.textSpan.length);
        let range = new AceRange(start.row, start.column, end.row, end.column);
        editor.selection.addRange(range);
    });
}

function showOccurrences(){
    let session = editor.getSession();
    refMarkers.forEach(function (id){
        session.removeMarker(id);
    });

    let references = tsProject.languageService.getOccurrencesAtPosition(selectFileName, aceEditorPosition.getCurrentCharPosition());
    if(!references){
        // none found. This is a valid response
        return;
    }
    references.forEach(function(ref){
        //TODO check script name
        // console.log(ref.unitIndex);
        let getpos = aceEditorPosition.getAcePositionFromChars;
        let start = getpos(ref.textSpan.start);
        let end = getpos(ref.textSpan.start + ref.textSpan.length);
        let range = new AceRange(start.row, start.column, end.row, end.column);
        refMarkers.push(session.addMarker(range, "typescript-ref", "text", true));
    });
}

let deferredShowOccurrences = deferredCall(showOccurrences);

/** Keeps running the func till worker is present */
function workerOnCreate(func, timeout){
    if(editor.getSession().$worker){
        func(editor.getSession().$worker);
    }else{
        setTimeout(function(){
            workerOnCreate(func, timeout);
        });
    }
}


$(function(){
    editor = ace.edit("editor");
    // editor.setTheme("ace/theme/monokai");
    editor.getSession().setMode('ace/mode/typescript');

    // outputEditor = ace.edit("output");
    // outputEditor.setTheme("ace/theme/monokai");
    // outputEditor.getSession().setMode('ace/mode/javascript');
    document.getElementById('editor').style.fontSize='16px';
    // document.getElementById('output').style.fontSize='14px';

    loadLibFiles();
    loadFile("samples/greeter.ts");

    editor.addEventListener("change", onUpdateDocument);
    editor.addEventListener("changeSelection", onChangeCursor);

    editor.commands.addCommands([{
        name:"autoComplete",
        bindKey:"Ctrl-Space",
        exec:function(editor) {
            startAutoComplete(editor);
        }
    }]);

    editor.commands.addCommands([{
        name:"refactor",
        bindKey: "F2",
        exec:function(editor) {
            refactor();
        }
    }]);

    editor.commands.addCommands([{
        name: "indent",
        bindKey: "Tab",
        exec: function(editor) {
            languageServiceIndent();
        },
        multiSelectAction: "forEach"
    }]);

    aceEditorPosition = new EditorPosition(editor);
    autoComplete = new AutoComplete(editor, selectFileName, new CompletionService(editor));

    // override editor onTextInput
    let originalTextInput = editor.onTextInput;
    editor.onTextInput = function (text){
        originalTextInput.call(editor, text);
        if(text == "."){
            editor.execCommand("autoComplete");

        }else if (editor.getSession().getDocument().isNewLine(text)) {
            let lineNumber = editor.getCursorPosition().row;
            let indent = tsProject.languageService.getIndentationAtPosition(selectFileName, lineNumber, defaultFormatCodeOptions());
            if(indent > 0) {
                editor.commands.exec("inserttext", editor, {text:" ", times:indent});
            }
        }
    };

    editor.addEventListener("mousedown", function(e){
        if(autoComplete.isActive()){
            autoComplete.deactivate();
        }
    });

    // editor.getSession().on("compiled", function(e){
    //     outputEditor.getSession().doc.setValue(e.data);
    // });

    editor.getSession().on("compileErrors", function(e){
        let session = editor.getSession();
        errorMarkers.forEach(session.removeMarker);
        rscMarkers.forEach(session.removeMarker);
        e.data.forEach(error => {
            let getpos = aceEditorPosition.getAcePositionFromChars;
            let start = getpos(error.minChar);
            let end = getpos(error.limChar);
            let range = new AceRange(start.row, start.column, end.row, end.column);
            errorMarkers.push(session.addMarker(range, "typescript-error", "text", true));
        });
    });


    // $("#javascript-run").click(function(e){
    //     javascriptRun(outputEditor.getSession().doc.getValue());
    // });

    $("#select-sample").change(function(e){
        let path = "samples/" + $(this).val();
        loadFile(path);
    });


    editor.getSession().on("verify", e => {});

});


/* VUE */

function getServerURL() {
    return window.location.protocol + "//" + window.location.host;
}

(function() {
    // Get the test list
    let xhr = new XMLHttpRequest();
    xhr.open('GET', getServerURL() + '/files', true);
    xhr.send();
    xhr.addEventListener('readystatechange', function (e) {
       if (xhr.readyState == 4 && xhr.status == 200) {        
            // For some reason we have to do `JSON.parse` twice
            let tests = JSON.parse(JSON.parse(xhr.responseText));
            let data = {
                name: 'Test Directory',
                children: tests
            };

            // boot up the demo
            let demo = new Vue({
                el: '#demo',
                data: {
                    treeData: data
                }
            });
        }

    });
})();


// define the item component
Vue.component('item', {
    template: '#item-template',
    props: {
        model: Object
    },
    data: function () {
        return {
            open: false
        }
    },
    computed: {
        isFolder: function () {
            return this.model.children && this.model.children.length;
        }
    },
    methods: {
        toggle: function () {
            if (this.isFolder) {
                this.open = !this.open
            } else {
                // Compute the file path
                let chain: any = [];
                let u = this;
                while (u) {
                    if (u.model && u.model.name) {
                        chain.push(u.model.name);
                    }
                    u = u.$parent;
                }
                chain.reverse();
                chain = chain.slice(1).join('/');

                // Request file from server
                let xhr = new XMLHttpRequest();
                xhr.open('POST', '/load-test', true);
                xhr.setRequestHeader("Content-type", "application/json");
                xhr.send(JSON.stringify({ 'name': chain }));
                xhr.addEventListener('readystatechange', function (e) {
                   if (xhr.readyState == 4 && xhr.status == 200) {
                        let fileText = '// file: ' + chain + '\n' + xhr.responseText;
                        editor.setValue(fileText);
                    }
                });
            }
        },
        changeType: function () {
            // if (!this.isFolder) {
            //     Vue.set(this.model, 'children', [])
            //     this.addChild()
            //     this.open = true
            // }
        },
        // addChild: function () {
        //     this.model.children.push({
        //         name: 'new stuff'
        //     })
        // }
    }
});


document.getElementById("verify").onclick = function () {
    let text = editor.getValue();
    // console.log(text)
    let data = JSON.stringify({ action: 2, program: text });

    let xhr = new XMLHttpRequest();
    xhr.open('POST', '/verify', true);
    xhr.setRequestHeader("Content-type", "application/json");
    xhr.send(data);
    xhr.addEventListener('readystatechange', function (e) {
        if (xhr.readyState == 4 && xhr.status == 200) {
            let response = xhr.responseText;            
            try {
                let responseJSON = JSON.parse(response);
                
                let errs = _.flatten(responseJSON);
                let isSafe = errs.length === 0;

                if (isSafe) {
                    // safeButton();
                    console.log('SAFE');
                } else {
                    // unsafeButton();
                    console.log(errs);                    
                    
                    let session = editor.getSession();
                    errorMarkers.forEach(session.removeMarker);
                    rscMarkers.forEach(session.removeMarker);     
                    
                    
                    errs.forEach(error => {
                        
                        let getpos = aceEditorPosition.getAcePositionFromChars;
                        let startRow = error.errLoc.sp_start[1] - 1;
                        let startCol = error.errLoc.sp_start[2] - 1;
                        let endRow   = error.errLoc.sp_stop[1] - 1;
                        let endCol   = error.errLoc.sp_stop[2] - 1;
                        let range = new AceRange(startRow, startCol, endRow, endCol);
                        
                        // editor.session.clearAnnotations();
                        console.log(error, range)
                        rscMarkers.push(editor.session.addMarker(range, "refscript-error", "text", true)); 
                              
                        // editor.session.setAnnotations([{ 
                        //             row: 1, 
                        //             column: 2, 
                        //             text: "Strange error", 
                        //             type: "info" 
                        //             }]); 
               
                    });
                }
            } catch(e) {
                // oops...
                console.log("Error while parsing output of rsc:");
                console.log(e);
            }
        }
    });

};