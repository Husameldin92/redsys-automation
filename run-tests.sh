#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${GREEN}RedSys CMS Automation Test Runner${NC}"
echo "================================="

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}Dependencies not installed. Running npm install...${NC}"
    npm install
fi

# Check if test images exist
if [ ! -f "cypress/fixtures/images/brand.jpg" ]; then
    echo -e "${YELLOW}Test images not found. Generating...${NC}"
    npm run generate:images
    sleep 2
fi

# Check if cypress.env.json exists
if [ ! -f "cypress.env.json" ]; then
    echo -e "${YELLOW}Warning: cypress.env.json not found.${NC}"
    echo "Copy cypress.env.json.example and update with your credentials."
    echo ""
fi

# Display options
echo "Select test mode:"
echo "1) Open Cypress Test Runner (Interactive)"
echo "2) Run tests headless"
echo "3) Run tests headed (visible browser)"
echo "4) Run tests in Chrome"
echo "5) Exit"

read -p "Enter your choice (1-5): " choice

case $choice in
    1)
        echo -e "${GREEN}Opening Cypress Test Runner...${NC}"
        npm run open
        ;;
    2)
        echo -e "${GREEN}Running tests in headless mode...${NC}"
        npm test
        ;;
    3)
        echo -e "${GREEN}Running tests in headed mode...${NC}"
        npm run test:headed
        ;;
    4)
        echo -e "${GREEN}Running tests in Chrome...${NC}"
        npm run test:chrome
        ;;
    5)
        echo "Exiting..."
        exit 0
        ;;
    *)
        echo -e "${RED}Invalid choice. Exiting...${NC}"
        exit 1
        ;;
esac
