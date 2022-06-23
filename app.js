//jshint esversion: 6

const express=require("express");
const bodyParser=require("body-parser");
const request=require("request");
const https=require("https");

const app=express();

app.use(express.static("public")); //For accessing our static files in our public folder i.e. CSS, images etc.
app.use(bodyParser.urlencoded({extended:true}));

app.get("/", function(req,res){
    res.sendFile(__dirname+"/signup.html");
})

app.post("/", function(req,res){
    const first=req.body.first;
    const last=req.body.last;
    const email=req.body.email;
    
    //MailChimp process starts here -->
    const data={
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: first,
                    LNAME: last
                }
            }
        ]
    }
    const jsondata = JSON.stringify(data);

    const url = "https://us11.api.mailchimp.com/3.0/lists/0e226fd532"

    const options = {
        method: "post",
        auth:"adnan1:ecb3ce90227dac364f416bf1f84296e7-us11"
    }

    const request = https.request(url, options, function(response){

        //To check whether response was correctly executed i.e status code=200 show success page else failure page
        if(response.statusCode==200)
        res.sendFile(__dirname + "/success.html");
        else
        res.sendFile(__dirname + "/failure.html");

        response.on("data", function(data){
            console.log(JSON.parse(data));
        })
    })
    request.write(jsondata);
    request.end();
})

//For Failure page
app.post("/failure", function(req,res){
    res.redirect("/");
})

app.listen(process.env.PORT || 3000, function(){
    console.log("Server is running on port 3000");
})

//API Key --
//ecb3ce90227dac364f416bf1f84296e7-us11

//List ID --
// 0e226fd532