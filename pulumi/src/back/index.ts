import { Output } from "@pulumi/pulumi"
import { Config } from "./pulumi"
import * as k8s from "@pulumi/kubernetes"
import path = require("node:path")
import process = require('node:process')

export function main(
  config: Config,
  environment: string,
  dockerHubImage: string,
  provider: k8s.Provider,
  namespace: string
) {
  const appName = config.name
  const deploymentConfig = config.deployment

  const containerConfig = {
    ...deploymentConfig.container,
    ...{ dockerHubImage: dockerHubImage },
  }
  const serviceConfig = config.service
  const labels = {
    environment: environment,
  }
  const opts = {
    provider: provider,
    deleteBeforeReplace: true,
  }

  const staticContentHostPath = `${path.dirname(process.cwd())}/static`
  console.log(staticContentHostPath)

  var data: { [k: string]: Output<string> } = {}

  const configMap = ((name = `${appName}-configmap`) =>
    new k8s.core.v1.ConfigMap(
      name,
      {
        metadata: {
          name,
          namespace,
          labels,
        },
        data: data,
      },
      opts
    ))()

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
            spec: ((
              appVolume = `${name}-app-config-volume`,
              staticVolume = `${name}-app-static-volume`,
            ) => {
              return {
                containers: [
                  {
                    name: containerConfig.name,
                    image: containerConfig.dockerHubImage,
                    imagePullPolicy: "Always",
                    ports: [
                      {
                        containerPort: 80,
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
                volumes: [
                  {
                    name: appVolume,
                    configMap: {
                      // TODO
                      name: configMap.metadata.name,
                    },
                  },
                  {
                    name: staticVolume,
                    hostPath: {
                      path: staticContentHostPath,
                      type: `DirectoryOrCreate`,
                    },
                  },
                ],
              }
            })(),
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