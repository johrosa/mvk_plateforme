#!/bin/bash
API_URL="http://localhost:3000/api"

echo "1. Registering Hub..."
HUB_REG=$(curl -s -X POST $API_URL/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email": "hub@test.com", "password": "password123", "name": "Village Hub", "role": "HUB"}')
echo $HUB_REG

echo -e "\n2. Logging in Hub..."
HUB_LOGIN=$(curl -s -X POST $API_URL/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "hub@test.com", "password": "password123"}')
TOKEN=$(echo $HUB_LOGIN | grep -o '"token":"[^"]*' | cut -d'"' -f4)

echo -e "\n3. Hub creating product for farmer without smartphone..."
curl -s -X POST $API_URL/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"name": "Manioc", "price": 1.0, "unit": "bag", "quantity": 20, "sourceFarmerName": "Old Papa Joe"}'

echo -e "\n4. Getting products to verify..."
curl -s -X GET $API_URL/products
echo ""
