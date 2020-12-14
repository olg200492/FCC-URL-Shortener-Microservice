require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const dns = require('dns');
let bodyParser = require('body-parser');
const urlparser = require('url');

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// URL tester
const stringIsAValidUrl = (str) => {
  try {
    new URL(str);
    return true;
  } catch (err) {
    return false;
  }
};

const links = [];
let id = 0;
// Your first API endpoint
app.post('/api/shorturl/new', function(req, res) {
  const bodyurl = req.body.url;
  
  const something = dns.lookup(urlparser.parse(bodyurl).hostname, (error, address) => {
    if (!address) {
      res.json({ error: "Invalid URL" })
    } else {
      id++;
      const link = {
        original_url: bodyurl,
        short_url: `${id}`
      };
      links.push(link);
      return res.json(link);
    }
  })
});


app.get('/api/shorturl/:id',(req,res)=>{
  const {id} = req.params;
  const link = links.find(l => l.short_url=== id);
  if(link){
    return res.redirect(link.original_url);
  }else{
    return res.json({
      error:'No short url'
    })
  }
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
