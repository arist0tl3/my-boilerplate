import { buildSubgraphSchema } from "@apollo/subgraph";

import schema from "../../schema";

export default function buildSchema() {
  return buildSubgraphSchema(schema);
}
