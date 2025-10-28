package main

import (
	"encoding/json"
	"log"
	"net/http"

	admissionv1 "k8s.io/api/admission/v1"
	corev1 "k8s.io/api/core/v1"
	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
)

func writeReview(w http.ResponseWriter, req *admissionv1.AdmissionRequest, resp admissionv1.AdmissionResponse, apiVersion string) {
	ar := admissionv1.AdmissionReview{
		TypeMeta: metav1.TypeMeta{
			APIVersion: apiVersion,
			Kind:       "AdmissionReview",
		},
		Response: &resp,
	}
	ar.Response.UID = req.UID
	w.Header().Set("Content-Type", "application/json")
	_ = json.NewEncoder(w).Encode(ar)
}

func handleMutate(w http.ResponseWriter, r *http.Request) {
	var review admissionv1.AdmissionReview
	if err := json.NewDecoder(r.Body).Decode(&review); err != nil {
		http.Error(w, "invalid request", http.StatusBadRequest)
		return
	}
	if review.Request == nil {
		http.Error(w, "empty request", http.StatusBadRequest)
		return
	}
	req := review.Request
	apiVersion := review.TypeMeta.APIVersion
	if apiVersion == "" {
		apiVersion = "admission.k8s.io/v1"
	}

	// 非 Pod：直接放行，避免回 400 造成整體失敗
	if req.Kind.Kind != "Pod" {
		writeReview(w, req, admissionv1.AdmissionResponse{Allowed: true}, apiVersion)
		return
	}

	var pod corev1.Pod
	if err := json.Unmarshal(req.Object.Raw, &pod); err != nil {
		writeReview(w, req, admissionv1.AdmissionResponse{
			Allowed: false,
			Result:  &metav1.Status{Message: "cannot parse pod"},
		}, apiVersion)
		return
	}

	// 已有 ndots=2 → 直接放行（注意 DNSConfig 可能為 nil）
	if pod.Spec.DNSConfig != nil {
		for _, opt := range pod.Spec.DNSConfig.Options {
			if opt.Name == "ndots" && opt.Value != nil && *opt.Value == "2" {
				writeReview(w, req, admissionv1.AdmissionResponse{Allowed: true}, apiVersion)
				return
			}
		}
	}

	// 構建 JSONPatch（分三種情況）
	var patch []map[string]interface{}
	if pod.Spec.DNSConfig == nil {
		// 1) 沒有 dnsConfig：整個新增
		patch = append(patch, map[string]interface{}{
			"op":   "add",
			"path": "/spec/dnsConfig",
			"value": map[string]interface{}{
				"options": []map[string]string{{"name": "ndots", "value": "2"}},
			},
		})
	} else if pod.Spec.DNSConfig.Options == nil || len(pod.Spec.DNSConfig.Options) == 0 {
		// 2) 有 dnsConfig 但沒有 options：新增整個 options 陣列
		patch = append(patch, map[string]interface{}{
			"op":    "add",
			"path":  "/spec/dnsConfig/options",
			"value": []map[string]string{{"name": "ndots", "value": "2"}},
		})
	} else {
		// 3) 已有 options：往陣列尾端追加
		patch = append(patch, map[string]interface{}{
			"op":    "add",
			"path":  "/spec/dnsConfig/options/-",
			"value": map[string]string{"name": "ndots", "value": "2"},
		})
	}

	patchBytes, _ := json.Marshal(patch)
	pt := admissionv1.PatchTypeJSONPatch

	writeReview(w, req, admissionv1.AdmissionResponse{
		Allowed:   true,
		PatchType: &pt,
		Patch:     patchBytes,
	}, apiVersion)
}

func main() {
	http.HandleFunc("/mutate", handleMutate)
	log.Println("starting webhook server on :8443")
	log.Fatal(http.ListenAndServeTLS(":8443", "/tls/tls.crt", "/tls/tls.key", nil))
}
