module.exports = {
	index:function(req,res,param){
		res.render('../view/index/index.jade',{
			h1:"It Works",
			title:'hello world'
		});
	}
}