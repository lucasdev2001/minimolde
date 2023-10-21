import mongoose, { Schema, model } from "mongoose";
import * as mqtt from "mqtt";

const client = mqtt.connect(process.env.BROKER!);

const notificationSchema = new Schema(
  {
    content: String,
    from: {
      type: mongoose.Types.ObjectId,
      ref: "Employee",
    },
  },
  {
    strict: true,
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  }
);

const Notification = model("Notification", notificationSchema);

Notification.watch().on("change", data =>
  client.publish("notifications", "notification:updated")
);

export default Notification;
