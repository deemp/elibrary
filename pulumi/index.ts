// """
// Creating a Kubernetes Deployment
// """

import * as pulumi from "@pulumi/pulumi"
import * as k8s from "@pulumi/kubernetes"
import * as Back from "./src/back/index"
import * as Monitoring from "./src/monitoring/index"

function mkSetup(
  environment: string,
  provider: k8s.Provider
) {
  const config = new pulumi.Config(environment)

  const namespace = environment
  new k8s.core.v1.Namespace(namespace, {
    metadata: {
      name: namespace
    }
  })

  const back = Back.main(
    config.requireObject("back"),
    environment,
    provider,
    namespace
  )

  const monitoring = Monitoring.main(
    namespace
  )
}

// didn't work with microk8s
// worked with minikube
// const provider = new k8s.Provider("k8s-yaml-rendered", {
//   renderYamlToDirectory: "yaml",
// })
const provider = new k8s.Provider("kubernetes-provider")

mkSetup(pulumi.getStack(), provider)
