#!/bin/sh

# From https://github.com/hashicorp/vault/blob/master/scripts/gen_openapi.sh

set -e

echo "Starting Vault..."
if pgrep -x "vault" > /dev/null
then
    VAULT_PID=`pgrep -x "vault"`
    kill -9 $VAULT_PID
fi

export VAULT_API_ADDR='http://127.0.0.1:8200'

vault server -dev -dev-root-token-id=root &
sleep 2
VAULT_PID=$!

echo "Mounting all builtin backends..."

#  auth backends
#vault auth enable alicloud
#vault auth enable app-id
#vault auth enable approle
vault auth enable aws
#vault auth enable azure
#vault auth enable centrify
vault auth enable cert
#vault auth enable gcp
#vault auth enable github
#vault auth enable jwt
#vault auth enable kubernetes
#vault auth enable ldap
#vault auth enable okta
#vault auth enable radius
vault auth enable userpass

# secrets backends
#vault secrets enable ad
#vault secrets enable alicloud
#vault secrets enable aws
#vault secrets enable azure
#vault secrets enable cassandra
#vault secrets enable consul
#vault secrets enable database
#vault secrets enable gcp
vault secrets enable kv
#vault secrets enable mongodb
#vault secrets enable mssql
#vault secrets enable mysql
#vault secrets enable nomad
#vault secrets enable pki
#vault secrets enable postgresql
#vault secrets enable rabbitmq
#vault secrets enable ssh
#vault secrets enable totp
#vault secrets enable transit
