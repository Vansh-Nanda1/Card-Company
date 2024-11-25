// 2. Create sub task - input is task_id
const subtaskSchema = require("../models/subtask.model");
const taskSchema = require("../models/task.model");

exports.registerSubTask = async (req, res) => {
  try {
    const { task_id } = req.body;
    const task = await taskSchema.findById(task_id);
    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }
    const subtask = await subtaskSchema.create({ task_id });
    res.status(201).json({ message: "Sub Task created successfully", subtask });
  } catch (err) {
    console.error("Error creating subtask:", err.message);
    res.status(500).json({ error: "Internal server error", err: err.message });
  }
};


// Get all user sub tasks (with filter like task_id if passed)
exports.getAllSubTasks = async (req, res) => {
  const { task_id } = req.query;
  const filter = { is_deleted: false }; 
  if (task_id) filter._id = task_id; 

  try {
    const tasks = await taskSchema.find(filter);

    if (tasks.length === 0) {
      return res.status(404).json({ error: "No tasks found" });
    }

    res.status(200).json({
      message: `${req.user.firstName}, all Sub Tasks fetched successfully.`,
      tasks,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};




