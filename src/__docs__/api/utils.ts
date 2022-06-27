import { TagOpenAPI } from '../../types/index'

export const parseTags = ((tags: Array<TagOpenAPI>) =>
tags.map((tag: TagOpenAPI) => ({
  name: tag.name,
  description: tag.description,
  externalDocs: null // intentionally left blank, it can specify a doc site.
})))
