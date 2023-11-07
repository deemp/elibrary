import { Config } from "./pulumi"
import * as k8s from "@pulumi/kubernetes"

interface Image {
  digest: string
}

interface Response {
  images: Image[]
}

async function resolveImage(image: string, tag: string) {
  let resp = await fetch(`https://registry.hub.docker.com/v2/repositories/${image}/tags/${tag}`)
  if (resp.ok) {
    let json = await resp.json() as Response
    return json.images[0].digest
  } else return ""
}


export async function main(
  config: Config,
  environment: string,
  provider: k8s.Provider,
  namespace: string
) {
  const appName = config.name
  const deploymentConfig = config.deployment

  const containerConfig = {
    ...deploymentConfig.container,
    ...{ image: config.deployment.container.image },
  }
  const serviceConfig = config.service
  const labels = {
    environment: environment,
  }
  const opts = {
    provider: provider,
    deleteBeforeReplace: true,
  }

  const containerPortName = `${appName}-port`

  const sha = await resolveImage(config.deployment.container.image, config.deployment.container.tag)

  const deployment = ((name = `${appName}-deployment`) =>
    new k8s.apps.v1.Deployment(
      name,
      {
        metadata: {
          name,
          labels,
          namespace
        },
        spec: {
          replicas: 1,
          selector: {
            matchLabels: labels,
          },
          template: {
            metadata: {
              labels,
              namespace
            },
            spec: ({
              containers: [
                {
                  name: containerConfig.name,
                  image: `${containerConfig.image}@${sha}`,
                  imagePullPolicy: "Always",
                  ports: [
                    {
                      containerPort: config.service.port,
                      name: containerPortName,
                    },
                  ],
                  resources: {
                    requests: {
                      memory: "900Mi",
                      cpu: "250m",
                    },
                    limits: {
                      memory: "900Mi",
                      cpu: "500m",
                    },
                  },
                },
              ],
            }),
          },
        },
      },
      opts
    ))()

  const backService = ((name = `${appName}-service`) =>
    new k8s.core.v1.Service(
      name,
      {
        metadata: {
          name,
          namespace,
          labels,
        },
        spec: {
          type: serviceConfig.type,
          ports: [
            {
              port: serviceConfig.port,
              name: `${name}-port`,
              targetPort: containerPortName,
              nodePort: serviceConfig.nodePort,
            },
          ],
          selector: labels,
        },
      },
      opts
    ))()

  return {
    host: backService.metadata.name,
    port: serviceConfig.port
  }
} 