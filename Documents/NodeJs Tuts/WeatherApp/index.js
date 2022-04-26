const http = require('http');
const fs = require('fs');
const requests = require('requests');
const homeFile = fs.readFileSync("index.html",'utf-8');

replaceVal = (tempData,OrgData)=>{
    let temperature = tempData.replace("{%Tempval%}", OrgData.main.temp);
    temperature = temperature.replace("{%wind%}", OrgData.wind.speed);
    temperature = temperature.replace("{%pressure%}", OrgData.main.pressure);
    temperature = temperature.replace("{%humidity%}", OrgData.main.humidity);
    temperature = temperature.replace("{%country%}", OrgData.sys.country);
    temperature = temperature.replace("{%location%}", OrgData.name);
    temperature = temperature.replace("{%tempstatus%}", OrgData.weather[0].main);
    temperature = temperature.replace("{%description%}", OrgData.weather[0].description);
    return temperature;
}

const server = http.createServer((req,res)=>{
    if(req.url == '/'){
        requests("https://api.openweathermap.org/data/2.5/weather?q=Indore&appid=ce4b61e8846b0b5ee55d3b5d862a3e37")
        .on ('data',(chunk)=>{
            let Objdata = JSON.parse(chunk);
            // console.log(Objdata.);
            let arrData = [Objdata];
            // console.log(arrData[0].wind.speed);
            const realTimeData = arrData.map((val)=>replaceVal(homeFile,val)).join("");
            res.write(realTimeData);
            // console.log(realTimeData);
        })
        .on('end',(err)=>{
            if (err) console.error('Error Occured!');
            console.log("end");
            res.end();
        })
    }
});

server.listen(8000,'127.0.0.1');