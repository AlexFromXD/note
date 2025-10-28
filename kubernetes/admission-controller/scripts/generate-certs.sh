#!/usr/bin/env bash
set -euo pipefail

# ===============================
# 用法：
# ./scripts/generate-certs.sh <service> <namespace>
#
# 例如：
# ./scripts/generate-certs.sh ndots-webhook-svc kube-system
#
# 產出：
#   ./certs/ca.crt
#   ./certs/ca.key
#   ./certs/tls.crt
#   ./certs/tls.key
#   ./certs/ca_bundle_base64.txt
# ===============================

SERVICE=${1:?service name required}
NAMESPACE=${2:?namespace required}
CERT_DIR="./certs"
mkdir -p "${CERT_DIR}"

CN="${SERVICE}.${NAMESPACE}.svc"

echo "📘 1. 產生 CA ..."
openssl genrsa -out "${CERT_DIR}/ca.key" 2048
openssl req -x509 -new -nodes -key "${CERT_DIR}/ca.key" \
  -subj "/CN=ndots-webhook-ca" \
  -days 3650 -out "${CERT_DIR}/ca.crt"

echo "📘 2. 產生 Server key 和 CSR ..."
openssl genrsa -out "${CERT_DIR}/tls.key" 2048
cat > "${CERT_DIR}/csr.conf" <<EOF
[ req ]
default_bits       = 2048
prompt             = no
default_md         = sha256
req_extensions     = req_ext
distinguished_name = dn

[ dn ]
CN = ${CN}

[ req_ext ]
subjectAltName = @alt_names

[ alt_names ]
DNS.1 = ${SERVICE}
DNS.2 = ${SERVICE}.${NAMESPACE}
DNS.3 = ${SERVICE}.${NAMESPACE}.svc
DNS.4 = ${SERVICE}.${NAMESPACE}.svc.cluster.local
EOF

openssl req -new -key "${CERT_DIR}/tls.key" -out "${CERT_DIR}/server.csr" -config "${CERT_DIR}/csr.conf"

echo "📘 3. 用 CA 簽發 Server cert ..."
cat > "${CERT_DIR}/csr-ca.conf" <<EOF
[ v3_ext ]
authorityKeyIdentifier=keyid,issuer
basicConstraints=CA:FALSE
keyUsage = digitalSignature, keyEncipherment
extendedKeyUsage = serverAuth
subjectAltName = @alt_names

[ alt_names ]
DNS.1 = ${SERVICE}
DNS.2 = ${SERVICE}.${NAMESPACE}
DNS.3 = ${SERVICE}.${NAMESPACE}.svc
DNS.4 = ${SERVICE}.${NAMESPACE}.svc.cluster.local
EOF

openssl x509 -req -in "${CERT_DIR}/server.csr" \
  -CA "${CERT_DIR}/ca.crt" -CAkey "${CERT_DIR}/ca.key" -CAcreateserial \
  -out "${CERT_DIR}/tls.crt" -days 365 -sha256 \
  -extfile "${CERT_DIR}/csr-ca.conf" -extensions v3_ext

echo "📘 4. 輸出 base64 caBundle ..."
base64 < "${CERT_DIR}/ca.crt" | tr -d '\n' > "${CERT_DIR}/ca_bundle_base64.txt"

echo "✅ 完成！"
echo "🔹 CA:         ${CERT_DIR}/ca.crt"
echo "🔹 Server Cert: ${CERT_DIR}/tls.crt"
echo "🔹 Server Key:  ${CERT_DIR}/tls.key"
echo "🔹 caBundle:    ${CERT_DIR}/ca_bundle_base64.txt"
