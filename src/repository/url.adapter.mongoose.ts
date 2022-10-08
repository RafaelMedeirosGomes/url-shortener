import UrlDAO from "../database/url.dao";
import UrlMongooseModel from "../database/url.model.mongoose";
import IUrlModel from "./url.interface";

export default class UrlModel implements IUrlModel {
  private readonly mongooseModel;
  constructor() {
    this.mongooseModel = UrlMongooseModel;
  }

  async create(doc: UrlDAO): Promise<Required<UrlDAO>> {
    const newDocument = await this.mongooseModel.create(doc);
    return newDocument;
  }

  async findByUUID(value: UrlDAO["uuid"]): Promise<Required<UrlDAO> | null> {
    const document = await this.mongooseModel.findOne({ uuid: value });
    return document;
  }
}
