import UrlDAO from "../database/url.dao";

export default interface IUrlModel {
  create: (doc: UrlDAO) => Promise<Required<UrlDAO>>;
  findByUUID: (value: UrlDAO["uuid"]) => Promise<Required<UrlDAO> | null>;
}
