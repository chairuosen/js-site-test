module.exports = function(app){
    app.use(function ajaxError(err,req,res,next){
        if(req.xhr){
            res.status(500).json({error:err.stack.split('\n')});
        }else{
            next(err);
        }
    });
    app.use(function pageError(err, req, res, next) {
        res.status(200).send('抓到一只野生ERROR君 :'+"<br/>"+err.stack.replace(/\n/g,"<br>"));
    });
}