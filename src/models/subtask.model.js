const { Schema, model } = require("mongoose");

const subtaskSchema = new Schema(
  {
    task_id: {
      type: Schema.Types.ObjectId,
      ref: "Task",
      required: true,
    },
    status: {
      type: Number,
      enum: [0, 1],
      default: 0,
    }, // 0 = Incomplete, 1 = Complete
    is_deleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = model("Subtask", subtaskSchema);
