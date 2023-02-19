'use strict';

module.exports = function (app, Issues) {

  function pretty(document){
    let obj = Object.keys(document).reduce(function(obj, key){
      if(key != "__v" && key != "project") obj[key] = document[key];
      return obj;
    }, {});
     return obj
  }
 
    app.route('/api/issues/:project')
      
    .get(function (req, res, next){
      let finds = Object.assign({}, req.params, req.query);
      
      Issues.find(finds, function(err, documents){
          res.json(documents);
        });
    })

    .post(function (req, res, next,){
      let document = new Issues(Object.assign({}, req.params, req.body));

      document.save(function(err, document){
        if(err){
          res.json({error: "required field(s) missing"});
        }else{
          res.json(pretty(document._doc));
        };
      });
    })
    
    .put(function(req, res, next){
      Issues.findByIdAndUpdate(req.body._id, req.body, {new: true}, function(err, document){
        if(err || !document){
            res.json({error: 'could not update', _id: req.body._id});
        }else{
          Issues.updateOne({_id: req.body._id},  { updated_on: new Date().toISOString()}, function(err, document){
            res.json({result: "successfully updated", _id: req.body._id});
          });
        }; 
      });
    })
    
    .delete(function (req, res, next){
       Issues.findByIdAndDelete(req.body._id, function(err, document){
         if(err || !document){
           res.json({error: "could not delete", _id: req.body._id});
         }else{
           res.json({result: "successfully deleted", _id: req.body._id});
         };
       });
    });

    app.get("/api/issues/:project/delete", function(req, res){
     Issues.deleteMany({project: req.params.project}, function(err){
      if(err){
        res.json({error: "Não deu para deletar"})
      }else{
        res.json({result: "Todas as instâncias de " + req.params.project + "foram apagadas"})
      }
     })
    })
};
