const taskSchema = require("../models/task.model");
const subtaskSchema = require("../models/subtask.model")
// 1. Create task - input is title, description and due_date with jwt auth token
exports.registerTask = async (req, res) => {
  const { title, description, due_date, priority } = req.body;
  try {
    const task = await taskSchema.create({
      user_id: req.user._id,
      title,
      description,
      due_date,
      priority
    });
    res.status(201).json(task);
  } catch (err) {
    res.status(500).json({ error: "Internal server error" , err : err.message});
  }
};



// 3. Get all user task(with filter like priority, due date and proper pagination etc)
exports.getAllTasks = async (req, res) => {
  const { priority, due_date } = req.query;

  // Pagination
  const page = parseInt(req.query.page) || 1;
  let limit = parseInt(req.query.limit) || 10;
  limit = limit > 50 ? 50 : limit;
  const skip = (page - 1) * limit;

  const filter = { user_id: req.user._id, is_deleted: false };
  if (priority) filter.priority = priority;
  if (due_date) {
    const dueDateObj = new Date(due_date);
    if (isNaN(dueDateObj.getTime())) {
      return res.status(400).json({ error: "Invalid due_date format" });
    }
    filter.due_date = { $lte: dueDateObj };
  }
  
  if (req.query.start_date && req.query.end_date) {
    const { due_date } = req.query; //yyyy/mm/dd
    const dueDateObj = new Date(due_date); 

    if (isNaN(dueDateObj.getTime())) {
      return res.status(400).json({ error: "Invalid due_date format" });
    }
    
    filter.due_date = { $lte: dueDateObj };
  }
  
  try {
    // Fetch tasks with filters, pagination 
    const tasks = await taskSchema.find(filter).skip(skip).limit(limit);

    res.status(200).json({
      message: `${req.user.firstName}, all tasks fetched successfully.`,
      tasks,
    });
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
};


//? 5. Update task- due_date, status-"TODO" or "DONE" can be changed
// the one who created will update the task only 
//? 6. Update subtask - only status can be updated - 0,1  
// You should also update the corresponding sub tasks in case of task updation and deletion
exports.updateTask = async (req, res) => {
  const { due_date, status } = req.body;
  const id = req.params.id
  try {
    const task = await taskSchema.findOneAndUpdate(
      { _id: id, user_id: req.user._id, is_deleted: false },
      { due_date, status },
      { new: true }
    );

    if (!task) return res.status(404).json({ error: "Task not found" });
    await subtaskSchema.updateMany(
      { task_id: task._id }, 
      { $set: { status: status === "DONE" ? 1 : 0 } } 
    );
    
    res.json({message : "Task Updated Sucessfully",task});
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
};

// Delete task(soft deletion)    
// 8. Delete sub task (soft deletion)

exports.deleteTask =  async (req, res) => {
  try {
    const id = req.params.id   
    const deletedTask = await taskSchema.findOneAndUpdate(
      { _id: id, user_id: req.user._id, is_deleted: false },
      { is_deleted: true },
      { new: true }
    );
    if (!deletedTask) {
      return res.status(404).json({ error: "Task not found or already deleted" });
    }
    await subtaskSchema.updateMany({ task_id: task._id }, { is_deleted: true });

    res.json({ message: "Task deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
};

