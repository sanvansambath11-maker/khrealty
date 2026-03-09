import requests
import sys
import json
from datetime import datetime

class KHRealtyAPITester:
    def __init__(self, base_url="https://borey-dreams.preview.emergentagent.com"):
        self.base_url = base_url
        self.tests_run = 0
        self.tests_passed = 0
        self.property_ids = []

    def run_test(self, name, method, endpoint, expected_status, data=None, params=None):
        """Run a single API test"""
        url = f"{self.base_url}/api/{endpoint}"
        headers = {'Content-Type': 'application/json'}

        self.tests_run += 1
        print(f"\n🔍 Testing {name}...")
        print(f"   URL: {method} {url}")
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=headers, params=params)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=headers)
            elif method == 'PUT':
                response = requests.put(url, json=data, headers=headers)
            elif method == 'DELETE':
                response = requests.delete(url, headers=headers)

            print(f"   Status: {response.status_code}")
            
            success = response.status_code == expected_status
            if success:
                self.tests_passed += 1
                print(f"✅ PASS - {name}")
                try:
                    return True, response.json()
                except:
                    return True, {}
            else:
                print(f"❌ FAIL - {name} - Expected {expected_status}, got {response.status_code}")
                try:
                    error_data = response.json()
                    print(f"   Error: {error_data}")
                except:
                    print(f"   Error: {response.text}")
                return False, {}

        except Exception as e:
            print(f"❌ FAIL - {name} - Error: {str(e)}")
            return False, {}

    def test_root_endpoint(self):
        """Test the root API endpoint"""
        return self.run_test("Root API", "GET", "", 200)

    def test_get_properties(self):
        """Test getting all properties"""
        success, response = self.run_test("Get All Properties", "GET", "properties", 200)
        if success and isinstance(response, list):
            print(f"   Found {len(response)} properties")
            # Store property IDs for later tests
            self.property_ids = [prop.get('id') for prop in response if prop.get('id')]
            print(f"   Property IDs: {self.property_ids[:3]}..." if len(self.property_ids) > 3 else f"   Property IDs: {self.property_ids}")
        return success, response

    def test_get_featured_properties(self):
        """Test getting featured properties"""
        success, response = self.run_test(
            "Get Featured Properties", "GET", "properties", 200, 
            params={'featured': 'true'}
        )
        if success and isinstance(response, list):
            featured_count = len([p for p in response if p.get('featured')])
            print(f"   Featured properties: {featured_count}/{len(response)}")
        return success, response

    def test_property_filters(self):
        """Test property filtering"""
        filters = [
            ({'city': 'Phnom Penh'}, "Filter by Phnom Penh"),
            ({'property_type': 'villa'}, "Filter by Villa type"),
            ({'min_price': '200000'}, "Filter by minimum price $200K"),
            ({'max_price': '300000'}, "Filter by maximum price $300K"),
            ({'bedrooms': '3'}, "Filter by 3+ bedrooms"),
        ]
        
        results = []
        for params, description in filters:
            success, response = self.run_test(description, "GET", "properties", 200, params=params)
            if success:
                print(f"   Results: {len(response)} properties")
            results.append((success, response))
        
        return all(result[0] for result in results)

    def test_get_single_property(self):
        """Test getting a single property by ID"""
        if not self.property_ids:
            print("⚠️  No property IDs available for single property test")
            return False, {}
        
        property_id = self.property_ids[0]
        return self.run_test(f"Get Property {property_id}", "GET", f"properties/{property_id}", 200)

    def test_property_not_found(self):
        """Test getting a non-existent property"""
        fake_id = "non-existent-property-id"
        return self.run_test("Get Non-existent Property", "GET", f"properties/{fake_id}", 404)

    def test_create_property(self):
        """Test creating a new property"""
        test_property = {
            "title": f"Test Property {datetime.now().strftime('%H%M%S')}",
            "description": "Test property created by automated testing",
            "price": 150000,
            "property_type": "villa",
            "location": "Test Location",
            "city": "Phnom Penh",
            "bedrooms": 3,
            "bathrooms": 2,
            "area": 200,
            "images": ["https://example.com/test-image.jpg"],
            "featured": False,
            "status": "available"
        }
        
        success, response = self.run_test("Create Property", "POST", "properties", 200, data=test_property)
        if success and response.get('id'):
            new_property_id = response['id']
            self.property_ids.append(new_property_id)
            print(f"   Created property ID: {new_property_id}")
            return success, response
        return success, response

    def test_update_property(self):
        """Test updating a property"""
        if not self.property_ids:
            print("⚠️  No property IDs available for update test")
            return False, {}
        
        property_id = self.property_ids[-1]  # Use the last created property
        update_data = {
            "title": f"Updated Test Property {datetime.now().strftime('%H%M%S')}",
            "price": 175000
        }
        
        return self.run_test(f"Update Property {property_id}", "PUT", f"properties/{property_id}", 200, data=update_data)

    def test_delete_property(self):
        """Test deleting a property"""
        if not self.property_ids:
            print("⚠️  No property IDs available for delete test")
            return False, {}
        
        property_id = self.property_ids[-1]  # Delete the last created property
        success, response = self.run_test(f"Delete Property {property_id}", "DELETE", f"properties/{property_id}", 200)
        if success:
            self.property_ids.remove(property_id)
        return success, response

    def test_submit_contact(self):
        """Test contact form submission"""
        contact_data = {
            "name": f"Test User {datetime.now().strftime('%H%M%S')}",
            "phone": "+855123456789",
            "telegram": "@testuser",
            "message": "This is a test message from automated testing"
        }
        
        return self.run_test("Submit Contact Form", "POST", "contacts", 200, data=contact_data)

    def test_get_contacts(self):
        """Test getting all contacts"""
        success, response = self.run_test("Get All Contacts", "GET", "contacts", 200)
        if success and isinstance(response, list):
            print(f"   Found {len(response)} contact submissions")
        return success, response

    def test_seed_data(self):
        """Test seeding sample data"""
        return self.run_test("Seed Sample Data", "POST", "seed", 200)

def main():
    print("🚀 Starting KH Realty API Testing")
    print("="*50)
    
    tester = KHRealtyAPITester()
    
    # Test sequence
    test_functions = [
        tester.test_root_endpoint,
        tester.test_seed_data,  # Seed data first to ensure we have properties
        tester.test_get_properties,
        tester.test_get_featured_properties,
        tester.test_property_filters,
        tester.test_get_single_property,
        tester.test_property_not_found,
        tester.test_create_property,
        tester.test_update_property,
        tester.test_delete_property,
        tester.test_submit_contact,
        tester.test_get_contacts,
    ]
    
    print(f"\nRunning {len(test_functions)} test groups...")
    
    for test_func in test_functions:
        try:
            test_func()
        except Exception as e:
            print(f"❌ FAIL - {test_func.__name__} - Exception: {str(e)}")
            tester.tests_run += 1
    
    # Print results
    print("\n" + "="*50)
    print(f"📊 Test Results: {tester.tests_passed}/{tester.tests_run} tests passed")
    
    if tester.tests_passed == tester.tests_run:
        print("🎉 All tests PASSED!")
        return 0
    else:
        failed = tester.tests_run - tester.tests_passed
        print(f"⚠️  {failed} test(s) FAILED")
        return 1

if __name__ == "__main__":
    sys.exit(main())