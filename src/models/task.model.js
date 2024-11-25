const { Schema, model } = require("mongoose");
const moment = require("moment")

const taskSchema = new Schema({
  user_id: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  title: {
    type: String,
    required: [true, "title is Required"],
    trim: true,
    minLength: 4,
    lowercase: true,
  },
  description: {
    type: String,
    required: [true, "description is Required"],
    trim: true,
    minLength: 6,
    lowercase: true,
  },
  due_date: {
    type: Date,
    set: function(Date){
      return moment(Date, "DD/MM/YY", true).toDate()
    }
  },  
  status: { type: String,
     enum: ["todo", "done"], 
     default: "todo",
     lowercase: true,
     trim: true,
     },
  priority: {
    type: String,
    enum: ["low", "medium", "high"],
    default: "medium",
    trim : true,
    lowercase : true
  },
  is_deleted: { 
    type: Boolean,
     default: false 
    },
},{timestamps : true});


module.exports = model("Task", taskSchema);
