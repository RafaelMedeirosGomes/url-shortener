import UrlDAO from "../database/url.dao";

export default interface IUrlModel {
  create: (doc: UrlDAO) => Promise<Required<UrlDAO>>;
  findByUUIDAndIncrementCounter: (
    uuid: UrlDAO["uuid"]
  ) => Promise<Required<UrlDAO> | null>;
}
