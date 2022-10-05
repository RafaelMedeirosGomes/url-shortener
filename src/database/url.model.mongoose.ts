import { Schema, model } from "mongoose";

const urlSchema = new Schema({
  longUrl: { type: String, required: true, maxlength: 2048 },
  uuid: { type: String, required: true, maxlength: 11, index: true },
  createdAt: { type: Date, default: Date.now },
});

export interface UrlDAO {
  longUrl: string;
  uuid: string;
  createdAt: Date;
}

const UrlModel = model<UrlDAO>("URL", urlSchema);

export default UrlModel;
