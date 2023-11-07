import { Input } from "@pulumi/pulumi"

export interface Config {
  name: string
  deployment: {
    container: {
      replicaCount: number
      name: string
      image: string
      tag: string
    }
  }
  service: {
    port: number
    type: Input<"NodePort">
    nodePort: number
  }
}