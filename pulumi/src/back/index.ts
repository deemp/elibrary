import { Output } from "@pulumi/pulumi"
import { Config } from "./pulumi"
import * as k8s from "@pulumi/kubernetes"
import path = require("node:path")
import process = require('node:process')

export function main(
  config: Config,
  environment: string,
  provider: k8s.Provider,
  namespace: string
) {
  const appName = config.name
  const deploymentConfig = config.deployment

  const containerConfig = {
    ...deploymentConfig.container,
    ...{ dockerHubImage: config.deployment.container.dockerHubImage },
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
                  image: containerConfig.dockerHubImage,
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