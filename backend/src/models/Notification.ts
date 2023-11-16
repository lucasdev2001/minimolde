import mongoose, { Schema, model } from "mongoose";
import { client } from "../microservices/broker";

const notificationSchema = new Schema(
  {
    content: String,
    from: {
      type: mongoose.Types.ObjectId,
      ref: "Employee",
    },
    expireAt: {
      type: Date,
      default: Date.now,
      index: { expires: "1m" },
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

Notification.watch().on("change", data => {
  client.publish("notifications", "notification:updated");
});

export default Notification;
