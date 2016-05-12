
import * as express       from 'express';
import * as path          from 'path';
import * as favicon       from 'serve-favicon';
import * as logger        from 'morgan';
import * as cookieParser  from 'cookie-parser';
import * as bodyParser    from 'body-parser';
import * as routes        from './routes';

let app = express();

// let httpServer = http.createServer(app);


// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.set('port', process.env.PORT || 3003);
let serverPort = app.get('port');

app.use(express.static(path.join(__dirname, '../')));


// Routes
app.get ('/files'    , routes.fileList);
app.post('/load-test', routes.loadTest);
app.post('/verify'   , routes.verify);

function handle404(err: any, req: express.Request, res: express.Response, next: Function) {
    res.status(404);
    res.render('404');
}

function handle500(err: any, req: express.Request, res: express.Response, next: Function) {
    console.error(err.stack);
    res.status(500);
    res.render('500');
}

// 404 page
app.use(handle404);

// 500 page
app.use(handle500);

// Go!
app.listen(serverPort, () => {
    console.log('Express START: http://localhost:', serverPort, 'press Ctrl-C to kill.');
});
