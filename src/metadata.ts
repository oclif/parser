export type Metadata = {
  flags: { [P in keyof any]: MetadataFlag }
}

type MetadataFlag = {
  setFromDefault?: boolean
}
