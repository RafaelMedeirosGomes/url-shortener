import { Schema, model } from "mongoose";
import UrlDAO from "./url.dao";

const urlSchema = new Schema({
  longUrl: { type: String, required: true, maxlength: 2048 },
  uuid: { type: String, required: true, maxlength: 11, index: true },
  createdAt: { type: Date, default: Date.now },
});

const UrlMongooseModel = model<Required<UrlDAO>>("URL", urlSchema);

export default UrlMongooseModel;
