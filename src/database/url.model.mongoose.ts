import { Schema, model } from "mongoose";

const UrlSchema = new Schema({
  longUrl: { type: String, required: true, maxlength: 2048 },
  shortUrl: { type: String, required: true, maxlength: 22 },
  createdAt: { type: Date, default: Date.now },
});

export interface UrlDTO {
  longUrl: string;
  shortUrl: string;
  createdAt: Date;
}

const UrlModel = model<UrlDTO>("URL", UrlSchema);

export default UrlModel;
