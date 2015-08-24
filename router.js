var fs = require('fs');
eval('var special = '+fs.readFileSync('./special_router.json'));
function extend(){
	function copy(from,to){
		for(var prop in from){
			to[prop] = from[prop];
		}
	}
	var temp = {};
	Array.prototype.map.call(arguments,function(obj){
		copy(obj,temp);
	})
	return temp;
}
function handleAction(controller_name,action_name,req,res,is_post){
	var controller_path = './controller/'+controller_name+".js";
	var controller_exist = fs.existsSync(controller_path);
	var controller = controller_exist ? require('./controller/'+controller_name) : null;
	var action = controller ? controller[action_name] : null;
	if( action ){
		var action_config ;
		var action_function;
		if(typeof action == 'function'){
			action_config = [];
			action_function = action;
		}else{
			action_function = action[0];
			action_config = action[1];
		}
		if( !is_post && action_config && action_config.post_only){
			error(res);
		}else{
			var p = extend(req.query,req.params,req.body)
			global.ENV = Number(p.env);
			action_function(req,res,p);
		}
	}else{
		error(res);
	}
}
function error(res,debug){
		res.send('404 Wrong World?'+(debug||""));
	}
function requestHandler(req,res,is_post){
	var path_name = "/"+req.params[0];
	var route = req.params[0].split('/')
	var controller_name = route[0] || 'index';
	var action_name = route[1] || 'index';
	if( CONFIG.static_path && CONFIG.static_path.indexOf(controller_name) > -1 ){        // static file request
		var file = './public'+ path_name;
		if(path_name.indexOf('.')==-1){
			var last_str = path_name[path_name.length-1];
			if( last_str == "/"){
				file += "index.html";
			} else{
				res.redirect(302, path_name+"/");
				return;
			}
				
		}
		fs.readFile(file,function(err,data){
			if(!err){
				res.end(data);
			}else{
				error(res);
			}
		});
	}else{
		handleAction(controller_name,action_name,req,res,is_post);
	}

	
}
module.exports = function(app){
	special && special.forEach(function(item){
		var rule = item[0];
		var route = item[1];
		app.get(rule,function(req,res){
			handleAction(route[0],route[1],req,res);
		});
	});

	return app
		.route('/*')
		.get(function(req,res){
			requestHandler(req,res,false);
		})
		.post(function(req,res){
			requestHandler(req,res,true);
		});
}