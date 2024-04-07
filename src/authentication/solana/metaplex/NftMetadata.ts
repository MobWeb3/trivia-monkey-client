export interface NftMetadataParams {
    name: string;
    symbol: string;
    image: string;
  }
  
  export class NftMetadata {
    name: string;
    symbol: string;
    description?: string;
    image: string;
    attributes?: { trait_type: string; value: string }[];
    properties?: { files: { uri: string; type: string }[] };
    session_id?: string;
    host_id?: string;
  
    constructor(params: NftMetadataParams) {
      this.name = params.name;
      this.symbol = params.symbol;
      this.image = params.image;
    }
  
    setDescription(description: string): NftMetadata {
      this.description = description;
      return this;
    }
  
    setAttributes(attributes: { trait_type: string; value: string }[]): NftMetadata {
      this.attributes = attributes;
      return this;
    }
  
    setProperties(properties: { files: { uri: string; type: string }[] }): NftMetadata {
      this.properties = properties;
      return this;
    }
  
    setSessionId(session_id: string): NftMetadata {
      this.session_id = session_id;
      return this;
    }
  
    setHostId(host_id: string): NftMetadata {
      this.host_id = host_id;
      return this;
    }
  
    toJSON() {
      return Object.entries(this)
        .reduce((obj: Record<string, unknown>, [key, value]) => {
          if (value !== undefined) {
              obj[key] = value;
          }
          return obj;
      }, {});
    }
  }