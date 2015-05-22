import {javascriptRun,readFile} from "./utils";

import ace = require('ace/ace');
import {Range as AceRange} from 'ace/range';
import {AutoComplete} from './AutoComplete';
import lang = require("ace/lib/lang");
import {EditorPosition} from 'EditorPosition';
import {CompilationService} from 'CompilationService';
import {deferredCall} from "ace/lib/lang";

import {Services} from 'ace/mode/typescript/typescriptServicesOld';
import {TypeScript} from 'ace/mode/typescript/typescriptServicesOld';
import {TypeScriptLS} from 'ace/mode/typescript/lightHarness';

var aceEditorPosition = null;
var editor:AceAjax.Editor = null;
var outputEditor:AceAjax.Editor = null;
var typeCompilationService = null;
var docUpdateCount = 0;
var typeScriptLS =  new TypeScriptLS();
var ServicesFactory = new Services.TypeScriptServicesFactory();
var serviceShim = ServicesFactory.createLanguageServiceShim(typeScriptLS);

var selectFileName = "";

var syncStop = false; //for stop sync on loadfile
var autoComplete = null;
var refMarkers = [];
var errorMarkers =[];


function loadLibFiles(){    

    var libFiles = ["typescripts/libOld.d.ts"];
    
    // Load files here 
    libFiles.forEach(function(libname){
        readFile(libname, function(content){
            typeScriptLS.addScript(libname, content.replace(/\r\n?/g,"\n"), true);
        });
    });

    // Load files in the worker
    workerOnCreate(function(){//TODO use worker init event
        libFiles.forEach(function(libname){
            readFile(libname, function(content){
                var params = {
                    data: {
                        name:libname,
                        content:content.replace(/\r\n?/g,"\n")
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
        var data= content.replace(/\r\n?/g,"\n");
        editor.setValue(data);
        editor.moveCursorTo(0, 0);
        typeScriptLS.updateScript(filename, editor.getSession().getDocument().getValue() , false);
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
    var action = data.action;
    var action = data.action;
    var start = aceEditorPosition.getPositionChars(data.start);
    var end = aceEditorPosition.getPositionChars(data.end);
    var newText = editor.getSession().getTextRange(new AceRange(data.start.row, data.start.column, data.end.row, data.end.column));
    
    var markers = editor.getSession().getMarkers(true);
    var line_count = 0;
    var isNewLine = editor.getSession().getDocument().isNewLine;

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

        var markerUpdate = function(id){
            var marker = markers[id];
            var row = data.start.row;

            if(line_count > 0){
                row = +1;
            }

            if(marker && marker.range.start.row > row ){
                marker.range.start.row += line_count ;
                marker.range.end.row += line_count ;
            }
        };

        errorMarkers.forEach(markerUpdate);
        refMarkers.forEach(markerUpdate);
        (<any>editor).onChangeFrontMarker();
    }

}

//sync LanguageService content and ace editor content
function syncTypeScriptServiceContent(script, data:AceAjax.EditorChangeEvent){

    var action = data.action;
    var start = aceEditorPosition.getPositionChars(data.start);
    var end = aceEditorPosition.getPositionChars(data.end);
    var newText = editor.getSession().getTextRange(new AceRange(data.start.row, data.start.column, data.end.row, data.end.column));
    if(action == "insert"){
        editLanguageService(script, new Services.TextEdit(start , start, newText));
    }else if (action == "remove") {        
        editLanguageService(script, new Services.TextEdit(start, end, ""));
    }
    else{
        console.error('unknown action:',action)
    }
};


function editLanguageService(name, textEdit){
    typeScriptLS.editScript(name, textEdit.minChar, textEdit.limChar, textEdit.text);
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
    var cursor = editor.getCursorPosition();
    var lineNumber = cursor.row;

    var text  = editor.session.getLine(lineNumber);
    var matches = text.match(/^[\t ]*/);
    var preIndent = 0;
    var wordLen = 0;

    if(matches){
        wordLen = matches[0].length;
        for(var i = 0; i < matches[0].length; i++){
            var elm = matches[0].charAt(i);
            var spaceLen = (elm == " ") ? 1: editor.session.getTabSize();
            preIndent += spaceLen;
        };
    }

    var option = new Services.EditorOptions();
    option.NewLineCharacter = "\n";

    var smartIndent = serviceShim.languageService.getSmartIndentAtLineNumber(selectFileName, lineNumber, option);

    if(preIndent > smartIndent){
        editor.indent();
    }else{
        var indent = smartIndent - preIndent;

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
    var references = serviceShim.languageService.getOccurrencesAtPosition(selectFileName, aceEditorPosition.getCurrentCharPosition());

    references.forEach(function(ref){
        var getpos = aceEditorPosition.getAcePositionFromChars;
        var start = getpos(ref.ast.minChar);
        var end = getpos(ref.ast.limChar);
        var range = new AceRange(start.row, start.column, end.row, end.column);
        editor.selection.addRange(range);
    });
}

function showOccurrences(){
    var references = serviceShim.languageService.getOccurrencesAtPosition(selectFileName, aceEditorPosition.getCurrentCharPosition());
    var session = editor.getSession();
    refMarkers.forEach(function (id){
        session.removeMarker(id);
    });
    references.forEach(function(ref){
        //TODO check script name
        // console.log(ref.unitIndex);
        var getpos = aceEditorPosition.getAcePositionFromChars;
        var start = getpos(ref.ast.minChar);
        var end = getpos(ref.ast.limChar);
        var range = new AceRange(start.row, start.column, end.row, end.column);
        refMarkers.push(session.addMarker(range, "typescript-ref", "text", true));
    });
}

var deferredShowOccurrences = deferredCall(showOccurrences);

function Compile(typeScriptContent){
    var output = "";

    var outfile = {
        Write: function (s) {
            output  += s;
        },
        WriteLine: function (s) {
            output  += s + "\n";
        },
        Close: function () {
        }
    };

    var outerr = {
        Write: function (s) {
        },
        WriteLine: function (s) {
        },
        Close: function () {
        }
    };
    var compiler = new TypeScript.TypeScriptCompiler(outfile, outerr, new TypeScript.NullLogger(), new TypeScript.CompilationSettings());
    compiler.addUnit(typeScriptContent, "output.js", false);
    compiler.typeCheck();
    compiler.emit(false, function (name) {

    });
    return output;
}

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
    editor.setTheme("ace/theme/monokai");
    editor.getSession().setMode('ace/mode/typescript');

    outputEditor = ace.edit("output");
    outputEditor.setTheme("ace/theme/monokai");
    outputEditor.getSession().setMode('ace/mode/javascript');
    document.getElementById('editor').style.fontSize='14px';
    document.getElementById('output').style.fontSize='14px';

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
    typeCompilationService = new CompilationService(editor, serviceShim);
    autoComplete = new AutoComplete(editor, selectFileName, typeCompilationService);

    // override editor onTextInput
    var originalTextInput = editor.onTextInput;
    editor.onTextInput = function (text){
        originalTextInput.call(editor, text);
        if(text == "."){
            editor.execCommand("autoComplete");

        }else if (editor.getSession().getDocument().isNewLine(text)) {
            var lineNumber = editor.getCursorPosition().row;
            var option = new Services.EditorOptions();
            option.NewLineCharacter = "\n";
            var indent = serviceShim.languageService.getSmartIndentAtLineNumber(selectFileName, lineNumber, option);
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

    editor.getSession().on("compiled", function(e){
        outputEditor.getSession().doc.setValue(e.data);
    });

    editor.getSession().on("compileErrors", function(e){
        var session = editor.getSession();
        errorMarkers.forEach(function (id){
            session.removeMarker(id);
        });
        e.data.forEach(function(error){
            var getpos = aceEditorPosition.getAcePositionFromChars;
            var start = getpos(error.minChar);
            var end = getpos(error.limChar);
            var range = new AceRange(start.row, start.column, end.row, end.column);
            errorMarkers.push(session.addMarker(range, "typescript-error", "text", true));
        });
    });    
    

    $("#javascript-run").click(function(e){
        javascriptRun(outputEditor.getSession().doc.getValue());
    });

    $("#select-sample").change(function(e){
        var path = "samples/" + $(this).val();
        loadFile(path);
    });

});
