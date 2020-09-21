from django.test import SimpleTestCase
from rest_framework.test import APIClient

# Create your tests here.

class ViewTests(SimpleTestCase):

	def test_index_view(self):
		response = self.client.get('/')

		self.assertEqual(response.status_code, 200)
		self.assertTemplateUsed(response, 'covid_us/index.html')

	def test_mapapi_view(self):
		client = APIClient()

		url = "/api/map/"
		response = client.get(url, format='json')

		self.assertEqual(response.status_code, 200)
		self.assertTrue('dates' in response.data)
		self.assertTrue('mapData' in response.data)

	def test_growrate_view(self):
		client = APIClient()

		url = "/api/grow/"
		response = client.get(url, format='json')

		self.assertEqual(response.status_code, 200)
		self.assertTrue('date' in response.data)
		self.assertTrue('rate' in response.data)
		self.assertTrue('rolling' in response.data)

	def test_growrate_view(self):
		client = APIClient()

		url = "/api/death/"
		response = client.get(url, format='json')

		self.assertEqual(response.status_code, 200)
		self.assertTrue('date' in response.data)
		self.assertTrue('rate' in response.data)
		self.assertTrue('rolling' in response.data)


