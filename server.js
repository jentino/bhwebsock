'use strict';
//
const express = require('express');
const SocketServer = require('ws').Server;
const path = require('path');
var pg = require('pg');


const PORT = process.env.PORT || 3000;
const INDEX = path.join(__dirname, 'index.html');
const DBINDEX = path.join(__dirname, 'db.html');

const server = express()
  .use((req, res) => res.sendFile(INDEX) )
  .get('/db', function (request, response) {
      pg.connect(process.env.DATABASE_URL, function(err, client, done) {
        client.query('SELECT * FROM test_table', function(err, result) {
          done();
          if (err)
           { console.error(err); response.send("Error " + err); }
          else
           { 
             console.log(result.rows);
              response.render(DBINDEX, {results: result.rows} ); 
          }
        });
      });
    })
  .listen(PORT, () => console.log(`Listening on ${ PORT }`));

    // var pg = require('pg');
    
    // server.get('/db', function (request, response) {
    //   pg.connect(process.env.DATABASE_URL, function(err, client, done) {
    //     client.query('SELECT * FROM test_table', function(err, result) {
    //       done();
    //       if (err)
    //        { console.error(err); response.send("Error " + err); }
    //       else
    //        { 
    //          console.log(result.rows);
    //           response.render('pages/db', {results: result.rows} ); 4
    //       }
    //     });
    //   });
    // });

const wss = new SocketServer({ server });

wss.on('connection', (ws) => {
  console.log('Client connected');
  ws.on('close', () => console.log('Client disconnected'));
});

setInterval(() => {
  wss.clients.forEach((client) => {
    client.send(new Date().toTimeString());
  });
}, 1000);
//tested ditto