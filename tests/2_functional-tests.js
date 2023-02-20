const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {
  suite("Post Tests", function(){
     test("Post all fields", function(done){
        chai
          .request(server)
          .post("/api/issues/Mytest")
          .send({ 
            issue_title: "My test",
            issue_text: "All fields",
            created_by: "My",
            assigned_to: "Mytest",
            status_text: "Work"
          })
          .end(function(err, res){
            let obj = JSON.parse(res.text);
            assert.equal(res.status, 200);
            assert.equal(obj.issue_text, "All fields");
            done();
          });
        });

        test("Post required fields", function(done){
            chai
              .request(server)
              .post("/api/issues/Mytest")
              .send({ 
                issue_title: "My test",
                issue_text: "Required fields",
                created_by: "My"
              })
              .end(function(err, res){
                let obj = JSON.parse(res.text);
                assert.equal(res.status, 200);
                assert.equal(obj.issue_text, "Required fields");
                done();
              });
        });

        test("Post no required fields", function(done){
            chai
              .request(server)
              .post("/api/issues/Mytest")
              .send({ 
                issue_title: "My test",
                issue_text: "No required fields"
              })
              .end(function(err, res){
                let obj = JSON.parse(res.text);
                assert.equal(res.status, 200);
                assert.equal(obj.error, "required field(s) missing");
                done();
              });
        });
  });

  suite("Get tests", function(){
    test("Get all", function(done){
        chai
          .request(server)
          .get("/api/issues/Mytest")
          .end(function(err, res){
            let obj = JSON.parse(res.text);
            assert.equal(res.status, 200);
            assert.isAbove(obj.length, 0);
            done();
          });
     });

     test("Get One specific", function(done){
       chai
         .request(server)
         .get("/api/issues/Mytest?status_text=Work")
         .end(function(err, res){
            let obj = JSON.parse(res.text)
            assert.equal(res.status, 200);
            obj.forEach(function(issue){
              assert.equal(issue.status_text, "Work");
            });
            done()
         });
      });

      test("Get All specific ", function(done){
        chai
          .request(server)
          .get("/api/issues/Mytest?status_text=Work&issue_text=Noexist")
          .end(function(err, res){
            let obj = JSON.parse(res.text);
            assert.equal(res.status, 200);
            assert.isUndefined(obj[0]);
            done();
        });
      });   
    });

    chai
      .request(server)
      .post("/api/issues/Mytest")
      .send({ 
        issue_title: "My test",
        issue_text: "Put test",
        created_by: "My",
        assigned_to: "Mytest",
        status_text: "Work"
      })
      .end(function(err, res){
        let id = JSON.parse(res.text)._id;
          suite("Put test", function(){
            test("Put one field", function(done){
              chai
                .request(server)
                .put("/api/issues/Mytest")
                .send({_id: id, issue_text: "Put one field"})
                .end(function(err, res){
                  let obj = JSON.parse(res.text);
                  assert.equal(res.status, 200);
                  assert.equal(obj.result,"successfully updated");
                  done();
                });
            });

            test("Put various fields", function(done){
                chai
                  .request(server)
                  .put("/api/issues/Mytest")
                  .send({_id: id, issue_text: "Put various field", assigned_to: "Puttest"})
                  .end(function(err, res){
                    let obj = JSON.parse(res.text);
                    assert.equal(res.status, 200);
                    assert.equal(obj.result, "successfully updated");
                    done();
                  });
              });

              test("Put no id", function(done){
                chai
                  .request(server)
                  .put("/api/issues/Mytest")
                  .send({})
                  .end(function(err, res){
                    let obj = JSON.parse(res.text);
                    assert.equal(res.status, 200);
                    assert.equal(obj.error, "missing _id");
                    done();
                  });
              });

              test("Put no field", function(done){
                chai
                  .request(server)
                  .put("/api/issues/Mytest")
                  .send({_id: id})
                  .end(function(err, res){
                    let obj = JSON.parse(res.text);
                    assert.equal(res.status, 200);
                    assert.equal(obj.error, "no update field(s) sent");
                    done();
                  });
              });

              test("Put invalid id", function(done){
                chai
                  .request(server)
                  .put("/api/issues/Mytest")
                  .send({_id: "NoValidId", issue_text: "put invalid id"})
                  .end(function(err, res){
                    let obj = JSON.parse(res.text);
                    assert.equal(res.status, 200);
                    assert.equal(obj.error, "could not update");
                    done();
                  });
              });
        });

        suite("Delete test", function(){
            test("Delete issue", function(done){
              chai
                .request(server)
                .delete("/api/issues/Mytest")
                .send({_id: id})
                .end(function(err, res){
                    let obj = JSON.parse(res.text);
                    assert.equal(res.status, 200);
                    assert.equal(obj.result, "successfully deleted");
                    done();
                });
            });

            test("Delete invalid Id", function(done){
              chai
                .request(server)
                .delete("/api/issues/Mytest")
                .send({_id: "NovalidId"})
                .end(function(err, res){
                  let obj = JSON.parse(res.text);
                  assert.equal(res.status, 200);
                  assert.equal(obj.error, "could not delete");
                  done()
                })
            });

            test("Delete no Id", function(done){
                chai
                  .request(server)
                  .delete("/api/issues/Mytest")
                  .send({})
                  .end(function(err, res){
                    let obj = JSON.parse(res.text);
                    assert.equal(res.status, 200);
                    assert.equal(obj.error, "missing _id");
                    done()
                  })
              });
        })
    })
});
