import { Schema, model } from "mongoose";

const urlSchema = new Schema({
  longUrl: { type: String, required: true, maxlength: 2048 },
  shortUrl: { type: String, required: true, maxlength: 22, index: true },
  createdAt: { type: Date, default: Date.now },
});

export interface UrlDAO {
  longUrl: string;
  shortUrl: string;
  createdAt: Date;
}

const UrlModel = model<UrlDAO>("URL", urlSchema);

export default UrlModel;
