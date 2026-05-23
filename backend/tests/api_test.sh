#!/bin/bash
API_URL="http://localhost:3000/api"
echo "Registering Farmer..."
FARMER_REG=$(curl -s -X POST $API_URL/auth/register -H "Content-Type: application/json" -d '{"email": "farmer@test.com", "password": "password123", "name": "Jean", "role": "FARMER"}')
echo $FARMER_REG
echo "Logging in..."
FARMER_LOGIN=$(curl -s -X POST $API_URL/auth/login -H "Content-Type: application/json" -d '{"email": "farmer@test.com", "password": "password123"}')
TOKEN=$(echo $FARMER_LOGIN | grep -o '"token":"[^"]*' | cut -d'"' -f4)
echo "Creating product..."
curl -s -X POST $API_URL/products -H "Content-Type: application/json" -H "Authorization: Bearer $TOKEN" -d '{"name": "Tomates", "price": 2.5, "unit": "kg", "quantity": 100}'
echo -e "\nGetting products..."
curl -s -X GET $API_URL/products
echo ""
