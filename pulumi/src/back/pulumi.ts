import { Input } from "@pulumi/pulumi"

export interface Config {
  name: string
  deployment: {
    container: {
      replicaCount: number
      name: string
      dockerHubImage: string
    }
  }
  service: {
    port: number
    type: Input<"NodePort">
    nodePort: number
  }
}