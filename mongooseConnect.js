require('dotenv').config();
const mongoose    = require('mongoose');

function main(callback){ 
  try{

   mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

   const issuesSchema = mongoose.Schema({
    issue_title: {type: String, required: {values: true , message: 'required field(s) missing'}},
    issue_text: {type: String, required: {values: true , message: 'required field(s) missing'}},
    created_by: {type: String, required: {values: true , message: 'required field(s) missing'}},
    created_on: {type: String, default: ()=> new Date().toISOString()},
    updated_on: {type: String, default: ()=> new Date().toISOString()},
    assigned_to: {type: String, default: ""},
    status_text: {type: String, default: ""},
    open: {type: Boolean,  default: true},   
    project: {type: String, select: true},
    __v: {type: Number, select: false}
  });

  const Issues = mongoose.model("Issues", issuesSchema);

   callback(Issues);

  } catch (e) {

    console.error(e);
    throw new Error('Unable to Connect to Database');
  };
};

module.exports = main