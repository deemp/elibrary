import * as k8s from "@pulumi/kubernetes"
import * as pulumi from "@pulumi/pulumi";

export function main(
  namespaceName: string
) {

  const namespace = `${namespaceName}-monitoring`

  new k8s.core.v1.Namespace(namespace, {
    metadata: {
      name: namespace
    }
  })

  const loki = new k8s.helm.v3.Release('loki', {
    chart: 'loki-stack',
    namespace,
    repositoryOpts: {
      repo: 'https://grafana.github.io/helm-charts',
    },
    skipCrds: true,
    values: {
      test_pod: {
        enabled: false
      }
    },
    name: 'loki'
  })

  new k8s.helm.v3.Release('prometheus', {
    chart: "kube-prometheus-stack",
    namespace,
    repositoryOpts: {
      repo: "https://prometheus-community.github.io/helm-charts",
    },
    values: {},
  })

  new k8s.helm.v3.Release('tempo', {
    chart: "tempo",
    namespace,
    repositoryOpts: {
      repo: "https://grafana.github.io/helm-charts",
    },
    values: {
      name: 'tempo'
    },
  })
}