from django.test import SimpleTestCase
from rest_framework.test import APIClient

# Create your tests here.


class TestViews(SimpleTestCase):

    def test_index_view(self):
        response = self.client.get('/')

        self.assertEqual(response.status_code, 200)
        self.assertTemplateUsed(response, 'covid_us/index.html')

    def test_mapapi_view(self):
        client = APIClient()

        url = "/api/map/"
        response = client.get(url, format='json')

        self.assertEqual(response.status_code, 200)
        self.assertIn('dates', response.data)
        self.assertIn('mapData', response.data)

    def test_growrate_view(self):
        client = APIClient()

        url = "/api/grow/"
        response = client.get(url, format='json')

        self.assertEqual(response.status_code, 200)
        self.assertIn('date' in response.data)
        self.assertIn('rate', response.data)
        self.assertIn('rolling', response.data)

    def test_growrate_view(self):
        client = APIClient()

        url = "/api/death/"
        response = client.get(url, format='json')

        self.assertEqual(response.status_code, 200)
        self.assertIn('date', response.data)
        self.assertIn('rate', response.data)
        self.assertIn('rolling', response.data)
