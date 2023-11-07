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

  // https://www.pulumi.com/registry/packages/kubernetes/api-docs/helm/v3/release/#query-kubernetes-resource-installed-by-helm-chart
  // const srv = k8s.core.v1.Service.get("loki", pulumi.interpolate`${loki.status.namespace}/${loki.status.name}-master`);
  // const lokiClusterIP = srv.spec.externalName;
}