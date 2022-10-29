## 前言

1. 關於 `GCP vs AWS`，可以讀一下[這篇](https://nandovillalba.medium.com/why-i-think-gcp-is-better-than-aws-ea78f9975bda)
2. 想了解 k8s 的網路機制，可以讀一下[這篇](https://sookocheff.com/post/kubernetes/understanding-kubernetes-networking-model/#kubernetes-basic)

---

## 正文

先假設不管你是用 terraform / CloudFormation / eksctl 還是 web console，總之當你費盡千辛萬苦終於得到一個運行中的 k8s cluster 之後，你可能會遇到的第一個問題就是：

> #### 單一節點上 pod 運行數量的限制

這個限制在[GKE](https://cloud.google.com/kubernetes-engine/docs/best-practices/scalability#managing_ips_in_vpc-native_clusters)是 110。但是在 EKS 上是根據每個 instance 可搭載的 ENI 數量，以及每個 ENI 可分派的 IP 數量[計算](https://github.com/awslabs/amazon-eks-ami/blob/master/files/eni-max-pods.txt)出來的。原因在於 EKS 使用了自己家的 [CNI plugin](https://github.com/aws/amazon-vpc-cni-k8s)。

> #### 參考：[AWS CNI Plugin vs Flannel](https://www.contino.io/insights/kubernetes-is-hard-why-eks-makes-it-easier-for-network-and-security-architects)

透過 AWS CNI Plugin 可以用管理 VPC 的 Config 直接管到 Pod / Container 層級，相對應的缺點就是 ip 數量不夠用，所以後來出了 [prefix assignment mode](https://aws.amazon.com/tw/blogs/containers/amazon-vpc-cni-increases-pods-per-node-limits/) 來應付這個問題。簡單來說就是從原本直接分派 IP 到 network interface 底下，改成分派一個 `/28` 的 IP address prefixes，如此一來可用的 IP
數量就從 1 個變成 16 個。

> #### 但是 prefix assignment mode 又會帶來新的問題（囧）

如果 pod 不小心跟 node 搶到同一個 IP，會讓 kubelet 無法跟 control plane 溝通，導致 node 變成 unknown status。所以使用`prefix assignment mode`要記得[指定獨立的 subnet](https://docs.aws.amazon.com/eks/latest/userguide/cni-custom-network.html)，或是加上[subnet CIDR reservations](https://docs.aws.amazon.com/vpc/latest/userguide/subnet-cidr-reservation.html)，確保不會發生`ip conflict`。

> #### 如果順利解決了 ip 問題，接下來還有...

- [unable to mount volumes](https://github.com/kubernetes/kubernetes/issues/65500)

- [kubelet OOM](https://github.com/awslabs/amazon-eks-ami/issues/318)

- to be continued ...
