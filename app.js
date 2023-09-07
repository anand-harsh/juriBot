const dialogflow=require('dialogflow')
const uuid=require('uuid')
const express=require('express')
const bodyParser=require('body-parser')
const port=process.env.PORT || 5500;
const app=express();
const sessionId=uuid.v4();
//const serverless=require('serverless-http')
//const router=express.Router()


app.use(bodyParser.urlencoded({
    extended: false
}))

app.use(function (req, res, next) {

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);
  
    // Pass to next layer of middleware
    next();
  });
app.post('/send-msg', (req, res)=>{
    runSample(req.body.MSG).then(data=>{
        res.send({Reply:data})
    })
})
async function runSample(msg, projectId='jurident-bot-bnpv'){

    const sessionClient=new dialogflow.SessionsClient({
        keyFilename:'jurident-bot-bnpv-06bf0f14bb3d.json'
    });
    const sessionPath=sessionClient.sessionPath(projectId,sessionId);
    const request={
        session:sessionPath,
        queryInput:{
            text:{
                text:msg,
                languageCode:'en-US'
                }            }
    };
    const responses=await sessionClient.detectIntent(request);
    console.log('Detected intent');
    const result=responses[0].queryResult;
    console.log(`Query: ${result.queryText}`);
    console.log(`Response: ${result.fulfillmentText}`);
    if(result.intent){
        console.log(`Intent: ${result.intent.displayName}`);
    }else{
        console.log(`No intent matched.`);
    }
    return result.fulfillmentText
}

app.listen(port, ()=>{
    console.log("running on port"+port)
})


/*
app.use('/.netlify/functions/app', router)
module.exports.handler=serverless(app)*/